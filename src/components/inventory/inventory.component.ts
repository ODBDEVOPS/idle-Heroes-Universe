import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { EquipmentItem, EquipmentSlot } from '../../models/equipment.model';
import { Rarity } from '../../models/hero.model';
import { TooltipDirective } from '../../directives/tooltip.directive';

const RARITY_ORDER: Rarity[] = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TooltipDirective],
})
export class InventoryComponent {
  gameService = input.required<GameService>();

  rarities: (Rarity | 'All')[] = ['All', ...RARITY_ORDER];
  activeRarityFilter = signal<Rarity | 'All'>('All');
  activeSort = signal<'rarity' | 'name'>('rarity');
  
  slots: EquipmentSlot[] = ['Weapon', 'Armor', 'Accessory'];

  filteredAndSortedInventory = computed(() => {
    const inventory = this.gameService().inventory();
    const filter = this.activeRarityFilter();
    const sort = this.activeSort();

    // 1. Group by slot
    const grouped: Record<string, EquipmentItem[]> = {
      Weapon: [],
      Armor: [],
      Accessory: [],
    };

    for (const item of inventory) {
      // 2. Filter
      if (filter === 'All' || item.rarity === filter) {
        grouped[item.slot].push(item);
      }
    }

    // 3. Sort each group
    for (const slot of this.slots) {
      grouped[slot].sort((a, b) => {
        if (sort === 'rarity') {
          return RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity);
        }
        if (sort === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
    }

    return grouped;
  });

  setRarityFilter(rarity: Rarity | 'All') {
    this.activeRarityFilter.set(rarity);
  }

  onSortChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.activeSort.set(selectElement.value as 'rarity' | 'name');
  }

  getRarityBorderClass(rarity: Rarity): string {
    switch (rarity) {
      case 'Mythic': return 'border-red-500';
      case 'Legendary': return 'border-yellow-400';
      case 'Epic': return 'border-purple-500';
      case 'Rare': return 'border-blue-500';
      default: return 'border-gray-600';
    }
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

  formatBonus(item: EquipmentItem): string {
    switch(item.bonusType) {
        case 'dpsFlat':
            return `+${this.formatNumber(item.bonusValue)} DPS`;
        case 'dpsPercent':
            return `+${(item.bonusValue * 100).toFixed(0)}% DPS`;
        case 'goldDropPercent':
            return `+${(item.bonusValue * 100).toFixed(0)}% Gold`;
        case 'clickDamageFlat':
            return `+${this.formatNumber(item.bonusValue)} Click DMG`;
        default:
            return '';
    }
  }

  formatNumber(num: number): string {
    if (num < 1000) {
      return num.toFixed(0);
    }
    const suffixes = ["", "k", "M", "B", "T"];
    const i = Math.floor(Math.log10(num) / 3);
    const shortNum = (num / Math.pow(1000, i)).toFixed(1);
    return shortNum.replace(/\.0$/, '') + suffixes[i];
  }
}
