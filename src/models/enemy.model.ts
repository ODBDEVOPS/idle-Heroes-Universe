export type EnemyType = 'Normal' | 'Armored' | 'Swift' | 'Hoarder' | 'Boss' | 'Caster' | 'Squad';

export interface Enemy {
  name: string;
  maxHp: number;
  currentHp: number;
  asciiArt: string;
  goldReward: number;
  isBoss: boolean; 
  type: EnemyType;
  damageReduction?: number;
  // New properties for abilities
  activeEffects?: { type: 'harden' | 'weaken', expiration: number }[];
  isFrenzied?: boolean;
  lastAbilityUse?: Record<string, number>;
}