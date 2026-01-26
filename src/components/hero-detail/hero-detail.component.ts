import { Component, ChangeDetectionStrategy, input, signal, computed, effect, output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Hero, Rarity, Role } from '../../models/hero.model';
import { EquipmentSlot, EquipmentItem } from '../../models/equipment.model';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { View } from '../../app.component';

interface DisplayHero extends Hero {
  shardCount: number;
  requiredShards: number;
  canAscend: boolean;
}

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  templateUrl: './hero-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TooltipDirective],
})
export class HeroDetailComponent implements OnDestroy {
  gameService = input.required<GameService>();
  viewChange = output<View>();

  heroId = signal<number | null>(null);

  // Modals
  isEquipModalOpen = signal(false);
  levelUpNotice = signal<{ heroId: number, levelsGained: number } | null>(null);

  // View state
  selectedSlot = signal<EquipmentSlot | null>(null);
  isPlacementMode = signal(false);

  // --- Computed Signals ---
  heroData = computed<DisplayHero | null>(() => {
    const id = this.heroId();
    if (!id) return null;
    
    const hero = this.gameService().heroes().find(h => h.id === id);
    if (!hero) return null;

    const cost = this.gameService().getFusionCost(hero);
    const shardCount = this.gameService().gameState().heroShards[hero.id] || 0;
    const canAscend = shardCount >= cost.shards && this.gameService().gameState().gold >= cost.gold;

    return {
        ...hero,
        shardCount,
        requiredShards: cost.shards,
        canAscend,
    };
  });

  activeTeamHeroes = computed(() => {
    const activeIds = this.gameService().gameState().activeHeroIds;
    const allHeroes = this.gameService().heroes();
    return activeIds.map(id => allHeroes.find(h => h.id === id) || null);
  });

  activeHeroIdSet = computed(() => new Set(this.gameService().gameState().activeHeroIds));

  availableItemsForSlot = computed(() => {
    const slot = this.selectedSlot();
    if (!slot) return [];
    return this.gameService().inventory().filter(item => item.slot === slot);
  });

  constructor() {
    effect(() => {
      const heroIdFromService = this.gameService().heroToViewInTeam();
      if (typeof heroIdFromService === 'number') {
        this.heroId.set(heroIdFromService);
      }
    });
  }

  ngOnDestroy() {
    this.gameService().heroToViewInTeam.set(undefined);
  }

  back() {
    this.viewChange.emit('team');
  }

  // --- Team Management ---
  enterPlacementMode() {
    const hero = this.heroData();
    if (!hero || this.activeHeroIdSet().has(hero.id)) return;
    this.isPlacementMode.set(true);
  }

  cancelPlacementMode() {
    this.isPlacementMode.set(false);
  }

  placeHeroInSlot(slotIndex: number) {
    const heroId = this.heroId();
    if (!this.isPlacementMode() || !heroId) return;
    this.gameService().swapActiveHero(heroId, slotIndex);
    this.isPlacementMode.set(false);
  }

  removeHeroFromTeam() {
    const heroId = this.heroId();
    if (!heroId || !this.activeHeroIdSet().has(heroId)) return;
    const activeIds = this.gameService().gameState().activeHeroIds;
    const slotIndex = activeIds.indexOf(heroId);
    if (slotIndex > -1) {
        this.gameService().removeHeroFromActiveSlot(slotIndex);
    }
  }

  goToFusion(heroId: number) {
    this.gameService().heroToViewInTeam.set(heroId);
    this.viewChange.emit('fusion');
  }

  // --- Hero Actions & Modals ---
  levelUp(heroId: number) { this.gameService().levelUpHero(heroId); }
  levelUpMultiple(heroId: number, levels: number) { this.gameService().levelUpHeroMultiple(heroId, levels); }

  levelUpMax(heroId: number) {
    const hero = this.gameService().heroes().find(h => h.id === heroId);
    const gold = this.gameService().gameState().gold;
    if (!hero) return;
    const { levels } = this.calculateMaxLevels(hero, gold);
    if (levels > 0) this.gameService().levelUpHeroMultiple(heroId, levels);
  }

  autoEquip(heroId: number) { this.gameService().autoEquipBestGear(heroId); }

  calculateCost(hero: Hero, levels: number): number {
    if (levels <= 0) return 0;
    let totalCost = 0;
    for (let i = 0; i < levels; i++) {
        totalCost += Math.floor(hero.baseCost * Math.pow(hero.upgradeCostMultiplier, hero.level + i));
    }
    return totalCost;
  }

  calculateMaxLevels(hero: Hero, currentGold: number): { levels: number, cost: number } {
    let gold = currentGold; let levels = 0; let totalCost = 0; let currentLevel = hero.level;
    const maxLevelsToCalculate = 10000;
    while (levels < maxLevelsToCalculate) {
      const costForNextLevel = Math.floor(hero.baseCost * Math.pow(hero.upgradeCostMultiplier, currentLevel));
      if (gold >= costForNextLevel) {
        gold -= costForNextLevel; totalCost += costForNextLevel; levels++; currentLevel++;
      } else { break; }
    }
    return { levels, cost: totalCost };
  }

  claimXp(heroId: number, event: MouseEvent) {
    event.stopPropagation();
    const levelsGained = this.gameService().claimOfflineXp(heroId);
    if (levelsGained > 0) {
        this.levelUpNotice.set({ heroId, levelsGained });
        setTimeout(() => this.levelUpNotice.set(null), 2000);
    }
  }
  
  toggleFavorite(heroId: number, event: MouseEvent) {
    event.stopPropagation();
    this.gameService().toggleHeroFavorite(heroId);
  }

  openEquipModal(slot: EquipmentSlot) {
    this.selectedSlot.set(slot);
    this.isEquipModalOpen.set(true);
  }

  closeEquipModal() {
    this.isEquipModalOpen.set(false);
    this.selectedSlot.set(null);
  }

  onEquipItem(itemId: number) {
    const heroId = this.heroData()?.id;
    if (heroId) this.gameService().equipItem(heroId, itemId);
    this.closeEquipModal();
  }

  onUnequipItem() {
    const heroId = this.heroData()?.id;
    const slot = this.selectedSlot();
    if (heroId && slot) this.gameService().unequipItem(heroId, slot);
    this.closeEquipModal();
  }

  // --- UI Helpers ---
  roleIcons: Record<Role, string> = { 'Tank': 'M12,2 L12,11 L4,11 L4,15 L12,15 L12,22 L14,22 L14,15 L20,15 L20,11 L14,11 L14,2 L12,2 Z M4,6 L20,6 L20,9 L4,9 L4,6 Z', 'DPS': 'M18.2,1.3l-5.6,5.6l1.4,1.4l5.6-5.6L18.2,1.3z M3,14.1l2.8-2.8l4.2,4.2l-2.8,2.8L3,14.1z M8.6,8.6 L3.4,13.8l1.4,1.4l5.2-5.2L8.6,8.6z M12.8,4.4l-7,7l1.4,1.4l7-7L12.8,4.4z M17,8.6l-7,7l1.4,1.4l7-7 L17,8.6z', 'Support': 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z', 'Assassin': 'M14.5,3 l-1.5-1 h-2 L9.5,3 L8,4.5 V6 h8 V4.5 L14.5,3 z M16,7 H8 L9,16 l3,6 l3-6 l1-9 z', 'Controller': 'M6,2v6h12V2H6z M8,4h8v2H8V4z M6,22v-6h12v6H6z M8,20h8v-2H8V20z M12,10 c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S13.1,10,12,10z', 'Bruiser': 'M20.5,10L23,12.5L20.5,15H17v3h-3v-3h-4v3H7v-3H3.5L1,12.5L3.5,10H7V7h3v3h4V7h3V10H20.5z', 'Marksman': 'M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8 s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z M12,6c-3.31,0-6,2.69-6,6s2.69,6,6,6s6-2.69,6-6S15.31,6,12,6z M12,16 c-2.21,0-4-1.79-4-4s1.79-4,4-4s4,1.79,4,4S14.21,16,12,16z', 'Mage': 'M12,3L9.11,8.33L3,9.5l4.5,4.36L6.22,20L12,17.27L17.78,20L16.5,13.86L21,9.5l-6.11-1.17L12,3z', 'Healer': 'M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7v-2h4V7h2v4h4v2h-4v4h-2z', 'Démoniste': 'M12,2C6.47,2,2,6.47,2,12s4.47,10,10,10s10-4.47,10-10S17.53,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z M15.5,11h-7v2h7V11z M9.5,8 C8.67,8,8,7.33,8,6.5S8.67,5,9.5,5s1.5,0.67,1.5,1.5S10.33,8,9.5,8z M14.5,8c-0.83,0-1.5-0.67-1.5-1.5S13.67,5,14.5,5 s1.5,0.67,1.5,1.5S15.33,8,14.5,8z', 'Shaman': 'M12,2c-1.95,0-3.8,0.73-5.25,2.04L12,9.3V2z M12,14.7l-5.25,5.25C8.2,21.27,10.05,22,12,22c1.95,0,3.8-0.73,5.25-2.04 L12,14.7z M20,12c0,1.95-0.73,3.8-2.04,5.25L12,12l5.96-5.25C19.27,8.2,20,10.05,20,12z M4,12c0-1.95,0.73-3.8,2.04-5.25L12,12 L6.04,17.25C4.73,15.8,4,13.95,4,12z', 'Mangas Hero': 'M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,13.5c-0.83,0-1.5-0.67-1.5-1.5 s0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5S12.83,13.5,12,13.5z M16,9H8V7h8V9z M16,17H8v-2h8V17z', 'Video game Hero': 'M9,4H7V2h2V4z M13,4h-2V2h2V4z M17,4h-2V2h2V4z M21,8V6h-2V4h-2V6h-2v2h2v2h2V8h2V6h2v2H21z M19,10h-2V8h2V10z M15,10h-2V8h2V10z M11,10H9V8h2V10z M7,10H5V8h2V10z M3,8V6H1v2H3z M19,22v-2h-2v-2h-2v2h-2v2h2v2h2v-2h2v2h2v-2H19z M15,18h-2v2h2V18z M11,18H9v2h2V18z M7,18H5v2h2V18z M3,20v-2H1v2H3z' };
  getRarityBorderClass(r: Rarity): string { switch(r){ case 'Mythic': return 'border-red-500'; case 'Legendary': return 'border-yellow-400'; case 'Epic': return 'border-purple-500'; case 'Rare': return 'border-blue-500'; default: return 'border-gray-600'; } }
  getRarityBgClass(r: Rarity): string { switch(r){ case 'Mythic': return 'bg-red-900/40'; case 'Legendary': return 'bg-yellow-700/30'; case 'Epic': return 'bg-purple-800/40'; case 'Rare': return 'bg-blue-800/40'; default: return 'bg-gray-700/20'; } }
  getRarityHeaderBgClass(r: Rarity): string { switch(r){ case 'Mythic': return 'bg-gradient-to-tr from-red-900/50 via-gray-800/50 to-gray-800/50'; case 'Legendary': return 'bg-gradient-to-tr from-yellow-800/50 via-gray-800/50 to-gray-800/50'; case 'Epic': return 'bg-gradient-to-tr from-purple-900/50 via-gray-800/50 to-gray-800/50'; case 'Rare': return 'bg-gradient-to-tr from-blue-900/50 via-gray-800/50 to-gray-800/50'; default: return 'bg-gray-800/50'; } }
  getRarityTextColor(r: Rarity): string { switch(r){ case 'Mythic': return 'text-red-500'; case 'Legendary': return 'text-yellow-400'; case 'Epic': return 'text-purple-500'; case 'Rare': return 'text-blue-400'; default: return 'text-gray-400'; } }
  getRarityPillClass(r: Rarity): string { switch(r){ case 'Mythic': return 'bg-red-500/20 text-red-400'; case 'Legendary': return 'bg-yellow-500/20 text-yellow-400'; case 'Epic': return 'bg-purple-500/20 text-purple-400'; case 'Rare': return 'bg-blue-500/20 text-blue-400'; default: return 'bg-gray-500/20 text-gray-300'; } }
  getRarityShadowClass(r: Rarity): string { switch(r){ case 'Mythic': return 'shadow-red-500/60'; case 'Legendary': return 'shadow-yellow-400/60'; case 'Epic': return 'shadow-purple-500/60'; case 'Rare': return 'shadow-blue-500/60'; default: return 'shadow-gray-500/60'; } }
  getHeroInitials(n: string): string { const p=n.split(' '); return p.length > 1 ? `${p[0][0]}${p[1][0]}` : n.substring(0,2).toUpperCase(); }
  formatNumber(n: number): string { if(n<1e3)return n.toFixed(0); const s=["","k","M","B","T"],i=Math.floor(Math.log10(n)/3); const sn=(n/1e3**i).toFixed(1); return sn.replace(/\.0$/,'')+s[i]; }
  formatBonus(i: EquipmentItem): string { switch(i.bonusType){ case 'dpsFlat': return `+${this.formatNumber(i.bonusValue)} DPS`; case 'dpsPercent': return `+${i.bonusValue*100}% DPS`; case 'goldDropPercent': return `+${i.bonusValue*100}% Gold`; case 'clickDamageFlat': return `+${this.formatNumber(i.bonusValue)} Click DMG`; default: return ''; } }
  getSlotIcon(s: EquipmentSlot): string { switch(s){ case 'Weapon': return 'M12 1.75L4.75 6.25V13.25C4.75 19.25 12 22.25 12 22.25C12 22.25 19.25 19.25 19.25 13.25V6.25L12 1.75Z M10 13L12 11L14 13 M12 11V17'; case 'Armor': return 'M9 20V12L5 12V8C5 5.79086 6.79086 4 9 4H15C17.2091 4 19 5.79086 19 8V12L15 12V20H9Z'; case 'Accessory': return 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'; default: return ''; } }
}
