import { Component, ChangeDetectionStrategy, input, signal, computed, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Hero, Rarity, Role } from '../../models/hero.model';
import { EquipmentItem } from '../../models/equipment.model';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { View } from '../../app.component';

type SortOption = 'level' | 'dps' | 'rarity' | 'name' | 'favorite';

interface DisplayHero extends Hero {
  shardCount: number;
  requiredShards: number;
  ascensionGoldCost: number;
  canAscend: boolean;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TooltipDirective],
})
export class TeamComponent {
  gameService = input.required<GameService>();
  viewChange = output<View>();

  // Modals
  isLevelUpAllConfirmOpen = signal(false);
  levelUpNotice = signal<{ heroId: number, levelsGained: number } | null>(null);

  // Sorting and Filtering State
  searchTerm = signal<string>('');
  listFilter = signal<'all' | 'active' | 'reserve'>('all');
  roles: (Role | 'All')[] = ['All', 'Tank', 'Bruiser', 'DPS', 'Assassin', 'Marksman', 'Mage', 'Healer', 'Support', 'Controller', 'Démoniste', 'Shaman', 'Mangas Hero', 'Video game Hero'];
  sortOptions: { value: SortOption, label: string }[] = [
    { value: 'level', label: 'Level' },
    { value: 'dps', label: 'DPS' },
    { value: 'rarity', label: 'Rarity' },
    { value: 'favorite', label: 'Favorite' },
    { value: 'name', label: 'Name' },
  ];
  activeRoleFilter = signal<Role | 'All'>('All');
  activeSort = signal<SortOption>('level');
  sortDirection = signal<'asc' | 'desc'>('desc');

  // --- Computed Signals ---
  activeHeroIdSet = computed(() => new Set(this.gameService().gameState().activeHeroIds));

  hasEmptySlot = computed(() => this.gameService().gameState().activeHeroIds.includes(null));

  filteredAndSortedHeroes = computed<DisplayHero[]>(() => {
    const allHeroes = this.gameService().heroes();
    const activeIds = this.activeHeroIdSet();
    const term = this.searchTerm().toLowerCase();

    let heroes: Hero[] = [];
    switch(this.listFilter()) {
      case 'active':
        heroes = allHeroes.filter(h => activeIds.has(h.id) && h.level > 0);
        break;
      case 'reserve':
        heroes = allHeroes.filter(h => !activeIds.has(h.id));
        break;
      default: // 'all'
        heroes = allHeroes;
    }

    const roleFilter = this.activeRoleFilter();
    if (roleFilter !== 'All') {
        heroes = heroes.filter(h => h.role === roleFilter);
    }
    
    if (term) {
        heroes = heroes.filter(h => h.name.toLowerCase().includes(term));
    }

    const sort = this.activeSort();
    const direction = this.sortDirection();
    const rarityOrder: Rarity[] = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];
    
    const sortedHeroes = heroes.slice().sort((a, b) => {
        if (a.level > 0 && b.level === 0) return -1;
        if (a.level === 0 && b.level > 0) return 1;

        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;

        let compare = 0;
        switch (sort) {
            case 'level': compare = b.level - a.level; break;
            case 'dps': compare = b.currentDps - a.currentDps; break;
            case 'rarity': compare = rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity); break;
            case 'name': compare = a.name.localeCompare(b.name); break;
        }

        if (sort === 'name') {
           return compare * (direction === 'desc' ? -1 : 1);
        }
        return compare * (direction === 'desc' ? 1 : -1);
    });

    const heroShards = this.gameService().gameState().heroShards;
    const gold = this.gameService().gameState().gold;

    return sortedHeroes.map(hero => {
        const cost = this.gameService().getFusionCost(hero);
        const shardCount = heroShards[hero.id] || 0;
        const canAscend = shardCount >= cost.shards && gold >= cost.gold;
        return {
            ...hero,
            shardCount,
            requiredShards: cost.shards,
            ascensionGoldCost: cost.gold,
            canAscend,
        };
    });
  });

  viewHeroDetails(heroId: number, event?: MouseEvent) {
    event?.stopPropagation();
    this.gameService().heroToViewInTeam.set(heroId);
    this.viewChange.emit('heroDetail');
  }

  // --- Team Management ---
  quickPlaceHero(heroId: number, event: MouseEvent) {
    event.stopPropagation();
    if (this.activeHeroIdSet().has(heroId)) return;

    const emptySlotIndex = this.gameService().gameState().activeHeroIds.indexOf(null);
    if (emptySlotIndex > -1) {
      this.gameService().swapActiveHero(heroId, emptySlotIndex);
    }
  }

  // --- Hero Actions & Modals ---
  quickUnlockHero(hero: DisplayHero, event: MouseEvent) {
    event.stopPropagation();
    if (hero.level > 0 || this.gameService().gameState().gold < hero.nextLevelCost) return;
    this.gameService().levelUpHero(hero.id);
  }
  
  quickLevelUp(hero: DisplayHero, event: MouseEvent) {
    event.stopPropagation();
    if (this.gameService().gameState().gold < hero.nextLevelCost) return;
    this.gameService().levelUpHero(hero.id);
  }

  quickAscend(hero: DisplayHero, event: MouseEvent) {
    event.stopPropagation();
    if (!hero.canAscend) return;

    const success = this.gameService().fuseHero(hero.id);
    if (success) {
      // Use a special value for levelsGained to signify ascension
      this.levelUpNotice.set({ heroId: hero.id, levelsGained: -1 }); 
      setTimeout(() => this.levelUpNotice.set(null), 2000);
    }
  }

  quickClaimXp(heroId: number, event: MouseEvent) {
    event.stopPropagation();
    const levelsGained = this.gameService().claimOfflineXp(heroId);
    if (levelsGained > 0) {
        this.levelUpNotice.set({ heroId, levelsGained });
        setTimeout(() => this.levelUpNotice.set(null), 2000);
    }
  }

  openLevelUpAllConfirm() { this.isLevelUpAllConfirmOpen.set(true); }
  closeLevelUpAllConfirm() { this.isLevelUpAllConfirmOpen.set(false); }

  confirmLevelUpAll() {
    this.gameService().levelUpAllHeroes();
    this.closeLevelUpAllConfirm();
  }
  
  toggleFavorite(heroId: number, event: MouseEvent) {
    event.stopPropagation();
    this.gameService().toggleHeroFavorite(heroId);
  }

  setListFilter(filter: 'all' | 'active' | 'reserve') {
    this.listFilter.set(filter);
  }
  
  onRoleFilterChange(event: Event) {
    this.activeRoleFilter.set((event.target as HTMLSelectElement).value as Role | 'All');
  }

  onSortOptionChange(event: Event) {
    this.activeSort.set((event.target as HTMLSelectElement).value as SortOption);
  }

  onSearchTermChange(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  toggleSortDirection() {
    this.sortDirection.update(dir => dir === 'asc' ? 'desc' : 'asc');
  }

  // --- UI Helpers ---
  getRarityBorderClass(r: Rarity): string { switch(r){ case 'Mythic': return 'border-red-500'; case 'Legendary': return 'border-yellow-400'; case 'Epic': return 'border-purple-500'; case 'Rare': return 'border-blue-500'; default: return 'border-gray-600'; } }
  getRarityPillClass(r: Rarity): string { switch(r){ case 'Mythic': return 'bg-red-500/20 text-red-400'; case 'Legendary': return 'bg-yellow-500/20 text-yellow-400'; case 'Epic': return 'bg-purple-500/20 text-purple-400'; case 'Rare': return 'bg-blue-500/20 text-blue-400'; default: return 'bg-gray-500/20 text-gray-300'; } }
  getHeroInitials(n: string): string { const p=n.split(' '); return p.length > 1 ? `${p[0][0]}${p[1][0]}` : n.substring(0,2).toUpperCase(); }
  formatNumber(n: number): string { if(n<1e3)return n.toFixed(0); const s=["","k","M","B","T"],i=Math.floor(Math.log10(n)/3); const sn=(n/1e3**i).toFixed(1); return sn.replace(/\.0$/,'')+s[i]; }
}
