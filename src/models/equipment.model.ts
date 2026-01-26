import { Rarity } from './hero.model';

export type EquipmentSlot = 'Weapon' | 'Armor' | 'Accessory';

export type EquipmentBonusType = 'dpsFlat' | 'dpsPercent' | 'goldDropPercent' | 'clickDamageFlat';

export interface EquipmentItem {
  id: number;
  name: string;
  slot: EquipmentSlot;
  bonusType: EquipmentBonusType;
  bonusValue: number;
  baseBonusValue: number;
  enchantLevel: number;
  rarity: Rarity;
  lore: string;
}
