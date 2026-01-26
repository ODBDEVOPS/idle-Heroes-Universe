import { Rarity } from "./hero.model";
import { OngoingExpedition } from "./expedition.model";
import { ActiveBlessing, BlessingCooldown } from "./celestial-shrine.model";
import { DungeonDifficulty } from './dungeon.model';
import { PlayerPet } from './pet.model';

export interface ActiveDungeonRun {
  dungeonId: number;
  difficulty: DungeonDifficulty;
  startTime: number; // timestamp
  completionTime: number; // timestamp
}

export interface ActiveDungeonBounty {
    bountyId: number;
    heroIds: number[];
    startTime: number;
    completionTime: number;
}

export interface TeamPreset {
  name: string;
  heroIds: (number | null)[];
}

export interface GameState {
  stage: number;
  gold: number;
  clickDamage: number;
  prestigePoints: number;
  goldMultiplier: number;
  // Team
  activeHeroIds: (number | null)[];
  teamPresets: TeamPreset[];
  // Prestige Upgrades
  prestigePowerLevel: number; // Increases all hero DPS
  clickingFrenzyLevel: number; // Increases click damage
  startingGoldLevel: number; // Increases gold after prestige
  expeditionSlotsLevel: number; // Unlocks more expedition slots
  dungeonSlotsLevel: number; // Unlocks more dungeon slots
  // Quest trackers
  totalEnemiesDefeated: number;
  totalHeroesSummoned: number;
  highestRarityForged: Rarity | null;
  // Offline progress
  lastUpdateTimestamp: number;
  // Tower of Trials
  towerFloor: number;
  // Daily Login
  lastLoginDate: string | null; // YYYY-MM-DD
  consecutiveLoginDays: number;
  // Artifacts
  artifacts: number[]; // Array of artifact IDs
  // Codex
  unlockedHeroIds: number[];
  viewedHeroIdsInCodex: number[];
  // Stats
  totalClicks: number;
  totalGoldEarned: number;
  totalPrestiges: number;
  totalSkillsUsed: number;
  totalDungeonsCompleted: number;
  totalExpeditionsCompleted: number;
  totalSponsorClaims: number;
  totalItemsForged: number;
  // Combat mode
  autoDpsEnabled: boolean;
  autoSkillEnabled: boolean;
  // Expeditions
  ongoingExpeditions: OngoingExpedition[];
  // Dungeons
  activeDungeonRuns: ActiveDungeonRun[];
  dungeonCrests: number;
  activeDungeonBounties: ActiveDungeonBounty[];
  purchasedDungeonShopItems: Record<number, number>;
  // Celestial Shrine
  activeBlessings: ActiveBlessing[];
  blessingCooldowns: BlessingCooldown[];
  // Gold Features
  lastTributeClaimTimestamp: number | null;
  lastGoldRushTimestamp: number | null;
  vaultInvestment: { amount: number, returnTime: number } | null;
  lastSponsorOfferTimestamp: number | null;
  // Gold Mine
  activeMiningOperation: { operationId: number, completionTime: number } | null;
  // Alchemy Lab
  enchantingDust: number;
  // Summoning
  lastFreeStandardSummonTimestamp: number | null;
  heroShards: Record<number, number>;
  // Pets
  pets: PlayerPet[];
  petCrystals: number;
  essenceOfLoyalty: number;
}
