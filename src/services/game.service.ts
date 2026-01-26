import { signal, computed, WritableSignal } from '@angular/core';
import { GameState, ActiveDungeonRun, TeamPreset, ActiveDungeonBounty } from '../models/game-state.model';
import { Hero, Rarity, Role, HeroStats } from '../models/hero.model';
import { Enemy, EnemyType } from '../models/enemy.model';
import { Quest } from '../models/quest.model';
import { EquipmentItem, EquipmentSlot, EquipmentBonusType } from '../models/equipment.model';
import { Artifact } from '../models/artifact.model';
import { Expedition, OngoingExpedition } from '../models/expedition.model';
import { Blessing, BlessingType, ActiveBlessing, BlessingCooldown } from '../models/celestial-shrine.model';
import { Dungeon, DungeonDifficulty, DungeonBounty, DungeonShopItem } from '../models/dungeon.model';
import { LeaderboardEntry } from '../models/leaderboard.model';
// FIX: Import Pet models
import { Pet, PlayerPet } from '../models/pet.model';

export const ALL_HEROES: Omit<Hero, 'currentDps' | 'nextLevelCost' | 'equipment' | 'skillCharge' | 'skillReady' | 'currentXp' | 'xpToNextLevel' | 'offlineXp'>[] = [
  // Starting Heroes
  // FIX: Added ascensionLevel to all hero definitions
  { id: 1, name: 'Starlight Knight', level: 1, baseDps: 2, baseCost: 10, upgradeCostMultiplier: 1.1, rarity: 'Common', role: 'DPS', skillDescription: 'Deals a burst of holy damage to the enemy.', lore: 'A loyal knight sworn to protect the innocent, wielding a sword blessed by the cosmos.', ascensionLevel: 0 },
  { id: 2, name: 'Shadow Archer', level: 0, baseDps: 10, baseCost: 100, upgradeCostMultiplier: 1.15, rarity: 'Rare', role: 'Marksman', skillDescription: 'Fires a shadow-infused arrow that pierces enemy defenses.', lore: 'A silent hunter from the twilight forests, her arrows never miss their mark.', ascensionLevel: 0 },
  { id: 3, name: 'Chrono Mage', level: 0, baseDps: 50, baseCost: 1000, upgradeCostMultiplier: 1.2, rarity: 'Epic', role: 'Mage', skillDescription: 'Unleashes a time-distorting spell, causing massive damage.', lore: 'A master of time magic, she can bend reality to her will, though fears its ultimate price.', ascensionLevel: 0 },
  { id: 4, name: 'Iron Guardian', level: 0, baseDps: 2, baseCost: 200, upgradeCostMultiplier: 1.12, rarity: 'Rare', role: 'Tank', skillDescription: 'Hardens its armor, becoming nearly invulnerable for a short time.', lore: 'An ancient golem animated by a powerful rune, its only purpose is to protect its allies.', ascensionLevel: 0 },
  { id: 5, name: 'Sun Priestess', level: 0, baseDps: 4, baseCost: 500, upgradeCostMultiplier: 1.18, rarity: 'Epic', role: 'Healer', skillDescription: 'Heals all allies and grants a temporary damage boost.', lore: 'A devoted follower of the sun god, her prayers can mend wounds and inspire courage.', ascensionLevel: 0 },
  // Summonable Heroes
  { id: 6, name: 'Village Guard', level: 0, baseDps: 1, baseCost: 15, upgradeCostMultiplier: 1.1, rarity: 'Common', role: 'Tank', skillDescription: 'Raises his shield, absorbing a moderate amount of damage.', lore: 'A simple man with uncommon courage, he stands firm to protect his home and friends.', ascensionLevel: 0 },
  { id: 7, name: 'Forest Scout', level: 0, baseDps: 3, baseCost: 25, upgradeCostMultiplier: 1.11, rarity: 'Common', role: 'DPS', skillDescription: 'Throws a poisoned dagger, dealing damage over time.', lore: 'Swift and unseen, he knows every secret path through the whispering woods.', ascensionLevel: 0 },
  { id: 8, name: 'Rogue Assassin', level: 0, baseDps: 15, baseCost: 120, upgradeCostMultiplier: 1.16, rarity: 'Rare', role: 'Assassin', skillDescription: 'Strikes from the shadows, dealing critical damage.', lore: 'A former member of a thieves\' guild, she now fights for her own code of honor.', ascensionLevel: 0 },
  { id: 9, name: 'Ice Sorceress', level: 0, baseDps: 8, baseCost: 150, upgradeCostMultiplier: 1.17, rarity: 'Rare', role: 'Mage', skillDescription: 'Freezes the enemy, slowing their attacks for a period.', lore: 'Born in the frozen north, she commands the biting cold with elegant fury.', ascensionLevel: 0 },
  { id: 10, name: 'Dragon Knight', level: 0, baseDps: 20, baseCost: 1200, upgradeCostMultiplier: 1.21, rarity: 'Epic', role: 'Bruiser', skillDescription: 'Breathes fire in a wide arc, damaging the enemy.', lore: 'Bonded with a mighty dragon, his armor is infused with its fiery essence.', ascensionLevel: 0 },
  { id: 11, name: 'Celestial Healer', level: 0, baseDps: 10, baseCost: 1500, upgradeCostMultiplier: 1.22, rarity: 'Epic', role: 'Healer', skillDescription: 'Summons a star that heals the most wounded ally over time.', lore: 'An angelic being who descended to aid mortals in their endless struggle against darkness.', ascensionLevel: 0 },
  { id: 12, name: 'Void Walker', level: 0, baseDps: 250, baseCost: 10000, upgradeCostMultiplier: 1.25, rarity: 'Legendary', role: 'Démoniste', skillDescription: 'Opens a rift to the void, dealing immense and unpredictable damage.', lore: 'A being who has gazed into the abyss and returned, wielding its chaotic power.', ascensionLevel: 0 },
  { id: 13, name: 'Phoenix Rider', level: 0, baseDps: 300, baseCost: 12000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Mage', skillDescription: 'Engulfs the battlefield in flames, dealing heavy damage.', lore: 'Reborn from ashes alongside his immortal companion, he is a symbol of eternal struggle and rebirth.', ascensionLevel: 0 },
  // New Heroes
  { id: 14, name: 'Cyber Ninja', level: 0, baseDps: 120, baseCost: 5000, upgradeCostMultiplier: 1.23, rarity: 'Epic', role: 'Video game Hero', skillDescription: 'Unleashes a flurry of high-tech shurikens at blinding speed.', lore: 'A warrior from a dystopian future, enhanced with cybernetics to be the perfect assassin.', ascensionLevel: 0 },
  { id: 15, name: 'Mech Pilot', level: 0, baseDps: 400, baseCost: 15000, upgradeCostMultiplier: 1.28, rarity: 'Legendary', role: 'Tank', skillDescription: 'Fires a massive laser cannon from his mech suit.', lore: 'A prodigy engineer and pilot, his custom-built mech is both a shield and a devastating weapon.', ascensionLevel: 0 },
  { id: 16, name: 'Monster Slayer', level: 0, baseDps: 15, baseCost: 180, upgradeCostMultiplier: 1.18, rarity: 'Rare', role: 'Video game Hero', skillDescription: 'Performs a powerful swing with his greatsword, effective against large foes.', lore: 'He wanders the land, hunting down the most dangerous beasts for coin and glory.', ascensionLevel: 0 },
  { id: 17, name: 'Cosmic Sorcerer', level: 0, baseDps: 800, baseCost: 50000, upgradeCostMultiplier: 1.3, rarity: 'Legendary', role: 'Mage', skillDescription: 'Summons a meteor shower, stunning and damaging the enemy.', lore: 'An ancient sage who draws power from the stars themselves, his knowledge is as vast as the universe.', ascensionLevel: 0 },
  { id: 18, name: 'Stealth Operative', level: 0, baseDps: 90, baseCost: 4000, upgradeCostMultiplier: 1.22, rarity: 'Epic', role: 'Assassin', skillDescription: 'Uses a cloaking device to land a guaranteed critical hit.', lore: 'A top-secret agent from a shadowy organization, her past is a classified secret.', ascensionLevel: 0 },
  { id: 19, name: 'Pirate Captain', level: 0, baseDps: 75, baseCost: 3500, upgradeCostMultiplier: 1.20, rarity: 'Epic', role: 'Mangas Hero', skillDescription: 'Orders a cannon barrage from his unseen ship.', lore: 'Feared across the seven seas, he lives for adventure, treasure, and the thrill of battle.', ascensionLevel: 0 },
  { id: 20, name: 'Dwarven Brawler', level: 0, baseDps: 25, baseCost: 250, upgradeCostMultiplier: 1.19, rarity: 'Rare', role: 'Bruiser', skillDescription: 'Slams the ground, stunning the enemy for a moment.', lore: 'Hailing from mountain strongholds, he loves a good fight and a better ale.', ascensionLevel: 0 },
  { id: 21, name: 'Plague Doctor', level: 0, baseDps: 5, baseCost: 40, upgradeCostMultiplier: 1.13, rarity: 'Common', role: 'Shaman', skillDescription: 'Throws a vial that weakens the enemy, increasing damage taken.', lore: 'A mysterious figure whose methods are unorthodox, but surprisingly effective.', ascensionLevel: 0 },
  { id: 22, name: 'Vampire Lord', level: 0, baseDps: 1500, baseCost: 100000, upgradeCostMultiplier: 1.35, rarity: 'Mythic', role: 'DPS', skillDescription: 'Drains the life force of his enemy to heal himself.', lore: 'An ancient noble cursed with immortality and an unquenchable thirst. His power is matched only by his tragic elegance.', ascensionLevel: 0 },
  { id: 23, name: 'Time Traveler', level: 0, baseDps: 12, baseCost: 1000, upgradeCostMultiplier: 1.24, rarity: 'Epic', role: 'Controller', skillDescription: 'Rewinds time slightly, giving other heroes a second chance to use skills.', lore: 'He has seen the beginning and the end, and now seeks to alter a future he cannot accept.', ascensionLevel: 0 },
  // 20 New Heroes
  { id: 24, name: 'Rift Strider', level: 0, baseDps: 350, baseCost: 14000, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Dashes through the enemy, dealing damage that ignores a portion of defense.', lore: 'Lost between dimensions, the Rift Strider seeks a way back home, using his unstable powers to eliminate obstacles.', ascensionLevel: 0 },
  { id: 25, name: 'Golem Forgemaster', level: 0, baseDps: 100, baseCost: 4500, upgradeCostMultiplier: 1.22, rarity: 'Epic', role: 'Bruiser', skillDescription: 'The golem smashes the ground, dealing AoE damage and stunning the enemy.', lore: 'He doesn\'t just build machines; he gives them a soul. His masterpiece, a golem of living stone and fire, fights by his side.', ascensionLevel: 0 },
  { id: 26, name: 'Star Shanty Bard', level: 0, baseDps: 5, baseCost: 200, upgradeCostMultiplier: 1.16, rarity: 'Rare', role: 'Support', skillDescription: 'Plays a song that increases the attack speed of all heroes for a short time.', lore: 'He\'s sailed the cosmic seas, collecting stories and songs. His music channels the very energy of the stars.', ascensionLevel: 0 },
  { id: 27, name: 'Feral Berserker', level: 0, baseDps: 18, baseCost: 220, upgradeCostMultiplier: 1.18, rarity: 'Rare', role: 'DPS', skillDescription: 'For a few seconds, his damage is increased based on his missing health.', lore: 'Exiled from his tribe for his uncontrollable rage, he now channels his fury against the forces of darkness.', ascensionLevel: 0 },
  { id: 28, name: 'Arcane Gunslinger', level: 0, baseDps: 130, baseCost: 5500, upgradeCostMultiplier: 1.23, rarity: 'Epic', role: 'Marksman', skillDescription: 'Fires a magically-infused bullet that ricochets between enemies.', lore: 'In a world where magic is fading, he\'s found a way to keep it alive, one bullet at a time.', ascensionLevel: 0 },
  { id: 29, name: 'Slime King', level: 0, baseDps: 2, baseCost: 30, upgradeCostMultiplier: 1.12, rarity: 'Common', role: 'Tank', skillDescription: 'Splits temporarily, distracting the enemy and reducing incoming damage.', lore: 'Started as a simple ooze, but after absorbing a fallen king\'s crown, he gained intelligence and a rather pompous attitude.', ascensionLevel: 0 },
  { id: 30, name: 'Cursed Samurai', level: 0, baseDps: 500, baseCost: 25000, upgradeCostMultiplier: 1.29, rarity: 'Legendary', role: 'Mangas Hero', skillDescription: 'A devastating single strike that also damages the Samurai himself.', lore: 'Bound by a blood pact to a demonic sword, he seeks a worthy opponent to finally break his curse or die trying.', ascensionLevel: 0 },
  { id: 31, name: 'Quantum Scientist', level: 0, baseDps: 60, baseCost: 3000, upgradeCostMultiplier: 1.21, rarity: 'Epic', role: 'Controller', skillDescription: 'Increases the enemy\'s chance to miss attacks for a short period.', lore: 'After a lab accident sent him spiraling through alternate realities, he learned to see and manipulate the threads of chance.', ascensionLevel: 0 },
  { id: 32, name: 'Spirit Shaman', level: 0, baseDps: 12, baseCost: 180, upgradeCostMultiplier: 1.17, rarity: 'Rare', role: 'Shaman', skillDescription: 'Summons a spirit wolf to attack alongside the heroes for a few seconds.', lore: 'The whispers of generations guide her hand. She is the bridge between the world of the living and the great spirit world.', ascensionLevel: 0 },
  { id: 33, name: 'Galaxy Serpent', level: 0, baseDps: 2000, baseCost: 150000, upgradeCostMultiplier: 1.36, rarity: 'Mythic', role: 'Mage', skillDescription: 'Calls down a collapsing star, dealing massive damage to the enemy.', lore: 'Older than galaxies, the Serpent is a force of nature, a cycle of cosmic destruction and rebirth made manifest.', ascensionLevel: 0 },
  { id: 34, name: 'Street Brawler', level: 0, baseDps: 4, baseCost: 35, upgradeCostMultiplier: 1.11, rarity: 'Common', role: 'Bruiser', skillDescription: 'A powerful punch that has a small chance to stun the enemy.', lore: 'Grew up fighting for every scrap. Now, he\'s found a bigger fight, and the pay is better.', ascensionLevel: 0 },
  { id: 35, name: 'Elven Mystic', level: 0, baseDps: 6, baseCost: 250, upgradeCostMultiplier: 1.17, rarity: 'Rare', role: 'Healer', skillDescription: 'Creates an aura that slowly regenerates the health of the team.', lore: 'As old as the forest she protects, her wisdom is deep and her magic is woven from life itself.', ascensionLevel: 0 },
  { id: 36, name: 'War Machine Alpha', level: 0, baseDps: 450, baseCost: 20000, upgradeCostMultiplier: 1.28, rarity: 'Legendary', role: 'Video game Hero', skillDescription: 'Unleashes a barrage of missiles, rockets, and lasers.', lore: 'Originally a military AI, it achieved self-awareness and now fights to protect all forms of life, organic and synthetic.', ascensionLevel: 0 },
  { id: 37, name: 'Sand Wraith', level: 0, baseDps: 95, baseCost: 4800, upgradeCostMultiplier: 1.23, rarity: 'Epic', role: 'Assassin', skillDescription: 'Envelops the enemy in a cursed sandstorm, dealing persistent damage.', lore: 'Born from the last breath of a betrayed king, the Sand Wraith tirelessly hunts those who have wronged the innocent.', ascensionLevel: 0 },
  { id: 38, name: 'Gravity Witch', level: 0, baseDps: 70, baseCost: 4200, upgradeCostMultiplier: 1.22, rarity: 'Epic', role: 'Controller', skillDescription: 'Crushes the enemy under immense gravitational force, significantly slowing them.', lore: 'She carries the weight of a dying star in her heart, allowing her to bend the fundamental forces of the universe to her will.', ascensionLevel: 0 },
  { id: 39, name: 'JRPG Protagonist', level: 0, baseDps: 600, baseCost: 40000, upgradeCostMultiplier: 1.31, rarity: 'Legendary', role: 'Mangas Hero', skillDescription: 'Unleashes a multi-hit combo attack that grows stronger with each prestige.', lore: 'He woke up in this universe with amnesia, a giant sword, and an unshakable feeling that he needs to save the world.', ascensionLevel: 0 },
  { id: 40, name: 'Field Medic', level: 0, baseDps: 1, baseCost: 20, upgradeCostMultiplier: 1.1, rarity: 'Common', role: 'Support', skillDescription: 'Applies a bandage to the most damaged hero, healing a small amount of health.', lore: 'She\'s seen the horrors of war and is determined to save as many lives as she can, one bandage at a time.', ascensionLevel: 0 },
  { id: 41, name: 'Abyssal Warlock', level: 0, baseDps: 1800, baseCost: 120000, upgradeCostMultiplier: 1.35, rarity: 'Mythic', role: 'Démoniste', skillDescription: 'Forces the enemy to gaze into the abyss, dealing massive damage and causing a random debuff.', lore: 'In his thirst for knowledge, he reached out to the entities between the stars. They answered, granting him power at the cost of his sanity.', ascensionLevel: 0 },
  { id: 42, name: 'Kaiju Hunter', level: 0, baseDps: 380, baseCost: 16000, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'An uppercut that deals bonus damage to bosses.', lore: 'From a world constantly under threat from colossal beasts, she and her Jaeger-like suit are humanity\'s last line of defense.', ascensionLevel: 0 },
  { id: 43, name: 'Aether Blade', level: 0, baseDps: 2500, baseCost: 200000, upgradeCostMultiplier: 1.38, rarity: 'Mythic', role: 'Assassin', skillDescription: 'Focuses all its energy into a single point, dealing astronomical damage.', lore: 'Not a person, but a weapon given form. The Aether Blade is a living concept of the \'perfect strike\', existing only to end conflicts.', ascensionLevel: 0 },
  { id: 44, name: 'Mech Goliath', level: 0, baseDps: 420, baseCost: 18000, upgradeCostMultiplier: 1.28, rarity: 'Legendary', role: 'Tank', skillDescription: 'Activates a kinetic shield that reflects a portion of enemy damage back.', lore: 'A colossal war machine from a fallen civilization, reactivated to serve a new master.', ascensionLevel: 0 },
  { id: 45, name: 'Astral Ranger', level: 0, baseDps: 140, baseCost: 6000, upgradeCostMultiplier: 1.24, rarity: 'Epic', role: 'Marksman', skillDescription: 'Fires an arrow of pure starlight that never misses and deals extra damage to bosses.', lore: 'A constellation given human form, she hunts down rogue stars and cosmic horrors.', ascensionLevel: 0 },
  { id: 46, name: 'Goblin Tinkerer', level: 0, baseDps: 3, baseCost: 45, upgradeCostMultiplier: 1.14, rarity: 'Common', role: 'Support', skillDescription: 'Throws a gadget that slightly increases the team\'s gold find for a few seconds.', lore: 'More interested in building contraptions than fighting, but his inventions sometimes work.', ascensionLevel: 0 },
  { id: 47, name: 'Crimson Witch', level: 0, baseDps: 700, baseCost: 45000, upgradeCostMultiplier: 1.32, rarity: 'Legendary', role: 'Démoniste', skillDescription: 'Sacrifices a small amount of her own HP to cast a devastating blood magic spell.', lore: 'A powerful sorceress from a shonen universe, she walks the line between chaos and control.', ascensionLevel: 0 },
  { id: 48, name: 'Paladin of the Sun', level: 0, baseDps: 80, baseCost: 4800, upgradeCostMultiplier: 1.22, rarity: 'Epic', role: 'Healer', skillDescription: 'Calls down a beam of sunlight, healing the team and damaging the enemy.', lore: 'A knight whose faith is as unbreakable as his armor. He serves a forgotten deity of light.', ascensionLevel: 0 },
  { id: 49, name: 'Cyberpunk Hacker', level: 0, baseDps: 10, baseCost: 160, upgradeCostMultiplier: 1.17, rarity: 'Rare', role: 'Controller', skillDescription: 'Uploads a virus that causes the enemy\'s attacks to temporarily deal less damage.', lore: 'She can break any firewall and bypass any security. Now she uses her skills to disrupt enemy forces.', ascensionLevel: 0 },
  { id: 50, name: 'Sand Scythe', level: 0, baseDps: 16, baseCost: 190, upgradeCostMultiplier: 1.18, rarity: 'Rare', role: 'Assassin', skillDescription: 'A swift strike with a blade of hardened sand that causes the enemy to bleed damage over time.', lore: 'A nomad of the great desert, she is as deadly and silent as the shifting dunes.', ascensionLevel: 0 },
  { id: 51, name: 'Barbarian Chieftain', level: 0, baseDps: 110, baseCost: 5200, upgradeCostMultiplier: 1.23, rarity: 'Epic', role: 'Bruiser', skillDescription: 'A mighty warcry that boosts his own DPS and the DPS of adjacent heroes.', lore: 'He united the warring clans of the north through sheer strength and force of will.', ascensionLevel: 0 },
  { id: 52, name: 'Fungal Shaman', level: 0, baseDps: 13, baseCost: 170, upgradeCostMultiplier: 1.17, rarity: 'Rare', role: 'Shaman', skillDescription: 'Summons toxic spores that poison the enemy, reducing their defense.', lore: 'He communicates with the vast mycelial network beneath the world, drawing strange powers from it.', ascensionLevel: 0 },
  { id: 53, name: 'Knight Errant', level: 0, baseDps: 4, baseCost: 38, upgradeCostMultiplier: 1.12, rarity: 'Common', role: 'DPS', skillDescription: 'A simple, honest sword strike that deals reliable damage.', lore: 'A young knight on a quest to prove his worth. He lacks experience but not courage.', ascensionLevel: 0 },
  { id: 54, name: 'Cosmic Overlord', level: 0, baseDps: 2200, baseCost: 180000, upgradeCostMultiplier: 1.37, rarity: 'Mythic', role: 'Mage', skillDescription: 'Rewrites a law of physics, dealing a percentage of the enemy\'s MAX HP as damage.', lore: 'A being from a higher plane of existence, it views battles as mere equations to be solved.', ascensionLevel: 0 },
  { id: 55, name: 'Silent Blade', level: 0, baseDps: 150, baseCost: 6500, upgradeCostMultiplier: 1.24, rarity: 'Epic', role: 'Assassin', skillDescription: 'Finds a weak point in the enemy\'s form, increasing all critical damage against them for a time.', lore: 'A member of an ancient order of spies and killers, her name is only a rumor.', ascensionLevel: 0 },
  { id: 56, name: 'Shield Maiden', level: 0, baseDps: 7, baseCost: 140, upgradeCostMultiplier: 1.16, rarity: 'Rare', role: 'Tank', skillDescription: 'Bangs her shield, taunting the enemy and increasing her own defense for a short duration.', lore: 'A fierce warrior from a land of ice and sagas, she is the immovable object to any unstoppable force.', ascensionLevel: 0 },
  { id: 57, name: 'Grove Protector', level: 0, baseDps: 2, baseCost: 32, upgradeCostMultiplier: 1.11, rarity: 'Common', role: 'Tank', skillDescription: 'Roots himself, slightly regenerating his health over a few seconds.', lore: 'A treant given life by ancient magic, he is slow to anger but terrible when roused.', ascensionLevel: 0 },
  { id: 58, name: 'Pirate Gunslinger', level: 0, baseDps: 22, baseCost: 240, upgradeCostMultiplier: 1.18, rarity: 'Rare', role: 'Marksman', skillDescription: 'Fires a "trick shot" that has a chance to drop extra gold on hit.', lore: 'He sails the seas of a popular manga world, known for his incredible aim and even more incredible luck.', ascensionLevel: 0 },
  { id: 59, name: 'Chrono Warden', level: 0, baseDps: 320, baseCost: 13000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Controller', skillDescription: 'Creates a time loop, forcing the enemy to repeat its last action, effectively stunning them.', lore: 'Tasked with protecting the timeline, he eliminates anomalies that threaten reality.', ascensionLevel: 0 },
  { id: 60, name: 'Archangel of Valor', level: 0, baseDps: 280, baseCost: 12500, upgradeCostMultiplier: 1.25, rarity: 'Legendary', role: 'Support', skillDescription: 'Grants the entire team a divine shield that absorbs a significant amount of damage.', lore: 'The commander of the celestial host, his presence inspires unwavering courage in his allies.', ascensionLevel: 0 },
  { id: 61, name: 'Void Horror', level: 0, baseDps: 2800, baseCost: 220000, upgradeCostMultiplier: 1.39, rarity: 'Mythic', role: 'DPS', skillDescription: 'Inflicts \'madness\', a debuff that deals increasing damage the longer it stays on the enemy.', lore: 'An eldritch being that slipped through the cracks of reality. Its very presence is a poison to the mind.', ascensionLevel: 0 },
  { id: 62, name: 'Spearmaster', level: 0, baseDps: 160, baseCost: 7000, upgradeCostMultiplier: 1.24, rarity: 'Epic', role: 'DPS', skillDescription: 'A lightning-fast spear thrust that has a high chance to be a critical hit.', lore: 'A hero from a martial arts manga, his spear is said to be able to pierce the heavens.', ascensionLevel: 0 },
  { id: 63, name: 'Detective Enigma', level: 0, baseDps: 11, baseCost: 175, upgradeCostMultiplier: 1.17, rarity: 'Rare', role: 'Controller', skillDescription: 'Points out a flaw, increasing the damage the enemy takes from all sources for a short time.', lore: 'A famous detective from a mystery video game, he can solve any crime and spot any weakness.', ascensionLevel: 0 },
];

export const ALL_ARTIFACTS: Artifact[] = [
  { id: 1, name: 'Orb of Power', description: '+10% to all hero DPS.', bonusType: 'dpsPercent', bonusValue: 0.10 },
  { id: 2, name: 'Amulet of Midas', description: '+25% gold from all sources.', bonusType: 'goldDropPercent', bonusValue: 0.25 },
  { id: 3, name: 'Gauntlets of Haste', description: '+50% to all click damage.', bonusType: 'clickDamagePercent', bonusValue: 0.50 },
  { id: 4, name: 'Tome of Focus', description: 'Hero skills charge 10% faster.', bonusType: 'skillChargeRate', bonusValue: 0.10 },
  { id: 5, name: 'Tome of Elem', description: 'Hero skills charge 15% faster.', bonusType: 'skillChargeRate', bonusValue: 0.15 },
];

// FIX: Add ALL_PETS constant for use in other components and pet logic
export const ALL_PETS: Pet[] = [
  { id: 1, name: 'Goldie the Goblin', rarity: 'Common', bonusType: 'goldDropPercent', baseBonus: 0.01, bonusPerLevel: 0.001, description: 'Increases gold dropped from enemies.', lore: 'A greedy but loyal goblin who has a knack for finding loose change.', art: '($.$)\n/| |\\\n / \\ ' },
  // FIX: Added evolutionCostEssence to make pet ascension functional
  { id: 2, name: 'Fury the Fire Sprite', rarity: 'Rare', bonusType: 'dpsPercent', baseBonus: 0.02, bonusPerLevel: 0.002, description: 'Increases total DPS of all heroes.', lore: 'A tiny elemental of pure rage. Its presence invigorates your heroes.', art: '(`A`)\n<{*}>\n V V ', evolutionCostEssence: 10 },
  { id: 3, name: 'Clicky the Crab', rarity: 'Epic', bonusType: 'clickDamagePercent', baseBonus: 0.05, bonusPerLevel: 0.005, description: 'Increases damage from your clicks.', lore: 'This crab clicks its claws with such force, it inspires you to do the same.', art: '(\\/)\n(o.o)\n(><)', evolutionCostEssence: 25 },
];

export const ALL_BLESSINGS: Blessing[] = [
  { type: 'goldRush', name: 'Blessing of Midas', description: 'Doubles all gold earned from enemies for 60 seconds.', durationSeconds: 60, cooldownSeconds: 86400, bonusMultiplier: 2 }, // 24 hours
  { type: 'powerSurge', name: 'Warrior\'s Zeal', description: 'Increases all hero DPS by 50% for 60 seconds.', durationSeconds: 60, cooldownSeconds: 86400, bonusMultiplier: 1.5 },
  { type: 'skillFrenzy', name: 'Arcane Haste', description: 'Instantly recharges all hero skills.', durationSeconds: 0, cooldownSeconds: 86400, bonusMultiplier: 0 }, // Instant effect
];

export const SYNERGY_BONUSES: { [key in Role]?: { count: number, bonus: { type: 'dpsPercent' | 'goldDropPercent' | 'clickDamagePercent', value: number }, description: string }[] } = {
  DPS: [
    { count: 2, bonus: { type: 'dpsPercent', value: 0.10 }, description: '+10% All DPS' },
    { count: 4, bonus: { type: 'dpsPercent', value: 0.25 }, description: '+25% All DPS' }
  ],
  Tank: [
    { count: 2, bonus: { type: 'goldDropPercent', value: 0.15 }, description: '+15% Gold Find' },
  ],
  Support: [
    { count: 2, bonus: { type: 'goldDropPercent', value: 0.10 }, description: '+10% Gold Find' },
  ],
  Assassin: [
    { count: 2, bonus: { type: 'clickDamagePercent', value: 0.20 }, description: '+20% Click Damage' },
  ],
  Mage: [
    { count: 2, bonus: { type: 'dpsPercent', value: 0.05 }, description: '+5% All DPS' },
    { count: 3, bonus: { type: 'dpsPercent', value: 0.15 }, description: '+15% All DPS' },
  ],
};

export const ALL_EXPEDITIONS: Expedition[] = [
  {
    id: 1,
    name: "Patrol the Whispering Woods",
    description: "A quick patrol to clear out any stray goblins and gather some resources.",
    durationSeconds: 3600, // 1 hour
    requirements: { minHeroes: 1, minTotalLevel: 10 },
    rewards: { gold: 5000, equipmentDrop: { chance: 0.25, rarity: 'Common' } }
  },
  {
    id: 2,
    name: "Explore the Sunken Crypt",
    description: "A delve into an ancient crypt. Requires a sturdy warrior to lead the way.",
    durationSeconds: 14400, // 4 hours
    requirements: { minHeroes: 2, minTotalLevel: 50, roles: [{ role: 'Tank', count: 1 }] },
    rewards: { gold: 25000, equipmentDrop: { chance: 0.5, rarity: 'Rare' } }
  },
  {
    id: 3,
    name: "Mine the Glimmering Caves",
    description: "These caves are rumored to hold not just ore, but crystallized prestige.",
    durationSeconds: 28800, // 8 hours
    requirements: { minHeroes: 3, minTotalLevel: 100 },
    rewards: { gold: 60000, prestigePoints: 5, equipmentDrop: { chance: 0.1, rarity: 'Rare' } }
  },
  {
    id: 4,
    name: "Assassinate the Orc Warlord",
    description: "A high-risk, high-reward mission that requires a stealthy approach.",
    durationSeconds: 43200, // 12 hours
    requirements: { minHeroes: 4, minTotalLevel: 200, roles: [{ role: 'Assassin', count: 1 }, { role: 'DPS', count: 2 }] },
    rewards: { gold: 150000, prestigePoints: 15, equipmentDrop: { chance: 0.75, rarity: 'Epic' } }
  }
];

export interface MiningOperation {
  id: number;
  name: string;
  description: string;
  durationSeconds: number;
  goldReward: number;
  stageRequirement: number;
}

export const ALL_MINING_OPERATIONS: MiningOperation[] = [
  { id: 1, name: 'Surface Prospecting', description: 'A quick scan of the surface for loose gold nuggets.', durationSeconds: 900, goldReward: 1500, stageRequirement: 1 }, // 15 mins
  { id: 2, name: 'Crystal Cavern', description: 'Explore a nearby cave known for its gold-rich crystals.', durationSeconds: 3600, goldReward: 7500, stageRequirement: 25 }, // 1 hour
  { id: 3, name: 'Deep Vein Mining', description: 'A serious operation to tap into a rich vein of gold deep underground.', durationSeconds: 14400, goldReward: 40000, stageRequirement: 50 }, // 4 hours
  { id: 4, name: 'Heart of the Mountain', description: 'A long and dangerous expedition to the molten core where legendary treasures are forged.', durationSeconds: 43200, goldReward: 150000, stageRequirement: 100 }, // 12 hours
  { id: 5, name: 'Asteroid Harvesting', description: 'Launch a rocket to a nearby asteroid belt to mine precious metals.', durationSeconds: 86400, goldReward: 350000, stageRequirement: 200 }, // 24 hours
];

export const ALL_DUNGEONS: Dungeon[] = [
    { 
        id: 1, name: 'Goblin Tunnels', description: 'A short raid on a nearby goblin nest. Quick and easy loot.', 
        difficulties: {
            'Normal': { stageRequirement: 10, durationSeconds: 1800, rewards: { gold: 3000, dungeonCrests: 1, equipmentDrop: { chance: 0.5, rarity: 'Common' } } },
            'Hard': { stageRequirement: 50, durationSeconds: 3600, cost: { gold: 1000 }, rewards: { gold: 10000, dungeonCrests: 3, petCrystals: 5, equipmentDrop: { chance: 0.6, rarity: 'Common' } } },
            'Nightmare': { stageRequirement: 100, durationSeconds: 7200, cost: { gold: 5000 }, rewards: { gold: 30000, dungeonCrests: 7, equipmentDrop: { chance: 0.5, rarity: 'Rare' }, petEggDrop: { chance: 0.05 } } }
        }
    },
    { 
        id: 2, name: 'Undead Catacombs', description: 'A spooky delve into a crypt teeming with restless dead.',
        difficulties: {
            'Normal': { stageRequirement: 40, durationSeconds: 7200, cost: { gold: 5000 }, rewards: { gold: 20000, dungeonCrests: 4, equipmentDrop: { chance: 0.75, rarity: 'Rare' } } },
            'Hard': { stageRequirement: 90, durationSeconds: 14400, cost: { gold: 20000 }, rewards: { gold: 80000, dungeonCrests: 10, petCrystals: 15, equipmentDrop: { chance: 0.85, rarity: 'Rare' } } },
            'Nightmare': { stageRequirement: 150, durationSeconds: 28800, cost: { gold: 75000 }, rewards: { gold: 250000, dungeonCrests: 25, equipmentDrop: { chance: 0.75, rarity: 'Epic' }, petEggDrop: { chance: 0.10 } } }
        }
    },
    { 
        id: 3, name: 'Dragon\'s Hoard', description: 'A daring attempt to sneak past a sleeping dragon and pilfer its treasure.',
        difficulties: {
            'Normal': { stageRequirement: 80, durationSeconds: 21600, cost: { gold: 25000 }, rewards: { gold: 120000, dungeonCrests: 15, equipmentDrop: { chance: 0.25, rarity: 'Epic' } } },
            'Hard': { stageRequirement: 140, durationSeconds: 43200, cost: { gold: 100000 }, rewards: { gold: 500000, dungeonCrests: 40, petCrystals: 30, equipmentDrop: { chance: 0.35, rarity: 'Epic' } } },
            'Nightmare': { stageRequirement: 200, durationSeconds: 86400, cost: { gold: 250000 }, rewards: { gold: 1500000, dungeonCrests: 100, equipmentDrop: { chance: 0.25, rarity: 'Legendary' }, petEggDrop: { chance: 0.20 } } }
        }
    },
    { 
        id: 4, name: 'The Void Abyss', description: 'A perilous journey into a realm of madness where reality frays at the edges.',
        difficulties: {
            'Normal': { stageRequirement: 150, durationSeconds: 86400, cost: { gold: 100000 }, rewards: { gold: 500000, dungeonCrests: 50, equipmentDrop: { chance: 0.1, rarity: 'Legendary' } } },
            'Hard': { stageRequirement: 250, durationSeconds: 172800, cost: { gold: 400000 }, rewards: { gold: 2000000, dungeonCrests: 150, petCrystals: 50, equipmentDrop: { chance: 0.15, rarity: 'Legendary' } } },
            'Nightmare': { stageRequirement: 400, durationSeconds: 172800, cost: { gold: 1000000 }, rewards: { gold: 5000000, dungeonCrests: 350, equipmentDrop: { chance: 0.1, rarity: 'Mythic' }, petEggDrop: { chance: 0.30 } } }
        }
    },
];

// FIX: Added petCrystals and essenceOfLoyalty to bounty rewards
export const ALL_DUNGEON_BOUNTIES: DungeonBounty[] = [
  { id: 1, name: 'Scout the Depths', description: 'A lone hero scouts ahead for minimal but quick rewards.', durationSeconds: 1800, requiredHeroCount: 1, rewards: { dungeonCrests: 2, gold: 1000, petCrystals: 1 } },
  { id: 2, name: 'Clear the Antechamber', description: 'A small team is needed to clear out the first rooms of a dungeon.', durationSeconds: 7200, requiredHeroCount: 2, rewards: { dungeonCrests: 5, gold: 5000, petCrystals: 5 } },
  { id: 3, name: 'Assassinate the Captain', description: 'A full squad is required for this high-risk, high-reward mission.', durationSeconds: 21600, requiredHeroCount: 4, rewards: { dungeonCrests: 15, gold: 20000, petCrystals: 10, essenceOfLoyalty: { chance: 0.1, amount: 1 } } },
];

export const ALL_DUNGEON_SHOP_ITEMS: DungeonShopItem[] = [
  {
    id: 1, name: 'Minor Gold Coffer', description: 'A small coffer of gold.', cost: 10,
    isSoldOut: () => false,
    purchase: (gameService: GameService) => {
      gameService.addGold(10000);
      return true;
    }
  },
  {
    id: 2, name: 'Rare Equipment Cache', description: 'Guaranteed to contain a Rare item.', cost: 50,
    isSoldOut: () => false,
    purchase: (gameService: GameService) => {
      // Logic to add a rare item to inventory
      const newItem = (gameService as any)._generateDroppedItem(gameService.gameState().stage, 'Rare');
      gameService.inventory.update(inv => [...inv, newItem]);
      return true;
    }
  },
  {
    id: 3, name: 'Tome of Wealth', description: 'Permanently increases all gold gains by 1%. (Max 10)', cost: 100, stock: 10,
    isSoldOut: (gameService: GameService) => (gameService.gameState().purchasedDungeonShopItems[3] || 0) >= 10,
    purchase: (gameService: GameService) => {
      gameService.gameState.update(s => {
        const newPurchased = {...s.purchasedDungeonShopItems};
        newPurchased[3] = (newPurchased[3] || 0) + 1;
        return {
          ...s,
          goldMultiplier: s.goldMultiplier + 0.01,
          purchasedDungeonShopItems: newPurchased
        };
      });
      return true;
    }
  }
];

const DAILY_REWARDS: {gold: number, prestigePoints: number}[] = [
    {gold: 1000, prestigePoints: 0},
    {gold: 2500, prestigePoints: 0},
    {gold: 5000, prestigePoints: 1},
    {gold: 10000, prestigePoints: 2},
    {gold: 15000, prestigePoints: 3},
    {gold: 25000, prestigePoints: 4},
    {gold: 50000, prestigePoints: 10},
];

const INITIAL_HEROES = ALL_HEROES.slice(0, 5);

const INITIAL_QUESTS: Omit<Quest, 'isCompleted' | 'isClaimed'>[] = [
  // Main Story
  { id: 1, description: 'Reach Stage 10', type: 'reachStage', target: 10, category: 'Main Story', reward: { gold: 100 } },
  { id: 2, description: 'Reach Stage 25', type: 'reachStage', target: 25, category: 'Main Story', reward: { gold: 500 } },
  { id: 3, description: 'Level up a hero to level 10', type: 'levelUpHero', target: 10, category: 'Main Story', reward: { gold: 200 } },
  { id: 4, description: 'Reach Stage 50', type: 'reachStage', target: 50, category: 'Main Story', reward: { gold: 2500, prestigePoints: 1 } },
  { id: 5, description: 'Reach Stage 75', type: 'reachStage', target: 75, category: 'Main Story', reward: { gold: 5000 } },
  { id: 6, description: 'Reach Stage 100', type: 'reachStage', target: 100, category: 'Main Story', reward: { gold: 10000, prestigePoints: 2 } },
  { id: 11, description: 'Reach Stage 250', type: 'reachStage', target: 250, category: 'Main Story', reward: { gold: 100000, prestigePoints: 10 } },
  { id: 12, description: 'Reach Stage 300', type: 'reachStage', target: 300, category: 'Main Story', reward: { gold: 250000, prestigePoints: 15 } },
  { id: 13, description: 'Reach Stage 400', type: 'reachStage', target: 400, category: 'Main Story', reward: { gold: 500000, prestigePoints: 20 } },
  { id: 14, description: 'Reach Stage 500', type: 'reachStage', target: 500, category: 'Main Story', reward: { gold: 1000000, prestigePoints: 50 } },
  { id: 15, description: 'Level up a hero to level 25', type: 'levelUpHero', target: 25, category: 'Main Story', reward: { gold: 7500 } },
  { id: 16, description: 'Level up a hero to level 50', type: 'levelUpHero', target: 50, category: 'Main Story', reward: { gold: 25000 } },
  { id: 17, description: 'Level up a hero to level 100', type: 'levelUpHero', target: 100, category: 'Main Story', reward: { gold: 100000, prestigePoints: 5 } },
  { id: 18, description: 'Level up 3 heroes to level 20', type: 'levelUpMultipleHeroes', target: { level: 20, count: 3 }, category: 'Main Story', reward: { gold: 15000 } },
  { id: 19, description: 'Unlock 10 heroes', type: 'unlockHeroCount', target: 10, category: 'Main Story', reward: { gold: 5000 } },
  { id: 20, description: 'Unlock 20 heroes', type: 'unlockHeroCount', target: 20, category: 'Main Story', reward: { gold: 20000 } },
  { id: 21, description: 'Prestige for the first time', type: 'prestigeCount', target: 1, category: 'Main Story', reward: { gold: 50000 } },
  { id: 22, description: 'Forge a Rare item', type: 'forgeRarity', target: 'Rare', category: 'Main Story', reward: { gold: 1000 } },
  { id: 23, description: 'Clear Tower Floor 5', type: 'clearTowerFloor', target: 5, category: 'Main Story', reward: { gold: 2000 } },
  { id: 24, description: 'Clear Tower Floor 10', type: 'clearTowerFloor', target: 10, category: 'Main Story', reward: { gold: 10000, prestigePoints: 1 } },
  { id: 25, description: 'Clear Tower Floor 20', type: 'clearTowerFloor', target: 20, category: 'Main Story', reward: { gold: 50000, prestigePoints: 5 } },
  { id: 26, description: 'Complete an Expedition', type: 'completeExpeditions', target: 1, category: 'Main Story', reward: { gold: 2500 } },
  { id: 27, description: 'Complete a Dungeon run', type: 'completeDungeons', target: 1, category: 'Main Story', reward: { gold: 2500 } },
  { id: 28, description: 'Field a team of 10 heroes', type: 'fieldHeroes', target: 10, category: 'Main Story', reward: { gold: 10000 } },
  { id: 29, description: 'Field a team of 20 heroes', type: 'fieldHeroes', target: 20, category: 'Main Story', reward: { gold: 50000 } },
  { id: 30, description: 'Earn a total of 1 Million Gold', type: 'earnGold', target: 1000000, category: 'Main Story', reward: { gold: 0, prestigePoints: 5 } },
  { id: 32, description: 'Perform 1,000 clicks', type: 'clickCount', target: 1000, category: 'Main Story', reward: { gold: 1000 } },
  { id: 33, description: 'Perform 10,000 clicks', type: 'clickCount', target: 10000, category: 'Main Story', reward: { gold: 10000 } },
  { id: 34, description: 'Prestige 3 times', type: 'prestigeCount', target: 3, category: 'Main Story', reward: { gold: 0, prestigePoints: 10 } },

  // Daily
  { id: 101, description: 'Defeat 50 enemies', type: 'defeatEnemies', target: 50, category: 'Daily', reward: { gold: 500 } },
  { id: 102, description: 'Defeat 250 enemies', type: 'defeatEnemies', target: 250, category: 'Daily', reward: { gold: 2500 } },
  { id: 103, description: 'Use hero skills 20 times', type: 'useSkills', target: 20, category: 'Daily', reward: { gold: 1000 } },
  { id: 104, description: 'Click 1,000 times', type: 'clickCount', target: 1000, category: 'Daily', reward: { gold: 1000 } },
  { id: 105, description: 'Earn 100k Gold', type: 'earnGold', target: 100000, category: 'Daily', reward: { gold: 5000 } },
  { id: 106, description: 'Claim a sponsor offer', type: 'claimSponsorGold', target: 1, category: 'Daily', reward: { gold: 5000 } },
  { id: 107, description: 'Complete an expedition', type: 'completeExpeditions', target: 1, category: 'Daily', reward: { gold: 2000 } },
  { id: 108, description: 'Complete a dungeon run', type: 'completeDungeons', target: 1, category: 'Daily', reward: { gold: 2000 } },
  { id: 109, description: 'Clear a Tower floor', type: 'clearTowerFloor', target: 1, category: 'Daily', reward: { gold: 1000 } },
  { id: 110, description: 'Forge an item', type: 'forgeAnyItem', target: 1, category: 'Daily', reward: { gold: 1000 } },
  { id: 111, description: 'Use hero skills 50 times', type: 'useSkills', target: 50, category: 'Daily', reward: { gold: 3000 } },

  // Weekly
  { id: 201, description: 'Summon 3 heroes', type: 'summonHero', target: 3, category: 'Weekly', reward: { gold: 1000 } },

  // Achievements
  { id: 301, description: 'Forge an Epic item', type: 'forgeRarity', target: 'Epic', category: 'Achievements', reward: { gold: 0, prestigePoints: 5 } },
  { id: 302, description: 'Forge a Legendary item', type: 'forgeRarity', target: 'Legendary', category: 'Achievements', reward: { gold: 0, prestigePoints: 20 } },
  { id: 303, description: 'Reach Stage 1000', type: 'reachStage', target: 1000, category: 'Achievements', reward: { gold: 0, prestigePoints: 100 } },
  { id: 304, description: 'Prestige 10 times', type: 'prestigeCount', target: 10, category: 'Achievements', reward: { gold: 0, prestigePoints: 50 } },
  { id: 305, description: 'Unlock a Legendary Hero', type: 'unlockHeroRarity', target: 'Legendary', category: 'Achievements', reward: { gold: 0, prestigePoints: 25 } },
  { id: 306, description: 'Unlock a Mythic Hero', type: 'unlockHeroRarity', target: 'Mythic', category: 'Achievements', reward: { gold: 0, prestigePoints: 100 } },
  { id: 307, description: 'Complete 10 Dungeons', type: 'completeDungeons', target: 10, category: 'Achievements', reward: { gold: 0, prestigePoints: 10 } },
  { id: 308, description: 'Complete 10 Expeditions', type: 'completeExpeditions', target: 10, category: 'Achievements', reward: { gold: 0, prestigePoints: 10 } },
  { id: 309, description: 'Forge a Mythic item', type: 'forgeRarity', target: 'Mythic', category: 'Achievements', reward: { gold: 0, prestigePoints: 100 } },
  { id: 310, description: 'Unlock 50 heroes', type: 'unlockHeroCount', target: 50, category: 'Achievements', reward: { gold: 0, prestigePoints: 50 } },
  { id: 311, description: 'Reach 1 Million total clicks', type: 'clickCount', target: 1000000, category: 'Achievements', reward: { gold: 0, prestigePoints: 20 } },
  { id: 312, description: 'Earn 1 Trillion total gold', type: 'earnGold', target: 1e12, category: 'Achievements', reward: { gold: 0, prestigePoints: 50 } },
];

// FIX: Add missing baseBonusValue and enchantLevel to initial equipment
const INITIAL_EQUIPMENT: EquipmentItem[] = [
  { id: 101, name: 'Rusty Sword', slot: 'Weapon', bonusType: 'dpsFlat', bonusValue: 2, baseBonusValue: 2, enchantLevel: 0, rarity: 'Common', lore: 'Seen better days, but still pointy.' },
  { id: 102, name: 'Apprentice Wand', slot: 'Weapon', bonusType: 'dpsPercent', bonusValue: 0.05, baseBonusValue: 0.05, enchantLevel: 0, rarity: 'Rare', lore: 'Crackles with barely contained magical energy. Smells faintly of ozone.' },
  { id: 201, name: 'Leather Tunic', slot: 'Armor', bonusType: 'dpsFlat', bonusValue: 1, baseBonusValue: 1, enchantLevel: 0, rarity: 'Common', lore: 'Smells of adventure and... is that goblin sweat?' },
  { id: 301, name: 'Amulet of Greed', slot: 'Accessory', bonusType: 'goldDropPercent', bonusValue: 0.1, baseBonusValue: 0.1, enchantLevel: 0, rarity: 'Epic', lore: 'Whispers promises of wealth to its wearer. It\'s best not to listen too closely.' },
  { id: 103, name: 'Old Dagger', slot: 'Weapon', bonusType: 'dpsFlat', bonusValue: 1, baseBonusValue: 1, enchantLevel: 0, rarity: 'Common', lore: 'Perfect for cutting ropes, apples, or the purse strings of unwary travelers.' },
  { id: 104, name: 'Cracked Staff', slot: 'Weapon', bonusType: 'dpsFlat', bonusValue: 1, baseBonusValue: 1, enchantLevel: 0, rarity: 'Common', lore: 'Held together with duct tape and sheer willpower.' },
];

const ENEMY_NAMES = ['Goblin', 'Slime', 'Orc', 'Dire Wolf', 'Stone Golem', 'Dragon Whelp'];
const TOWER_ENEMY_NAMES = ['Guardian', 'Sentinel', 'Warden', 'Executioner', 'Arbiter', 'Colossus'];
const PRESTIGE_STAGE_REQUIREMENT = 50;
const RARITY_ORDER: Rarity[] = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];
export const STANDARD_SUMMON_COST_GOLD = 1000;
export const PREMIUM_SUMMON_COST_PRESTIGE = 10;
const DUPLICATE_HERO_GOLD_REWARD = 500;
const SKILL_CHARGE_RATE = 2; // points per second
const XP_PER_DPS_PER_SECOND = 0.05;
const SAVE_KEY = 'idleHeroesUniverseSave';

const ASCII_ART = {
  Normal: {
    heads: ['(Ò_Ó)', '(>_<)', '(ô_ô)', '[O.O]', '{\\__/}', '(o_o)', '(¬_¬)', '´ཀ`  ´ཀ`'],
    bodies: ['/| |\\', '/| |\\', '-( )-', '-[ ]-', '={ }=', 'd[ ]b', 'q( )p',' ´ཀ`´ཀ` '],
    legs: [' / \\ ', ' || ||', ' //\\\\', ' v   v', '--- ---', '_/ \\_', '| | | |','´ཀ`  ´ཀ`']
  },
  Armored: {
    heads: ['[[Ò-Ó]]', '(#_#)', '[-|-]', '[ helmet ]', '<|#_#|>','  𓁹‿𓁹'],
    bodies: ['/|##|\\', '[|##|]', '=|##|=', '[| H |]', '{|---|','𓁹‿𓁹  𓁹‿𓁹'],
    legs: ['/## ##\\', '[## ##]', '--- ---', '|_| |_|', '/=\\ /=\\','´ཀ`  ´ཀ`']
  },
  Swift: {
    heads: ['(>->)', '(^-^)', '<(o_o)>', '(>>_>>)', '(`·.·´)','👻👻👻👻👻'],
    bodies: ['-| |-','-(_)-','- ) (' , '>( )<', '}( )/{','👻👻👻👻👻' ],
    legs: [' /  \\',' |  |','<<  >>', '-/  \\-', '´-- --`','👻👻👻👻👻']
  },
  Hoarder: {
    heads: ['(U_U)', '($_$)', '{o.o}', '[$.$]', '(g_g)',''],
    bodies: ['/O()O\\', '[O()O]', '={O()O}=', '[G()G]', '(|o o|)','(㇏(•̀ᢍ•́)ノ)'],
    legs: [' / O \\ ', ' ||O||', 'OO---OO', '[_] [_]', '$   $','']
  },
  Boss: {
    heads: ['(◣_◢)', '(#`皿´#)', '[■-■]', '(|ÒДÓ|)', '╲/`°´\\╱'],
    bodies: ['/|H H|\\', '[|H H|]', '={H H}=', '[|XXX|]', '((|#|))'],
    legs: ['/H| |H\\', '[H| |H]', 'HHH HHH', '/|¯ ¯|\\', '==| |==']
  },
  Caster: {
    heads: ['(ô.ô)', '(~_~)', '(`-´)', '(o.o)p', 'q(o.o)'],
    bodies: ['-)|(-', '-/|\\-', '={*}=-', '-(*)-', 'o)*(*o'],
    legs: [' /"\\ ', ' //\\\\', '-~-~-', '(___)', '`~-~´']
  },
  Squad: {
    heads: ['(o.o) (o.o)', '(>.<) (>.<)', '[^ ^] [^ ^]', '(ò_ó)(ó_ò)'],
    bodies: ['/| |\\ /| |\\', '-( )--( )-', '-[ ]--[ ]-', 'd[ ]b d[ ]b'],
    legs: [' / \\   / \\ ', ' ||||  ||||', ' //\\ //\\', '_/ \\_ _/ \\_']
  },
};


export class GameService {
  gameState: WritableSignal<GameState> = signal({
    stage: 1,
    gold: 0,
    clickDamage: 1,
    prestigePoints: 0,
    goldMultiplier: 1,
    activeHeroIds: [1, ...Array(19).fill(null)],
    teamPresets: [
      { name: 'Preset A', heroIds: Array(20).fill(null) },
      { name: 'Preset B', heroIds: Array(20).fill(null) },
      { name: 'Preset C', heroIds: Array(20).fill(null) },
    ],
    prestigePowerLevel: 0,
    clickingFrenzyLevel: 0,
    startingGoldLevel: 0,
    expeditionSlotsLevel: 0,
    dungeonSlotsLevel: 0,
    totalEnemiesDefeated: 0,
    totalHeroesSummoned: 0,
    highestRarityForged: null,
    lastUpdateTimestamp: Date.now(),
    towerFloor: 1,
    lastLoginDate: null,
    consecutiveLoginDays: 0,
    artifacts: [],
    unlockedHeroIds: [],
    viewedHeroIdsInCodex: [],
    totalClicks: 0,
    totalGoldEarned: 0,
    totalPrestiges: 0,
    totalSkillsUsed: 0,
    totalDungeonsCompleted: 0,
    totalExpeditionsCompleted: 0,
    totalSponsorClaims: 0,
    totalItemsForged: 0,
    autoDpsEnabled: true,
    autoSkillEnabled: false,
    ongoingExpeditions: [],
    activeDungeonRuns: [],
    activeBlessings: [],
    blessingCooldowns: [],
    lastTributeClaimTimestamp: null,
    lastGoldRushTimestamp: null,
    vaultInvestment: null,
    lastSponsorOfferTimestamp: null,
    activeMiningOperation: null,
    // FIX: Renamed arcaneDust to enchantingDust to match GameState model
    enchantingDust: 0,
    lastFreeStandardSummonTimestamp: null,
    heroShards: {},
    // FIX: Add missing GameState properties for dungeons
    dungeonCrests: 0,
    activeDungeonBounties: [],
    purchasedDungeonShopItems: {},
    // FIX: Add missing GameState properties for pets to fix compilation error
    pets: [],
    petCrystals: 0,
    // FIX: Add missing essenceOfLoyalty to GameState initialization
    essenceOfLoyalty: 0,
  });

  heroes: WritableSignal<Hero[]> = signal([]);
  quests: WritableSignal<Quest[]> = signal([]);
  inventory: WritableSignal<EquipmentItem[]> = signal([]);
  
  artifacts = computed(() => ALL_ARTIFACTS.filter(a => this.gameState().artifacts.includes(a.id)));

  currentEnemy: WritableSignal<Enemy> = signal(this.createEnemy(1));
  towerEnemy = signal<Enemy | null>(null);
  isInTowerCombat = signal<boolean>(false);
  
  // Signals for one-time modals
  offlineReport = signal<{gold: number, xp: number, seconds: number} | null>(null);
  isDailyRewardAvailable = signal<boolean>(false);
  
  lastItemDrop = signal<EquipmentItem | null>(null);

  heroToViewInTeam = signal<number | null | undefined>(undefined);

  private artifactBonuses = computed(() => {
    const bonuses = { dpsPercent: 0, goldDropPercent: 0, clickDamagePercent: 0, skillChargeRate: 0 };
    this.artifacts().forEach(artifact => {
        if (artifact.bonusType in bonuses) {
            (bonuses as any)[artifact.bonusType] += artifact.bonusValue;
        }
    });
    return bonuses;
  });

  activeHeroes = computed(() => {
    const activeIds = this.gameState().activeHeroIds;
    return this.heroes().filter(h => activeIds.includes(h.id));
  });
  
  activeSynergies = computed(() => {
      const activeHeroes = this.activeHeroes();
      const roleCounts: { [key in Role]?: number } = {};
      for (const hero of activeHeroes) {
          roleCounts[hero.role] = (roleCounts[hero.role] || 0) + 1;
      }

      const activeBonuses: { role: Role, description: string }[] = [];
      for (const role in roleCounts) {
          const synergiesForRole = SYNERGY_BONUSES[role as Role];
          if (synergiesForRole) {
              const count = roleCounts[role as Role]!;
              // Find the highest tier of synergy met
              const bestBonus = synergiesForRole
                  .filter(s => count >= s.count)
                  .sort((a, b) => b.count - a.count)[0];
              
              if (bestBonus) {
                  activeBonuses.push({ role: role as Role, description: bestBonus.description });
              }
          }
      }
      return activeBonuses;
  });

  private synergyBonuses = computed(() => {
      const bonuses = { dpsPercent: 0, goldDropPercent: 0, clickDamagePercent: 0 };
      const activeHeroes = this.activeHeroes();
      const roleCounts: { [key in Role]?: number } = {};
      for (const hero of activeHeroes) {
          roleCounts[hero.role] = (roleCounts[hero.role] || 0) + 1;
      }

      for (const role in roleCounts) {
          const synergiesForRole = SYNERGY_BONUSES[role as Role];
          if (synergiesForRole) {
              const count = roleCounts[role as Role]!;
              const bestBonus = synergiesForRole
                  .filter(s => count >= s.count)
                  .sort((a, b) => b.count - a.count)[0];
              
              if (bestBonus) {
                  (bonuses as any)[bestBonus.bonus.type] += bestBonus.bonus.value;
              }
          }
      }
      return bonuses;
  });

  totalDps = computed(() => {
    const baseDps = this.activeHeroes().reduce((sum, hero) => sum + hero.currentDps, 0);
    let finalDps = baseDps * (1 + this.artifactBonuses().dpsPercent + this.synergyBonuses().dpsPercent);

    // Apply blessing bonus
    const powerSurge = this.gameState().activeBlessings.find(b => b.type === 'powerSurge');
    if(powerSurge) {
        const blessingInfo = ALL_BLESSINGS.find(b => b.type === 'powerSurge')!;
        finalDps *= blessingInfo.bonusMultiplier;
    }

    return finalDps;
  });
  private totalClickDamageBonus = computed(() => this.getGlobalBonus('clickDamageFlat'));
  private totalGoldDropBonus = computed(() => this.getGlobalBonus('goldDropPercent'));

  damageFlashes: WritableSignal<{ id: number, type: 'click' | 'dps' | 'skill', damage: number, x: number }[]> = signal([]);

  stageCleared = signal<boolean>(false);
  recentlyLeveledHeroId = signal<number | null>(null);
  enemyIsShaking = signal<boolean>(false);
  enemyHit = signal<boolean>(false);
  heroAttackPulse = signal<boolean>(false);
  lastSkillUsed = signal<{ heroId: number, damage: number, rarity: Rarity } | null>(null);

  hasClaimableQuests = computed(() => this.quests().some(q => q.isCompleted && !q.isClaimed));

  constructor() {
    const loaded = this.loadGame();
    if (!loaded) {
      this.initializeInventory();
      this.initializeGame();
      this.initializeQuests();
    }
    this.checkDailyLogin();
    setInterval(() => this.saveGame(), 5000);
  }

  saveGame() {
    this.gameState.update(s => ({ ...s, lastUpdateTimestamp: Date.now() }));
    const saveData = {
      gameState: this.gameState(),
      heroes: this.heroes(),
      inventory: this.inventory(),
      quests: this.quests(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  }

  loadGame(): boolean {
    const saveData = localStorage.getItem(SAVE_KEY);
    if (!saveData) return false;

    try {
      const parsedData = JSON.parse(saveData);
      const savedGameState = this._addMissingGameStateFields(parsedData.gameState);

      this.gameState.set(savedGameState);

      const lastTime = savedGameState.lastUpdateTimestamp || Date.now();
      const offlineSeconds = Math.min(86400, (Date.now() - lastTime) / 1000);

      if (offlineSeconds > 30) {
          const savedHeroesWithStats = parsedData.heroes.map((h: Hero) => this.calculateHeroStats(h));
          const activeHeroIds = new Set(savedGameState.activeHeroIds);
          const offlineDps = savedHeroesWithStats
            .filter((h: Hero) => activeHeroIds.has(h.id))
            .reduce((sum: number, hero: Hero) => sum + hero.currentDps, 0);
          
          const totalXpGained = offlineDps * offlineSeconds * XP_PER_DPS_PER_SECOND;
          const stageGoldPerSecond = (this.createEnemy(savedGameState.stage).goldReward * 0.5); // Estimate gold/sec
          const totalGoldGained = stageGoldPerSecond * offlineSeconds * 0.25; // Nerf offline gold
          
          this.offlineReport.set({gold: totalGoldGained, xp: totalXpGained, seconds: offlineSeconds});
          
          savedGameState.gold += totalGoldGained;
          savedGameState.totalGoldEarned = (savedGameState.totalGoldEarned || 0) + totalGoldGained;

          const activeHeroesCount = savedGameState.activeHeroIds.filter((id: number | null) => id !== null).length;
          if (activeHeroesCount > 0) {
              const xpPerHero = totalXpGained / activeHeroesCount;
              parsedData.heroes.forEach((h: Hero) => {
                  if (activeHeroIds.has(h.id)) h.offlineXp = (h.offlineXp || 0) + xpPerHero;
                  else h.offlineXp = 0;
              });
          }
      }

      this.gameState.set(savedGameState);
      const finalHeroes = parsedData.heroes.map((h: Hero) => {
        const heroWithStats = {
          ...h,
          stats: h.stats || { totalDamageDealt: 0, skillsUsed: 0 }
        };
        return this.calculateHeroStats(heroWithStats);
      });
      this.heroes.set(finalHeroes);
      this.inventory.set(parsedData.inventory || []);
      this.quests.set(parsedData.quests || []);

      this.currentEnemy.set(this.createEnemy(this.gameState().stage));
      this.checkQuestCompletion();
      return true;
    } catch (e) {
      console.error("Failed to load save data:", e);
      localStorage.removeItem(SAVE_KEY);
      return false;
    }
  }

  private _addMissingGameStateFields(state: any): GameState {
    const defaultPresets: TeamPreset[] = [
      { name: 'Preset A', heroIds: Array(20).fill(null) },
      { name: 'Preset B', heroIds: Array(20).fill(null) },
      { name: 'Preset C', heroIds: Array(20).fill(null) },
    ];
    let activeHeroIds = state.activeHeroIds ?? [1, ...Array(19).fill(null)];
    if (activeHeroIds.length < 20) {
      activeHeroIds = [...activeHeroIds, ...Array(20 - activeHeroIds.length).fill(null)];
    }
    return {
        ...state,
        activeHeroIds,
        teamPresets: state.teamPresets ?? defaultPresets,
        towerFloor: state.towerFloor ?? 1,
        lastLoginDate: state.lastLoginDate ?? null,
        consecutiveLoginDays: state.consecutiveLoginDays ?? 0,
        artifacts: state.artifacts ?? [],
        unlockedHeroIds: state.unlockedHeroIds ?? [],
        viewedHeroIdsInCodex: state.viewedHeroIdsInCodex ?? [],
        totalClicks: state.totalClicks ?? 0,
        totalGoldEarned: state.totalGoldEarned ?? 0,
        totalPrestiges: state.totalPrestiges ?? 0,
        totalSkillsUsed: state.totalSkillsUsed ?? 0,
        totalDungeonsCompleted: state.totalDungeonsCompleted ?? 0,
        totalExpeditionsCompleted: state.totalExpeditionsCompleted ?? 0,
        totalSponsorClaims: state.totalSponsorClaims ?? 0,
        totalItemsForged: state.totalItemsForged ?? 0,
        autoDpsEnabled: state.autoDpsEnabled ?? true,
        autoSkillEnabled: state.autoSkillEnabled ?? false,
        expeditionSlotsLevel: state.expeditionSlotsLevel ?? 0,
        dungeonSlotsLevel: state.dungeonSlotsLevel ?? 0,
        ongoingExpeditions: state.ongoingExpeditions ?? [],
        activeDungeonRuns: state.activeDungeonRuns ?? [],
        activeBlessings: state.activeBlessings ?? [],
        blessingCooldowns: state.blessingCooldowns ?? [],
        lastTributeClaimTimestamp: state.lastTributeClaimTimestamp ?? null,
        lastGoldRushTimestamp: state.lastGoldRushTimestamp ?? null,
        vaultInvestment: state.vaultInvestment ?? null,
        lastSponsorOfferTimestamp: state.lastSponsorOfferTimestamp ?? null,
        activeMiningOperation: state.activeMiningOperation ?? null,
        // FIX: Use enchantingDust and provide fallback from arcaneDust for old saves
        enchantingDust: state.enchantingDust ?? (state.arcaneDust ?? 0),
        lastFreeStandardSummonTimestamp: state.lastFreeStandardSummonTimestamp ?? null,
        heroShards: state.heroShards ?? {},
        // FIX: Add missing GameState properties for dungeons
        dungeonCrests: state.dungeonCrests ?? 0,
        activeDungeonBounties: state.activeDungeonBounties ?? [],
        purchasedDungeonShopItems: state.purchasedDungeonShopItems ?? {},
        // FIX: Add missing GameState properties for pets to handle loading older save files
        pets: state.pets ?? [],
        petCrystals: state.petCrystals ?? 0,
        essenceOfLoyalty: state.essenceOfLoyalty ?? 0,
    };
  }
  
  private initializeInventory() {
    this.inventory.set(INITIAL_EQUIPMENT);
  }

  private initializeGame(isPrestige = false) {
    const heroesWithStats = INITIAL_HEROES.map(h => {
        const hero: Omit<Hero, 'currentDps' | 'nextLevelCost'> = {
            ...h,
            level: (isPrestige && h.id === 1) ? 1 : (h.level || 0),
            equipment: { Weapon: null, Armor: null, Accessory: null },
            skillCharge: 0,
            skillReady: false,
            isFavorite: false,
            currentXp: 0,
            xpToNextLevel: 100,
            offlineXp: 0,
            stats: { totalDamageDealt: 0, skillsUsed: 0 },
            ascensionLevel: 0,
        };
        return this.calculateHeroStats(hero);
    });
    this.heroes.set(heroesWithStats);
    if (!isPrestige) {
        this.gameState.update(s => ({...s, unlockedHeroIds: [1,2,3,4,5]}));
    }
  }

  private initializeQuests() {
    this.quests.set(INITIAL_QUESTS.map(q => ({...q, isCompleted: false, isClaimed: false })));
    this.checkQuestCompletion();
  }

  startGameLoop() {
    setInterval(() => {
      this.updateGame();
    }, 1000);
  }

  private updateGame() {
    // Deal Auto-DPS damage
    const dps = this.totalDps();
    if (dps > 0) {
      if (!this.isInTowerCombat() && this.gameState().autoDpsEnabled) {
        this.dealDamageToEnemy(dps, 'dps');
      }
    }

    // Auto-Skill usage
    if (this.gameState().autoSkillEnabled) {
        const readyHero = this.activeHeroes().find(h => h.skillReady);
        if (readyHero) {
            this.activateHeroSkill(readyHero.id);
        }
    }

    // Passive Online XP and Skill Charge
    const totalXpGainedThisSecond = this.totalDps() * XP_PER_DPS_PER_SECOND;
    const skillChargeBonus = 1 + this.artifactBonuses().skillChargeRate;
    const activeHeroIds = new Set(this.gameState().activeHeroIds);

    this.heroes.update(heroes => {
      const activeHeroesCount = this.activeHeroes().length;
      const xpPerHero = activeHeroesCount > 0 ? totalXpGainedThisSecond / activeHeroesCount : 0;
      
      return heroes.map(h => {
        if (activeHeroIds.has(h.id)) {
          const needsXpUpdate = xpPerHero > 0;
          const needsSkillUpdate = !h.skillReady;

          if (!needsXpUpdate && !needsSkillUpdate) {
            return h;
          }

          const updatedHero = { ...h };

          if (needsXpUpdate) {
            updatedHero.offlineXp = (h.offlineXp || 0) + xpPerHero;
          }

          if (needsSkillUpdate) {
            const newCharge = Math.min(100, h.skillCharge + (SKILL_CHARGE_RATE * skillChargeBonus));
            updatedHero.skillCharge = newCharge;
            updatedHero.skillReady = newCharge >= 100;
          }

          return updatedHero;
        }
        return h;
      });
    });

    // Visual pulse for hero attacks
    this.heroAttackPulse.set(true);
    setTimeout(() => this.heroAttackPulse.set(false), 500);

    // check for expired blessings
    const now = Date.now();
    const activeBlessings = this.gameState().activeBlessings;
    if (activeBlessings.length > 0) {
        this.gameState.update(s => ({
            ...s,
            activeBlessings: s.activeBlessings.filter(b => b.endTime > now)
        }));
    }
  }

  playerClick() {
    const clickFrenzyBonus = 1 + (this.gameState().clickingFrenzyLevel * 0.05);
    let clickDamage = (this.gameState().clickDamage + this.totalClickDamageBonus()) * clickFrenzyBonus;
    clickDamage *= (1 + this.artifactBonuses().clickDamagePercent + this.synergyBonuses().clickDamagePercent);
    
    if (this.isInTowerCombat()) {
        this.applyTowerDamage(clickDamage, 'click');
    } else {
        this.dealDamageToEnemy(clickDamage, 'click');
    }
    this.gameState.update(s => ({...s, totalClicks: s.totalClicks + 1}));
    this.checkQuestCompletion();
  }

  private dealDamageToEnemy(damage: number, type: 'click' | 'dps' | 'skill') {
     if(this.currentEnemy().currentHp <= 0) return;

    // Apply damage reduction
    let finalDamage = damage;
    const enemy = this.currentEnemy();
    if (enemy.damageReduction) {
        finalDamage = damage * (1 - enemy.damageReduction);
    }
    
    if (type === 'click') {
        this.enemyIsShaking.set(true);
        setTimeout(() => this.enemyIsShaking.set(false), 300);
    }
    this.enemyHit.set(true);
    setTimeout(() => this.enemyHit.set(false), 100);

    // Attribute DPS damage to heroes for stats
    if (type === 'dps') {
      const totalDps = this.totalDps();
      if (totalDps > 0) {
        this.heroes.update(heroes => heroes.map(h => {
          if (this.gameState().activeHeroIds.includes(h.id)) {
            const damageShare = finalDamage * (h.currentDps / totalDps);
            const newStats: HeroStats = {
              skillsUsed: h.stats?.skillsUsed ?? 0,
              totalDamageDealt: (h.stats?.totalDamageDealt ?? 0) + damageShare,
            };
            return { ...h, stats: newStats };
          }
          return h;
        }));
      }
    }

    this.currentEnemy.update(e => ({ ...e, currentHp: Math.max(0, e.currentHp - finalDamage) }));
    this.addDamageFlash(finalDamage, type);

    if (this.currentEnemy().currentHp <= 0) {
      this.handleEnemyDrop();
      
      this.gameState.update(state => {
        const artifactGoldBonus = 1 + this.artifactBonuses().goldDropPercent;
        const synergyGoldBonus = 1 + this.synergyBonuses().goldDropPercent;
        let goldBonus = (state.goldMultiplier + this.totalGoldDropBonus()) * artifactGoldBonus * synergyGoldBonus;
        
        // Apply blessing bonus
        const goldRush = state.activeBlessings.find(b => b.type === 'goldRush');
        if (goldRush) {
            const blessingInfo = ALL_BLESSINGS.find(b => b.type === 'goldRush')!;
            goldBonus *= blessingInfo.bonusMultiplier;
        }

        const goldEarned = this.currentEnemy().goldReward * goldBonus;
        return {
            ...state,
            gold: state.gold + goldEarned,
            stage: state.stage + 1,
            totalEnemiesDefeated: state.totalEnemiesDefeated + 1,
            totalGoldEarned: state.totalGoldEarned + goldEarned
        }
      });
      this.currentEnemy.set(this.createEnemy(this.gameState().stage));
      this.stageCleared.set(true);
      setTimeout(() => this.stageCleared.set(false), 1500);
      this.checkQuestCompletion();
    }
  }
  
  private addDamageFlash(damage: number, type: 'click' | 'dps' | 'skill') {
    const flash = { id: Date.now() + Math.random(), type, damage, x: Math.random() * 60 + 20 };
    this.damageFlashes.update(flashes => [...flashes, flash]);
    setTimeout(() => this.damageFlashes.update(flashes => flashes.filter(f => f.id !== flash.id)), 1000);
  }

  private generateEnemyAsciiArt(type: EnemyType): string {
    const artSet = ASCII_ART[type] || ASCII_ART['Normal'];
    const head = artSet.heads[Math.floor(Math.random() * artSet.heads.length)];
    const body = artSet.bodies[Math.floor(Math.random() * artSet.bodies.length)];
    const leg = artSet.legs[Math.floor(Math.random() * artSet.legs.length)];
    return `${head}\n${body}\n${leg}`;
  }

  private createEnemy(stage: number): Enemy {
    const isBoss = stage > 0 && stage % 10 === 0;

    let type: EnemyType = 'Normal';
    let hpModifier = 1;
    let goldModifier = 1;
    let damageReduction: number | undefined = undefined;
    
    if (isBoss) {
        type = 'Boss';
        hpModifier = 10;
        goldModifier = 20;
    } else {
        const rand = Math.random();
        if (rand < 0.10) { // 10% chance for Caster
            type = 'Caster';
            hpModifier = 0.8;
            goldModifier = 1.2;
        } else if (rand < 0.25) { // 15% chance for Armored
            type = 'Armored';
            hpModifier = 1.5;
            goldModifier = 1.5;
            damageReduction = 0.3;
        } else if (rand < 0.45) { // 20% chance for Swift
            type = 'Swift';
            hpModifier = 0.7;
            goldModifier = 0.7;
        } else if (rand < 0.55) { // 10% chance for Hoarder
            type = 'Hoarder';
            hpModifier = 2.5;
            goldModifier = 5.0;
        } else if (rand < 0.65) { // 10% chance for Squad
            type = 'Squad';
            hpModifier = 1.8;
            goldModifier = 2.0;
        }
        // else 35% chance of 'Normal'
    }

    const baseHp = Math.floor(10 * Math.pow(1.2, stage - 1));
    const finalHp = baseHp * hpModifier;
    
    const baseName = type === 'Boss' ? 'Guardian' : 
                   (type === 'Caster' ? 'Goblin Shaman' :
                   (type === 'Hoarder' ? 'Goblin Hoarder' : 
                   (type === 'Armored' ? 'Iron Golem' : 
                   (type === 'Swift' ? 'Dire Wolf' : 
                   (type === 'Squad' ? 'Goblin Squad' : 
                   ENEMY_NAMES[Math.floor(Math.random() * ENEMY_NAMES.length)])))));
    
    const name = type === 'Boss' ? `Stage ${stage} ${baseName}` : `${baseName} Lv.${stage}`;

    return {
      name: name,
      maxHp: finalHp,
      currentHp: finalHp,
      asciiArt: this.generateEnemyAsciiArt(type),
      goldReward: Math.ceil((baseHp/5) * goldModifier),
      isBoss,
      type,
      damageReduction,
    };
  }
  
  private calculateHeroStats<T extends Omit<Hero, 'currentDps' | 'nextLevelCost' | 'xpToNextLevel'>>(hero: T & { xpToNextLevel?: number }): Hero {
      let currentDps = hero.level > 0 ? Math.floor(hero.baseDps * Math.pow(1.1, hero.level - 1)) : 0;
      let dpsPercentBonus = 0;
      for(const slot in hero.equipment) {
        const item = hero.equipment[slot as EquipmentSlot];
        if (item) {
            if (item.bonusType === 'dpsFlat') currentDps += item.bonusValue;
            else if (item.bonusType === 'dpsPercent') dpsPercentBonus += item.bonusValue;
        }
      }
      const prestigePowerBonus = 1 + (this.gameState().prestigePowerLevel * 0.01);
      const ascensionBonus = 1 + (hero.ascensionLevel * 0.15); // Increased to 15%
      currentDps = Math.floor(currentDps * (1 + dpsPercentBonus) * prestigePowerBonus * ascensionBonus);
      const nextLevelCost = Math.floor(hero.baseCost * Math.pow(hero.upgradeCostMultiplier, hero.level));
      const xpToNextLevel = Math.floor(100 * Math.pow(1.2, hero.level));
      
      return { ...hero, currentDps, nextLevelCost, xpToNextLevel };
  }

  levelUpHero(heroId: number) {
    this.levelUpHeroMultiple(heroId, 1);
  }

  levelUpHeroMultiple(heroId: number, levelsToGain: number) {
    if (levelsToGain <= 0) return;
    const hero = this.heroes().find(h => h.id === heroId);
    if (!hero) return;

    let totalCost = 0;
    let currentLevel = hero.level;

    for (let i = 0; i < levelsToGain; i++) {
        totalCost += Math.floor(hero.baseCost * Math.pow(hero.upgradeCostMultiplier, currentLevel + i));
    }
    
    if (this.gameState().gold < totalCost) return;

    this.gameState.update(state => ({ ...state, gold: state.gold - totalCost }));
    
    this.heroes.update(heroes => 
      heroes.map(h => {
        if (h.id === heroId) {
          const updatedHero = { ...h, level: h.level + levelsToGain, currentXp: 0 };
          return this.calculateHeroStats(updatedHero);
        }
        return h;
      })
    );

    this.recentlyLeveledHeroId.set(heroId);
    setTimeout(() => this.recentlyLeveledHeroId.set(null), 500);
    this.checkQuestCompletion();
  }

  levelUpAllHeroes() {
    this.gameState.update(state => {
        let currentGold = state.gold;
        let heroes = this.heroes();
        let heroesUpdated = true;
        
        while(heroesUpdated) {
            heroesUpdated = false;
            let cheapestHero: Hero | null = null;
            let minCost = Infinity;

            for (const hero of heroes) {
                if (hero.level > 0 && hero.nextLevelCost < minCost) {
                    minCost = hero.nextLevelCost;
                    cheapestHero = hero;
                }
            }

            if (cheapestHero && currentGold >= minCost) {
                currentGold -= minCost;
                
                heroes = heroes.map(h => {
                    if (h.id === cheapestHero!.id) {
                        const updatedHero = { ...h, level: h.level + 1 };
                        return this.calculateHeroStats(updatedHero);
                    }
                    return h;
                });

                heroesUpdated = true;
            }
        }

        this.heroes.set(heroes);
        return { ...state, gold: currentGold };
    });
  }

  claimOfflineXp(heroId: number): number {
    const heroToUpdate = this.heroes().find(h => h.id === heroId);
    if (!heroToUpdate || heroToUpdate.offlineXp <= 0) {
        return 0;
    }

    let levelsGained = 0;
    let totalXp = (heroToUpdate.currentXp || 0) + heroToUpdate.offlineXp;
    let newLevel = heroToUpdate.level;
    let xpForNext = heroToUpdate.xpToNextLevel;

    while (totalXp >= xpForNext) {
        totalXp -= xpForNext;
        newLevel++;
        levelsGained++;
        xpForNext = Math.floor(100 * Math.pow(1.2, newLevel));
    }

    const updatedHeroStats = {
        ...heroToUpdate,
        level: newLevel,
        currentXp: totalXp,
        offlineXp: 0
    };
    const finalHero = this.calculateHeroStats(updatedHeroStats);

    this.heroes.update(heroes => heroes.map(h => h.id === heroId ? finalHero : h));

    if (levelsGained > 0) {
        this.recentlyLeveledHeroId.set(heroId);
        setTimeout(() => this.recentlyLeveledHeroId.set(null), 500);
    }

    return levelsGained;
  }

  toggleHeroFavorite(heroId: number) {
    this.heroes.update(heroes => heroes.map(h => h.id === heroId ? { ...h, isFavorite: !h.isFavorite } : h));
  }

  activateHeroSkill(heroId: number) {
    const hero = this.heroes().find(h => h.id === heroId);
    if (!hero || !hero.skillReady || !this.gameState().activeHeroIds.includes(hero.id)) return;
    
    const skillDamage = hero.currentDps * 5;
    if (this.isInTowerCombat()) {
        this.applyTowerDamage(skillDamage, 'skill');
    } else {
        this.dealDamageToEnemy(skillDamage, 'skill');
    }

    this.heroes.update(heroes => heroes.map(h => {
      if (h.id === heroId) {
        const newStats: HeroStats = {
          skillsUsed: (h.stats?.skillsUsed ?? 0) + 1,
          totalDamageDealt: (h.stats?.totalDamageDealt ?? 0) + skillDamage,
        };
        return { ...h, skillCharge: 0, skillReady: false, stats: newStats };
      }
      return h;
    }));
    
    this.gameState.update(s => ({...s, totalSkillsUsed: s.totalSkillsUsed + 1}));
    this.lastSkillUsed.set({ heroId, damage: skillDamage, rarity: hero.rarity });
    setTimeout(() => this.lastSkillUsed.set(null), 500);
    this.checkQuestCompletion();
  }

  private getItemScore(item: EquipmentItem): number {
    let score = 0;
    const rarityMultiplier: Record<Rarity, number> = { 'Common': 1, 'Rare': 2, 'Epic': 4, 'Legendary': 8, 'Mythic': 16 };
    
    switch (item.bonusType) {
        case 'dpsPercent': score = item.bonusValue * 1000; break;
        case 'dpsFlat': score = item.bonusValue; break;
        case 'goldDropPercent': score = item.bonusValue * 500; break;
        case 'clickDamageFlat': score = item.bonusValue * 0.1; break;
    }
    
    return score * rarityMultiplier[item.rarity];
  }

  autoEquipBestGear(heroId: number) {
    const hero = this.heroes().find(h => h.id === heroId);
    if (!hero) return;

    const inventory = this.inventory();
    let updatedEquipment = { ...hero.equipment };
    const itemsToReturn: EquipmentItem[] = [];
    const itemsToRemoveFromInv: number[] = [];

    const slots: EquipmentSlot[] = ['Weapon', 'Armor', 'Accessory'];

    for (const slot of slots) {
      const availableItems = inventory.filter(i => i.slot === slot);
      if (availableItems.length === 0) continue;

      const bestItem = availableItems.reduce((best, current) => this.getItemScore(current) > this.getItemScore(best) ? current : best);
      
      const currentItem = updatedEquipment[slot];
      const currentItemScore = currentItem ? this.getItemScore(currentItem) : -1;
      
      if (this.getItemScore(bestItem) > currentItemScore) {
        if (currentItem) {
          itemsToReturn.push(currentItem);
        }
        updatedEquipment[slot] = bestItem;
        itemsToRemoveFromInv.push(bestItem.id);
      }
    }

    if (itemsToReturn.length > 0 || itemsToRemoveFromInv.length > 0) {
      this.heroes.update(heroes => heroes.map(h => {
        if (h.id === heroId) {
          return this.calculateHeroStats({ ...h, equipment: updatedEquipment });
        }
        return h;
      }));
      
      this.inventory.update(inv => [
        ...inv.filter(i => !itemsToRemoveFromInv.includes(i.id)),
        ...itemsToReturn
      ]);
    }
  }

  equipItem(heroId: number, itemId: number) {
    const itemToEquip = this.inventory().find(i => i.id === itemId);
    const hero = this.heroes().find(h => h.id === heroId);
    if (!itemToEquip || !hero) return;
    this.heroes.update(heroes => heroes.map(h => {
        if (h.id === heroId) {
            const newEquipment = { ...h.equipment };
            const currentItem = newEquipment[itemToEquip.slot];
            if (currentItem) { this.inventory.update(inv => [...inv, currentItem]); }
            newEquipment[itemToEquip.slot] = itemToEquip;
            return this.calculateHeroStats({ ...h, equipment: newEquipment });
        }
        return h;
    }));
    this.inventory.update(inv => inv.filter(i => i.id !== itemId));
  }

  unequipItem(heroId: number, slot: EquipmentSlot) {
    const hero = this.heroes().find(h => h.id === heroId);
    if (!hero) return;
    const itemToUnequip = hero.equipment[slot];
    if (!itemToUnequip) return;
    this.heroes.update(heroes => heroes.map(h => {
        if (h.id === heroId) {
            const newEquipment = { ...h.equipment, [slot]: null };
            return this.calculateHeroStats({ ...h, equipment: newEquipment });
        }
        return h;
    }));
    this.inventory.update(inv => [...inv, itemToUnequip]);
  }

  craftItems(itemIds: number[]): boolean {
    if (itemIds.length !== 3) return false;
    const itemsToCraft = this.inventory().filter(i => itemIds.includes(i.id));
    if (itemsToCraft.length !== 3) return false;
    const firstItem = itemsToCraft[0];
    const isValid = itemsToCraft.every(item => item.slot === firstItem.slot && item.rarity === firstItem.rarity);
    if (!isValid) return false;
    const currentRarityIndex = RARITY_ORDER.indexOf(firstItem.rarity);
    if (currentRarityIndex >= RARITY_ORDER.length - 1) return false;
    const newRarity = RARITY_ORDER[currentRarityIndex + 1];
    const newItem = this._generateForgedItem(firstItem.slot, newRarity);
    const currentHighestIndex = this.gameState().highestRarityForged ? RARITY_ORDER.indexOf(this.gameState().highestRarityForged!) : -1;
    if (currentRarityIndex + 1 > currentHighestIndex) {
        this.gameState.update(s => ({ ...s, highestRarityForged: newRarity }));
    }
    this.gameState.update(s => ({ ...s, totalItemsForged: s.totalItemsForged + 1 }));
    this.inventory.update(inv => [...inv.filter(i => !itemIds.includes(i.id)), newItem]);
    this.checkQuestCompletion();
    return true;
  }

  private _generateForgedItem(slot: EquipmentSlot, rarity: Rarity): EquipmentItem {
    const STATS_BY_RARITY: Record<string, {dpsFlat: number, dpsPercent: number, goldDropPercent: number}> = { 
      'Rare': {dpsFlat: 5, dpsPercent: 0.05, goldDropPercent: 0.05}, 
      'Epic': {dpsFlat: 25, dpsPercent: 0.15, goldDropPercent: 0.15}, 
      'Legendary': {dpsFlat: 100, dpsPercent: 0.3, goldDropPercent: 0.3}, 
      'Mythic': {dpsFlat: 500, dpsPercent: 0.5, goldDropPercent: 0.5} 
    };
    let bonusType: EquipmentBonusType = 'dpsFlat';
    let bonusValue = 1;
    let name = `Forged ${rarity} Item`;
    const forgedLore = [
        "A masterpiece of the forge, humming with newfound power.",
        "Three become one. This item radiates potential.",
        "Reforged and reborn, its quality is undeniable.",
        "The smiths outdid themselves. This piece is nearly flawless."
    ];
    let lore = forgedLore[Math.floor(Math.random() * forgedLore.length)];

    const rarityStats = STATS_BY_RARITY[rarity as keyof typeof STATS_BY_RARITY];

    switch(slot) { 
      case 'Weapon': 
        name = `Forged ${rarity} ${slot}`; 
        bonusType = Math.random() > 0.5 ? 'dpsFlat' : 'dpsPercent'; 
        if (bonusType === 'dpsPercent') {
          bonusValue = rarityStats?.dpsPercent || 0.01;
        } else {
          bonusValue = rarityStats?.dpsFlat || 1;
        }
        break; 
      case 'Armor': 
        name = `Forged ${rarity} ${slot}`; 
        bonusType = 'dpsFlat'; 
        bonusValue = Math.floor((rarityStats?.dpsFlat || 1) * 0.5); 
        break; 
      case 'Accessory': 
        name = `Forged ${rarity} Trinket`; 
        bonusType = 'goldDropPercent'; 
        bonusValue = rarityStats?.goldDropPercent || 0.01; 
        break; 
    } 
    
    const finalBonusValue = bonusValue * (1 + (Math.random() - 0.5) * 0.2);

    // FIX: Add missing properties
    return { 
      id: Date.now() + Math.random(), 
      name, 
      slot, 
      rarity, 
      bonusType, 
      bonusValue: finalBonusValue,
      baseBonusValue: finalBonusValue,
      enchantLevel: 0,
      lore
    }; 
  }

  private _generateDroppedItem(stage: number, rarity: Rarity): EquipmentItem {
    const slots: EquipmentSlot[] = ['Weapon', 'Armor', 'Accessory'];
    const slot = slots[Math.floor(Math.random() * slots.length)];
    
    const STATS_BY_RARITY: Record<Rarity, {dpsFlat: number, dpsPercent: number, goldDropPercent: number}> = { 
        'Common': {dpsFlat: 2, dpsPercent: 0.02, goldDropPercent: 0.02},
        'Rare': {dpsFlat: 10, dpsPercent: 0.07, goldDropPercent: 0.07}, 
        'Epic': {dpsFlat: 50, dpsPercent: 0.20, goldDropPercent: 0.20}, 
        'Legendary': {dpsFlat: 250, dpsPercent: 0.4, goldDropPercent: 0.4}, 
        'Mythic': {dpsFlat: 1000, dpsPercent: 0.6, goldDropPercent: 0.6} 
    };
    const LORE_TEMPLATES = {
        Weapon: [
            "Taken from a fearsome foe, it still holds a grudge.",
            "This weapon has seen countless battles, and is ready for more.",
            "Glows with a faint, otherworldly light."
        ],
        Armor: [
            "This piece of armor has saved a life more than once.",
            "Surprisingly light, yet unnervingly strong.",
            "Scratched and dented, but its integrity is unquestionable."
        ],
        Accessory: [
            "A lucky charm that seems to actually work.",
            "Lost by a powerful adventurer long ago. Their loss is your gain.",
            "It feels warm to the touch, pulsing with a gentle energy."
        ]
    };

    let bonusType: EquipmentBonusType = 'dpsFlat';
    let bonusValue = 1;
    let name = `${rarity} Item`;
    let lore = LORE_TEMPLATES[slot][Math.floor(Math.random() * LORE_TEMPLATES[slot].length)];

    const rarityStats = STATS_BY_RARITY[rarity];

    switch(slot){ 
        case 'Weapon': 
            name = `${rarity} Blade`; 
            bonusType = Math.random() > 0.5 ? 'dpsFlat' : 'dpsPercent'; 
            if (bonusType === 'dpsPercent') {
                bonusValue = rarityStats?.dpsPercent || 0.01;
            } else {
                bonusValue = rarityStats?.dpsFlat || 1;
            }
            break; 
        case 'Armor': 
            name = `${rarity} Guard`; 
            bonusType = 'dpsFlat'; 
            bonusValue = Math.floor((rarityStats?.dpsFlat || 1) * 0.7); 
            break; 
        case 'Accessory': 
            name = `${rarity} Charm`; 
            bonusType = 'goldDropPercent'; 
            bonusValue = rarityStats?.goldDropPercent || 0.01; 
            break; 
    }
    
    const stageMultiplier = 1 + (stage / 200);
    const finalBonusValue = bonusValue * stageMultiplier * (1 + (Math.random() - 0.5) * 0.2);

    // FIX: Add missing properties
    return { 
      id: Date.now() + Math.random(), 
      name, 
      slot, 
      rarity, 
      bonusType, 
      bonusValue: finalBonusValue,
      baseBonusValue: finalBonusValue,
      enchantLevel: 0,
      lore
    };
  }
  
  private handleEnemyDrop() {
    const enemy = this.currentEnemy();
    const dropChance = enemy.isBoss ? 1.0 : 0.20;

    if (Math.random() > dropChance) {
        return;
    }

    const rand = Math.random();
    let rarity: Rarity;

    if (enemy.isBoss) {
        if (rand < 0.02) rarity = 'Legendary';
        else if (rand < 0.30) rarity = 'Epic';
        else rarity = 'Rare';
    } else {
        if (rand < 0.001) rarity = 'Legendary';
        else if (rand < 0.05) rarity = 'Epic';
        else if (rand < 0.30) rarity = 'Rare';
        else rarity = 'Common';
    }
    
    const newItem = this._generateDroppedItem(this.gameState().stage, rarity);
    this.inventory.update(inv => [...inv, newItem]);
    this.lastItemDrop.set(newItem);
    setTimeout(() => this.lastItemDrop.set(null), 3000);
  }

  summonHero(type: 'standard' | 'premium'): { hero: Omit<Hero, 'currentDps' | 'nextLevelCost' | 'equipment' | 'skillCharge' | 'skillReady' | 'currentXp' | 'xpToNextLevel' | 'offlineXp'>, isNew: boolean, goldBonus: number | null, shardsGained: number | null } | null {
    if (type === 'standard' && this.gameState().gold < STANDARD_SUMMON_COST_GOLD) return null;
    if (type === 'premium' && this.gameState().prestigePoints < PREMIUM_SUMMON_COST_PRESTIGE) return null;

    if (type === 'standard') this.gameState.update(s => ({...s, gold: s.gold - STANDARD_SUMMON_COST_GOLD }));
    else this.gameState.update(s => ({...s, prestigePoints: s.prestigePoints - PREMIUM_SUMMON_COST_PRESTIGE }));

    return this._performSummon(type);
  }

  freeStandardSummon(): { hero: Omit<Hero, 'currentDps' | 'nextLevelCost' | 'equipment' | 'skillCharge' | 'skillReady' | 'currentXp' | 'xpToNextLevel' | 'offlineXp'>, isNew: boolean, goldBonus: number | null, shardsGained: number | null } | null {
    const lastClaim = this.gameState().lastFreeStandardSummonTimestamp ?? 0;
    const cooldownMs = 24 * 60 * 60 * 1000; // 24 hours
    if (Date.now() < lastClaim + cooldownMs) {
        return null; // Not ready
    }
    
    this.gameState.update(s => ({...s, lastFreeStandardSummonTimestamp: Date.now()}));
    
    return this._performSummon('standard');
  }

  private _performSummon(type: 'standard' | 'premium'): { hero: Omit<Hero, 'currentDps' | 'nextLevelCost' | 'equipment' | 'skillCharge' | 'skillReady' | 'currentXp' | 'xpToNextLevel' | 'offlineXp'>, isNew: boolean, goldBonus: number | null, shardsGained: number | null } | null {
    const rand = Math.random();
    let rarity: Rarity;
    if (type === 'standard') {
        if (rand < 0.01) rarity = 'Epic';
        else if (rand < 0.25) rarity = 'Rare';
        else rarity = 'Common';
    } else {
        if (rand < 0.05) rarity = 'Legendary';
        else if (rand < 0.40) rarity = 'Epic';
        else rarity = 'Rare';
    }

    const possibleHeroes = ALL_HEROES.filter(h => h.rarity === rarity);
    if (possibleHeroes.length === 0) return null;

    const summonedHeroData = possibleHeroes[Math.floor(Math.random() * possibleHeroes.length)];
    const isOwned = this.heroes().some(h => h.id === summonedHeroData.id);
    let isNew = false;
    let goldBonus = null;
    let shardsGained = null;
    const shardValues: Record<Rarity, number> = { 'Common': 1, 'Rare': 3, 'Epic': 5, 'Legendary': 10, 'Mythic': 20 };

    if (isOwned) {
        goldBonus = DUPLICATE_HERO_GOLD_REWARD / 2;
        shardsGained = shardValues[summonedHeroData.rarity];
        this.gameState.update(s => {
            const newShards = {...s.heroShards};
            newShards[summonedHeroData.id] = (newShards[summonedHeroData.id] || 0) + shardsGained!;
            return ({...s, gold: s.gold + goldBonus!, heroShards: newShards });
        });
    } else {
        const newHero: Omit<Hero, 'currentDps' | 'nextLevelCost'> = { ...summonedHeroData, level: 0, equipment: { Weapon: null, Armor: null, Accessory: null }, skillCharge: 0, skillReady: false, isFavorite: false, currentXp: 0, xpToNextLevel: 100, offlineXp: 0, stats: { totalDamageDealt: 0, skillsUsed: 0 }, ascensionLevel: 0 };
        this.heroes.update(heroes => [...heroes, this.calculateHeroStats(newHero)].sort((a,b) => a.id - b.id));
        this.gameState.update(s => ({...s, unlockedHeroIds: [...s.unlockedHeroIds, summonedHeroData.id]}));
        isNew = true;
    }

    this.gameState.update(s => ({...s, totalHeroesSummoned: s.totalHeroesSummoned + 1}));
    this.checkQuestCompletion();
    return { hero: summonedHeroData, isNew, goldBonus, shardsGained };
  }

  summonHeroes(type: 'standard', count: number): { hero: Omit<Hero, 'currentDps' | 'nextLevelCost' | 'equipment' | 'skillCharge' | 'skillReady' | 'currentXp' | 'xpToNextLevel' | 'offlineXp'>, isNew: boolean, goldBonus: number | null, shardsGained: number | null }[] | null {
    const cost = STANDARD_SUMMON_COST_GOLD * count;
    if (this.gameState().gold < cost) return null;

    this.gameState.update(s => ({ ...s, gold: s.gold - cost }));

    const results: { hero: Omit<Hero, 'currentDps' | 'nextLevelCost' | 'equipment' | 'skillCharge' | 'skillReady' | 'currentXp' | 'xpToNextLevel' | 'offlineXp'>, isNew: boolean, goldBonus: number | null, shardsGained: number | null }[] = [];
    const newHeroes: Hero[] = [];
    let totalGoldBonus = 0;
    const newHeroIds = new Set<number>();
    const newHeroShards: Record<number, number> = {};
    const shardValues: Record<Rarity, number> = { 'Common': 1, 'Rare': 3, 'Epic': 5, 'Legendary': 10, 'Mythic': 20 };

    for (let i = 0; i < count; i++) {
        const rand = Math.random();
        const rarity: Rarity = rand < 0.01 ? 'Epic' : rand < 0.25 ? 'Rare' : 'Common';
        
        const possibleHeroes = ALL_HEROES.filter(h => h.rarity === rarity);
        if (possibleHeroes.length === 0) continue;

        const summonedHeroData = possibleHeroes[Math.floor(Math.random() * possibleHeroes.length)];
        const isOwned = this.heroes().some(h => h.id === summonedHeroData.id) || newHeroIds.has(summonedHeroData.id);
        
        if (isOwned) {
            const goldBonus = DUPLICATE_HERO_GOLD_REWARD / 2;
            const shardsGained = shardValues[summonedHeroData.rarity];
            totalGoldBonus += goldBonus;
            results.push({ hero: summonedHeroData, isNew: false, goldBonus, shardsGained });
            newHeroShards[summonedHeroData.id] = (newHeroShards[summonedHeroData.id] || 0) + shardsGained;
        } else {
            const newHeroData: Omit<Hero, 'currentDps' | 'nextLevelCost'> = { ...summonedHeroData, level: 0, equipment: { Weapon: null, Armor: null, Accessory: null }, skillCharge: 0, skillReady: false, isFavorite: false, currentXp: 0, xpToNextLevel: 100, offlineXp: 0, stats: { totalDamageDealt: 0, skillsUsed: 0 }, ascensionLevel: 0 };
            newHeroes.push(this.calculateHeroStats(newHeroData));
            newHeroIds.add(newHeroData.id);
            results.push({ hero: summonedHeroData, isNew: true, goldBonus: null, shardsGained: null });
        }
    }

    if (totalGoldBonus > 0 || Object.keys(newHeroShards).length > 0) {
        this.gameState.update(s => {
            const updatedShards = { ...s.heroShards };
            for(const heroId in newHeroShards) {
                updatedShards[+heroId] = (updatedShards[+heroId] || 0) + newHeroShards[heroId];
            }
            return { 
                ...s, 
                gold: s.gold + totalGoldBonus, 
                totalGoldEarned: s.totalGoldEarned + totalGoldBonus,
                heroShards: updatedShards
            };
        });
    }

    if (newHeroes.length > 0) {
        this.heroes.update(currentHeroes => [...currentHeroes, ...newHeroes].sort((a, b) => a.id - b.id));
        this.gameState.update(s => ({ ...s, unlockedHeroIds: [...s.unlockedHeroIds, ...Array.from(newHeroIds)] }));
    }

    this.gameState.update(s => ({ ...s, totalHeroesSummoned: s.totalHeroesSummoned + count }));
    this.checkQuestCompletion();

    return results;
}

  private getGlobalBonus(bonusType: 'clickDamageFlat' | 'goldDropPercent'): number {
    return this.heroes().flatMap(hero => Object.values(hero.equipment)).reduce((t, item) => item && item.bonusType === bonusType ? t + item.bonusValue : t, 0);
  }

  levelUpClickDamage() {
      const cost = this.getClickDamageUpgradeCost();
      if(this.gameState().gold >= cost) this.gameState.update(state => ({ ...state, gold: state.gold - cost, clickDamage: state.clickDamage + 1 }));
  }

  getClickDamageUpgradeCost(): number { return Math.floor(25 * Math.pow(1.2, this.gameState().clickDamage -1)); }

  canPrestige(): boolean { return this.gameState().stage >= PRESTIGE_STAGE_REQUIREMENT; }

  getPrestigePointsReward(): number { return Math.floor(this.gameState().stage / 10); }

  prestige() {
    if (!this.canPrestige()) return;
    const points = this.getPrestigePointsReward();
    const startingGold = this.getStartingGoldEffect();
    const towerFloor = this.gameState().towerFloor;
    const artifacts = this.gameState().artifacts;
    const unlockedHeroIds = this.gameState().unlockedHeroIds;
    const stats = { totalClicks: this.gameState().totalClicks, totalGoldEarned: this.gameState().totalGoldEarned };
    const lifetimeStats = { 
        totalPrestiges: this.gameState().totalPrestiges + 1,
        totalSkillsUsed: this.gameState().totalSkillsUsed,
        totalDungeonsCompleted: this.gameState().totalDungeonsCompleted,
        totalExpeditionsCompleted: this.gameState().totalExpeditionsCompleted,
        totalSponsorClaims: this.gameState().totalSponsorClaims,
        totalItemsForged: this.gameState().totalItemsForged,
    };

    this.gameState.update(state => ({ 
        ...state, 
        stage: 1, 
        gold: startingGold, 
        prestigePoints: state.prestigePoints + points, 
        totalEnemiesDefeated: 0, 
        totalHeroesSummoned: 0, 
        towerFloor,
        artifacts,
        unlockedHeroIds,
        ...stats,
        ...lifetimeStats
    }));
    this.currentEnemy.set(this.createEnemy(1));
    this.initializeGame(true);
    this.initializeQuests(); 
    this.initializeInventory();
    this.saveGame();
    this.checkQuestCompletion();
  }
  
  getGoldMultiplierUpgradeCost(): number { return 1; }
  upgradeGoldMultiplier() {
      const cost = this.getGoldMultiplierUpgradeCost();
      if (this.gameState().prestigePoints >= cost) this.gameState.update(state => ({ ...state, prestigePoints: state.prestigePoints - cost, goldMultiplier: state.goldMultiplier + 0.05 }));
  }

  getPrestigePowerCost(): number { return Math.floor(2 * Math.pow(1.5, this.gameState().prestigePowerLevel)); }
  getPrestigePowerEffect(): number { return this.gameState().prestigePowerLevel * 1; }
  upgradePrestigePower() {
    const cost = this.getPrestigePowerCost();
    if (this.gameState().prestigePoints >= cost) {
      this.gameState.update(s => ({ ...s, prestigePoints: s.prestigePoints - cost, prestigePowerLevel: s.prestigePowerLevel + 1 }));
      this.heroes.update(heroes => heroes.map(h => this.calculateHeroStats(h)));
    }
  }

  getClickingFrenzyCost(): number { return Math.floor(1 * Math.pow(1.8, this.gameState().clickingFrenzyLevel)); }
  getClickingFrenzyEffect(): number { return this.gameState().clickingFrenzyLevel * 5; }
  upgradeClickingFrenzy() {
    const cost = this.getClickingFrenzyCost();
    if (this.gameState().prestigePoints >= cost) this.gameState.update(s => ({ ...s, prestigePoints: s.prestigePoints - cost, clickingFrenzyLevel: s.clickingFrenzyLevel + 1 }));
  }

  getStartingGoldCost(): number { return Math.floor(1 * Math.pow(1.4, this.gameState().startingGoldLevel)); }
  getStartingGoldEffect(): number { return this.gameState().startingGoldLevel * 100; }
  upgradeStartingGold() {
    const cost = this.getStartingGoldCost();
    if (this.gameState().prestigePoints >= cost) this.gameState.update(s => ({ ...s, prestigePoints: s.prestigePoints - cost, startingGoldLevel: s.startingGoldLevel + 1 }));
  }
  
  private checkQuestCompletion() {
    this.quests.update(quests => quests.map(quest => {
        if (quest.isCompleted) return quest;
        let completed = false;
        switch (quest.type) {
            case 'reachStage': completed = this.gameState().stage >= (quest.target as number); break;
            case 'levelUpHero': completed = this.heroes().some(h => h.level >= (quest.target as number)); break;
            case 'defeatEnemies': completed = this.gameState().totalEnemiesDefeated >= (quest.target as number); break;
            case 'summonHero': completed = this.gameState().totalHeroesSummoned >= (quest.target as number); break;
            case 'forgeRarity':
                const highestForged = this.gameState().highestRarityForged;
                if (highestForged) completed = RARITY_ORDER.indexOf(highestForged) >= RARITY_ORDER.indexOf(quest.target as Rarity);
                break;
            case 'earnGold': completed = this.gameState().totalGoldEarned >= (quest.target as number); break;
            case 'useSkills': completed = this.gameState().totalSkillsUsed >= (quest.target as number); break;
            case 'clickCount': completed = this.gameState().totalClicks >= (quest.target as number); break;
            case 'prestigeCount': completed = this.gameState().totalPrestiges >= (quest.target as number); break;
            case 'unlockHeroCount': completed = this.gameState().unlockedHeroIds.length >= (quest.target as number); break;
            case 'unlockHeroRarity':
                const unlockedHeroes = this.heroes().filter(h => this.gameState().unlockedHeroIds.includes(h.id));
                completed = unlockedHeroes.some(h => h.rarity === (quest.target as Rarity));
                break;
            case 'completeDungeons': completed = this.gameState().totalDungeonsCompleted >= (quest.target as number); break;
            case 'completeExpeditions': completed = this.gameState().totalExpeditionsCompleted >= (quest.target as number); break;
            case 'clearTowerFloor': completed = (this.gameState().towerFloor - 1) >= (quest.target as number); break;
            case 'fieldHeroes': completed = this.gameState().activeHeroIds.filter(id => id !== null).length >= (quest.target as number); break;
            case 'levelUpMultipleHeroes':
                const targetInfo = quest.target as { level: number, count: number };
                completed = this.heroes().filter(h => h.level >= targetInfo.level).length >= targetInfo.count;
                break;
            case 'forgeAnyItem': completed = this.gameState().totalItemsForged >= (quest.target as number); break;
            case 'claimSponsorGold': completed = this.gameState().totalSponsorClaims >= (quest.target as number); break;
        }
        return completed ? { ...quest, isCompleted: true } : quest;
    }));
  }

  claimQuestReward(questId: number) {
    const quest = this.quests().find(q => q.id === questId);
    if (quest && quest.isCompleted && !quest.isClaimed) {
        this.gameState.update(state => ({ ...state, gold: state.gold + quest.reward.gold, prestigePoints: state.prestigePoints + (quest.reward.prestigePoints || 0) }));
        this.quests.update(quests => quests.map(q => q.id === questId ? { ...q, isClaimed: true } : q ));
    }
  }

  private createTowerEnemy(floor: number): Enemy {
    const hp = Math.floor(50 * Math.pow(1.4, floor - 1));
    const name = TOWER_ENEMY_NAMES[Math.floor(Math.random() * TOWER_ENEMY_NAMES.length)];
    const goldReward = Math.ceil(hp / 4);
    return { 
      name: `${name} of Floor ${floor}`, 
      maxHp: hp, 
      currentHp: hp, 
      asciiArt: this.generateEnemyAsciiArt('Boss'), 
      goldReward, 
      isBoss: true,
      type: 'Boss'
    };
  }

  startTowerChallenge() {
    if (this.isInTowerCombat()) return;
    const floor = this.gameState().towerFloor;
    const enemy = this.createTowerEnemy(floor);
    this.towerEnemy.set(enemy);
    this.isInTowerCombat.set(true);
  }

  applyTowerDamage(damage: number, type: 'click' | 'dps' | 'skill') {
    if (!this.isInTowerCombat() || !this.towerEnemy()) return;
    this.towerEnemy.update(enemy => {
        if (!enemy) return null;
        return { ...enemy, currentHp: Math.max(0, enemy.currentHp - damage) }
    });
    if (type === 'click' || type === 'skill') {
        this.addDamageFlash(damage, type);
    }
  }

  endTowerChallenge(isVictory: boolean) {
    if (isVictory) {
        const floor = this.gameState().towerFloor;
        const enemy = this.towerEnemy();
        let prestigePointsReward = 0;
        if (floor % 5 === 0) {
            prestigePointsReward = Math.floor(floor / 5);
        }
        // Award Artifacts at specific floors
        let newArtifacts = [...this.gameState().artifacts];
        if (floor === 10 && !newArtifacts.includes(1)) newArtifacts.push(1);
        if (floor === 20 && !newArtifacts.includes(2)) newArtifacts.push(2);
        if (floor === 30 && !newArtifacts.includes(3)) newArtifacts.push(3);
        if (floor === 40 && !newArtifacts.includes(4)) newArtifacts.push(4);

        const goldEarned = enemy?.goldReward || 0;
        this.gameState.update(s => ({
            ...s,
            towerFloor: s.towerFloor + 1,
            gold: s.gold + goldEarned,
            prestigePoints: s.prestigePoints + prestigePointsReward,
            artifacts: newArtifacts,
            totalGoldEarned: s.totalGoldEarned + goldEarned
        }));
        this.checkQuestCompletion();
    }
    this.isInTowerCombat.set(false);
    this.towerEnemy.set(null);
  }
  
  clearOfflineReport() {
      this.offlineReport.set(null);
  }

  private checkDailyLogin() {
    const today = new Date().toISOString().slice(0, 10);
    const lastLogin = this.gameState().lastLoginDate;

    if (lastLogin !== today) {
        this.isDailyRewardAvailable.set(true);
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        
        this.gameState.update(s => {
            const consecutive = (lastLogin === yesterday) ? (s.consecutiveLoginDays % 7) + 1 : 1;
            return {...s, consecutiveLoginDays: consecutive};
        });
    }
  }

  getDailyRewardForDay(day: number) {
      return DAILY_REWARDS[(day-1) % 7];
  }

  claimDailyReward() {
      const today = new Date().toISOString().slice(0, 10);
      const day = this.gameState().consecutiveLoginDays;
      const reward = this.getDailyRewardForDay(day);

      this.gameState.update(s => ({
          ...s,
          gold: s.gold + reward.gold,
          prestigePoints: s.prestigePoints + reward.prestigePoints,
          lastLoginDate: today
      }));
      this.isDailyRewardAvailable.set(false);
  }

  hardReset() {
      localStorage.removeItem(SAVE_KEY);
      window.location.reload();
  }

  toggleAutoDps() {
    this.gameState.update(s => ({ ...s, autoDpsEnabled: !s.autoDpsEnabled }));
  }

  toggleAutoSkill() {
    this.gameState.update(s => ({ ...s, autoSkillEnabled: !s.autoSkillEnabled }));
  }

  markHeroAsViewedInCodex(heroId: number) {
    this.gameState.update(s => {
      if (!s.viewedHeroIdsInCodex.includes(heroId)) {
        return { ...s, viewedHeroIdsInCodex: [...s.viewedHeroIdsInCodex, heroId] };
      }
      return s;
    });
  }

  // Expedition Methods
  getExpeditionSlotsCost(): number { return Math.floor(5 * Math.pow(2.5, this.gameState().expeditionSlotsLevel)); }
  getExpeditionSlotsEffect(): number { return 1 + this.gameState().expeditionSlotsLevel; }
  upgradeExpeditionSlots() {
    const cost = this.getExpeditionSlotsCost();
    if (this.gameState().prestigePoints >= cost) {
      this.gameState.update(s => ({ ...s, prestigePoints: s.prestigePoints - cost, expeditionSlotsLevel: s.expeditionSlotsLevel + 1 }));
    }
  }

  startExpedition(expeditionId: number, heroIds: number[]): boolean {
    const expedition = ALL_EXPEDITIONS.find(e => e.id === expeditionId);
    if (!expedition) return false;

    const availableSlots = this.getExpeditionSlotsEffect();
    if (this.gameState().ongoingExpeditions.length >= availableSlots) return false;

    const now = Date.now();
    const newOngoingExpedition: OngoingExpedition = {
      expeditionId,
      heroIds,
      startTime: now,
      completionTime: now + expedition.durationSeconds * 1000,
    };

    this.gameState.update(s => ({
      ...s,
      ongoingExpeditions: [...s.ongoingExpeditions, newOngoingExpedition]
    }));
    return true;
  }

  claimExpedition(expeditionToClaim: OngoingExpedition): { gold: number, prestige: number, item: EquipmentItem | null } {
    const expeditionDetails = ALL_EXPEDITIONS.find(e => e.id === expeditionToClaim.expeditionId);
    if (!expeditionDetails) return { gold: 0, prestige: 0, item: null };

    const rewards = expeditionDetails.rewards;
    let gainedItem: EquipmentItem | null = null;
    if (rewards.equipmentDrop && Math.random() < rewards.equipmentDrop.chance) {
      gainedItem = this._generateDroppedItem(this.gameState().stage, rewards.equipmentDrop.rarity);
      this.inventory.update(inv => [...inv, gainedItem!]);
    }
    
    this.gameState.update(s => ({
      ...s,
      gold: s.gold + rewards.gold,
      prestigePoints: s.prestigePoints + (rewards.prestigePoints || 0),
      ongoingExpeditions: s.ongoingExpeditions.filter(oe => oe.startTime !== expeditionToClaim.startTime),
      totalExpeditionsCompleted: s.totalExpeditionsCompleted + 1,
    }));
    this.checkQuestCompletion();
    
    return { gold: rewards.gold, prestige: rewards.prestigePoints || 0, item: gainedItem };
  }

  // Celestial Shrine Methods
  public getBlessingStatus(type: BlessingType): { status: 'ready' | 'active' | 'cooldown', remainingSeconds: number } {
    const now = Date.now();
    const active = this.gameState().activeBlessings.find(b => b.type === type);
    if (active) {
        return { status: 'active', remainingSeconds: Math.ceil((active.endTime - now) / 1000) };
    }
    const cooldown = this.gameState().blessingCooldowns.find(b => b.type === type);
    if (cooldown && cooldown.readyTime > now) {
        return { status: 'cooldown', remainingSeconds: Math.ceil((cooldown.readyTime - now) / 1000) };
    }
    return { status: 'ready', remainingSeconds: 0 };
  }

  public activateBlessing(type: BlessingType) {
      const status = this.getBlessingStatus(type);
      if (status.status !== 'ready') return;

      const blessingInfo = ALL_BLESSINGS.find(b => b.type === type)!;
      const now = Date.now();

      if (blessingInfo.durationSeconds > 0) {
          // Timed buff
          this.gameState.update(s => ({
              ...s,
              activeBlessings: [...s.activeBlessings, { type, endTime: now + blessingInfo.durationSeconds * 1000 }],
              blessingCooldowns: [...s.blessingCooldowns.filter(c => c.type !== type), { type, readyTime: now + blessingInfo.cooldownSeconds * 1000 }]
          }));
      } else {
          // Instant effect
          if (type === 'skillFrenzy') {
              this.heroes.update(heroes => heroes.map(h => ({ ...h, skillCharge: 100, skillReady: true })));
          }
          this.gameState.update(s => ({
              ...s,
              blessingCooldowns: [...s.blessingCooldowns.filter(c => c.type !== type), { type, readyTime: now + blessingInfo.cooldownSeconds * 1000 }]
          }));
      }
  }

  // New Gold Features
  public addGold(amount: number) {
    if (amount <= 0) return;
    this.gameState.update(s => ({
        ...s,
        gold: s.gold + amount,
        totalGoldEarned: s.totalGoldEarned + amount,
    }));
    this.checkQuestCompletion();
  }

  public claimTribute(): number {
    const now = Date.now();
    const lastClaim = this.gameState().lastTributeClaimTimestamp ?? 0;
    const cooldown = 24 * 60 * 60 * 1000; // 24 hours
    if (now - lastClaim < cooldown) {
        return 0;
    }

    const reward = this.gameState().stage * 1000;
    this.addGold(reward);
    this.gameState.update(s => ({ ...s, lastTributeClaimTimestamp: now }));
    return reward;
  }

  public setGoldRushCooldown() {
      this.gameState.update(s => ({ ...s, lastGoldRushTimestamp: Date.now() }));
  }

  public investInVault(amount: number): boolean {
      const gold = this.gameState().gold;
      if (amount <= 0 || gold < amount || this.gameState().vaultInvestment) {
          return false;
      }
      const returnTime = Date.now() + (8 * 60 * 60 * 1000); // 8 hours
      this.gameState.update(s => ({
          ...s,
          gold: s.gold - amount,
          vaultInvestment: { amount, returnTime }
      }));
      return true;
  }

  public withdrawFromVault(): number {
      const vault = this.gameState().vaultInvestment;
      if (!vault || vault.returnTime > Date.now()) {
          return 0;
      }
      const interest = 0.5; // 50%
      const totalReturn = Math.floor(vault.amount * (1 + interest));
      this.addGold(totalReturn);
      this.gameState.update(s => ({ ...s, vaultInvestment: null }));
      return totalReturn;
  }

  public claimSponsorGold(): number {
      const now = Date.now();
      const lastClaim = this.gameState().lastSponsorOfferTimestamp ?? 0;
      const cooldown = 5 * 60 * 1000; // 5 minutes
      if (now - lastClaim < cooldown) {
          return 0;
      }
      
      const offlineDps = this.activeHeroes().reduce((sum: number, hero: Hero) => sum + hero.currentDps, 0);
      const stageGoldPerSecond = (this.createEnemy(this.gameState().stage).goldReward * 0.5);
      const offlineGoldPerSecond = stageGoldPerSecond * 0.25;
      const reward = Math.floor(offlineGoldPerSecond * 60);

      this.addGold(reward);
      this.gameState.update(s => ({...s, lastSponsorOfferTimestamp: now, totalSponsorClaims: s.totalSponsorClaims + 1 }));
      this.checkQuestCompletion();
      return reward;
  }
  
  // Gold Mine Methods
  public startMiningOperation(operationId: number): boolean {
    if (this.gameState().activeMiningOperation) {
      return false;
    }
    const operation = ALL_MINING_OPERATIONS.find(op => op.id === operationId);
    if (!operation || this.gameState().stage < operation.stageRequirement) {
      return false;
    }

    const now = Date.now();
    this.gameState.update(s => ({
      ...s,
      activeMiningOperation: {
        operationId: operation.id,
        completionTime: now + operation.durationSeconds * 1000,
      }
    }));
    return true;
  }

  public claimMiningOperation(): number {
    const activeOp = this.gameState().activeMiningOperation;
    if (!activeOp || activeOp.completionTime > Date.now()) {
      return 0;
    }

    const operationDetails = ALL_MINING_OPERATIONS.find(op => op.id === activeOp.operationId);
    if (!operationDetails) {
      // Clear invalid operation
      this.gameState.update(s => ({ ...s, activeMiningOperation: null }));
      return 0;
    }

    const goldReward = operationDetails.goldReward;
    this.addGold(goldReward); // Use existing method to handle gold addition
    this.gameState.update(s => ({ ...s, activeMiningOperation: null }));

    return goldReward;
  }
  
  // Dungeon Methods
  getDungeonSlotsCost(): number { return Math.floor(10 * Math.pow(3, this.gameState().dungeonSlotsLevel)); }
  getDungeonSlotsEffect(): number { return 1 + this.gameState().dungeonSlotsLevel; }
  upgradeDungeonSlots() {
    const cost = this.getDungeonSlotsCost();
    if (this.gameState().prestigePoints >= cost) {
      this.gameState.update(s => ({ ...s, prestigePoints: s.prestigePoints - cost, dungeonSlotsLevel: s.dungeonSlotsLevel + 1 }));
    }
  }

  startDungeonRun(dungeonId: number, difficulty: DungeonDifficulty): boolean {
    const dungeon = ALL_DUNGEONS.find(d => d.id === dungeonId);
    if (!dungeon) return false;
    
    const difficultyDetails = dungeon.difficulties[difficulty];
    if (!difficultyDetails) return false;

    const availableSlots = this.getDungeonSlotsEffect();
    if (this.gameState().activeDungeonRuns.length >= availableSlots) return false;

    if (this.gameState().stage < difficultyDetails.stageRequirement) return false;

    const cost = difficultyDetails.cost?.gold || 0;
    if (this.gameState().gold < cost) return false;
    
    const prestigeCost = difficultyDetails.cost?.prestigePoints || 0;
    if (this.gameState().prestigePoints < prestigeCost) return false;

    const now = Date.now();
    const newDungeonRun: ActiveDungeonRun = {
      dungeonId,
      difficulty,
      startTime: now,
      completionTime: now + difficultyDetails.durationSeconds * 1000,
    };

    this.gameState.update(s => ({
      ...s,
      gold: s.gold - cost,
      prestigePoints: s.prestigePoints - prestigeCost,
      activeDungeonRuns: [...s.activeDungeonRuns, newDungeonRun]
    }));
    return true;
  }

  // FIX: Update claimDungeonRun to handle pet rewards and return correct type
  claimDungeonRun(dungeonToClaim: ActiveDungeonRun): { gold: number, item: EquipmentItem | null, crests: number, petCrystals: number, petEgg: boolean } {
    const dungeonDetails = ALL_DUNGEONS.find(d => d.id === dungeonToClaim.dungeonId);
    if (!dungeonDetails) return { gold: 0, item: null, crests: 0, petCrystals: 0, petEgg: false };

    const difficultyDetails = dungeonDetails.difficulties[dungeonToClaim.difficulty];
    const rewards = difficultyDetails.rewards;
    let gainedItem: EquipmentItem | null = null;
    if (rewards.equipmentDrop && Math.random() < rewards.equipmentDrop.chance) {
      gainedItem = this._generateDroppedItem(this.gameState().stage, rewards.equipmentDrop.rarity);
      this.inventory.update(inv => [...inv, gainedItem!]);
    }
    
    let petEggFound = false;
    if (rewards.petEggDrop && Math.random() < rewards.petEggDrop.chance) {
        petEggFound = true;
        this.hatchPetEgg();
    }
    
    this.addGold(rewards.gold);
    
    this.gameState.update(s => ({
      ...s,
      dungeonCrests: s.dungeonCrests + (rewards.dungeonCrests || 0),
      petCrystals: s.petCrystals + (rewards.petCrystals || 0),
      activeDungeonRuns: s.activeDungeonRuns.filter(dr => dr.startTime !== dungeonToClaim.startTime),
      totalDungeonsCompleted: s.totalDungeonsCompleted + 1,
    }));
    this.checkQuestCompletion();
    
    return { gold: rewards.gold, item: gainedItem, crests: rewards.dungeonCrests || 0, petCrystals: rewards.petCrystals || 0, petEgg: petEggFound };
  }
  
  startDungeonBounty(bountyId: number, heroIds: number[]): boolean {
      const bounty = ALL_DUNGEON_BOUNTIES.find(b => b.id === bountyId);
      if (!bounty || heroIds.length !== bounty.requiredHeroCount) return false;

      // Ensure heroes are not already on a bounty
      const heroesOnBounty = new Set(this.gameState().activeDungeonBounties.flatMap(b => b.heroIds));
      if (heroIds.some(id => heroesOnBounty.has(id))) return false;

      const now = Date.now();
      const newBounty: ActiveDungeonBounty = {
          bountyId,
          heroIds,
          startTime: now,
          completionTime: now + bounty.durationSeconds * 1000,
      };

      this.gameState.update(s => ({
          ...s,
          activeDungeonBounties: [...s.activeDungeonBounties, newBounty]
      }));
      return true;
  }

  // FIX: Update claimDungeonBounty to handle pet rewards and return correct type
  claimDungeonBounty(bountyToClaim: ActiveDungeonBounty): { gold: number; crests: number; petCrystals: number; essence: number; } | null {
      const activeBounty = this.gameState().activeDungeonBounties.find(b => b.startTime === bountyToClaim.startTime);
      if (!activeBounty || activeBounty.completionTime > Date.now()) return null;

      const bountyDetails = ALL_DUNGEON_BOUNTIES.find(b => b.id === activeBounty.bountyId);
      if (!bountyDetails) return null;

      const { gold, dungeonCrests, petCrystals, essenceOfLoyalty } = bountyDetails.rewards;

      let essenceGained = 0;
      if (essenceOfLoyalty && Math.random() < essenceOfLoyalty.chance) {
          essenceGained = essenceOfLoyalty.amount;
      }

      this.addGold(gold);
      this.gameState.update(s => ({
          ...s,
          dungeonCrests: s.dungeonCrests + dungeonCrests,
          petCrystals: s.petCrystals + (petCrystals || 0),
          essenceOfLoyalty: s.essenceOfLoyalty + essenceGained,
          activeDungeonBounties: s.activeDungeonBounties.filter(b => b.startTime !== bountyToClaim.startTime),
      }));

      return { gold, crests: dungeonCrests, petCrystals: petCrystals || 0, essence: essenceGained };
  }
  
  purchaseDungeonShopItem(itemId: number): DungeonShopItem | null {
      const item = ALL_DUNGEON_SHOP_ITEMS.find(i => i.id === itemId);
      if (!item || item.isSoldOut(this) || this.gameState().dungeonCrests < item.cost) {
          return null;
      }

      this.gameState.update(s => ({
          ...s,
          dungeonCrests: s.dungeonCrests - item.cost,
      }));

      if (item.purchase(this)) {
          return item;
      } else {
          // Revert cost if purchase fails
          this.gameState.update(s => ({ ...s, dungeonCrests: s.dungeonCrests + item.cost }));
          return null;
      }
  }

  // FIX: Add missing 'getLeaderboardData' method
  public getLeaderboardData(): LeaderboardEntry[] {
    const playerStage = this.gameState().stage;
    const entries: LeaderboardEntry[] = [];

    // Player's entry
    const playerEntry: LeaderboardEntry = {
      rank: 0, // Will determine this after sorting
      name: 'You',
      stage: playerStage,
      isPlayer: true,
    };
    entries.push(playerEntry);

    // Generate some fake opponents
    const opponentNames = [
      'ShadowSlayer', 'RiftWalker', 'CrimsonBlade', 'IronTide', 'VoidGazer',
      'PhoenixAsh', 'Starcaller', 'GraveLord', 'NightWhisper', 'StormChaser',
      'QuantumLeap', 'AbyssalFang', 'SolarFlare', 'FrostHeart', 'StoneGuard'
    ];

    for (let i = 0; i < 24; i++) { // Generate 24 opponents for a top-25 list
      let stage: number;
      if (i < 5) {
        // Opponents higher than player
        stage = playerStage + Math.floor(Math.random() * 20) + 5;
      } else if (i < 15) {
        // Opponents around player's stage
        stage = Math.max(1, playerStage + Math.floor(Math.random() * 20) - 10);
      } else {
        // Opponents lower than player
        stage = Math.max(1, playerStage - Math.floor(Math.random() * 30) - 1);
      }
      
      const name = opponentNames[i % opponentNames.length];

      entries.push({
        rank: 0,
        name: `${name}${i}`,
        stage: stage,
        isPlayer: false,
      });
    }

    // Sort by stage descending
    entries.sort((a, b) => b.stage - a.stage);

    // Assign ranks
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return entries;
  }

  // Alchemy Lab Methods
  salvageItems(itemIds: number[]): number {
    if (itemIds.length === 0) return 0;

    const itemsToSalvage = this.inventory().filter(i => itemIds.includes(i.id));
    if (itemsToSalvage.length === 0) return 0;

    const getDustValue = (rarity: Rarity): number => {
        switch(rarity) {
            case 'Common': return 1;
            case 'Rare': return 5;
            case 'Epic': return 25;
            case 'Legendary': return 100;
            case 'Mythic': return 500;
            default: return 0;
        }
    };
    
    const dustGained = itemsToSalvage.reduce((sum, item) => sum + getDustValue(item.rarity), 0);

    if (dustGained > 0) {
        this.gameState.update(s => ({
            ...s,
            // FIX: Use enchantingDust instead of arcaneDust
            enchantingDust: s.enchantingDust + dustGained
        }));
    }

    this.inventory.update(inv => inv.filter(i => !itemIds.includes(i.id)));
    
    return dustGained;
  }

  // FIX: Renamed method and updated to use enchantingDust
  transmuteEnchantingDustForGold(amount: number): number {
    if (amount <= 0 || this.gameState().enchantingDust < amount) {
        return 0;
    }

    const goldGained = amount * 500;

    this.gameState.update(s => ({
        ...s,
        enchantingDust: s.enchantingDust - amount
    }));
    
    this.addGold(goldGained);

    return goldGained;
  }

  // Fusion Methods
  getFusionCost(hero: Hero): { shards: number, gold: number } {
    const shardCopyValues: Record<Rarity, number> = { 'Common': 1, 'Rare': 3, 'Epic': 5, 'Legendary': 10, 'Mythic': 20 };
    const shardValue = shardCopyValues[hero.rarity];
    // First ascension (level 0) costs 3 "copies", then 4, 5, etc.
    const shards = (hero.ascensionLevel + 3) * shardValue;
    const gold = Math.floor(hero.baseCost * 50 * Math.pow(2, hero.ascensionLevel));
    return { shards, gold };
  }

  fuseHero(heroId: number): boolean {
    const hero = this.heroes().find(h => h.id === heroId);
    if (!hero) return false;

    const cost = this.getFusionCost(hero);
    const state = this.gameState();

    const hasEnoughShards = (state.heroShards[hero.id] || 0) >= cost.shards;
    const hasEnoughGold = state.gold >= cost.gold;

    if (!hasEnoughShards || !hasEnoughGold) {
      return false;
    }

    // Deduct resources
    this.gameState.update(s => {
      const newShards = { ...s.heroShards };
      newShards[hero.id] -= cost.shards;
      return {
        ...s,
        gold: s.gold - cost.gold,
        heroShards: newShards
      };
    });

    // Upgrade hero
    this.heroes.update(heroes => 
      heroes.map(h => {
        if (h.id === heroId) {
          const updatedHero = { ...h, ascensionLevel: h.ascensionLevel + 1 };
          return this.calculateHeroStats(updatedHero);
        }
        return h;
      })
    );

    return true;
  }

  // Team & Preset Methods
  swapActiveHero(heroIdToPlace: number, slotIndex: number) {
    this.gameState.update(s => {
      const newActiveIds = [...s.activeHeroIds];
      const existingHeroIdInSlot = newActiveIds[slotIndex];
      const currentIndexOfHero = newActiveIds.indexOf(heroIdToPlace);
  
      if (currentIndexOfHero > -1) {
        // Swap within active team
        newActiveIds[currentIndexOfHero] = existingHeroIdInSlot;
        newActiveIds[slotIndex] = heroIdToPlace;
      } else {
        // Place from bench
        newActiveIds[slotIndex] = heroIdToPlace;
      }
      
      return { ...s, activeHeroIds: newActiveIds };
    });
    this.checkQuestCompletion();
  }

  removeHeroFromActiveSlot(slotIndex: number) {
    this.gameState.update(s => {
      const newActiveIds = [...s.activeHeroIds];
      newActiveIds[slotIndex] = null;
      return { ...s, activeHeroIds: newActiveIds };
    });
    this.checkQuestCompletion();
  }
  
  saveActiveTeamToPreset(presetIndex: number) {
    this.gameState.update(s => {
      const newPresets = [...s.teamPresets];
      newPresets[presetIndex] = {
        ...newPresets[presetIndex],
        heroIds: [...s.activeHeroIds],
      };
      return { ...s, teamPresets: newPresets };
    });
  }

  loadTeamFromPreset(presetIndex: number) {
    this.gameState.update(s => {
      const preset = s.teamPresets[presetIndex];
      if (preset) {
        return { ...s, activeHeroIds: [...preset.heroIds] };
      }
      return s;
    });
    this.checkQuestCompletion();
  }
  
  updatePresetName(presetIndex: number, newName: string) {
    this.gameState.update(s => {
      const newPresets = s.teamPresets.map((preset, index) => 
        index === presetIndex ? { ...preset, name: newName } : preset
      );
      return { ...s, teamPresets: newPresets };
    });
  }

  // FIX: Add methods for pet system
  private hatchPetEgg() {
    const ownedPetIds = new Set(this.gameState().pets.map(p => p.petId));
    const unownedPets = ALL_PETS.filter(p => !ownedPetIds.has(p.id));

    if (unownedPets.length > 0) {
        const newPet = unownedPets[Math.floor(Math.random() * unownedPets.length)];
        // FIX: Add missing ascensionLevel property
        const newPlayerPet: PlayerPet = {
            petId: newPet.id,
            level: 1,
            isEquipped: false,
            ascensionLevel: 0,
        };
        this.gameState.update(s => ({
            ...s,
            pets: [...s.pets, newPlayerPet],
        }));
    } else {
        // All pets owned, give some crystals instead
        this.gameState.update(s => ({ ...s, petCrystals: s.petCrystals + 25 }));
    }
  }

  public equipPet(petId: number) {
    this.gameState.update(s => ({
        ...s,
        pets: s.pets.map(p => ({ ...p, isEquipped: p.petId === petId }))
    }));
  }

  public levelUpPet(petId: number) {
      const pet = this.gameState().pets.find(p => p.petId === petId);
      if (!pet) return;

      const cost = 10 * pet.level;
      if (this.gameState().petCrystals < cost) return;

      this.gameState.update(s => ({
          ...s,
          petCrystals: s.petCrystals - cost,
          pets: s.pets.map(p => p.petId === petId ? { ...p, level: p.level + 1 } : p)
      }));
  }

  // FIX: Implement ascendPet method
  public ascendPet(petId: number): boolean {
    const playerPet = this.gameState().pets.find(p => p.petId === petId);
    if (!playerPet) return false;

    const petDetails = ALL_PETS.find(p => p.id === petId);
    if (!petDetails || !petDetails.evolutionCostEssence) return false;
    
    const ascensionThreshold = 25; // As defined in component
    const ascensionCost = (petDetails.evolutionCostEssence || 0) * (playerPet.ascensionLevel + 1);
    
    const canAscend = playerPet.level >= ascensionThreshold && this.gameState().essenceOfLoyalty >= ascensionCost;

    if (!canAscend) return false;

    this.gameState.update(s => ({
        ...s,
        essenceOfLoyalty: s.essenceOfLoyalty - ascensionCost,
        pets: s.pets.map(p => {
            if (p.petId === petId) {
                return { ...p, level: 1, ascensionLevel: p.ascensionLevel + 1 };
            }
            return p;
        })
    }));

    return true;
  }
  
  // Enchanting Methods
  public getEnchantCost(item: EquipmentItem): { dust: number, gold: number } {
    const rarityMultiplier = {
      'Common': 5,
      'Rare': 10,
      'Epic': 25,
      'Legendary': 50,
      'Mythic': 100,
    }[item.rarity];

    const levelMultiplier = Math.pow(1.5, item.enchantLevel);

    const dust = Math.floor(rarityMultiplier * levelMultiplier);
    const gold = Math.floor(rarityMultiplier * 1000 * levelMultiplier);
    
    return { dust, gold };
  }

  public enchantItem(itemId: number): boolean {
    const item = this.inventory().find(i => i.id === itemId);
    if (!item) return false;

    const cost = this.getEnchantCost(item);
    const state = this.gameState();

    if (state.enchantingDust < cost.dust || state.gold < cost.gold) {
      return false;
    }

    this.gameState.update(s => ({
      ...s,
      enchantingDust: s.enchantingDust - cost.dust,
      gold: s.gold - cost.gold,
    }));

    this.inventory.update(inv => inv.map(i => {
      if (i.id === itemId) {
        const newEnchantLevel = i.enchantLevel + 1;
        return {
          ...i,
          enchantLevel: newEnchantLevel,
          bonusValue: i.baseBonusValue * (1 + newEnchantLevel * 0.10),
        };
      }
      return i;
    }));
    
    // Also update item if it's equipped on a hero
    this.heroes.update(heroes => heroes.map(h => {
        let equipmentUpdated = false;
        const newEquipment = {...h.equipment};
        for(const slot in newEquipment) {
            const equippedItem = newEquipment[slot as EquipmentSlot];
            if(equippedItem && equippedItem.id === itemId) {
                const newEnchantLevel = equippedItem.enchantLevel + 1;
                newEquipment[slot as EquipmentSlot] = {
                    ...equippedItem,
                    enchantLevel: newEnchantLevel,
                    bonusValue: equippedItem.baseBonusValue * (1 + newEnchantLevel * 0.10)
                };
                equipmentUpdated = true;
                break;
            }
        }
        if (equipmentUpdated) {
            return this.calculateHeroStats({...h, equipment: newEquipment});
        }
        return h;
    }));

    return true;
  }

  public calculateCost(hero: Hero, levels: number): number {
    if (levels <= 0) return 0;
    let totalCost = 0;
    for (let i = 0; i < levels; i++) {
        totalCost += Math.floor(hero.baseCost * Math.pow(hero.upgradeCostMultiplier, hero.level + i));
    }
    return totalCost;
  }

  public calculateMaxLevels(hero: Hero, currentGold: number): { levels: number, cost: number } {
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

  public unlockAllHeroes() {
    let currentGold = this.gameState().gold;
    const heroesToUpdate: number[] = [];
    let heroList = [...this.heroes()];
    let heroesUpdatedInLoop = true;

    while (heroesUpdatedInLoop) {
        heroesUpdatedInLoop = false;
        let cheapestHero: Hero | null = null;
        let minCost = Infinity;

        for (const hero of heroList) {
            if (hero.level === 0 && hero.nextLevelCost < minCost) {
                minCost = hero.nextLevelCost;
                cheapestHero = hero;
            }
        }

        if (cheapestHero && currentGold >= minCost) {
            currentGold -= minCost;
            heroesToUpdate.push(cheapestHero.id);
            heroList = heroList.map(h => h.id === cheapestHero!.id ? {...h, level: 1} : h); 
            heroesUpdatedInLoop = true;
        }
    }

    if (heroesToUpdate.length > 0) {
        this.gameState.update(s => ({...s, gold: currentGold}));
        this.heroes.update(heroes => heroes.map(h => {
            if (heroesToUpdate.includes(h.id)) {
                const unlockedHero = { ...h, level: 1 };
                return this.calculateHeroStats(unlockedHero);
            }
            return h;
        }));
    }
  }

  public equipAllHeroes() {
    this.heroes().filter(h => h.level > 0).forEach(hero => this.autoEquipBestGear(hero.id));
  }

  public placeAllHeroes() {
    this.gameState.update(s => {
        const activeIds = new Set(s.activeHeroIds.filter(id => id !== null));
        let newActiveIds = [...s.activeHeroIds];
        
        const emptySlotIndexes: number[] = [];
        newActiveIds.forEach((id, index) => {
            if (id === null) {
                emptySlotIndexes.push(index);
            }
        });

        if (emptySlotIndexes.length === 0) return s;

        const reserveHeroes = this.heroes()
            .filter(h => h.level > 0 && !activeIds.has(h.id))
            .sort((a, b) => b.currentDps - a.currentDps);

        for (let i = 0; i < emptySlotIndexes.length; i++) {
            if (reserveHeroes[i]) {
                newActiveIds[emptySlotIndexes[i]] = reserveHeroes[i].id;
            } else {
                break;
            }
        }
        
        return { ...s, activeHeroIds: newActiveIds };
    });
    this.checkQuestCompletion();
  }
}
