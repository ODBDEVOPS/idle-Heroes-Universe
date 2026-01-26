import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService, ALL_HEROES } from '../../services/game.service';
import { Rarity, Role } from '../../models/hero.model';

type HeroData = typeof ALL_HEROES[0];

@Component({
  selector: 'app-codex',
  templateUrl: './codex.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class CodexComponent {
  gameService = input.required<GameService>();
  
  isModalOpen = signal(false);
  selectedHeroData = signal<{ hero: HeroData, unlocked: boolean, isNew: boolean } | null>(null);

  // Filters
  rarities: (Rarity | 'All')[] = ['All', 'Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];
  roles: (Role | 'All')[] = ['All', 'Tank', 'Bruiser', 'DPS', 'Assassin', 'Marksman', 'Mage', 'Healer', 'Support', 'Controller', 'Démoniste', 'Shaman', 'Mangas Hero', 'Video game Hero'];
  activeRarityFilter = signal<Rarity | 'All'>('All');
  activeRoleFilter = signal<Role | 'All'>('All');
  
  filteredHeroes = computed(() => {
    const rarityFilter = this.activeRarityFilter();
    const roleFilter = this.activeRoleFilter();
    
    return ALL_HEROES.filter(hero => {
      const rarityMatch = rarityFilter === 'All' || hero.rarity === rarityFilter;
      const roleMatch = roleFilter === 'All' || hero.role === roleFilter;
      return rarityMatch && roleMatch;
    });
  });

  newlyUnlockedHeroIds = computed(() => {
    const unlocked = new Set(this.gameService().gameState().unlockedHeroIds);
    const viewed = new Set(this.gameService().gameState().viewedHeroIdsInCodex);
    return new Set([...unlocked].filter(id => !viewed.has(id)));
  });

  openHeroDetails(hero: HeroData) {
    const unlocked = this.isHeroUnlocked(hero.id);
    const isNew = this.isHeroNew(hero.id);
    this.selectedHeroData.set({ hero, unlocked, isNew });
    this.isModalOpen.set(true);

    if (isNew) {
      // Mark as viewed after a short delay to allow the user to see the "new" state
      setTimeout(() => {
        this.gameService().markHeroAsViewedInCodex(hero.id);
      }, 1500);
    }
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  isHeroUnlocked(heroId: number): boolean {
    return this.gameService().gameState().unlockedHeroIds.includes(heroId);
  }

  isHeroNew(heroId: number): boolean {
    return this.newlyUnlockedHeroIds().has(heroId);
  }

  onRarityFilterChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.activeRarityFilter.set(selectElement.value as Rarity | 'All');
  }

  onRoleFilterChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.activeRoleFilter.set(selectElement.value as Role | 'All');
  }

  getRarityTextColor(rarity: Rarity): string {
    switch (rarity) {
      case 'Mythic': return 'text-red-500';
      case 'Legendary': return 'text-yellow-400';
      case 'Epic': return 'text-purple-500';
      case 'Rare': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  }

  getRarityBorderClass(rarity: Rarity): string {
    switch (rarity) {
      case 'Mythic': return 'border-red-500';
      case 'Legendary': return 'border-yellow-400';
      case 'Epic': return 'border-purple-500';
      case 'Rare': return 'border-blue-500';
      default: return 'border-gray-400';
    }
  }

  getHeroInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`;
    }
    return name.substring(0, 2).toUpperCase();
  }
}