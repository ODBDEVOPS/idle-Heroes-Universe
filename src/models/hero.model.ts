import { EquipmentItem, EquipmentSlot } from './equipment.model';

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
export type Role = 'Tank' | 'DPS' | 'Support' | 'Assassin' | 'Controller' | 'Bruiser' | 'Marksman' | 'Mage' | 'Healer' | 'Démoniste' | 'Shaman' | 'Mangas Hero' | 'Video game Hero';

export interface HeroStats {
  totalDamageDealt: number;
  skillsUsed: number;
}

export interface Hero {
  id: number;
  name: string;
  level: number;
  baseDps: number;
  baseCost: number;
  upgradeCostMultiplier: number;
  rarity: Rarity;
  role: Role;
  skillDescription: string;
  lore: string;
  currentDps: number;
  nextLevelCost: number;
  equipment: Record<EquipmentSlot, EquipmentItem | null>;
  skillCharge: number;
  skillReady: boolean;
  isFavorite?: boolean;
  // XP System
  currentXp: number;
  xpToNextLevel: number;
  offlineXp: number;
  // New Stats
  stats?: HeroStats;
  positionalModifier?: number;
  ascensionLevel: number;
}