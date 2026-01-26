import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { EquipmentItem, EquipmentSlot } from '../../models/equipment.model';
import { Rarity } from '../../models/hero.model';

const RARITY_ORDER: Rarity[] = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];

@Component({
  selector: 'app-forge',
  templateUrl: './forge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ForgeComponent {
  gameService = input.required<GameService>();

  selectedItemIds = signal<number[]>([]);
  showCraftAnimation = signal(false);
  lastCraftResult = signal<{ slot: EquipmentSlot; rarity: Rarity; } | null>(null);
  isForging = signal(false);

  // Group inventory by slot for easier display
  inventoryBySlot = computed(() => {
    const grouped: Record<string, EquipmentItem[]> = {
      Weapon: [],
      Armor: [],
      Accessory: [],
    };
    for (const item of this.gameService().inventory()) {
      grouped[item.slot].push(item);
    }
    return grouped;
  });

  selectedItems = computed(() => {
    const ids = this.selectedItemIds();
    return this.gameService().inventory().filter(item => ids.includes(item.id));
  });

  canCraft = computed(() => {
    const items = this.selectedItems();
    if (items.length !== 3) return false;
    const firstItem = items[0];
    if (firstItem.rarity === 'Mythic') return false; // Max rarity
    return items.every(item => item.rarity === firstItem.rarity && item.slot === firstItem.slot);
  });

  craftingResultPreview = computed(() => {
    if (!this.canCraft()) return null;
    const firstItem = this.selectedItems()[0];
    const currentRarityIndex = RARITY_ORDER.indexOf(firstItem.rarity);
    const nextRarity = RARITY_ORDER[currentRarityIndex + 1];
    return {
      slot: firstItem.slot,
      rarity: nextRarity,
    };
  });

  displayResult = computed(() => {
    if (this.showCraftAnimation()) {
      return this.lastCraftResult();
    }
    if (this.isForging()) {
      return null;
    }
    return this.craftingResultPreview();
  });

  toggleItemSelection(itemId: number) {
    if (this.isForging()) return;
    this.selectedItemIds.update(ids => {
      const newIds = new Set(ids);
      if (newIds.has(itemId)) {
        newIds.delete(itemId);
      } else {
        if (newIds.size < 3) {
          newIds.add(itemId);
        }
      }
      return Array.from(newIds);
    });
  }

  handleCraft() {
    if (!this.canCraft() || this.isForging()) return;

    this.isForging.set(true);
    
    const resultPreview = this.craftingResultPreview();
    const idsToCraft = this.selectedItemIds();

    // Animation for ingredients flying to the center and sparks
    setTimeout(() => {
        const success = this.gameService().craftItems(idsToCraft);
        
        if (success && resultPreview) {
            this.lastCraftResult.set(resultPreview);
            this.showCraftAnimation.set(true); // Trigger result pop-in
        }
        
        this.isForging.set(false);
        this.selectedItemIds.set([]); // Clear selected items after animation
        
        // Cleanup for pop-in animation
        setTimeout(() => {
            this.showCraftAnimation.set(false);
            this.lastCraftResult.set(null);
        }, 400); // Pop-in duration

    }, 500); // Ingredient fade and spark duration
  }

  getRarityColor(rarity: Rarity): string {
    switch (rarity) {
      case 'Mythic': return 'border-red-500';
      case 'Legendary': return 'border-yellow-400';
      case 'Epic': return 'border-purple-500';
      case 'Rare': return 'border-blue-500';
      // Common rarity
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
    const shortNum = (num / Math.pow(1000, i)).toFixed(2);
    return shortNum + suffixes[i];
  }
}