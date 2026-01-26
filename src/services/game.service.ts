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
  // thèmes et de mécaniques, avec une progression équilibrée des statistiques et des coûts. Les rarités vont de Common à Mythic, avec des DPS de base qui augmentent significativement pour les héros de haut niveau.
  { id: 64, name: 'Celestial Artificer', level: 0, baseDps: 85, baseCost: 3800, upgradeCostMultiplier: 1.21, rarity: 'Epic', role: 'Support', skillDescription: 'Creates a temporary relic that boosts the attack speed of nearby heroes.', lore: 'A master crafter who weaves starlight and hope into every artifact she creates.', ascensionLevel: 0 },
  { id: 65, name: 'Frost Giant', level: 0, baseDps: 550, baseCost: 28000, upgradeCostMultiplier: 1.30, rarity: 'Legendary', role: 'Tank', skillDescription: 'Unleashes a glacial roar that freezes and damages all enemies in a cone.', lore: 'A primordial being from the age of ice, awakened by the shifting climate of the world.', ascensionLevel: 0 },
  { id: 66, name: 'Alchemist Prodigy', level: 0, baseDps: 9, baseCost: 110, upgradeCostMultiplier: 1.15, rarity: 'Rare', role: 'Support', skillDescription: 'Throws an explosive potion that deals moderate AoE damage and reduces enemy defense.', lore: 'A young genius who sees the world as one grand, volatile experiment waiting to happen.', ascensionLevel: 0 },
  { id: 67, name: 'Spectral Duelist', level: 0, baseDps: 180, baseCost: 8000, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'DPS', skillDescription: 'Phases through the enemy, dealing damage and becoming untargetable for a brief moment.', lore: 'A ghost bound to this plane by a thirst for honorable combat, forever seeking a worthy opponent.', ascensionLevel: 0 },
  { id: 68, name: 'Oracle of Ruin', level: 0, baseDps: 950, baseCost: 60000, upgradeCostMultiplier: 1.33, rarity: 'Legendary', role: 'Démoniste', skillDescription: 'Whispers a prophecy of doom, causing the enemy to take a percentage of its own damage as extra damage for a duration.', lore: 'She does not predict the future; she chooses which terrible one comes to pass.', ascensionLevel: 0 },
  { id: 69, name: 'Clockwork Sniper', level: 0, baseDps: 200, baseCost: 9000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Marksman', skillDescription: 'Charges a perfect shot that deals massive damage and always crits against enemies below 50% health.', lore: 'A mechanical marvel of gears and lenses, built for one purpose: absolute precision elimination.', ascensionLevel: 0 },
  { id: 70, name: 'Cave Hunter', level: 0, baseDps: 6, baseCost: 55, upgradeCostMultiplier: 1.13, rarity: 'Common', role: 'DPS', skillDescription: 'Throws a primitive spear. Has a chance to cause bleeding, dealing damage over time.', lore: 'Survivor of a lost tribe, he hunts not for sport, but for the survival of his people.', ascensionLevel: 0 },
  { id: 71, name: 'Herald of Spring', level: 0, baseDps: 35, baseCost: 1200, upgradeCostMultiplier: 1.19, rarity: 'Rare', role: 'Healer', skillDescription: 'Calls forth a field of blooming flowers that heals allies and damages enemies standing in it.', lore: 'Where she walks, winter ends. She is the embodiment of renewal and gentle, persistent growth.', ascensionLevel: 0 },
  { id: 72, name: 'Cyber-Werewolf', level: 0, baseDps: 420, baseCost: 19000, upgradeCostMultiplier: 1.28, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Transforms, gaining increased attack speed and lifesteal for a short duration.', lore: 'A failed corporate experiment merged man, wolf, and machine. Now he seeks revenge on his creators.', ascensionLevel: 0 },
  { id: 73, name: 'Bubble Mage', level: 0, baseDps: 8, baseCost: 90, upgradeCostMultiplier: 1.14, rarity: 'Common', role: 'Controller', skillDescription: 'Traps an enemy in a bubble, suspending them and making them invulnerable but unable to act.', lore: 'A mischievous apprentice who found that the most frivolous-seeming magic can be incredibly potent.', ascensionLevel: 0 },
  { id: 74, name: 'Grand Admiral', level: 0, baseDps: 700, baseCost: 42000, upgradeCostMultiplier: 1.31, rarity: 'Legendary', role: 'Support', skillDescription: 'Calls in an orbital strike, dealing heavy damage and marking the enemy, causing all allies to focus fire on it.', lore: 'Commanding the fleet from his flagship bridge, he brings the firepower of an entire starfleet to bear.', ascensionLevel: 0 },
  { id: 75, name: 'Mushroom Forager', level: 0, baseDps: 1, baseCost: 18, upgradeCostMultiplier: 1.09, rarity: 'Common', role: 'Support', skillDescription: 'Shares a nourishing mushroom, granting a small, temporary health shield to the weakest ally.', lore: 'She knows the forest\'s secrets, and which fungi can save a life—or end one.', ascensionLevel: 0 },
  { id: 76, name: 'Chrono-Assassin', level: 0, baseDps: 900, baseCost: 55000, upgradeCostMultiplier: 1.32, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Strikes the enemy from multiple points in time simultaneously, dealing immense instant damage.', lore: 'He exists outside of time\'s flow, choosing the perfect moment to end his targets across all timelines.', ascensionLevel: 0 },
  { id: 77, name: 'Soul Smith', level: 0, baseDps: 110, baseCost: 5000, upgradeCostMultiplier: 1.23, rarity: 'Epic', role: 'Shaman', skillDescription: 'Channels the souls of fallen warriors into the team\'s weapons, granting a flat DPS bonus for a time.', lore: 'He forges weapons not with fire and hammer, but with memories and the whispers of the departed.', ascensionLevel: 0 },
  { id: 78, name: 'Desert Nomad', level: 0, baseDps: 14, baseCost: 160, upgradeCostMultiplier: 1.16, rarity: 'Rare', role: 'Marksman', skillDescription: 'Fires a shot that blinds the enemy, causing its next attack to miss.', lore: 'A wanderer of the endless sands, his aim is as true as his knowledge of the dunes is deep.', ascensionLevel: 0 },
  { id: 79, name: 'Gravity Titan', level: 0, baseDps: 1500, baseCost: 110000, upgradeCostMultiplier: 1.35, rarity: 'Mythic', role: 'Tank', skillDescription: 'Creates a local singularity, pulling enemies together and significantly increasing damage they take from area attacks.', lore: 'A fragment of a collapsed star given sentience, its mass warps the fabric of space around it.', ascensionLevel: 0 },
  { id: 80, name: 'Code Breaker', level: 0, baseDps: 65, baseCost: 2800, upgradeCostMultiplier: 1.20, rarity: 'Epic', role: 'Controller', skillDescription: 'Hacks the enemy, temporarily reducing its level (and thus its stats) for a short duration.', lore: 'In a world of digital magic, she sees the underlying code and rewrites reality with a keystroke.', ascensionLevel: 0 },
  { id: 81, name: 'Dragon Tamer', level: 0, baseDps: 250, baseCost: 11000, upgradeCostMultiplier: 1.25, rarity: 'Legendary', role: 'Support', skillDescription: 'Sends her drake companion to dive-bomb the enemy, dealing damage and lowering its attack.', lore: 'Raided by dragons as a child, she was raised by them. Now she leads a flight of her own.', ascensionLevel: 0 },
  { id: 82, name: 'Pit Fighter', level: 0, baseDps: 20, baseCost: 210, upgradeCostMultiplier: 1.18, rarity: 'Rare', role: 'Bruiser', skillDescription: 'Enters a frenzy, increasing his attack speed with each consecutive hit on the same enemy.', lore: 'A slave to the fighting pits who earned his freedom. Now he fights for a cause, not for a master.', ascensionLevel: 0 },
  { id: 83, name: 'Starlight Weaver', level: 0, baseDps: 300, baseCost: 14000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Mage', skillDescription: 'Weaves a tapestry of starlight that damages the enemy and heals the most injured ally simultaneously.', lore: 'She spins the threads of fate and light, mending wounds in both flesh and destiny.', ascensionLevel: 0 },
  { id: 84, name: 'Gremlin Engineer', level: 0, baseDps: 4, baseCost: 42, upgradeCostMultiplier: 1.12, rarity: 'Common', role: 'Support', skillDescription: 'Deploys a malfunctioning turret that attacks randomly but has a chance to explode, dealing AoE damage.', lore: 'His inventions are chaotic, dangerous, and brilliant. Nobody trusts them, but they often work.', ascensionLevel: 0 },
  { id: 85, name: 'Blood Monarch', level: 0, baseDps: 1200, baseCost: 80000, upgradeCostMultiplier: 1.34, rarity: 'Mythic', role: 'DPS', skillDescription: 'Commands a swarm of crimson insects that drains the enemy\'s health and transfers a portion to the Monarch.', lore: 'An ancient ruler whose kingdom fell to plague. She now commands the very scourge that destroyed it.', ascensionLevel: 0 },
  { id: 86, name: 'Stormcaller Shaman', level: 0, baseDps: 95, baseCost: 4600, upgradeCostMultiplier: 1.22, rarity: 'Epic', role: 'Shaman', skillDescription: 'Calls down a chain lightning that jumps between enemies, dealing decreasing damage with each jump.', lore: 'He speaks to the spirits of the storm, and they answer with thunder and fury.', ascensionLevel: 0 },
  { id: 87, name: 'Crystal Golem', level: 0, baseDps: 40, baseCost: 900, upgradeCostMultiplier: 1.18, rarity: 'Rare', role: 'Tank', skillDescription: 'Crystallizes its surface, reflecting a portion of incoming damage back at the attacker.', lore: 'Born in the heart of a geode, this living crystal seeks to protect the natural order.', ascensionLevel: 0 },
  { id: 88, name: 'Parallel Universe Hero', level: 0, baseDps: 850, baseCost: 52000, upgradeCostMultiplier: 1.32, rarity: 'Legendary', role: 'Video game Hero', skillDescription: 'Swaps places with a version of himself from another dimension, confusing the enemy and resetting his own skill cooldowns.', lore: 'He fell through a rift and met infinite versions of himself. Now they work together.', ascensionLevel: 0 },
  { id: 89, name: 'Whispering Bard', level: 0, baseDps: 7, baseCost: 130, upgradeCostMultiplier: 1.15, rarity: 'Rare', role: 'Controller', skillDescription: 'Sings a haunting melody that puts the enemy to sleep for a few seconds, interrupting its attack.', lore: 'His songs don\'t just entertain; they weave subtle magics that bend the will of listeners.', ascensionLevel: 0 },
  { id: 90, name: 'Ironclad Dreadnought', level: 0, baseDps: 600, baseCost: 35000, upgradeCostMultiplier: 1.30, rarity: 'Legendary', role: 'Tank', skillDescription: 'Activates a broadside barrage, dealing heavy damage in an area and knocking the enemy back.', lore: 'A massive, steam-powered war machine from an era of industrial magic and cannonfire.', ascensionLevel: 0 },
  { id: 91, name: 'Fey Trickster', level: 0, baseDps: 30, baseCost: 750, upgradeCostMultiplier: 1.17, rarity: 'Rare', role: 'Controller', skillDescription: 'Creates illusory copies of the weakest hero, distracting the enemy for a short time.', lore: 'A capricious creature from the Feywild, she fights not for glory, but for the sheer amusement of chaos.', ascensionLevel: 0 },
  { id: 92, name: 'Sunken King', level: 0, baseDps: 500, baseCost: 26000, upgradeCostMultiplier: 1.29, rarity: 'Legendary', role: 'Démoniste', skillDescription: 'Rises from the depths, summoning tidal waves that damage and slow all enemies.', lore: 'The ruler of a fallen underwater civilization, his wrath is as cold and relentless as the abyss.', ascensionLevel: 0 },
  { id: 93, name: 'Scrap Welder', level: 0, baseDps: 5, baseCost: 50, upgradeCostMultiplier: 1.13, rarity: 'Common', role: 'Support', skillDescription: 'Hastily repairs a random hero\'s equipment, granting them a temporary armor bonus.', lore: 'In a junkyard city, she can turn trash into treasure and scrap into salvation.', ascensionLevel: 0 },
  { id: 94, name: 'Dream Eater', level: 0, baseDps: 220, baseCost: 10500, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Mage', skillDescription: 'Invades the enemy\'s mind, dealing damage based on the enemy\'s current DPS.', lore: 'It feeds on hopes and nightmares, leaving its victims empty husks, devoid of dreams.', ascensionLevel: 0 },
  { id: 95, name: 'Burning Phoenix', level: 0, baseDps: 1800, baseCost: 130000, upgradeCostMultiplier: 1.36, rarity: 'Mythic', role: 'Mage', skillDescription: 'Explodes in a supernova of fire, dealing massive damage and leaving behind a healing ash that restores allies.', lore: 'A cycle of death and rebirth given form. Each time it falls, it rises stronger, its flames hotter.', ascensionLevel: 0 },
  { id: 96, name: 'Chain Warden', level: 0, baseDps: 130, baseCost: 5800, upgradeCostMultiplier: 1.24, rarity: 'Epic', role: 'Tank', skillDescription: 'Hooks and pulls the enemy, interrupting its current action and reducing its attack for a short time.', lore: 'A spectral jailer tasked with dragging escaped souls back to their eternal punishment.', ascensionLevel: 0 },
  { id: 97, name: 'Gunpowder Alchemist', level: 0, baseDps: 55, baseCost: 2200, upgradeCostMultiplier: 1.19, rarity: 'Rare', role: 'Marksman', skillDescription: 'Fires a volatile shot that explodes on impact, dealing area damage around the target.', lore: 'She believes that every problem can be solved with the right mixture of chemicals and force.', ascensionLevel: 0 },
  { id: 98, name: 'Moonlight Stalker', level: 0, baseDps: 400, baseCost: 17000, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Becomes invisible under moonlight (always active at night stages), guaranteeing her next attack is a critical hit.', lore: 'A lycanthrope who has mastered her curse, she is deadliest when the moon is full.', ascensionLevel: 0 },
  { id: 99, name: 'Terraformer', level: 0, baseDps: 75, baseCost: 3400, upgradeCostMultiplier: 1.21, rarity: 'Epic', role: 'Controller', skillDescription: 'Transforms the ground beneath the enemy, rooting them in place and dealing earth damage.', lore: 'A geomancer of immense power, she can shape mountains and divert rivers with a thought.', ascensionLevel: 0 },
  { id: 100, name: 'Void-Touched Smith', level: 0, baseDps: 3000, baseCost: 250000, upgradeCostMultiplier: 1.40, rarity: 'Mythic', role: 'Bruiser', skillDescription: 'Imbues his weapon with void energy, causing his attacks to ignore a percentage of the enemy\'s defense.', lore: 'He ventured into the Void to find the ultimate material for his forge. He returned changed, with a hammer that breaks reality.', ascensionLevel: 0 },
  { id: 101, name: 'Corsair Captain', level: 0, baseDps: 90, baseCost: 4100, upgradeCostMultiplier: 1.22, rarity: 'Epic', role: 'Marksman', skillDescription: 'Unleashes a volley of pistol shots, hitting the enemy multiple times in rapid succession.', lore: 'The scourge of the high seas, her flag strikes fear into the hearts of merchant and navy alike.', ascensionLevel: 0 },
  { id: 102, name: 'Living Totem', level: 0, baseDps: 3, baseCost: 28, upgradeCostMultiplier: 1.10, rarity: 'Common', role: 'Support', skillDescription: 'Channels ancestral spirits, providing a small but constant heal-over-time to all allies.', lore: 'A carved idol animated by the collective faith of a village, it protects its people.', ascensionLevel: 0 },
  { id: 103, name: 'Apex Predator', level: 0, baseDps: 950, baseCost: 58000, upgradeCostMultiplier: 1.33, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Leaps onto the enemy, pinning them down and dealing continuous damage for a few seconds.', lore: 'The ultimate hunter, evolved in a hyper-accelerated ecosystem. You are just another link in its food chain.', ascensionLevel: 0 },
  { id: 104, name: 'Cipher Agent', level: 0, baseDps: 120, baseCost: 5300, upgradeCostMultiplier: 1.23, rarity: 'Epic', role: 'Controller', skillDescription: 'Decrypts the enemy\'s attack pattern, granting the team a chance to dodge attacks for a short time.', lore: 'An operative for a shadowy organization that manipulates world events from behind the scenes.', ascensionLevel: 0 },
  { id: 105, name: 'Forge Priest', level: 0, baseDps: 50, baseCost: 1800, upgradeCostMultiplier: 1.20, rarity: 'Rare', role: 'Support', skillDescription: 'Blesses the team\'s weapons, adding a small amount of true damage to their attacks for a duration.', lore: 'He worships the sacred flame of creation, and his blessings make steel sing and spells burn brighter.', ascensionLevel: 0 },
  { id: 106, name: 'Thunderbird', level: 0, baseDps: 650, baseCost: 38000, upgradeCostMultiplier: 1.31, rarity: 'Legendary', role: 'Mage', skillDescription: 'Summons a thunderstorm that strikes the enemy repeatedly with lightning bolts.', lore: 'A legendary spirit of the skies, its wings create storms and its cry is the sound of thunder.', ascensionLevel: 0 },
  { id: 107, name: 'Grave Digger', level: 0, baseDps: 10, baseCost: 95, upgradeCostMultiplier: 1.14, rarity: 'Common', role: 'Shaman', skillDescription: 'Unearths a restless skeleton to fight for the team for a short period.', lore: 'He puts the dead to rest, but sometimes he needs a little help from them first.', ascensionLevel: 0 },
  { id: 108, name: 'Neon Samurai', level: 0, baseDps: 380, baseCost: 16500, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Video game Hero', skillDescription: 'Activates overdrive, making his blade vibrate at ultra-high frequency, slicing through armor.', lore: 'A cybernetically enhanced warrior from a dystopian megacity, he follows a code of honor in a dishonorable world.', ascensionLevel: 0 },
  { id: 109, name: 'Mirage Weaver', level: 0, baseDps: 70, baseCost: 3200, upgradeCostMultiplier: 1.21, rarity: 'Epic', role: 'Controller', skillDescription: 'Creates a perfect mirror image of the enemy that attacks it, dealing a fraction of the enemy\'s own DPS.', lore: 'A master of light and illusion, she can make you doubt your own eyes, your own mind.', ascensionLevel: 0 },
  { id: 110, name: 'Obsidian Drake', level: 0, baseDps: 1200, baseCost: 85000, upgradeCostMultiplier: 1.34, rarity: 'Mythic', role: 'Tank', skillDescription: 'Coats itself in hardening magma, becoming immune to critical hits and reflecting melee damage.', lore: 'A dragon born from volcanic fury, its scales are black glass and its heart burns with primal earthfire.', ascensionLevel: 0 },
  { id: 111, name: 'Hive Queen', level: 0, baseDps: 200, baseCost: 9500, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Summoner', skillDescription: 'Releases a swarm of razor-winged insects that attack the enemy continuously for several seconds.', lore: 'She is the heart of a symbiotic organism, a living hive that sees through a thousand eyes.', ascensionLevel: 0 },
  { id: 112, name: 'Runestone Carver', level: 0, baseDps: 25, baseCost: 300, upgradeCostMultiplier: 1.17, rarity: 'Rare', role: 'Support', skillDescription: 'Activates an ancient rune, providing a shield that blocks the next instance of damage for each hero.', lore: 'He speaks the language of the world\'s bones, carving power from stone and history.', ascensionLevel: 0 },
  { id: 113, name: 'Glacial Serpent', level: 0, baseDps: 450, baseCost: 21000, upgradeCostMultiplier: 1.28, rarity: 'Legendary', role: 'Mage', skillDescription: 'Constricts the enemy in coils of ice, dealing damage over time and reducing their attack speed.', lore: 'A primordial beast that slumbers within glaciers, its awakening brings a new ice age.', ascensionLevel: 0 },
  { id: 114, name: 'Junk Mech', level: 0, baseDps: 15, baseCost: 140, upgradeCostMultiplier: 1.16, rarity: 'Rare', role: 'Tank', skillDescription: 'Uses a scrap-metal shield to block the next heavy attack, negating its damage completely.', lore: 'Piloted by a clever raccoon, this mech is built from whatever it could salvage. It\'s surprisingly tough.', ascensionLevel: 0 },
  { id: 115, name: 'Sorrowsong Siren', level: 0, baseDps: 350, baseCost: 15500, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Controller', skillDescription: 'Sings a song of despair, causing the enemy to deal less damage and become more vulnerable to crowd control.', lore: 'Her voice can calm the roughest seas or drive sailors to madness. She chooses her side now.', ascensionLevel: 0 },
  { id: 116, name: 'Black Powder Rebel', level: 0, baseDps: 40, baseCost: 850, upgradeCostMultiplier: 1.18, rarity: 'Rare', role: 'Marksman', skillDescription: 'Sets a fuse that explodes after a delay, dealing heavy damage in a large area.', lore: 'A freedom fighter in an age of steam and oppression, she believes in revolution by any means necessary.', ascensionLevel: 0 },
  { id: 117, name: 'Ethereal Baker', level: 0, baseDps: 2, baseCost: 22, upgradeCostMultiplier: 1.09, rarity: 'Common', role: 'Healer', skillDescription: 'Shares magical pastries that provide a small, instant heal and a tiny temporary max HP boost.', lore: 'Her cakes are so good, they can mend a broken bone and lift a broken spirit.', ascensionLevel: 0 },
  { id: 118, name: 'Planet Cracker', level: 0, baseDps: 2500, baseCost: 200000, upgradeCostMultiplier: 1.38, rarity: 'Mythic', role: 'Video game Hero', skillDescription: 'Charges a beam of pure energy that deals damage equal to a percentage of the enemy\'s current HP.', lore: 'A weapon from a lost age of galactic empire, designed to break worlds. Now it points at lesser targets.', ascensionLevel: 0 },
  { id: 119, name: 'Warden of the Wilds', level: 0, baseDps: 100, baseCost: 4700, upgradeCostMultiplier: 1.22, rarity: 'Epic', role: 'Tank', skillDescription: 'Calls upon the roots and vines of the land to entangle the enemy, holding them in place.', lore: 'The guardian spirit of an ancient forest, she is the embodiment of nature\'s patience and wrath.', ascensionLevel: 0 },
  { id: 120, name: 'Chaos Imp', level: 0, baseDps: 8, baseCost: 80, upgradeCostMultiplier: 1.13, rarity: 'Common', role: 'Démoniste', skillDescription: 'Throws a bolt of chaotic energy. The damage is random, ranging from very low to very high.', lore: 'A tiny, mischievous demon. It\'s not very powerful, but its magic is wildly unpredictable.', ascensionLevel: 0 },
  { id: 121, name: 'Starlight Sentinel', level: 0, baseDps: 600, baseCost: 36000, upgradeCostMultiplier: 1.30, rarity: 'Legendary', role: 'Marksman', skillDescription: 'Fires an arrow that becomes a mini black hole on impact, pulling in and damaging nearby enemies.', lore: 'An eternal watcher at the edge of the galaxy, her bow is strung with the light of dying stars.', ascensionLevel: 0 },
  { id: 122, name: 'Golemancer', level: 0, baseDps: 150, baseCost: 6800, upgradeCostMultiplier: 1.24, rarity: 'Epic', role: 'Summoner', skillDescription: 'Summons a small clay golem to fight. The golem has its own health and attacks independently.', lore: 'A scholar of animation magic, he prefers to let his creations do the fighting for him.', ascensionLevel: 0 },
  { id: 123, name: 'Vampire Hunter', level: 0, baseDps: 85, baseCost: 3900, upgradeCostMultiplier: 1.21, rarity: 'Epic', role: 'Marksman', skillDescription: 'Fires a silver stake, dealing massive bonus damage to demonic and undead enemies.', lore: 'He has dedicated his life to eradicating the creatures of the night, and he is very, very good at it.', ascensionLevel: 0 },
  { id: 124, name: 'Coral Guardian', level: 0, baseDps: 55, baseCost: 2300, upgradeCostMultiplier: 1.20, rarity: 'Rare', role: 'Healer', skillDescription: 'Releases a cloud of healing spores from its coral body, healing all allies over a few seconds.', lore: 'A peaceful colony creature that protects the reefs. It sees the fighting party as its new, strange reef to protect.', ascensionLevel: 0 },
  { id: 125, name: 'Quantum Duplicator', level: 0, baseDps: 500, baseCost: 27000, upgradeCostMultiplier: 1.29, rarity: 'Legendary', role: 'Controller', skillDescription: 'Creates a quantum duplicate of the highest DPS hero for a short duration.', lore: 'His device doesn\'t create illusions; it temporarily pulls a hero from a nearly identical parallel reality.', ascensionLevel: 0 },
  { id: 126, name: 'Bone Collector', level: 0, baseDps: 12, baseCost: 125, upgradeCostMultiplier: 1.15, rarity: 'Rare', role: 'Shaman', skillDescription: 'Rattles a bag of bones, cursing the enemy to take increased damage from the next source that hits them.', lore: 'A witch doctor who bargains with spirits of the dead, paying them with the bones of her foes.', ascensionLevel: 0 },
  { id: 127, name: 'Solar Dragon', level: 0, baseDps: 2200, baseCost: 175000, upgradeCostMultiplier: 1.37, rarity: 'Mythic', role: 'Mage', skillDescription: 'Breathes a continuous stream of solar plasma, dealing immense damage that increases the longer it channels.', lore: 'A celestial dragon that flies close to stars, bathing in their fire. Its breath can melt continents.', ascensionLevel: 0 },
  { id: 128, name: 'Gadgeteer', level: 0, baseDps: 30, baseCost: 700, upgradeCostMultiplier: 1.17, rarity: 'Rare', role: 'Support', skillDescription: 'Throws a pocket watch that creates a small time-dilation field, slightly speeding up ally attacks inside it.', lore: 'An inventor with a belt full of gadgets for every situation, though they don\'t always work as intended.', ascensionLevel: 0 },
  { id: 129, name: 'Abyssal Leviathan', level: 0, baseDps: 1900, baseCost: 140000, upgradeCostMultiplier: 1.36, rarity: 'Mythic', role: 'Tank', skillDescription: 'Swallows the enemy whole (stunning them) and deals massive damage over time while they are trapped.', lore: 'A beast that slumbers in the deepest trench. Its hunger is endless, and its size defies measurement.', ascensionLevel: 0 },
  { id: 130, name: 'Mystic Archer', level: 0, baseDps: 110, baseCost: 5100, upgradeCostMultiplier: 1.23, rarity: 'Epic', role: 'Marksman', skillDescription: 'Her arrows are tipped with focused magic, dealing damage that ignores a portion of the enemy\'s armor.', lore: 'She learned to weave spells into her archery, creating a deadly art that is entirely her own.', ascensionLevel: 0 },
  { id: 131, name: 'Clockwork King', level: 0, baseDps: 800, baseCost: 48000, upgradeCostMultiplier: 1.32, rarity: 'Legendary', role: 'Controller', skillDescription: 'Winds up the gears of reality, slowing down time for the enemy, making all their actions slower.', lore: 'The ruler of a clockwork city, he believes the universe itself is a machine to be understood and controlled.', ascensionLevel: 0 },
  { id: 132, name: 'Spore Druid', level: 0, baseDps: 18, baseCost: 200, upgradeCostMultiplier: 1.16, rarity: 'Rare', role: 'Shaman', skillDescription: 'Releases a cloud of paralyzing spores that have a chance to stun the enemy with each attack for a short time.', lore: 'He communicates with the fungal networks, learning secrets of decay and rebirth unknown to other druids.', ascensionLevel: 0 },
  { id: 133, name: 'Star Forged Warrior', level: 0, baseDps: 900, baseCost: 56000, upgradeCostMultiplier: 1.33, rarity: 'Legendary', role: 'DPS', skillDescription: 'Channels the power of a neutron star into his strikes, dealing massive damage and gaining armor penetration.', lore: 'His armor and weapon were tempered in the heart of a dying star. He carries a fraction of its density and power.', ascensionLevel: 0 },
  { id: 134, name: 'Pickpocket', level: 0, baseDps: 6, baseCost: 60, upgradeCostMultiplier: 1.13, rarity: 'Common', role: 'Support', skillDescription: 'Steals gold from the enemy on hit. The amount is small but can add up over time.', lore: 'A street urchin with lightning-fast fingers. He fights not for glory, but for the next meal.', ascensionLevel: 0 },
  { id: 135, name: 'Dreamcatcher', level: 0, baseDps: 65, baseCost: 2900, upgradeCostMultiplier: 1.20, rarity: 'Epic', role: 'Healer', skillDescription: 'Weaves a net of positive dreams that absorbs a large amount of damage from a single target ally.', lore: 'She protects the minds of her allies from psychic attacks and nightmares, turning fear into resilience.', ascensionLevel: 0 },
  { id: 136, name: 'Molten Core Golem', level: 0, baseDps: 350, baseCost: 15000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Tank', skillDescription: 'Erupts, dealing fire damage to all enemies and leaving a pool of lava that damages enemies standing in it.', lore: 'A golem forged in the planet\'s mantle, its body is cracked stone with rivers of magma flowing within.', ascensionLevel: 0 },
  { id: 137, name: 'Astral Projectionist', level: 0, baseDps: 1, baseCost: 10, upgradeCostMultiplier: 1.08, rarity: 'Common', role: 'Controller', skillDescription: 'Projects his astral form to harass the enemy, dealing negligible damage but applying a random minor debuff.', lore: 'He\'s not really here. His physical body is asleep miles away. This is just a very convincing daydream.', ascensionLevel: 0 },
  { id: 138, name: 'Reality Sculptor', level: 0, baseDps: 1400, baseCost: 95000, upgradeCostMultiplier: 1.34, rarity: 'Mythic', role: 'Mage', skillDescription: 'Briefly treats the enemy as a work of art, "erasing" a portion of their current and max HP.', lore: 'An artist who discovered his paints could alter reality. His masterpiece is a universe of his own design.', ascensionLevel: 0 },
  { id: 139, name: 'Siege Engine', level: 0, baseDps: 300, baseCost: 13500, upgradeCostMultiplier: 1.25, rarity: 'Legendary', role: 'Video game Hero', skillDescription: 'Deploys into stationary mode, greatly increasing its range and damage but becoming immobile.', lore: 'A transforming tank/artillery unit from a futuristic war. It adapts to any battlefield.', ascensionLevel: 0 },
  { id: 140, name: 'Blight Doctor', level: 0, baseDps: 20, baseCost: 230, upgradeCostMultiplier: 1.18, rarity: 'Rare', role: 'Shaman', skillDescription: 'Infects the enemy with a virulent disease that spreads to other enemies, dealing damage over time.', lore: 'She studies diseases not to cure them, but to weaponize them against those who threaten her research.', ascensionLevel: 0 },
  { id: 141, name: 'Celestial Judge', level: 0, baseDps: 1100, baseCost: 70000, upgradeCostMultiplier: 1.33, rarity: 'Legendary', role: 'DPS', skillDescription: 'Passes judgment on the enemy. If the enemy is below a health threshold, the judgment deals bonus true damage.', lore: 'An arbiter from a higher plane, she weighs the sins of her foes and delivers perfect, impartial punishment.', ascensionLevel: 0 },
  { id: 142, name: 'Rune Knight', level: 0, baseDps: 80, baseCost: 3700, upgradeCostMultiplier: 1.21, rarity: 'Epic', role: 'Tank', skillDescription: 'Activates a defensive rune that redirects a percentage of damage taken by allies to himself for a short time.', lore: 'His armor is inscribed with ancient, powerful runes that grant him protection and command over battlefields.', ascensionLevel: 0 },
  { id: 143, name: 'Pixie Bombardier', level: 0, baseDps: 14, baseCost: 150, upgradeCostMultiplier: 1.15, rarity: 'Rare', role: 'Marksman', skillDescription: 'Flies around dropping tiny but explosive acorns on the enemy, dealing splash damage.', lore: 'A tiny faerie with a massive chip on her shoulder and a bag full of volatile forest nuts.', ascensionLevel: 0 },
  { id: 144, name: 'Harbinger of Silence', level: 0, baseDps: 750, baseCost: 44000, upgradeCostMultiplier: 1.31, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Strikes the enemy\'s voice, preventing them from using their special skill for an extended duration.', lore: 'He speaks only in signs, and his blade carries a curse that steals the sound from the world.', ascensionLevel: 0 },
  { id: 145, name: 'Geomancer', level: 0, baseDps: 45, baseCost: 1100, upgradeCostMultiplier: 1.19, rarity: 'Rare', role: 'Controller', skillDescription: 'Causes an earthquake, disrupting the enemy and causing them to drop gold on the ground.', lore: 'He feels the tremors of the earth and can command stone and soil to rise up in defense.', ascensionLevel: 0 },
  { id: 146, name: 'Nano-Swarm Commander', level: 0, baseDps: 240, baseCost: 11500, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Video game Hero', skillDescription: 'Deploys a cloud of nanites that repair allies and damage enemies simultaneously.', lore: 'She controls microscopic machines that can build or dismantle matter at the atomic level.', ascensionLevel: 0 },
  { id: 147, name: 'Tome Keeper', level: 0, baseDps: 50, baseCost: 1900, upgradeCostMultiplier: 1.20, rarity: 'Rare', role: 'Mage', skillDescription: 'Reads from an ancient tome, unleashing a random spell from a list of five possibilities.', lore: 'The librarian of forbidden knowledge, he carries a book that contains spells too dangerous to be cast.', ascensionLevel: 0 },
  { id: 148, name: 'Void Sailor', level: 0, baseDps: 1600, baseCost: 120000, upgradeCostMultiplier: 1.35, rarity: 'Mythic', role: 'Explorer', skillDescription: 'Fires the cannons of his void-ship, dealing damage that scales with how far the player has progressed in the game.', lore: 'A captain who lost his ship and crew to the Void. Now he sails the emptiness in a vessel of memory and regret.', ascensionLevel: 0 },
  { id: 149, name: 'Mirror Knight', level: 0, baseDps: 170, baseCost: 7800, upgradeCostMultiplier: 1.24, rarity: 'Epic', role: 'Tank', skillDescription: 'His shield reflects the enemy\'s image, causing the enemy to be attacked by a phantom version of itself.', lore: 'His armor is polished to a perfect mirror finish. He believes to defeat an enemy, you must first show them themselves.', ascensionLevel: 0 },
  { id: 150, name: 'Cursed Doll', level: 0, baseDps: 4, baseCost: 35, upgradeCostMultiplier: 1.11, rarity: 'Common', role: 'Controller', skillDescription: 'The doll\'s gaze has a chance to terrify the enemy, causing them to flee for a very short duration.', lore: 'A child\'s toy imbued with a lost soul. It seeks companionship, but its presence brings misfortune.', ascensionLevel: 0 },
  { id: 151, name: 'Infernal Chef', level: 0, baseDps: 100, baseCost: 4900, upgradeCostMultiplier: 1.22, rarity: 'Epic', role: 'Support', skillDescription: 'Cooks up a hellish stew that, when consumed by allies, increases their damage and sets their attacks on fire.', lore: 'A demon who found passion not in torture, but in gastronomy. His dishes are painfully delicious.', ascensionLevel: 0 },
  { id: 152, name: 'Gravity Well', level: 0, baseDps: 0, baseCost: 500, upgradeCostMultiplier: 1.18, rarity: 'Rare', role: 'Controller', skillDescription: 'Does no damage itself, but dramatically increases the damage the enemy takes from all other sources.', lore: 'Not a creature, but a localized phenomenon—a point where gravity is so intense it warps probability and weakness.', ascensionLevel: 0 },
  { id: 153, name: 'Lunar Paladin', level: 0, baseDps: 220, baseCost: 10200, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Healer', skillDescription: 'Bathes the team in soothing moonlight, healing them and cleansing them of negative effects.', lore: 'A knight who swore an oath to the moon. His power waxes and wanes with the lunar cycle.', ascensionLevel: 0 },
  { id: 154, name: 'Data Thief', level: 0, baseDps: 60, baseCost: 2600, upgradeCostMultiplier: 1.20, rarity: 'Epic', role: 'Support', skillDescription: 'Hacks the enemy, stealing a portion of their current DPS and adding it to the team\'s total DPS for a short time.', lore: 'In a digital world, she steals not coins, but the very essence of power: information and processing capability.', ascensionLevel: 0 },
  { id: 155, name: 'Elder Treant', level: 0, baseDps: 200, baseCost: 9200, upgradeCostMultiplier: 1.24, rarity: 'Epic', role: 'Tank', skillDescription: 'Roots deep into the ground, gaining massive damage reduction but becoming unable to move or dodge.', lore: 'The oldest living thing in the forest. Its thoughts are slow, but its strength is as deep as the earth.', ascensionLevel: 0 },
  { id: 156, name: 'Phase-shift Phantom', level: 0, baseDps: 130, baseCost: 5900, upgradeCostMultiplier: 1.23, rarity: 'Epic', role: 'Assassin', skillDescription: 'Shifts out of phase, avoiding all damage for a few seconds and appearing behind the enemy for a critical strike.', lore: 'A ghost that can choose which laws of physics apply to it. It is never quite *here*.', ascensionLevel: 0 },
  { id: 157, name: 'Catalyst', level: 0, baseDps: 1, baseCost: 15, upgradeCostMultiplier: 1.09, rarity: 'Common', role: 'Support', skillDescription: 'Does not attack. Instead, each of his basic attacks increases the skill charge rate of a random hero.', lore: 'He understands the flow of energy in battle and can subtly nudge it to accelerate his allies\' potential.', ascensionLevel: 0 },
  { id: 158, name: 'Omni-Mage', level: 0, baseDps: 1500, baseCost: 105000, upgradeCostMultiplier: 1.35, rarity: 'Mythic', role: 'Mage', skillDescription: 'Cycles through all elements, casting a different powerful spell each time his skill is used.', lore: 'The last student of a school of magic that sought to master every element. He is the only one who survived the attempt.', ascensionLevel: 0 },
  { id: 159, name: 'Jester of Fate', level: 0, baseDps: 30, baseCost: 650, upgradeCostMultiplier: 1.16, rarity: 'Rare', role: 'Controller', skillDescription: 'Pulls a random card. The effect can be tremendously positive for the team or disastrous for the enemy (or vice versa).', lore: 'He treats all of existence as a grand game, and he is the wild card nobody can predict.', ascensionLevel: 0 },
  { id: 160, name: 'Spark Generator', level: 0, baseDps: 10, baseCost: 105, upgradeCostMultiplier: 1.14, rarity: 'Common', role: 'Support', skillDescription: 'Generates electrical sparks that jump between heroes, giving them a chance to deal bonus lightning damage on hit.', lore: 'A tinkerer who built a device to harness static electricity. It\'s not much, but it gives everyone a little shock.', ascensionLevel: 0 },
  { id: 161, name: 'Beast Tamer', level: 0, baseDps: 90, baseCost: 4300, upgradeCostMultiplier: 1.22, rarity: 'Epic', role: 'Summoner', skillDescription: 'Whistles, calling a random beast from the forest to aid in battle for a short time.', lore: 'She doesn\'t command animals; she asks for their help. And the forest has many, many friends.', ascensionLevel: 0 },
  { id: 162, name: 'Dusk Blade', level: 0, baseDps: 400, baseCost: 18000, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Is empowered during the transition between day and night stages, dealing triple damage for a short period.', lore: 'An assassin who exists only in the moment of twilight, the blurry line between light and shadow.', ascensionLevel: 0 },
  { id: 163, name: 'The Final Boss', level: 0, baseDps: 5000, baseCost: 500000, upgradeCostMultiplier: 1.50, rarity: 'Mythic', role: 'Video game Hero', skillDescription: 'Unleashes a devastating screen-filling attack that deals damage based on the total combined level of all your heroes.', lore: 'A being designed to be unbeatable. It broke free from its game and now seeks a challenge worthy of its title.', ascensionLevel: 0 },
  //50 héros supplémentaires capturent l'esprit des jeux vidéo classiques des années 1980-2000, avec des références à des séries iconiques comme Street Fighter, Final Fantasy, Sonic, Mega Man, Resident Evil, Metal Gear Solid, et bien d'autres. Chaque héros a des statistiques équilibrées et des compétences qui reflètent leurs capacités dans leurs jeux d'origine.
  { id: 164, name: 'Pixel Plumber', level: 0, baseDps: 8, baseCost: 85, upgradeCostMultiplier: 1.14, rarity: 'Common', role: 'Bruiser', skillDescription: 'Jumps on enemies, dealing damage and stunning smaller foes.', lore: 'A hero from a side-scrolling platformer world, he\'s been rescuing princesses and stomping goombas for decades.', ascensionLevel: 0 },
  { id: 165, name: 'Blaster Master', level: 0, baseDps: 140, baseCost: 6200, upgradeCostMultiplier: 1.24, rarity: 'Epic', role: 'Video game Hero', skillDescription: 'Fires a spread shot from his tank-like vehicle, hitting multiple targets.', lore: 'From an 8-bit sci-fi adventure, he explores underground worlds in his versatile armored vehicle.', ascensionLevel: 0 },
  { id: 166, name: 'Contra Commando', level: 0, baseDps: 45, baseCost: 1200, upgradeCostMultiplier: 1.19, rarity: 'Rare', role: 'Marksman', skillDescription: 'Uses a spread gun that fires in five directions simultaneously.', lore: 'A hardened soldier from a run-and-gun classic, he never stops shooting and knows the Konami code by heart.', ascensionLevel: 0 },
  { id: 167, name: 'Metroid Hunter', level: 0, baseDps: 180, baseCost: 8500, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Marksman', skillDescription: 'Charges and releases a powerful beam attack that pierces through enemies.', lore: 'A bounty hunter from a distant planet, equipped with an advanced power suit and an arsenal of alien weaponry.', ascensionLevel: 0 },
  { id: 168, name: 'Blue Hedgehog', level: 0, baseDps: 320, baseCost: 14000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'DPS', skillDescription: 'Spins into a ball and dashes through enemies at supersonic speed.', lore: 'The fastest thing alive from a 16-bit world, he collects golden rings and fights robotic enemies.', ascensionLevel: 0 },
  { id: 169, name: 'Mega Man', level: 0, baseDps: 110, baseCost: 5200, upgradeCostMultiplier: 1.23, rarity: 'Epic', role: 'Marksman', skillDescription: 'Charges his mega buster for a powerful shot, or uses a copied weapon from a defeated robot master.', lore: 'A robotic hero created to fight evil, he can absorb the powers of defeated enemies to grow stronger.', ascensionLevel: 0 },
  { id: 170, name: 'Street Fighter', level: 0, baseDps: 95, baseCost: 4800, upgradeCostMultiplier: 1.22, rarity: 'Epic', role: 'Bruiser', skillDescription: 'Executes a Hadouken fireball or Shoryuken uppercut, dealing heavy damage.', lore: 'A world warrior from a fighting tournament, he trains endlessly to become the strongest martial artist.', ascensionLevel: 0 },
  { id: 171, name: 'Chun-Li', level: 0, baseDps: 88, baseCost: 4500, upgradeCostMultiplier: 1.22, rarity: 'Epic', role: 'Assassin', skillDescription: 'Performs her Hyakuretsukyaku (Lightning Leg) attack, hitting multiple times rapidly.', lore: 'An Interpol officer seeking justice for her father\'s death, she\'s known as the strongest woman in the world.', ascensionLevel: 0 },
  { id: 172, name: 'Doom Marine', level: 0, baseDps: 280, baseCost: 12500, upgradeCostMultiplier: 1.25, rarity: 'Legendary', role: 'DPS', skillDescription: 'Unleashes the BFG 9000, dealing massive area damage to all enemies.', lore: 'The only thing they fear is you. A space marine who single-handedly battles demonic invasions from Hell.', ascensionLevel: 0 },
  { id: 173, name: 'Lara Croft', level: 0, baseDps: 120, baseCost: 5500, upgradeCostMultiplier: 1.23, rarity: 'Epic', role: 'Marksman', skillDescription: 'Fires dual pistols with perfect accuracy while performing acrobatic dodges.', lore: 'A British archaeologist-adventurer who explores ancient tombs and uncovers supernatural mysteries.', ascensionLevel: 0 },
  { id: 174, name: 'Final Fantasy Knight', level: 0, baseDps: 200, baseCost: 9500, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Tank', skillDescription: 'Uses Cover ability to protect the most damaged ally, taking damage in their place.', lore: 'A heroic knight from a fantasy RPG, sworn to protect the crystals and save the world from darkness.', ascensionLevel: 0 },
  { id: 175, name: 'Black Mage', level: 0, baseDps: 300, baseCost: 13500, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Mage', skillDescription: 'Casts Firaga, dealing massive fire damage to a single enemy.', lore: 'A mysterious spellcaster from a classic RPG, specializing in destructive black magic with a pointy hat.', ascensionLevel: 0 },
  { id: 176, name: 'White Mage', level: 0, baseDps: 40, baseCost: 1000, upgradeCostMultiplier: 1.18, rarity: 'Rare', role: 'Healer', skillDescription: 'Casts Curaga, restoring a large amount of health to all allies.', lore: 'A benevolent healer from a fantasy world, using white magic to mend wounds and cure ailments.', ascensionLevel: 0 },
  { id: 177, name: 'Chocobo Knight', level: 0, baseDps: 150, baseCost: 7000, upgradeCostMultiplier: 1.24, rarity: 'Epic', role: 'DPS', skillDescription: 'Charges forward on his chocobo, dealing damage to all enemies in a line.', lore: 'A specialized knight who rides the iconic yellow birds of his world into battle.', ascensionLevel: 0 },
  { id: 178, name: 'Tetris Block', level: 0, baseDps: 25, baseCost: 400, upgradeCostMultiplier: 1.17, rarity: 'Rare', role: 'Controller', skillDescription: 'Drops a line piece that clears when aligned, damaging all enemies.', lore: 'A sentient tetromino from a puzzle world, it organizes itself to create order from chaos.', ascensionLevel: 0 },
  { id: 179, name: 'Pac-Man Ghost', level: 0, baseDps: 15, baseCost: 180, upgradeCostMultiplier: 1.16, rarity: 'Rare', role: 'Controller', skillDescription: 'Turns blue and vulnerable, allowing allies to deal extra damage when attacking this enemy.', lore: 'One of the four ghosts from the maze, sometimes chasing, sometimes fleeing.', ascensionLevel: 0 },
  { id: 180, name: 'Space Invader', level: 0, baseDps: 12, baseCost: 150, upgradeCostMultiplier: 1.15, rarity: 'Common', role: 'DPS', skillDescription: 'Fires slow-moving projectiles that increase in speed as its health decreases.', lore: 'A pixelated alien from the classic arcade shooter, moving in formation with its brethren.', ascensionLevel: 0 },
  { id: 181, name: 'Frogger', level: 0, baseDps: 3, baseCost: 30, upgradeCostMultiplier: 1.11, rarity: 'Common', role: 'Support', skillDescription: 'Safely navigates hazards, granting a temporary movement speed boost to all allies.', lore: 'An amphibious hero who must cross busy roads and rivers to reach his destination.', ascensionLevel: 0 },
  { id: 182, name: 'Donkey Kong', level: 0, baseDps: 400, baseCost: 18000, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Throws barrels that roll through enemy lines, damaging all in their path.', lore: 'The original arcade ape, he throws barrels and fights to protect his banana hoard.', ascensionLevel: 0 },
  { id: 183, name: 'Q*bert', level: 0, baseDps: 18, baseCost: 220, upgradeCostMultiplier: 1.17, rarity: 'Rare', role: 'Controller', skillDescription: 'Hops on enemies\' heads, confusing them and making them attack their own allies.', lore: 'A strange orange creature who jumps between pyramid cubes, avoiding snakes and purple balls.', ascensionLevel: 0 },
  { id: 184, name: 'Dig Dug', level: 0, baseDps: 22, baseCost: 250, upgradeCostMultiplier: 1.18, rarity: 'Rare', role: 'Controller', skillDescription: 'Inflates enemies until they pop, dealing area damage to nearby foes.', lore: 'A miner who digs through earth, fighting off vegetable-like monsters with his pump.', ascensionLevel: 0 },
  { id: 185, name: 'Bomberman', level: 0, baseDps: 80, baseCost: 3800, upgradeCostMultiplier: 1.21, rarity: 'Epic', role: 'Controller', skillDescription: 'Places bombs that explode in a cross pattern, damaging enemies and destroying obstacles.', lore: 'A hero who uses bombs to navigate maze-like levels and defeat his robotic enemies.', ascensionLevel: 0 },
  { id: 186, name: 'Castlevania Hunter', level: 0, baseDps: 160, baseCost: 7500, upgradeCostMultiplier: 1.24, rarity: 'Epic', role: 'DPS', skillDescription: 'Uses the Vampire Killer whip, dealing holy damage to undead enemies.', lore: 'A member of the Belmont clan, destined to battle Dracula and his minions throughout history.', ascensionLevel: 0 },
  { id: 187, name: 'Simon Belmont', level: 0, baseDps: 170, baseCost: 8000, upgradeCostMultiplier: 1.24, rarity: 'Epic', role: 'DPS', skillDescription: 'Throws holy water that creates flames on the ground, dealing continuous damage.', lore: 'The most famous vampire hunter, armed with the legendary whip and various sub-weapons.', ascensionLevel: 0 },
  { id: 188, name: 'Altered Beast', level: 0, baseDps: 240, baseCost: 11000, upgradeCostMultiplier: 1.25, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Transforms into a powerful beast form, gaining increased damage and new abilities.', lore: 'A resurrected warrior who collects power-ups to transform into mythical creatures.', ascensionLevel: 0 },
  { id: 189, name: 'Golden Axe Warrior', level: 0, baseDps: 130, baseCost: 6000, upgradeCostMultiplier: 1.23, rarity: 'Epic', role: 'Bruiser', skillDescription: 'Rides a creature into battle, performing charge attacks that knock back enemies.', lore: 'A barbarian hero from a fantasy beat-em-up, fighting to rescue the king and princess.', ascensionLevel: 0 },
  { id: 190, name: 'Double Dragon Fighter', level: 0, baseDps: 100, baseCost: 5000, upgradeCostMultiplier: 1.22, rarity: 'Epic', role: 'Bruiser', skillDescription: 'Executes combination attacks and grappling moves, dealing damage to multiple enemies.', lore: 'One of the Lee brothers, martial artists fighting to rescue their girlfriend from a street gang.', ascensionLevel: 0 },
  { id: 191, name: 'R-Type Ship', level: 0, baseDps: 220, baseCost: 10500, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Video game Hero', skillDescription: 'Deploys the Force pod that orbits and protects it, while firing a powerful wave cannon.', lore: 'An advanced starfighter from a side-scrolling shooter, battling the Bydo Empire across space and time.', ascensionLevel: 0 },
  { id: 192, name: 'Gradius Vic Viper', level: 0, baseDps: 210, baseCost: 10000, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Video game Hero', skillDescription: 'Activates Options (drones) that mirror its attacks, multiplying damage output.', lore: 'The iconic starfighter from the Gradius series, equipped with a power-up system and shields.', ascensionLevel: 0 },
  { id: 193, name: 'Earthbound PSI User', level: 0, baseDps: 180, baseCost: 8500, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Mage', skillDescription: 'Uses PSI Rockin attack, dealing damage to all enemies with psychic energy.', lore: 'A young psychic from a modern-day RPG, using his mental powers to save the world from alien invasion.', ascensionLevel: 0 },
  { id: 194, name: 'Chrono Trigger Hero', level: 0, baseDps: 350, baseCost: 15000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'DPS', skillDescription: 'Performs a Dual Tech or Triple Tech with other time-traveling heroes for massive damage.', lore: 'A young man transported through time, gathering allies to prevent a global catastrophe.', ascensionLevel: 0 },
  { id: 195, name: 'Magus', level: 0, baseDps: 500, baseCost: 25000, upgradeCostMultiplier: 1.29, rarity: 'Legendary', role: 'Mage', skillDescription: 'Casts Dark Matter, dealing massive shadow damage to a single target.', lore: 'The mysterious sorcerer from the Middle Ages, master of black magic with a complex destiny.', ascensionLevel: 0 },
  { id: 196, name: 'Secret of Mana Hero', level: 0, baseDps: 190, baseCost: 9000, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'DPS', skillDescription: 'Charges his weapon to level 8, then unleashes a devastating special attack.', lore: 'A young boy who pulls the Mana Sword from its stone, beginning a quest to restore balance to the world.', ascensionLevel: 0 },
  { id: 197, name: 'Sonic Tails', level: 0, baseDps: 140, baseCost: 6500, upgradeCostMultiplier: 1.23, rarity: 'Epic', role: 'Support', skillDescription: 'Flies around dropping bombs on enemies and repairing mechanical allies.', lore: 'Sonic\'s two-tailed fox friend, a mechanical genius who builds gadgets and flies using his tails.', ascensionLevel: 0 },
  { id: 198, name: 'Knuckles the Echidna', level: 0, baseDps: 280, baseCost: 12500, upgradeCostMultiplier: 1.25, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Digs underground and surfaces beneath enemies, dealing damage and stunning them.', lore: 'The guardian of the Master Emerald, with powerful fists that can break through anything.', ascensionLevel: 0 },
  { id: 199, name: 'Street Fighter Akuma', level: 0, baseDps: 600, baseCost: 35000, upgradeCostMultiplier: 1.30, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Performs the Raging Demon, dealing massive instant damage to a single enemy.', lore: 'The ultimate martial arts master, seeking worthy opponents to test his deadly Satsui no Hado.', ascensionLevel: 0 },
  { id: 200, name: 'Mortal Kombat Scorpion', level: 0, baseDps: 380, baseCost: 16000, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Throws his spear to pull enemies close, then performs a devastating combo.', lore: 'GET OVER HERE! A spectre from the Netherrealm seeking revenge for his death and his clan.', ascensionLevel: 0 },
  { id: 201, name: 'Sub-Zero', level: 0, baseDps: 370, baseCost: 15500, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Controller', skillDescription: 'Freezes enemies solid with his ice blast, making them vulnerable to shatter damage.', lore: 'A cryomancer from the Lin Kuei clan, mastering the art of ice manipulation in combat.', ascensionLevel: 0 },
  { id: 202, name: 'Resident Evil S.T.A.R.S.', level: 0, baseDps: 150, baseCost: 7000, upgradeCostMultiplier: 1.24, rarity: 'Epic', role: 'Marksman', skillDescription: 'Fires a shotgun with a chance to blow off limbs, reducing enemy effectiveness.', lore: 'A special forces operative investigating a mysterious mansion filled with biological horrors.', ascensionLevel: 0 },
  { id: 203, name: 'Nemesis', level: 0, baseDps: 750, baseCost: 44000, upgradeCostMultiplier: 1.31, rarity: 'Legendary', role: 'Tank', skillDescription: 'Pursues a single target relentlessly, dealing increasing damage the longer he chases them.', lore: 'STARS! A bio-organic weapon programmed to eliminate specific targets, armed with a rocket launcher.', ascensionLevel: 0 },
  { id: 204, name: 'Tomb Raider but Classic', level: 0, baseDps: 130, baseCost: 6000, upgradeCostMultiplier: 1.23, rarity: 'Epic', role: 'Marksman', skillDescription: 'Uses grappling hook to reach vantage points, gaining increased critical hit chance.', lore: 'The original polygon adventurer, exploring ancient ruins with her trademark dual pistols.', ascensionLevel: 0 },
  { id: 205, name: 'Crash Bandicoot', level: 0, baseDps: 160, baseCost: 7500, upgradeCostMultiplier: 1.24, rarity: 'Epic', role: 'Bruiser', skillDescription: 'Spins like a tornado, damaging all nearby enemies and deflecting projectiles.', lore: 'A genetically enhanced bandicoot created by Dr. Cortex, now fighting against his creator.', ascensionLevel: 0 },
  { id: 206, name: 'Spyro the Dragon', level: 0, baseDps: 220, baseCost: 10500, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Mage', skillDescription: 'Breathes fire in a cone, damaging all enemies in front and setting them ablaze.', lore: 'A young purple dragon from the Dragon Realms, collecting gems and freeing his fellow dragons.', ascensionLevel: 0 },
  { id: 207, name: 'Tony Hawk', level: 0, baseDps: 90, baseCost: 4200, upgradeCostMultiplier: 1.22, rarity: 'Epic', role: 'Support', skillDescription: 'Performs a special trick that generates bonus gold based on combo multiplier.', lore: 'A legendary skateboarder from the late 90s, grinding rails and pulling off impossible tricks.', ascensionLevel: 0 },
  { id: 208, name: 'Parappa the Rapper', level: 0, baseDps: 40, baseCost: 950, upgradeCostMultiplier: 1.18, rarity: 'Rare', role: 'Support', skillDescription: 'Chants rhymes that boost the attack speed of all allies on beat.', lore: 'A paper-thin rapping dog who believes in himself and follows the rhythm to overcome challenges.', ascensionLevel: 0 },
  { id: 209, name: 'Abe from Oddworld', level: 0, baseDps: 25, baseCost: 350, upgradeCostMultiplier: 1.17, rarity: 'Rare', role: 'Controller', skillDescription: 'Possesses enemies, turning them to fight on your side for a limited time.', lore: 'A Mudokon slave who discovers his psychic powers and leads a revolution against his captors.', ascensionLevel: 0 },
  { id: 210, name: 'Earthworm Jim', level: 0, baseDps: 200, baseCost: 9500, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Marksman', skillDescription: 'Uses his plasma blaster or whips with his own head as a weapon.', lore: 'An ordinary earthworm who donned a super-powered robotic suit, now having surreal adventures across the galaxy.', ascensionLevel: 0 },
  { id: 211, name: 'Duke Nukem', level: 0, baseDps: 300, baseCost: 13500, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'DPS', skillDescription: 'Uses a shrink ray to miniaturize enemies, making them take more damage.', lore: 'The iconic action hero who blows up aliens and makes one-liners. Hail to the king, baby.', ascensionLevel: 0 },
  { id: 212, name: 'Samus Aran (Varia Suit)', level: 0, baseDps: 450, baseCost: 21000, upgradeCostMultiplier: 1.28, rarity: 'Legendary', role: 'Marksman', skillDescription: 'Activates Screw Attack, becoming invulnerable while dealing damage to touched enemies.', lore: 'The legendary bounty hunter in her powered armor, equipped with missiles, bombs, and beam weapons.', ascensionLevel: 0 },
  { id: 213, name: 'Kirby', level: 0, baseDps: 120, baseCost: 5500, upgradeCostMultiplier: 1.23, rarity: 'Epic', role: 'Controller', skillDescription: 'Inhales enemies to copy their abilities, gaining new attack patterns temporarily.', lore: 'A pink puffball from Dream Land who can inhale enemies and copy their powers.', ascensionLevel: 0 },
  { id: 214, name: 'King Dedede', level: 0, baseDps: 320, baseCost: 14000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Hammers enemies into the ground, stunning them and dealing area damage.', lore: 'The self-proclaimed king of Dream Land, often causing trouble but sometimes helping Kirby.', ascensionLevel: 0 },
  { id: 215, name: 'Fox McCloud', level: 0, baseDps: 280, baseCost: 12500, upgradeCostMultiplier: 1.25, rarity: 'Legendary', role: 'Marksman', skillDescription: 'Performs a barrel roll to evade attacks, then counterattacks with lasers.', lore: 'Leader of the Star Fox team, piloting an Arwing to defend the Lylat system from Andross.', ascensionLevel: 0 },
  { id: 216, name: 'Link (The Hero of Time)', level: 0, baseDps: 250, baseCost: 11500, upgradeCostMultiplier: 1.25, rarity: 'Legendary', role: 'DPS', skillDescription: 'Uses the Spin Attack, damaging all nearby enemies with his Master Sword.', lore: 'The chosen hero of Hyrule, wielding the Master Sword and the Triforce of Courage against Ganondorf.', ascensionLevel: 0 },
  { id: 217, name: 'Princess Zelda', level: 0, baseDps: 180, baseCost: 8500, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Mage', skillDescription: 'Casts Light Arrows that pierce through enemies and reveal hidden weaknesses.', lore: 'The princess of Hyrule and bearer of the Triforce of Wisdom, with powerful magical abilities.', ascensionLevel: 0 },
  { id: 218, name: 'Ganondorf', level: 0, baseDps: 800, baseCost: 48000, upgradeCostMultiplier: 1.32, rarity: 'Mythic', role: 'Démoniste', skillDescription: 'Channels dark magic to deal massive damage and temporarily control an enemy.', lore: 'The King of the Gerudo and bearer of the Triforce of Power, seeking to conquer Hyrule.', ascensionLevel: 0 },
  { id: 219, name: 'Pokémon Trainer', level: 0, baseDps: 160, baseCost: 7500, upgradeCostMultiplier: 1.24, rarity: 'Epic', role: 'Summoner', skillDescription: 'Sends out different Pokémon to fight, each with unique elemental attacks.', lore: 'A young trainer from Pallet Town, on a journey to become a Pokémon Master.', ascensionLevel: 0 },
  { id: 220, name: 'Pikachu', level: 0, baseDps: 140, baseCost: 6500, upgradeCostMultiplier: 1.23, rarity: 'Epic', role: 'Mage', skillDescription: 'Uses Thunderbolt, dealing electric damage that can chain to nearby enemies.', lore: 'An Electric-type Pokémon, the iconic mascot and faithful companion to Ash Ketchum.', ascensionLevel: 0 },
  { id: 221, name: 'Mewtwo', level: 0, baseDps: 900, baseCost: 55000, upgradeCostMultiplier: 1.33, rarity: 'Mythic', role: 'Mage', skillDescription: 'Uses Psystrike, dealing massive psychic damage that ignores defense.', lore: 'A genetically engineered Psychic-type Pokémon, created from Mew\'s DNA and seeking meaning in its existence.', ascensionLevel: 0 },
  { id: 222, name: 'Cloud Strife', level: 0, baseDps: 500, baseCost: 25000, upgradeCostMultiplier: 1.29, rarity: 'Legendary', role: 'DPS', skillDescription: 'Performs Omnislash, a series of rapid sword strikes on a single target.', lore: 'A former SOLDIER turned mercenary, wielding the massive Buster Sword and fighting against Shinra.', ascensionLevel: 0 },
  { id: 223, name: 'Sephiroth', level: 0, baseDps: 1200, baseCost: 80000, upgradeCostMultiplier: 1.34, rarity: 'Mythic', role: 'Assassin', skillDescription: 'Casts Supernova, dealing catastrophic damage to all enemies.', lore: 'The One-Winged Angel, a former war hero now seeking to become a god and destroy the planet.', ascensionLevel: 0 },
  { id: 224, name: 'Solid Snake', level: 0, baseDps: 220, baseCost: 10500, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Assassin', skillDescription: 'Uses stealth camouflage to become invisible, then performs CQC takedowns.', lore: 'A legendary special forces operative, infiltrating enemy bases and preventing nuclear threats.', ascensionLevel: 0 },
  { id: 225, name: 'Lara Croft (Classic)', level: 0, baseDps: 130, baseCost: 6000, upgradeCostMultiplier: 1.23, rarity: 'Epic', role: 'Marksman', skillDescription: 'Performs acrobatic flips while firing dual pistols, gaining evasion during the move.', lore: 'The original tomb raider with polygon graphics, exploring ancient ruins and collecting artifacts.', ascensionLevel: 0 },
  { id: 226, name: 'Rayman', level: 0, baseDps: 170, baseCost: 8000, upgradeCostMultiplier: 1.24, rarity: 'Epic', role: 'Bruiser', skillDescription: 'Uses his detached fists to punch enemies from a distance.', lore: 'A limbless hero from the Glade of Dreams, using his floating hands and feet to battle evil.', ascensionLevel: 0 },
  { id: 227, name: 'Glover', level: 0, baseDps: 110, baseCost: 5200, upgradeCostMultiplier: 1.23, rarity: 'Epic', role: 'Controller', skillDescription: 'Throws and catches his magic ball, which bounces between enemies dealing damage.', lore: 'A magical glove who must restore the Crystal Kingdom after a alchemy experiment gone wrong.', ascensionLevel: 0 },
  { id: 228, name: 'Banjo-Kazooie', level: 0, baseDps: 240, baseCost: 11500, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'DPS', skillDescription: 'Uses egg-firing and forward roll attacks to damage multiple enemies.', lore: 'A bear and bird duo on a quest to rescue Banjo\'s sister from the witch Gruntilda.', ascensionLevel: 0 },
  { id: 229, name: 'Conker the Squirrel', level: 0, baseDps: 190, baseCost: 9000, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Marksman', skillDescription: 'Uses a slingshot or money as throwing weapons, with random critical hit chance based on luck.', lore: 'A hungover squirrel thrust into bizarre adventures in a world not suitable for younger players.', ascensionLevel: 0 },
  { id: 230, name: 'Master Chief', level: 0, baseDps: 400, baseCost: 18000, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Tank', skillDescription: 'Activates overshield, becoming nearly invulnerable for a short duration.', lore: 'A cybernetically enhanced supersoldier, the last Spartan-II defending humanity from the Covenant.', ascensionLevel: 0 },
  { id: 231, name: 'Arbiter', level: 0, baseDps: 380, baseCost: 16000, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Uses active camouflage and energy sword for deadly stealth kills.', lore: 'A disgraced Sangheili commander who becomes a key ally to humanity in the war against the Flood.', ascensionLevel: 0 },
  { id: 232, name: 'Gordon Freeman', level: 0, baseDps: 350, baseCost: 15000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'DPS', skillDescription: 'Uses the Gravity Gun to pick up objects and enemies, throwing them for massive damage.', lore: 'The silent theoretical physicist turned resistance fighter against an alien invasion.', ascensionLevel: 0 },
  { id: 233, name: 'Kratos (Classic)', level: 0, baseDps: 600, baseCost: 35000, upgradeCostMultiplier: 1.30, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Unleashes the Army of Sparta, summoning ghostly soldiers to attack enemies.', lore: 'The Ghost of Sparta from Greek mythology, seeking vengeance against the gods of Olympus.', ascensionLevel: 0 },
  { id: 234, name: 'Crash Bandicoot (Cortex)', level: 0, baseDps: 420, baseCost: 19000, upgradeCostMultiplier: 1.28, rarity: 'Legendary', role: 'Mage', skillDescription: 'Fires energy beams from his cortex vortex, dealing damage and shrinking enemies.', lore: 'The evil genius who created Crash Bandicoot, constantly scheming to conquer the world.', ascensionLevel: 0 },
  { id: 235, name: 'Spyro (Ripto)', level: 0, baseDps: 450, baseCost: 21000, upgradeCostMultiplier: 1.28, rarity: 'Legendary', role: 'Mage', skillDescription: 'Summons minions and casts powerful elemental spells to overwhelm enemies.', lore: 'A tyrannical sorcerer from Avalar, obsessed with power and ruling over dragon realms.', ascensionLevel: 0 },
  { id: 236, name: 'Heihachi Mishima', level: 0, baseDps: 400, baseCost: 18000, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Performs the Electric Wind God Fist, stunning enemies and dealing heavy damage.', lore: 'The ruthless patriarch of the Mishima family, master of the Devil Gene and head of the Mishima Zaibatsu.', ascensionLevel: 0 },
  { id: 237, name: 'Nightmare (Soulcalibur)', level: 0, baseDps: 550, baseCost: 28000, upgradeCostMultiplier: 1.30, rarity: 'Legendary', role: 'Tank', skillDescription: 'Wields the cursed sword Soul Edge, dealing damage that steals health from enemies.', lore: 'The Azure Knight possessed by the evil sword Soul Edge, spreading chaos and destruction.', ascensionLevel: 0 },
  { id: 238, name: 'Jill Valentine', level: 0, baseDps: 180, baseCost: 8500, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Marksman', skillDescription: 'Uses her lockpick to disable enemy defenses, increasing damage they take.', lore: 'A S.T.A.R.S. member and master of unlocking, surviving the horrors of Raccoon City.', ascensionLevel: 0 },
  { id: 239, name: 'Leon S. Kennedy', level: 0, baseDps: 200, baseCost: 9500, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Marksman', skillDescription: 'Performs a suplex or roundhouse kick on stunned enemies, dealing massive damage.', lore: 'A rookie police officer on his first day, thrown into a zombie-infested nightmare.', ascensionLevel: 0 },
  { id: 240, name: 'Wesker', level: 0, baseDps: 700, baseCost: 42000, upgradeCostMultiplier: 1.31, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Uses superhuman speed to dash through enemies, dealing damage and applying a virus debuff.', lore: 'The former S.T.A.R.S. captain turned bioterrorist, enhanced by the prototype virus.', ascensionLevel: 0 },
  { id: 241, name: 'Tifa Lockhart', level: 0, baseDps: 280, baseCost: 12500, upgradeCostMultiplier: 1.25, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Builds up Limit Break, then unleashes a devastating martial arts combo.', lore: 'A martial artist and bartender, member of AVALANCHE fighting against the Shinra Corporation.', ascensionLevel: 0 },
  { id: 242, name: 'Aerith Gainsborough', level: 0, baseDps: 120, baseCost: 5500, upgradeCostMultiplier: 1.23, rarity: 'Epic', role: 'Healer', skillDescription: 'Casts Healing Wind, restoring health to all allies and providing a protective barrier.', lore: 'The last of the Cetra, a flower seller with powerful white magic abilities.', ascensionLevel: 0 },
  { id: 243, name: 'Vincent Valentine', level: 0, baseDps: 350, baseCost: 15000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Transforms into Chaos, gaining new powerful attacks and lifesteal.', lore: 'A former Turk experimented on by Hojo, now a vampire-like gunslinger with a tragic past.', ascensionLevel: 0 },
  { id: 244, name: 'Yoshi', level: 0, baseDps: 150, baseCost: 7000, upgradeCostMultiplier: 1.24, rarity: 'Epic', role: 'Support', skillDescription: 'Swallows enemies and lays them as eggs, which can be thrown for damage.', lore: 'A friendly dinosaur from the Mushroom Kingdom, often serving as Mario\'s trusted steed.', ascensionLevel: 0 },
  { id: 245, name: 'Wario', level: 0, baseDps: 320, baseCost: 14000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Shoulder charges through enemies, dealing damage and collecting any coins they drop.', lore: 'Mario\'s greedy rival, obsessed with treasure and creating his own game empire.', ascensionLevel: 0 },
  { id: 246, name: 'Luigi', level: 0, baseDps: 140, baseCost: 6500, upgradeCostMultiplier: 1.23, rarity: 'Epic', role: 'Support', skillDescription: 'Uses the Poltergust to vacuum up enemies, then slams them for area damage.', lore: 'Mario\'s taller, greener brother, often overshadowed but brave when it counts.', ascensionLevel: 0 },
  { id: 247, name: 'Princess Peach', level: 0, baseDps: 100, baseCost: 5000, upgradeCostMultiplier: 1.22, rarity: 'Epic', role: 'Healer', skillDescription: 'Uses her parasol to float above danger and heal nearby allies with royal magic.', lore: 'The frequently kidnapped ruler of the Mushroom Kingdom, with hidden resilience and power.', ascensionLevel: 0 },
  { id: 248, name: 'Bowser', level: 0, baseDps: 600, baseCost: 35000, upgradeCostMultiplier: 1.30, rarity: 'Legendary', role: 'Tank', skillDescription: 'Breathes fire in a wide arc and uses his spiked shell to reflect projectiles.', lore: 'The King of the Koopas, constantly scheming to kidnap Princess Peach and defeat Mario.', ascensionLevel: 0 },
  { id: 249, name: 'M. Bison', level: 0, baseDps: 650, baseCost: 38000, upgradeCostMultiplier: 1.31, rarity: 'Legendary', role: 'Démoniste', skillDescription: 'Floats in the air and unleashes Psycho Crusher, dashing through all enemies.', lore: 'The dictator of Shadowloo, using psycho power to achieve world domination.', ascensionLevel: 0 },
  { id: 250, name: 'Chun-Li (Alpha)', level: 0, baseDps: 320, baseCost: 14000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Performs the Kikosho, a massive energy blast that damages all enemies in a line.', lore: 'The strongest woman in the world, using her lightning kicks to fight for justice.', ascensionLevel: 0 },
  { id: 251, name: 'Ryu (Evil)', level: 0, baseDps: 550, baseCost: 28000, upgradeCostMultiplier: 1.30, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Enters the Satsui no Hado state, gaining increased damage and new deadly techniques.', lore: 'The wandering warrior corrupted by the murderous intent within his fighting style.', ascensionLevel: 0 },
  { id: 252, name: 'Zero (Mega Man X)', level: 0, baseDps: 450, baseCost: 21000, upgradeCostMultiplier: 1.28, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Uses his Z-Saber to perform rapid slashes, dealing massive damage to a single target.', lore: 'A reploid and former Maverick Hunter, wielding a lightsaber-like weapon with incredible skill.', ascensionLevel: 0 },
  { id: 253, name: 'Dr. Wily', level: 0, baseDps: 300, baseCost: 13500, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Controller', skillDescription: 'Deploys a custom robot master to fight for him, each with unique abilities.', lore: 'Mega Man\'s arch-nemesis, a mad scientist constantly building evil robots to conquer the world.', ascensionLevel: 0 },
  { id: 254, name: 'Sagat', level: 0, baseDps: 420, baseCost: 19000, upgradeCostMultiplier: 1.28, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Fires a high-damage Tiger Shot projectile or performs the Tiger Uppercut.', lore: 'The Emperor of Muay Thai, seeking redemption after his defeat by Ryu.', ascensionLevel: 0 },
  { id: 255, name: 'Guile', level: 0, baseDps: 380, baseCost: 16000, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Controller', skillDescription: 'Uses Sonic Boom to control space and Flash Kick to anti-air approaching enemies.', lore: 'An American Air Force major, fighting to avenge his friend Charlie.', ascensionLevel: 0 },
  { id: 256, name: 'Vega', level: 0, baseDps: 350, baseCost: 15000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Uses his claw and wall jumps to attack from unexpected angles.', lore: 'A Spanish matador and narcissistic fighter who wears a mask to protect his beauty.', ascensionLevel: 0 },
  { id: 257, name: 'Blanka', level: 0, baseDps: 320, baseCost: 14000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Turns into an electric ball and rolls through enemies, shocking them.', lore: 'A feral green beast-man from Brazil, able to generate electricity from his body.', ascensionLevel: 0 },
  { id: 258, name: 'E. Honda', level: 0, baseDps: 400, baseCost: 18000, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Tank', skillDescription: 'Performs the Hundred Hand Slap, a rapid series of palm strikes that push enemies back.', lore: 'A sumo wrestler fighting to prove sumo is the greatest martial art in the world.', ascensionLevel: 0 },
  { id: 259, name: 'Dhalsim', level: 0, baseDps: 300, baseCost: 13500, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Mage', skillDescription: 'Stretches his limbs to attack from distance and breathes Yoga Fire projectiles.', lore: 'A yogi from India who fights to raise money for his village.', ascensionLevel: 0 },
  { id: 260, name: 'Zangief', level: 0, baseDps: 500, baseCost: 25000, upgradeCostMultiplier: 1.29, rarity: 'Legendary', role: 'Tank', skillDescription: 'Performs the Spinning Piledriver, grabbing and slamming enemies for massive damage.', lore: 'The Red Cyclone, a Russian wrestler who fights for the glory of his homeland.', ascensionLevel: 0 },
  { id: 261, name: 'Balrog', level: 0, baseDps: 420, baseCost: 19000, upgradeCostMultiplier: 1.28, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Charges forward with a devastating punch that can break through guards.', lore: 'A boxer from the USA who fights for money and fame.', ascensionLevel: 0 },
  { id: 262, name: 'Psycho Mantis', level: 0, baseDps: 450, baseCost: 21000, upgradeCostMultiplier: 1.28, rarity: 'Legendary', role: 'Mage', skillDescription: 'Reads the enemy\'s moves and counters them before they can attack.', lore: 'A psychic who can read minds and move objects with telekinesis.', ascensionLevel: 0 },
  { id: 263, name: 'Revolver Ocelot', level: 0, baseDps: 380, baseCost: 16000, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Marksman', skillDescription: 'Fires his revolvers with incredible accuracy, able to ricochet bullets off surfaces.', lore: 'A legendary gunslinger and triple agent with a complex loyalty web.', ascensionLevel: 0 },
  { id: 264, name: 'Gray Fox', level: 0, baseDps: 550, baseCost: 28000, upgradeCostMultiplier: 1.30, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Uses high-frequency blade to cut through anything and moves at blinding speed.', lore: 'A cyborg ninja and former special forces operative, struggling with his humanity.', ascensionLevel: 0 },
  { id: 265, name: 'Liquid Snake', level: 0, baseDps: 500, baseCost: 25000, upgradeCostMultiplier: 1.29, rarity: 'Legendary', role: 'Controller', skillDescription: 'Takes control of enemy vehicles or troops temporarily.', lore: 'Solid Snake\'s twin brother, leader of FOXHOUND seeking to surpass his "father".', ascensionLevel: 0 },
  { id: 266, name: 'Sniper Wolf', level: 0, baseDps: 400, baseCost: 18000, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Marksman', skillDescription: 'Takes a single shot that deals massive damage to the weakest enemy.', lore: 'A legendary sniper and member of FOXHOUND, with a tragic past and unmatched skill.', ascensionLevel: 0 },
  { id: 267, name: 'Vulcan Raven', level: 0, baseDps: 600, baseCost: 35000, upgradeCostMultiplier: 1.30, rarity: 'Legendary', role: 'Tank', skillDescription: 'Uses a minigun to suppress enemies and a tribal mask for spiritual protection.', lore: 'A shaman and warrior of immense size and strength, serving FOXHOUND.', ascensionLevel: 0 },
  { id: 268, name: 'Decapre', level: 0, baseDps: 350, baseCost: 15000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Uses her clawed gauntlets for rapid strikes and teleportation moves.', lore: 'One of M. Bison\'s Dolls, a cybernetically enhanced assassin with a connection to Cammy.', ascensionLevel: 0 },
  { id: 269, name: 'Juri Han', level: 0, baseDps: 420, baseCost: 19000, upgradeCostMultiplier: 1.28, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Stores energy in her Feng Shui Engine to enhance her special moves.', lore: 'A sadistic taekwondo fighter from South Korea seeking revenge against M. Bison.', ascensionLevel: 0 },
  { id: 270, name: 'C. Viper', level: 0, baseDps: 380, baseCost: 16000, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Controller', skillDescription: 'Uses high-tech gadgets like her Thunder Knuckle and Seismic Hammer.', lore: 'An undercover agent for the NSA, using advanced battle suit technology.', ascensionLevel: 0 },
  { id: 271, name: 'Seth', level: 0, baseDps: 700, baseCost: 42000, upgradeCostMultiplier: 1.31, rarity: 'Legendary', role: 'Controller', skillDescription: 'Copies the abilities of other heroes temporarily, adapting to any situation.', lore: 'The director of S.I.N. and a perfect being created to absorb others\' fighting techniques.', ascensionLevel: 0 },
  { id: 272, name: 'Gill', level: 0, baseDps: 800, baseCost: 48000, upgradeCostMultiplier: 1.32, rarity: 'Mythic', role: 'Mage', skillDescription: 'Resurrects once per battle with full health when defeated.', lore: 'The leader of the Secret Society, believed to be a god with control over fire and ice.', ascensionLevel: 0 },
  { id: 273, name: 'Urien', level: 0, baseDps: 650, baseCost: 38000, upgradeCostMultiplier: 1.31, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Uses Aegis Reflector to create mirrors that reflect projectiles and damage enemies.', lore: 'Gill\'s younger brother, seeking to overthrow him and claim leadership of the Secret Society.', ascensionLevel: 0 },
  { id: 274, name: 'Necro', level: 0, baseDps: 320, baseCost: 14000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Controller', skillDescription: 'Stretches his elastic body to attack from unusual angles and electrocute enemies.', lore: 'A victim of Shadaloo experimentation, given elastic limbs and electrical powers.', ascensionLevel: 0 },
  { id: 275, name: 'Twelve', level: 0, baseDps: 300, baseCost: 13500, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Shapeshifts to mimic enemy appearances and attacks briefly.', lore: 'A mysterious biological weapon created by Gill, capable of cellular mimicry.', ascensionLevel: 0 },
  { id: 276, name: 'Q', level: 0, baseDps: 400, baseCost: 18000, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Tank', skillDescription: 'Has high defense and a mysterious aura that reduces damage from all sources.', lore: 'An enigmatic fighter in a trench coat and metal mask, with unknown motives.', ascensionLevel: 0 },
  { id: 277, name: 'Hugo', level: 0, baseDps: 600, baseCost: 35000, upgradeCostMultiplier: 1.30, rarity: 'Legendary', role: 'Tank', skillDescription: 'Uses his massive size to grab and throw enemies, dealing area damage.', lore: 'A German wrestler of enormous stature, fighting to become the strongest in the world.', ascensionLevel: 0 },
  { id: 278, name: 'Remy', level: 0, baseDps: 350, baseCost: 15000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Mage', skillDescription: 'Uses elegant fencing techniques combined with blue energy projectiles.', lore: 'A French fighter who uses a unique style combining savate fencing with psycho power.', ascensionLevel: 0 },
  { id: 279, name: 'Sean', level: 0, baseDps: 280, baseCost: 12500, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Bruiser', skillDescription: 'Uses a basketball-inspired fighting style with powerful dunk attacks.', lore: 'Ryu\'s Brazilian student, developing his own style based on his mentor\'s teachings.', ascensionLevel: 0 },
  { id: 280, name: 'Elena', level: 0, baseDps: 320, baseCost: 14000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Healer', skillDescription: 'Uses capoeira moves that heal herself and nearby allies with each hit.', lore: 'A cheerful fighter from Kenya who uses a unique healing capoeira style.', ascensionLevel: 0 },
  { id: 281, name: 'Oro', level: 0, baseDps: 700, baseCost: 42000, upgradeCostMultiplier: 1.31, rarity: 'Mythic', role: 'Mage', skillDescription: 'Fights with one arm behind his back, yet still deals immense damage with spiritual energy.', lore: 'A hermit martial artist seeking a worthy successor to his techniques.', ascensionLevel: 0 },
  { id: 282, name: 'Ingrid', level: 0, baseDps: 500, baseCost: 25000, upgradeCostMultiplier: 1.29, rarity: 'Legendary', role: 'Mage', skillDescription: 'Uses angelic powers to purify enemies, dealing extra damage to dark-aligned foes.', lore: 'An angelic being from Capcom Fighting Evolution, with connections to the Street Fighter universe.', ascensionLevel: 0 },
  { id: 283, name: 'Skullomania', level: 0, baseDps: 250, baseCost: 11500, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Support', skillDescription: 'Inspires allies with his heroic poses, increasing their attack speed.', lore: 'A salaryman who becomes a superhero in his spare time, fighting for justice.', ascensionLevel: 0 },
  { id: 284, name: 'Dudley', level: 0, baseDps: 420, baseCost: 19000, upgradeCostMultiplier: 1.28, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Uses precise boxing techniques with rose-throwing flair for critical hits.', lore: 'A British gentleman boxer who fights with elegance and precision.', ascensionLevel: 0 },
  { id: 285, name: 'Makoto', level: 0, baseDps: 450, baseCost: 21000, upgradeCostMultiplier: 1.28, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Delivers powerful, slow strikes that deal massive damage and stun enemies.', lore: 'A serious-minded karate practitioner seeking to restore her dojo\'s reputation.', ascensionLevel: 0 },
  { id: 286, name: 'Ibuki', level: 0, baseDps: 380, baseCost: 16000, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Uses ninjutsu techniques including kunai throws and teleportation.', lore: 'A high school ninja balancing her studies with her clan\'s traditions.', ascensionLevel: 0 },
  { id: 287, name: 'Alex', level: 0, baseDps: 500, baseCost: 25000, upgradeCostMultiplier: 1.29, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Uses wrestling moves and powerful strikes with his massive frame.', lore: 'A wrestler from New York seeking to become the strongest fighter.', ascensionLevel: 0 },
  { id: 288, name: 'R. Mika', level: 0, baseDps: 350, baseCost: 15000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Support', skillDescription: 'Tags in her partner Yamato for dual wrestling attacks.', lore: 'A cheerful professional wrestler who fights to entertain her fans.', ascensionLevel: 0 },
  { id: 289, name: 'Karin', level: 0, baseDps: 320, baseCost: 14000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Uses the Kanzuki-ryu style with precise counters and multi-hit combos.', lore: 'The wealthy heiress of the Kanzuki family, seeking to prove her style\'s superiority.', ascensionLevel: 0 },
  { id: 290, name: 'Nash', level: 0, baseDps: 400, baseCost: 18000, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Uses sonic boom and somersault shell special moves with military precision.', lore: 'A former ally of Guile, resurrected as a cyber-enhanced soldier.', ascensionLevel: 0 },
  { id: 291, name: 'Karin (Alpha)', level: 0, baseDps: 280, baseCost: 12500, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Bruiser', skillDescription: 'Uses her family\'s traditional martial arts with elegant yet powerful strikes.', lore: 'The rival of Sakura, constantly seeking to prove her style is superior.', ascensionLevel: 0 },
  { id: 292, name: 'Sakura', level: 0, baseDps: 300, baseCost: 13500, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Uses a schoolgirl version of Ryu\'s fighting style with her own energetic flair.', lore: 'Ryu\'s biggest fan, who taught herself to fight by watching his matches.', ascensionLevel: 0 },
  { id: 293, name: 'Dan', level: 0, baseDps: 100, baseCost: 5000, upgradeCostMultiplier: 1.22, rarity: 'Epic', role: 'Support', skillDescription: 'Taunts enemies, lowering their defense and making them vulnerable.', lore: 'A joke character who created his own ineffective fighting style.', ascensionLevel: 0 },
  { id: 294, name: 'Rose', level: 0, baseDps: 350, baseCost: 15000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Mage', skillDescription: 'Uses tarot cards and soul power to predict and counter enemy attacks.', lore: 'A fortune teller with soul power, fighting against M. Bison\'s evil influence.', ascensionLevel: 0 },
  { id: 295, name: 'Gen', level: 0, baseDps: 450, baseCost: 21000, upgradeCostMultiplier: 1.28, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Switches between Mantis and Crane styles for different attack patterns.', lore: 'An elderly assassin seeking a worthy opponent to give him a glorious death.', ascensionLevel: 0 },
  { id: 296, name: 'Sodom', level: 0, baseDps: 380, baseCost: 16000, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Tank', skillDescription: 'Uses Japanese weapons and armor despite being American, with slow but powerful attacks.', lore: 'An American who idolizes Japanese culture, leading the Mad Gear gang.', ascensionLevel: 0 },
  { id: 297, name: 'Birdie', level: 0, baseDps: 420, baseCost: 19000, upgradeCostMultiplier: 1.28, rarity: 'Legendary', role: 'Tank', skillDescription: 'Uses a chain and his massive strength to control space and punish enemies.', lore: 'A former member of Shadaloo who now fights for himself.', ascensionLevel: 0 },
  { id: 298, name: 'Adon', level: 0, baseDps: 320, baseCost: 14000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Uses Muay Thai techniques with arrogant showmanship for critical hits.', lore: 'Sagat\'s former student, now seeking to surpass his master.', ascensionLevel: 0 },
  { id: 299, name: 'Cody', level: 0, baseDps: 350, baseCost: 15000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Fights with street brawling techniques and can pick up weapons from the ground.', lore: 'The mayor of Metro City who secretly longs for his days as a street fighter.', ascensionLevel: 0 },
  { id: 300, name: 'Guy', level: 0, baseDps: 380, baseCost: 16000, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Uses Bushinryu ninjutsu with quick, fluid movements and multi-hit combos.', lore: 'A modern-day ninja and master of Bushinryu, fighting to protect justice.', ascensionLevel: 0 },
  { id: 301, name: 'Maki', level: 0, baseDps: 320, baseCost: 14000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Uses twin tonfa and agile movements for rapid strikes.', lore: 'Guy\'s childhood friend and fellow Bushinryu practitioner.', ascensionLevel: 0 },
  { id: 302, name: 'Dean', level: 0, baseDps: 280, baseCost: 12500, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Marksman', skillDescription: 'Uses a variety of firearms with tactical precision and explosive rounds.', lore: 'A mercenary with military training, expert in various firearms.', ascensionLevel: 0 },
  { id: 303, name: 'Captain Commando', level: 0, baseDps: 400, baseCost: 18000, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Video game Hero', skillDescription: 'Uses an electrified glove and special weapons to fight futuristic crime.', lore: 'The leader of the Commando Team, fighting crime in the year 2026.', ascensionLevel: 0 },
  { id: 304, name: 'Baby Head', level: 0, baseDps: 150, baseCost: 7000, upgradeCostMultiplier: 1.24, rarity: 'Epic', role: 'Controller', skillDescription: 'Controls a mech suit with baby-like movements but devastating weapons.', lore: 'A genius baby who pilots a robotic suit to fight alongside Captain Commando.', ascensionLevel: 0 },
  { id: 305, name: 'Mack the Knife', level: 0, baseDps: 350, baseCost: 15000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Uses bladed weapons with incredible speed and precision.', lore: 'An alien ninja from the planet "Crysta", member of the Commando Team.', ascensionLevel: 0 },
  { id: 306, name: 'Ginzu the Ninja', level: 0, baseDps: 300, baseCost: 13500, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Assassin', skillDescription: 'Uses traditional ninja weapons and techniques with modern enhancements.', lore: 'A ninja from the future, fighting with high-tech shuriken and blades.', ascensionLevel: 0 },
  { id: 307, name: 'Bred', level: 0, baseDps: 250, baseCost: 11500, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Marksman', skillDescription: 'Uses a laser whip and blaster for both melee and ranged attacks.', lore: 'A reptilian alien and skilled hunter, tracking the most dangerous prey.', ascensionLevel: 0 },
  { id: 308, name: 'Sledge', level: 0, baseDps: 500, baseCost: 25000, upgradeCostMultiplier: 1.29, rarity: 'Legendary', role: 'Tank', skillDescription: 'Uses a massive hammer and his own brute strength to crush enemies.', lore: 'A mutant with superhuman strength, using a giant hammer as his weapon.', ascensionLevel: 0 },
  { id: 309, name: 'Blaster', level: 0, baseDps: 320, baseCost: 14000, upgradeCostMultiplier: 1.26, rarity: 'Legendary', role: 'Marksman', skillDescription: 'Uses a high-powered blaster rifle with various elemental ammunition types.', lore: 'A cyborg soldier equipped with advanced firearms and targeting systems.', ascensionLevel: 0 },
  { id: 310, name: 'The President', level: 0, baseDps: 200, baseCost: 9500, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Support', skillDescription: 'Motivates allies with speeches, increasing their damage and resilience.', lore: 'The leader of the free world, surprisingly capable in combat situations.', ascensionLevel: 0 },
  { id: 311, name: 'Baron', level: 0, baseDps: 450, baseCost: 21000, upgradeCostMultiplier: 1.28, rarity: 'Legendary', role: 'Démoniste', skillDescription: 'Uses dark magic and curses to weaken enemies and empower himself.', lore: 'A nobleman who sold his soul for dark powers, now commanding legions of the undead.', ascensionLevel: 0 },
  { id: 312, name: 'Saya', level: 0, baseDps: 280, baseCost: 12500, upgradeCostMultiplier: 1.25, rarity: 'Epic', role: 'Healer', skillDescription: 'Uses ancient healing arts combined with defensive martial techniques.', lore: 'A priestess from a hidden temple, blessed with healing powers and combat skills.', ascensionLevel: 0 },
  { id: 313, name: 'Jack', level: 0, baseDps: 380, baseCost: 16000, upgradeCostMultiplier: 1.27, rarity: 'Legendary', role: 'Bruiser', skillDescription: 'Uses cybernetic enhancements and street fighting techniques.', lore: 'A cyborg built for combat, with fragmented memories of a human past.', ascensionLevel: 0 },
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
  // Add
  { id: 4, name: 'Lucky the Leprechaun', rarity: 'Epic', bonusType: 'criticalChance', baseBonus: 0.03, bonusPerLevel: 0.003, description: 'Increases critical hit chance for all heroes.', lore: 'A mischievous little fellow who brings fortune to those who catch him.', art: ' /\\\n/  \\\n|  |\n|  |\n \\/', evolutionCostEssence: 25 },
  { id: 5, name: 'Smarty the Owl', rarity: 'Rare', bonusType: 'heroCostReduction', baseBonus: 0.015, bonusPerLevel: 0.0015, description: 'Reduces hero upgrade costs.', lore: 'Wise beyond his years, he helps you make smarter investments.', art: ' ,-,\n(0.0)\n(_)_)', evolutionCostEssence: 15 },
  { id: 6, name: 'Zippy the Zephyr', rarity: 'Legendary', bonusType: 'attackSpeed', baseBonus: 0.08, bonusPerLevel: 0.008, description: 'Increases attack speed of all heroes.', lore: 'A tiny wind spirit that whispers secrets of swift strikes to your heroes.', art: '  ~\n ( )\n  ~', evolutionCostEssence: 50 },
  { id: 7, name: 'Stony the Golem', rarity: 'Epic', bonusType: 'healthPercent', baseBonus: 0.10, bonusPerLevel: 0.01, description: 'Increases maximum health of all heroes.', lore: 'A fragment of mountain given life, it shares its sturdiness with your team.', art: ' [ ]\n[| |]\n [_]', evolutionCostEssence: 30 },
  { id: 8, name: 'Glimmer the Fairy', rarity: 'Rare', bonusType: 'skillCooldownReduction', baseBonus: 0.02, bonusPerLevel: 0.002, description: 'Reduces skill cooldown time.', lore: 'Her magical dust hastens the recovery of heroic abilities.', art: '  ^\n / \\\n(•.•)\n /|\\', evolutionCostEssence: 18 },
  { id: 9, name: 'Boomer the Bomb', rarity: 'Epic', bonusType: 'criticalDamage', baseBonus: 0.15, bonusPerLevel: 0.015, description: 'Increases critical damage multiplier.', lore: 'A volatile creature that loves explosions. Handle with care!', art: ' (*)\n( * )\n \\|/', evolutionCostEssence: 28 },
  { id: 10, name: 'Chrono the Clockwork Mouse', rarity: 'Legendary', bonusType: 'offlineEarnings', baseBonus: 0.12, bonusPerLevel: 0.012, description: 'Increases offline gold and experience earnings.', lore: 'A mechanical mouse that keeps working even when you\'re away.', art: ' [o]\n[|_|]\n / \\', evolutionCostEssence: 55 },
  { id: 11, name: 'Squishy the Slime', rarity: 'Common', bonusType: 'heroHealthRegen', baseBonus: 0.005, bonusPerLevel: 0.0005, description: 'Provides passive health regeneration to heroes.', lore: 'A gelatinous blob with surprising restorative properties.', art: '  O\n ( )\n  O', evolutionCostEssence: 8 },
  { id: 12, name: 'Whisper the Ghost', rarity: 'Rare', bonusType: 'enemyDefenseReduction', baseBonus: 0.02, bonusPerLevel: 0.002, description: 'Reduces enemy defense.', lore: 'A friendly specter that haunts your foes, making them vulnerable.', art: '  ~~\n (..)\n  ~~', evolutionCostEssence: 16 },
  { id: 13, name: 'Blinky the Star', rarity: 'Epic', bonusType: 'experienceGain', baseBonus: 0.08, bonusPerLevel: 0.008, description: 'Increases experience gain from all sources.', lore: 'A fallen star fragment that guides heroes to greater heights.', art: '  *\n / \\\n*   *', evolutionCostEssence: 32 },
  { id: 14, name: 'Rusty the Mechanical Sparrow', rarity: 'Common', bonusType: 'heroUpgradeSpeed', baseBonus: 0.01, bonusPerLevel: 0.001, description: 'Reduces time between hero upgrades.', lore: 'An old automaton that helps heroes train more efficiently.', art: ' ><\n(^^)\n/||\\', evolutionCostEssence: 10 },
  { id: 15, name: 'Sparky the Lightning Bug', rarity: 'Legendary', bonusType: 'chainLightningChance', baseBonus: 0.10, bonusPerLevel: 0.01, description: 'Gives attacks a chance to chain to nearby enemies.', lore: 'This electrified insect can arc between foes, spreading damage.', art: '  .\n ( )\n / \\', evolutionCostEssence: 60 },
  { id: 16, name: 'Pebble the Rockling', rarity: 'Common', bonusType: 'damageReduction', baseBonus: 0.01, bonusPerLevel: 0.001, description: 'Reduces damage taken by all heroes.', lore: 'A small stone creature that hardens your heroes\' resolve.', art: '  __\n /  \\\n|    |\n \\__/', evolutionCostEssence: 9 },
  { id: 17, name: 'Frosty the Snowflake', rarity: 'Epic', bonusType: 'enemySlow', baseBonus: 0.06, bonusPerLevel: 0.006, description: 'Slows enemy attack speed.', lore: 'A sentient snowflake that chills enemies to their core.', art: '  *\n /|\\\n* | *\n \\|/', evolutionCostEssence: 35 },
  { id: 18, name: 'Ember the Phoenix Chick', rarity: 'Mythic', bonusType: 'rebirthChance', baseBonus: 0.05, bonusPerLevel: 0.005, description: 'Gives heroes a chance to resurrect upon death.', lore: 'A baby phoenix that shares its cycle of rebirth with your team.', art: '  ^\n (o)\n/   \\', evolutionCostEssence: 100 },
  { id: 19, name: 'Glim the Glowworm', rarity: 'Rare', bonusType: 'darkStageBonus', baseBonus: 0.04, bonusPerLevel: 0.004, description: 'Increases all stats during night/dark stages.', lore: 'Illuminates the path to victory when darkness falls.', art: '  o\n ( )\n  |', evolutionCostEssence: 20 },
  { id: 20, name: 'Bubbles the Seafoam', rarity: 'Common', bonusType: 'healingEffectiveness', baseBonus: 0.015, bonusPerLevel: 0.0015, description: 'Increases effectiveness of all healing.', lore: 'Ocean foam given form, with soothing properties.', art: '  O\n( O )\n ~~~', evolutionCostEssence: 12 },
  { id: 21, name: 'Zappy the Tesla Coil', rarity: 'Legendary', bonusType: 'aoeDamage', baseBonus: 0.12, bonusPerLevel: 0.012, description: 'Increases area of effect damage.', lore: 'A miniature lightning generator that amplifies explosive attacks.', art: '  |\n [ ]\n/   \\', evolutionCostEssence: 65 },
  { id: 22, name: 'Mossy the Entling', rarity: 'Epic', bonusType: 'healthOverTime', baseBonus: 0.03, bonusPerLevel: 0.003, description: 'Provides healing over time to all heroes.', lore: 'A young tree spirit that nourishes your team with life energy.', art: '  Y\n /|\\\n/ | \\', evolutionCostEssence: 38 },
  { id: 23, name: 'Cogsworth the Gear', rarity: 'Rare', bonusType: 'mechanicalHeroBoost', baseBonus: 0.05, bonusPerLevel: 0.005, description: 'Increases damage of mechanical/robot heroes.', lore: 'A sentient gear that optimizes mechanical allies.', art: ' [=]\n[ = ]\n [=]', evolutionCostEssence: 22 },
  { id: 24, name: 'Shimmer the Prism', rarity: 'Epic', bonusType: 'elementalDamage', baseBonus: 0.09, bonusPerLevel: 0.009, description: 'Increases elemental (fire, ice, lightning) damage.', lore: 'A crystal that refracts and amplifies elemental energies.', art: '  /\\\n /  \\\n/____\\', evolutionCostEssence: 40 },
  { id: 25, name: 'Pip the Pocket Dragon', rarity: 'Legendary', bonusType: 'bossDamage', baseBonus: 0.15, bonusPerLevel: 0.015, description: 'Increases damage against bosses.', lore: 'A tiny dragon with a big bite, especially against large foes.', art: '  ><\n (^^)\n/ || \\', evolutionCostEssence: 70 },
  { id: 26, name: 'Wisp the Will-o\'-the-Wisp', rarity: 'Rare', bonusType: 'movementSpeed', baseBonus: 0.03, bonusPerLevel: 0.003, description: 'Increases hero movement and attack animation speed.', lore: 'A floating light that guides your heroes to strike faster.', art: '  o\n ( )\n  O', evolutionCostEssence: 24 },
  { id: 27, name: 'Nibbles the Bookworm', rarity: 'Epic', bonusType: 'skillDamage', baseBonus: 0.10, bonusPerLevel: 0.01, description: 'Increases damage of all hero skills.', lore: 'A worm that has consumed ancient spellbooks, granting magical insight.', art: '  ~\n (o)\n ~~~', evolutionCostEssence: 42 },
  { id: 28, name: 'Thorny the Rosebud', rarity: 'Common', bonusType: 'thornsDamage', baseBonus: 0.02, bonusPerLevel: 0.002, description: 'Returns a percentage of damage taken back to attackers.', lore: 'A beautiful but prickly plant that retaliates when threatened.', art: '  @\n /|\\\n/ | \\', evolutionCostEssence: 14 },
  { id: 29, name: 'Echo the Bat', rarity: 'Rare', bonusType: 'doubleAttackChance', baseBonus: 0.025, bonusPerLevel: 0.0025, description: 'Gives attacks a chance to hit twice.', lore: 'Uses echolocation to find weak points for follow-up strikes.', art: '  /\\\n /  \\\n/    \\', evolutionCostEssence: 26 },
  { id: 30, name: 'Cinder the Ash Spirit', rarity: 'Epic', bonusType: 'burnDamage', baseBonus: 0.07, bonusPerLevel: 0.007, description: 'Adds burn damage over time to attacks.', lore: 'A being of smoldering embers that sets foes ablaze.', art: '  *\n ( )\n / \\', evolutionCostEssence: 45 },
  { id: 31, name: 'Quill the Porcupine', rarity: 'Common', bonusType: 'piercingDamage', baseBonus: 0.015, bonusPerLevel: 0.0015, description: 'Adds armor piercing to a percentage of damage.', lore: 'His sharp quills teach your heroes to strike through defenses.', art: '  ^\n / \\\n|   |\n \\ /', evolutionCostEssence: 16 },
  { id: 32, name: 'Orbit the Mini-Planet', rarity: 'Legendary', bonusType: 'gravityWell', baseBonus: 0.08, bonusPerLevel: 0.008, description: 'Pulls enemies together, making area attacks more effective.', lore: 'A tiny celestial body with its own gravitational field.', art: '  O\n(   )\n OOO', evolutionCostEssence: 75 },
  { id: 33, name: 'Dewdrop the Morning Dew', rarity: 'Rare', bonusType: 'energyRegen', baseBonus: 0.04, bonusPerLevel: 0.004, description: 'Increases energy/mana regeneration rate.', lore: 'A drop of morning dew that refreshes magical reserves.', art: '  o\n ( )\n  O', evolutionCostEssence: 28 },
  { id: 34, name: 'Glimmerdust the Pixie', rarity: 'Epic', bonusType: 'buffDuration', baseBonus: 0.12, bonusPerLevel: 0.012, description: 'Increases duration of all beneficial effects.', lore: 'Her magical dust makes positive effects last longer.', art: '  ^\n / \\\n(•.•)\n > <', evolutionCostEssence: 48 },
  { id: 35, name: 'Rumble the Earthquake Beetle', rarity: 'Legendary', bonusType: 'stunChance', baseBonus: 0.06, bonusPerLevel: 0.006, description: 'Gives attacks a chance to stun enemies.', lore: 'This beetle\'s footsteps are so heavy they can shake enemies senseless.', art: '  []\n[|  |]\n  []', evolutionCostEssence: 80 },
  { id: 36, name: 'Fizz the Bubbling Brew', rarity: 'Rare', bonusType: 'potionEffectiveness', baseBonus: 0.05, bonusPerLevel: 0.005, description: 'Increases effectiveness of all potions and consumables.', lore: 'An alchemical concoction that has gained sentience and helpfulness.', art: '  U\n ( )\n  U', evolutionCostEssence: 30 },
  { id: 37, name: 'Zephyr the Cloud', rarity: 'Common', bonusType: 'evasionChance', baseBonus: 0.01, bonusPerLevel: 0.001, description: 'Gives heroes a chance to dodge attacks.', lore: 'A fluffy cloud that obscures your heroes, making them harder to hit.', art: '  ~~\n(   )\n ~~~', evolutionCostEssence: 18 },
  { id: 38, name: 'Glint the Midas Mouse', rarity: 'Mythic', bonusType: 'goldenTaps', baseBonus: 0.10, bonusPerLevel: 0.01, description: 'Clicking has a chance to spawn gold coins.', lore: 'A mouse touched by King Midas himself, everything it touches turns to gold.', art: ' >$<\n(oo)\n/  \\', evolutionCostEssence: 120 },
  { id: 39, name: 'Coral the Sea Sprite', rarity: 'Epic', bonusType: 'aquaticHeroBoost', baseBonus: 0.11, bonusPerLevel: 0.011, description: 'Increases damage of water/ice based heroes.', lore: 'A spirit of the ocean that empowers those connected to the sea.', art: '  ^\n / \\\n(*)', evolutionCostEssence: 50 },
  { id: 40, name: 'Scorch the Salamander', rarity: 'Legendary', bonusType: 'fireDamage', baseBonus: 0.18, bonusPerLevel: 0.018, description: 'Greatly increases fire damage.', lore: 'A fire-dwelling lizard that breathes flames of empowerment.', art: '  >\n ( )\n/   \\', evolutionCostEssence: 85 },
  { id: 41, name: 'Chill the Ice Cube', rarity: 'Rare', bonusType: 'freezeChance', baseBonus: 0.035, bonusPerLevel: 0.0035, description: 'Gives attacks a chance to freeze enemies.', lore: 'A sentient ice cube that wants to share the cold.', art: '  []\n[  ]\n []', evolutionCostEssence: 32 },
  { id: 42, name: 'Static the Ball of Wool', rarity: 'Common', bonusType: 'staticCharge', baseBonus: 0.02, bonusPerLevel: 0.002, description: 'Adds small lightning damage to all attacks.', lore: 'This wool ball is constantly charged with static electricity.', art: '  O\n(   )\n O O', evolutionCostEssence: 20 },
  { id: 43, name: 'Pebble Jr.', rarity: 'Common', bonusType: 'heroArmor', baseBonus: 0.015, bonusPerLevel: 0.0015, description: 'Increases armor of all heroes.', lore: 'The offspring of Stony the Golem, already showing defensive instincts.', art: '  .\n / \\\n|   |', evolutionCostEssence: 22 },
  { id: 44, name: 'Lumen the Light Bug', rarity: 'Epic', bonusType: 'undeadDamage', baseBonus: 0.13, bonusPerLevel: 0.013, description: 'Increases damage against undead enemies.', lore: 'A bug that emits holy light, terrifying to the unholy.', art: '  *\n (o)\n / \\', evolutionCostEssence: 52 },
  { id: 45, name: 'Shadow the Cat', rarity: 'Legendary', bonusType: 'stealthCritChance', baseBonus: 0.09, bonusPerLevel: 0.009, description: 'Increases critical chance for stealth/assassin heroes.', lore: 'A black cat that moves unseen, teaching stealthy strikes.', art: '  ^ ^\n ( . . )\n  > ^ <', evolutionCostEssence: 90 },
  { id: 46, name: 'Bloom the Flower Bud', rarity: 'Rare', bonusType: 'healingOverTime', baseBonus: 0.045, bonusPerLevel: 0.0045, description: 'Provides constant healing to the lowest health hero.', lore: 'A budding flower that emits a healing aura as it blooms.', art: '  @\n /|\\\n/ | \\', evolutionCostEssence: 34 },
  { id: 47, name: 'Cog the Tiny Gear', rarity: 'Common', bonusType: 'engineerHeroBoost', baseBonus: 0.025, bonusPerLevel: 0.0025, description: 'Increases damage of engineer/mechanic heroes.', lore: 'A spare part from a giant mech, now helping smaller creations.', art: '  []\n[  ]\n []', evolutionCostEssence: 24 },
  { id: 48, name: 'Emberling', rarity: 'Rare', bonusType: 'warmthAura', baseBonus: 0.03, bonusPerLevel: 0.003, description: 'Reduces effectiveness of enemy freeze/slow effects.', lore: 'A tiny flame creature that keeps your heroes warm and agile.', art: '  ^\n ( )\n / \\', evolutionCostEssence: 36 },
  { id: 49, name: 'Droplet the Rain Spirit', rarity: 'Epic', bonusType: 'cleansingRain', baseBonus: 0.07, bonusPerLevel: 0.007, description: 'Periodically removes debuffs from your heroes.', lore: 'A gentle rain that washes away negative effects.', art: '  o\n ( )\n  O', evolutionCostEssence: 55 },
  { id: 50, name: 'Quake the Mole', rarity: 'Legendary', bonusType: 'earthquakeDamage', baseBonus: 0.14, bonusPerLevel: 0.014, description: 'Causes periodic earthquake damage to all enemies.', lore: 'This mole\'s digging causes tremors that damage foes.', art: '  oo\n (  )\n/    \\', evolutionCostEssence: 95 },
  { id: 51, name: 'Zing the Spring', rarity: 'Common', bonusType: 'bounceChance', baseBonus: 0.02, bonusPerLevel: 0.002, description: 'Gives projectiles a chance to bounce to additional enemies.', lore: 'A coiled spring that adds extra bounce to attacks.', art: '  ~~\n(   )\n ~~~', evolutionCostEssence: 26 },
  { id: 52, name: 'Flicker the Candle Flame', rarity: 'Rare', bonusType: 'lightRadius', baseBonus: 0.04, bonusPerLevel: 0.004, description: 'Increases accuracy against evasive enemies.', lore: 'A small flame that illuminates hidden foes.', art: '  |\n ( )\n  |', evolutionCostEssence: 38 },
  { id: 53, name: 'Crystal the Geode', rarity: 'Epic', bonusType: 'gemFind', baseBonus: 0.08, bonusPerLevel: 0.008, description: 'Increases chance to find gems and rare materials.', lore: 'A geode that sparkles with precious crystals inside.', art: '  /\\\n /  \\\n/____\\', evolutionCostEssence: 58 },
  { id: 54, name: 'Vortex the Tiny Tornado', rarity: 'Legendary', bonusType: 'knockbackChance', baseBonus: 0.10, bonusPerLevel: 0.01, description: 'Gives attacks a chance to knock back enemies.', lore: 'A miniature whirlwind that blows enemies away.', art: '  ~\n ( )\n  ~', evolutionCostEssence: 100 },
  { id: 55, name: 'Mistle the Parasite', rarity: 'Common', bonusType: 'lifeSteal', baseBonus: 0.01, bonusPerLevel: 0.001, description: 'Gives attacks a small life steal effect.', lore: 'A friendly parasite that teaches your heroes to drain life from foes.', art: '  ~\n (o)\n  ~', evolutionCostEssence: 28 },
  { id: 56, name: 'Fang the Baby Vampire Bat', rarity: 'Epic', bonusType: 'vampiricAura', baseBonus: 0.06, bonusPerLevel: 0.006, description: 'Increases life steal effectiveness for all heroes.', lore: 'A young vampire bat that hungers for enemy life force.', art: '  /\\\n /  \\\n/    \\', evolutionCostEssence: 60 },
  { id: 57, name: 'Nimbus the Storm Cloud', rarity: 'Mythic', bonusType: 'stormAura', baseBonus: 0.15, bonusPerLevel: 0.015, description: 'Periodically strikes random enemies with lightning.', lore: 'A cloud constantly crackling with electrical energy.', art: '  ~~\n( * )\n ~~~', evolutionCostEssence: 150 },
  { id: 58, name: 'Petal the Butterfly', rarity: 'Rare', bonusType: 'flyingHeroBoost', baseBonus: 0.05, bonusPerLevel: 0.005, description: 'Increases damage of flying/ranged heroes.', lore: 'A graceful butterfly that inspires aerial superiority.', art: '  /\\\n /  \\\n\\  /', evolutionCostEssence: 40 },
  { id: 59, name: 'Rustle the Leaf', rarity: 'Common', bonusType: 'natureDamage', baseBonus: 0.02, bonusPerLevel: 0.002, description: 'Increases nature/poison damage.', lore: 'An autumn leaf imbued with the essence of the forest.', art: '  /\\\n /  \\\n/    \\', evolutionCostEssence: 30 },
  { id: 60, name: 'Glow the Firefly', rarity: 'Rare', bonusType: 'lightDamage', baseBonus: 0.045, bonusPerLevel: 0.0045, description: 'Increases holy/light damage.', lore: 'A firefly that glows with divine light against darkness.', art: '  o\n (*)\n / \\', evolutionCostEssence: 42 },
  { id: 61, name: 'Dust Bunny', rarity: 'Common', bonusType: 'debuffDuration', baseBonus: 0.015, bonusPerLevel: 0.0015, description: 'Increases duration of enemy debuffs.', lore: 'A clump of dust that somehow makes negative effects stick longer.', art: '  O\n(   )\n O O', evolutionCostEssence: 32 },
  { id: 62, name: 'Spark Jr.', rarity: 'Rare', bonusType: 'energyDamage', baseBonus: 0.05, bonusPerLevel: 0.005, description: 'Increases energy/arcane damage.', lore: 'The offspring of Sparky, already emitting small electrical arcs.', art: '  .\n ( )\n / \\', evolutionCostEssence: 44 },
  { id: 63, name: 'Frostbite the Ice Mite', rarity: 'Epic', bonusType: 'frostAura', baseBonus: 0.09, bonusPerLevel: 0.009, description: 'Slows all enemies within range.', lore: 'A tiny insect that emits intense cold from its body.', art: '  *\n (o)\n / \\', evolutionCostEssence: 65 },
  { id: 64, name: 'Inferno the Matchstick', rarity: 'Legendary', bonusType: 'igniteChance', baseBonus: 0.12, bonusPerLevel: 0.012, description: 'Greatly increases chance to ignite enemies.', lore: 'A match that never goes out, constantly setting things ablaze.', art: '  |\n ( )\n  |', evolutionCostEssence: 105 },
  { id: 65, name: 'Magnet the Lodestone', rarity: 'Rare', bonusType: 'metalDamage', baseBonus: 0.055, bonusPerLevel: 0.0055, description: 'Increases damage against mechanical/armored enemies.', lore: 'A magnet that disrupts metallic foes.', art: '  []\n[  ]\n []', evolutionCostEssence: 46 },
  { id: 66, name: 'Whirl the Dervish', rarity: 'Epic', bonusType: 'spinAttackChance', baseBonus: 0.08, bonusPerLevel: 0.008, description: 'Gives melee heroes a chance to perform a spin attack.', lore: 'A tiny swirling wind that teaches circular strike techniques.', art: '  ~\n ( )\n  ~', evolutionCostEssence: 68 },
  { id: 67, name: 'Puddle the Water Drop', rarity: 'Common', bonusType: 'waterDamage', baseBonus: 0.018, bonusPerLevel: 0.0018, description: 'Increases water damage.', lore: 'A single drop of water with surprising impact.', art: '  o\n ( )\n  O', evolutionCostEssence: 34 },
  { id: 68, name: 'Cinder Jr.', rarity: 'Rare', bonusType: 'emberTrail', baseBonus: 0.04, bonusPerLevel: 0.004, description: 'Leaves a burning trail behind moving heroes.', lore: 'The child of Cinder, leaving small embers in its wake.', art: '  *\n ( )\n / \\', evolutionCostEssence: 48 },
  { id: 69, name: 'Zap the Battery', rarity: 'Epic', bonusType: 'overcharge', baseBonus: 0.075, bonusPerLevel: 0.0075, description: 'Gives a chance to double cast spells.', lore: 'A charged battery that occasionally overloads magical abilities.', art: '  [+]\n[   ]\n [-]', evolutionCostEssence: 70 },
  { id: 70, name: 'Gale the Gust', rarity: 'Legendary', bonusType: 'windShear', baseBonus: 0.13, bonusPerLevel: 0.013, description: 'Periodically reduces enemy attack speed dramatically.', lore: 'A powerful gust of wind that hampers enemy actions.', art: '  ~~\n(   )\n ~~~', evolutionCostEssence: 110 },
  { id: 71, name: 'Moss the Lichen', rarity: 'Common', bonusType: 'poisonDamage', baseBonus: 0.016, bonusPerLevel: 0.0016, description: 'Increases poison/acid damage.', lore: 'A patch of moss that secretes toxic substances.', art: '  ~~\n(   )\n ~~~', evolutionCostEssence: 36 },
  { id: 72, name: 'Flare the Solar Spark', rarity: 'Mythic', bonusType: 'solarFlare', baseBonus: 0.20, bonusPerLevel: 0.02, description: 'Deals periodic damage to all enemies based on your DPS.', lore: 'A fragment of the sun itself, burning with stellar fury.', art: '  O\n ( )\n / \\', evolutionCostEssence: 200 },
  { id: 73, name: 'Ripple the Pond', rarity: 'Rare', bonusType: 'aoeHeal', baseBonus: 0.035, bonusPerLevel: 0.0035, description: 'Healing effects spread to nearby heroes.', lore: 'Creates ripples that spread healing to adjacent allies.', art: '  O\n(   )\n OOO', evolutionCostEssence: 50 },
  { id: 74, name: 'Glimmer Jr.', rarity: 'Common', bonusType: 'magicFind', baseBonus: 0.012, bonusPerLevel: 0.0012, description: 'Slightly increases chance for rare item drops.', lore: 'A smaller version of Glimmer, still learning to find treasure.', art: '  *\n ( )\n / \\', evolutionCostEssence: 38 },
  { id: 75, name: 'Boulder the Pebble', rarity: 'Epic', bonusType: 'earthDamage', baseBonus: 0.085, bonusPerLevel: 0.0085, description: 'Increases earth/rock damage.', lore: 'A pebble with the heart of a boulder, empowering geological attacks.', art: '  __\n /  \\\n|    |\n \\__/', evolutionCostEssence: 72 },
  { id: 76, name: 'Static Jr.', rarity: 'Common', bonusType: 'shockChance', baseBonus: 0.014, bonusPerLevel: 0.0014, description: 'Gives a small chance to stun with lightning damage.', lore: 'A smaller electrical companion, still learning to control its power.', art: '  .\n ( )\n / \\', evolutionCostEssence: 40 },
  { id: 77, name: 'Blaze the Torch', rarity: 'Legendary', bonusType: 'fireAura', baseBonus: 0.16, bonusPerLevel: 0.016, description: 'Deals constant fire damage to nearby enemies.', lore: 'An ever-burning torch that scorches all who approach.', art: '  |\n ( )\n  |', evolutionCostEssence: 115 },
  { id: 78, name: 'Dew the Morning', rarity: 'Rare', bonusType: 'morningBuff', baseBonus: 0.038, bonusPerLevel: 0.0038, description: 'Increases all stats during the first hour of play each day.', lore: 'Captures the fresh energy of morning and shares it with your team.', art: '  o\n ( )\n  O', evolutionCostEssence: 52 },
  { id: 79, name: 'Crystal Shard', rarity: 'Common', bonusType: 'crystalDamage', baseBonus: 0.017, bonusPerLevel: 0.0017, description: 'Increases crystal/glass damage.', lore: 'A sharp fragment of crystal that enhances piercing attacks.', art: '  /\\\n /  \\\n/    \\', evolutionCostEssence: 42 },
  { id: 80, name: 'Vapor the Steam Spirit', rarity: 'Epic', bonusType: 'steamCloud', baseBonus: 0.07, bonusPerLevel: 0.007, description: 'Creates clouds that blind enemies, reducing their accuracy.', lore: 'A spirit of steam that obscures vision and confuses foes.', art: '  ~~\n(   )\n ~~~', evolutionCostEssence: 75 },
  { id: 81, name: 'Zephyr Jr.', rarity: 'Common', bonusType: 'windDamage', baseBonus: 0.019, bonusPerLevel: 0.0019, description: 'Increases wind/air damage.', lore: 'A baby wind spirit, just learning to create breezes.', art: '  ~\n ( )\n  ~', evolutionCostEssence: 44 },
  { id: 82, name: 'Frost the Snowball', rarity: 'Rare', bonusType: 'snowballEffect', baseBonus: 0.042, bonusPerLevel: 0.0042, description: 'Damage increases slightly with each consecutive hit on same target.', lore: 'A rolling snowball that grows as it attacks.', art: '  O\n(   )\n OOO', evolutionCostEssence: 54 },
  { id: 83, name: 'Inferno Jr.', rarity: 'Epic', bonusType: 'hellfire', baseBonus: 0.095, bonusPerLevel: 0.0095, description: 'Fire damage ignores a portion of enemy fire resistance.', lore: 'A young infernal being whose flames burn even the fire-resistant.', art: '  ^\n ( )\n / \\', evolutionCostEssence: 78 },
  { id: 84, name: 'Quake Jr.', rarity: 'Rare', bonusType: 'tremorSense', baseBonus: 0.044, bonusPerLevel: 0.0044, description: 'Reveals invisible/stealthed enemies.', lore: 'A baby mole that can feel even the stealthiest footsteps.', art: '  oo\n (  )\n/    \\', evolutionCostEssence: 56 },
  { id: 85, name: 'Vortex Jr.', rarity: 'Common', bonusType: 'vacuumEffect', baseBonus: 0.015, bonusPerLevel: 0.0015, description: 'Slightly pulls enemies toward attack impacts.', lore: 'A small whirlwind that creates minor suction.', art: '  ~\n ( )\n  ~', evolutionCostEssence: 46 },
  { id: 86, name: 'Solar the Sunflower', rarity: 'Legendary', bonusType: 'photosynthesis', baseBonus: 0.14, bonusPerLevel: 0.014, description: 'Healing is increased during daytime stages.', lore: 'A sunflower that converts sunlight into healing energy.', art: '  O\n /|\\\n/ | \\', evolutionCostEssence: 120 },
  { id: 87, name: 'Lunar the Moonflower', rarity: 'Legendary', bonusType: 'moonlight', baseBonus: 0.14, bonusPerLevel: 0.014, description: 'Damage is increased during nighttime stages.', lore: 'A flower that blooms under moonlight, empowering attacks.', art: '  O\n /|\\\n/ | \\', evolutionCostEssence: 120 },
  { id: 88, name: 'Storm the Tempest', rarity: 'Mythic', bonusType: 'thunderstorm', baseBonus: 0.18, bonusPerLevel: 0.018, description: 'Combines effects of lightning, wind, and water damage boosts.', lore: 'A miniature storm system containing multiple weather phenomena.', art: '  ~~\n( * )\n ~~~', evolutionCostEssence: 250 },
  { id: 89, name: 'Ember Jr.', rarity: 'Common', bonusType: 'warmth', baseBonus: 0.013, bonusPerLevel: 0.0013, description: 'Reduces freeze duration on heroes.', lore: 'A tiny ember that provides just enough warmth to resist cold.', art: '  ^\n ( )\n / \\', evolutionCostEssence: 48 },
  { id: 90, name: 'Coral Jr.', rarity: 'Rare', bonusType: 'oceanicBlessing', baseBonus: 0.046, bonusPerLevel: 0.0046, description: 'Increases healing received by aquatic heroes.', lore: 'A baby coral that blesses ocean-dwelling allies.', art: '  ^\n / \\\n(*)', evolutionCostEssence: 58 },
  { id: 91, name: 'Zap Jr.', rarity: 'Common', bonusType: 'staticDischarge', baseBonus: 0.016, bonusPerLevel: 0.0016, description: 'Chance to release electrical discharge when hit.', lore: 'A small battery that occasionally discharges when jostled.', art: '  .\n ( )\n / \\', evolutionCostEssence: 50 },
  { id: 92, name: 'Bloom Jr.', rarity: 'Common', bonusType: 'freshScent', baseBonus: 0.014, bonusPerLevel: 0.0014, description: 'Slightly increases hero morale (small all-stat boost).', lore: 'A budding flower whose scent inspires your team.', art: '  @\n /|\\\n/ | \\', evolutionCostEssence: 52 },
  { id: 93, name: 'Fang Jr.', rarity: 'Rare', bonusType: 'bloodPact', baseBonus: 0.048, bonusPerLevel: 0.0048, description: 'Life steal also restores a small amount of energy.', lore: 'A baby bat that teaches more efficient life draining.', art: '  /\\\n /  \\\n/    \\', evolutionCostEssence: 60 },
  { id: 94, name: 'Cogsworth Jr.', rarity: 'Common', bonusType: 'efficiency', baseBonus: 0.018, bonusPerLevel: 0.0018, description: 'Reduces energy cost of all skills slightly.', lore: 'A tiny gear that helps mechanical systems run more efficiently.', art: '  []\n[  ]\n []', evolutionCostEssence: 54 },
  { id: 95, name: 'Nimbus Jr.', rarity: 'Epic', bonusType: 'rainCloud', baseBonus: 0.065, bonusPerLevel: 0.0065, description: 'Periodically heals the most injured hero.', lore: 'A small cloud that rains healing water on allies.', art: '  ~~\n(   )\n ~~~', evolutionCostEssence: 80 },
  { id: 96, name: 'Petal Jr.', rarity: 'Common', bonusType: 'gentleBreeze', baseBonus: 0.017, bonusPerLevel: 0.0017, description: 'Slightly increases projectile speed.', lore: 'A tiny butterfly whose wings create helpful air currents.', art: '  /\\\n /  \\\n\\  /', evolutionCostEssence: 56 },
  { id: 97, name: 'Rustle Jr.', rarity: 'Common', bonusType: 'leafArmor', baseBonus: 0.015, bonusPerLevel: 0.0015, description: 'Adds small thorns effect to all heroes.', lore: 'A small leaf that still has protective properties.', art: '  /\\\n /  \\\n/    \\', evolutionCostEssence: 58 },
  { id: 98, name: 'Glow Jr.', rarity: 'Common', bonusType: 'guidingLight', baseBonus: 0.016, bonusPerLevel: 0.0016, description: 'Slightly increases accuracy of all attacks.', lore: 'A dim firefly that still helps aim true.', art: '  o\n ( )\n / \\', evolutionCostEssence: 60 },
  { id: 99, name: 'Dust Bunny Jr.', rarity: 'Common', bonusType: 'allergyAttack', baseBonus: 0.014, bonusPerLevel: 0.0014, description: 'Chance to make enemies sneeze (brief stagger).', lore: 'A tiny dust bunny that tickles enemies\' noses.', art: '  O\n(   )\n O O', evolutionCostEssence: 62 },
  { id: 100, name: 'Magnet Jr.', rarity: 'Common', bonusType: 'magneticPersonality', baseBonus: 0.019, bonusPerLevel: 0.0019, description: 'Slightly increases chance for enemies to target tanks.', lore: 'A small magnet that draws enemy attention to your defenders.', art: '  []\n[  ]\n []', evolutionCostEssence: 64 },
  { id: 101, name: 'Whirl Jr.', rarity: 'Common', bonusType: 'dizzyingEffect', baseBonus: 0.016, bonusPerLevel: 0.0016, description: 'Chance to confuse enemies, making them attack randomly.', lore: 'A tiny whirlwind that spins enemies\' heads.', art: '  ~\n ( )\n  ~', evolutionCostEssence: 66 },
  { id: 102, name: 'Puddle Jr.', rarity: 'Common', bonusType: 'slippery', baseBonus: 0.015, bonusPerLevel: 0.0015, description: 'Chance for enemies to slip and fall when attacking.', lore: 'A small puddle that creates treacherous footing.', art: '  o\n ( )\n  O', evolutionCostEssence: 68 },
  { id: 103, name: 'Gale Jr.', rarity: 'Rare', bonusType: 'refreshingBreeze', baseBonus: 0.05, bonusPerLevel: 0.005, description: 'Periodically removes one random debuff from your team.', lore: 'A gentle breeze that clears away negative effects.', art: '  ~~\n(   )\n ~~~', evolutionCostEssence: 70 },
];

export const ALL_BLESSINGS: Blessing[] = [
  { type: 'goldRush', name: 'Blessing of Midas', description: 'Doubles all gold earned from enemies for 60 seconds.', durationSeconds: 60, cooldownSeconds: 86400, bonusMultiplier: 2 }, // 24 hours
  { type: 'powerSurge', name: 'Warrior\'s Zeal', description: 'Increases all hero DPS by 50% for 60 seconds.', durationSeconds: 60, cooldownSeconds: 86400, bonusMultiplier: 1.5 },
  { type: 'skillFrenzy', name: 'Arcane Haste', description: 'Instantly recharges all hero skills.', durationSeconds: 0, cooldownSeconds: 86400, bonusMultiplier: 0 }, // Instant effect

  //Add
    { type: 'critStorm', name: 'Critical Tempest', description: 'All attacks have 100% critical chance for 30 seconds.', durationSeconds: 30, cooldownSeconds: 7200, bonusMultiplier: 1 }, // 2 hours
  { type: 'manaTide', name: 'Mana Spring', description: 'All hero skills recharge 300% faster for 45 seconds.', durationSeconds: 45, cooldownSeconds: 5400, bonusMultiplier: 3 }, // 1.5 hours
  { type: 'timeWarp', name: 'Time Compression', description: 'All hero attack speed increased by 200% for 20 seconds.', durationSeconds: 20, cooldownSeconds: 3600, bonusMultiplier: 2 }, // 1 hour
  { type: 'divineShield', name: 'Divine Protection', description: 'All heroes become invulnerable for 15 seconds.', durationSeconds: 15, cooldownSeconds: 10800, bonusMultiplier: 0 }, // 3 hours
  { type: 'lootExplosion', name: 'Treasure Cascade', description: 'Enemies drop 5x more items and gold for 40 seconds.', durationSeconds: 40, cooldownSeconds: 14400, bonusMultiplier: 5 }, // 4 hours
  { type: 'experienceFlood', name: 'Wisdom Deluge', description: 'Experience gain increased by 400% for 60 seconds.', durationSeconds: 60, cooldownSeconds: 10800, bonusMultiplier: 4 }, // 3 hours
  { type: 'cloneArmy', name: 'Mirror Image', description: 'Each hero is duplicated for 25 seconds (50% effectiveness).', durationSeconds: 25, cooldownSeconds: 7200, bonusMultiplier: 0.5 }, // 2 hours
  { type: 'elementalOverload', name: 'Elemental Convergence', description: 'All elemental damage increased by 300% for 35 seconds.', durationSeconds: 35, cooldownSeconds: 9000, bonusMultiplier: 3 }, // 2.5 hours
  { type: 'berserkRage', name: 'Berserker Fury', description: 'Hero damage increases as their health decreases for 30 seconds.', durationSeconds: 30, cooldownSeconds: 7200, bonusMultiplier: 0 }, // 2 hours
  { type: 'phantomStrike', name: 'Phantom Assault', description: 'All attacks bypass enemy armor for 20 seconds.', durationSeconds: 20, cooldownSeconds: 5400, bonusMultiplier: 0 }, // 1.5 hours
  { type: 'chainReaction', name: 'Chain Lightning', description: 'All attacks chain to 3 additional enemies for 25 seconds.', durationSeconds: 25, cooldownSeconds: 7200, bonusMultiplier: 3 }, // 2 hours
  { type: 'healingRain', name: 'Healing Torrent', description: 'All heroes heal for 5% of their max health every second for 30 seconds.', durationSeconds: 30, cooldownSeconds: 10800, bonusMultiplier: 0.05 }, // 3 hours
  { type: 'bossBane', name: 'Titan Slayer', description: 'Damage against bosses increased by 500% for 45 seconds.', durationSeconds: 45, cooldownSeconds: 14400, bonusMultiplier: 5 }, // 4 hours
  { type: 'speedDemon', name: 'Speed Demon', description: 'All hero movement and animation speed increased by 150% for 40 seconds.', durationSeconds: 40, cooldownSeconds: 5400, bonusMultiplier: 1.5 }, // 1.5 hours
  { type: 'resourceHarvest', name: 'Resource Windfall', description: 'All resource generation (gold, essence, gems) increased by 250% for 50 seconds.', durationSeconds: 50, cooldownSeconds: 18000, bonusMultiplier: 2.5 }, // 5 hours
  { type: 'deathMark', name: 'Death\'s Mark', description: 'Enemies take 100% more damage from critical hits for 30 seconds.', durationSeconds: 30, cooldownSeconds: 7200, bonusMultiplier: 1 }, // 2 hours
  { type: 'magicAmplifier', name: 'Arcane Amplification', description: 'All skill damage increased by 400% for 25 seconds.', durationSeconds: 25, cooldownSeconds: 9000, bonusMultiplier: 4 }, // 2.5 hours
  { type: 'fortuneFavor', name: 'Fortune\'s Favor', description: 'All luck-based effects (crit, dodge, loot) are doubled for 60 seconds.', durationSeconds: 60, cooldownSeconds: 21600, bonusMultiplier: 2 }, // 6 hours
  { type: 'timeFreeze', name: 'Chrono Freeze', description: 'All enemies are frozen in place for 10 seconds.', durationSeconds: 10, cooldownSeconds: 14400, bonusMultiplier: 0 }, // 4 hours
  { type: 'soulHarvest', name: 'Soul Reap', description: 'Defeating enemies restores 10% of max health and energy to all heroes for 30 seconds.', durationSeconds: 30, cooldownSeconds: 10800, bonusMultiplier: 0.1 }, // 3 hours
  { type: 'precisionStrike', name: 'Perfect Precision', description: 'All attacks cannot miss and have 50% increased critical damage for 35 seconds.', durationSeconds: 35, cooldownSeconds: 7200, bonusMultiplier: 0.5 }, // 2 hours
  { type: 'elementalImmunity', name: 'Elemental Ward', description: 'All heroes become immune to elemental damage for 25 seconds.', durationSeconds: 25, cooldownSeconds: 14400, bonusMultiplier: 0 }, // 4 hours
  { type: 'damageReflect', name: 'Thorn Aura', description: 'All heroes reflect 100% of damage taken back to attackers for 20 seconds.', durationSeconds: 20, cooldownSeconds: 10800, bonusMultiplier: 1 }, // 3 hours
  { type: 'infiniteMana', name: 'Mana Infinity', description: 'All hero skills cost no energy for 15 seconds.', durationSeconds: 15, cooldownSeconds: 18000, bonusMultiplier: 0 }, // 5 hours
  { type: 'petEvolution', name: 'Pet Ascension', description: 'All pets become 300% more effective for 45 seconds.', durationSeconds: 45, cooldownSeconds: 21600, bonusMultiplier: 3 }, // 6 hours
  { type: 'heroicResolve', name: 'Heroic Resolve', description: 'Heroes cannot die and fight with 1 HP when they would normally die for 30 seconds.', durationSeconds: 30, cooldownSeconds: 28800, bonusMultiplier: 0 }, // 8 hours
  { type: 'aoeExpansion', name: 'Area Expansion', description: 'All area effect attacks have 200% larger radius for 40 seconds.', durationSeconds: 40, cooldownSeconds: 10800, bonusMultiplier: 2 }, // 3 hours
  { type: 'stealthField', name: 'Shadow Veil', description: 'All heroes become invisible and untargetable for 15 seconds.', durationSeconds: 15, cooldownSeconds: 14400, bonusMultiplier: 0 }, // 4 hours
  { type: 'damageOverTime', name: 'Bleeding Wounds', description: 'All attacks apply a stacking damage over time effect for 30 seconds.', durationSeconds: 30, cooldownSeconds: 7200, bonusMultiplier: 0 }, // 2 hours
  { type: 'resourceConversion', name: 'Alchemical Transmutation', description: 'All enemy drops are converted to gold at 200% value for 50 seconds.', durationSeconds: 50, cooldownSeconds: 21600, bonusMultiplier: 2 }, // 6 hours
  { type: 'statSteal', name: 'Stat Vampire', description: 'Heroes steal 5% of enemy stats with each hit for 25 seconds.', durationSeconds: 25, cooldownSeconds: 14400, bonusMultiplier: 0.05 }, // 4 hours
  { type: 'revivalWave', name: 'Mass Resurrection', description: 'All fallen heroes are revived with 50% health after 5 seconds.', durationSeconds: 5, cooldownSeconds: 43200, bonusMultiplier: 0 }, // 12 hours
  { type: 'damageCapRemoval', name: 'Limit Breaker', description: 'Removes damage caps on all attacks for 20 seconds.', durationSeconds: 20, cooldownSeconds: 43200, bonusMultiplier: 0 }, // 12 hours
  { type: 'enemyWeaken', name: 'Enfeeblement', description: 'All enemies deal 70% less damage for 35 seconds.', durationSeconds: 35, cooldownSeconds: 10800, bonusMultiplier: 0.3 }, // 3 hours
  { type: 'cooldownReset', name: 'Temporal Reset', description: 'Resets cooldown of all blessings (except this one) after use.', durationSeconds: 0, cooldownSeconds: 86400, bonusMultiplier: 0 }, // 24 hours
  { type: 'essenceHarvest', name: 'Essence Overflow', description: 'Essence gain increased by 300% for 60 seconds.', durationSeconds: 60, cooldownSeconds: 14400, bonusMultiplier: 3 }, // 4 hours
  { type: 'fusionBoost', name: 'Fusion Catalyst', description: 'All fusion and crafting success rates increased by 50% for 120 seconds.', durationSeconds: 120, cooldownSeconds: 43200, bonusMultiplier: 0.5 }, // 12 hours
  { type: 'heroLevelBoost', name: 'Experience Surge', description: 'Heroes gain 10x experience from all sources for 45 seconds.', durationSeconds: 45, cooldownSeconds: 28800, bonusMultiplier: 10 }, // 8 hours
  { type: 'petLevelBoost', name: 'Pet Enlightenment', description: 'Pets gain 5x experience for 60 seconds.', durationSeconds: 60, cooldownSeconds: 21600, bonusMultiplier: 5 }, // 6 hours
  { type: 'bossSpawn', name: 'Boss Lure', description: 'Boss spawn chance increased by 1000% for 90 seconds.', durationSeconds: 90, cooldownSeconds: 43200, bonusMultiplier: 10 }, // 12 hours
  { type: 'rareDrop', name: 'Treasure Magnet', description: 'Rare item drop chance increased by 500% for 75 seconds.', durationSeconds: 75, cooldownSeconds: 28800, bonusMultiplier: 5 }, // 8 hours
  { type: 'attackChain', name: 'Combo Master', description: 'Each consecutive hit on same target deals 10% more damage for 30 seconds.', durationSeconds: 30, cooldownSeconds: 7200, bonusMultiplier: 0.1 }, // 2 hours
  { type: 'healthSwap', name: 'Life Transfer', description: '50% of damage dealt is converted to healing for all heroes for 25 seconds.', durationSeconds: 25, cooldownSeconds: 14400, bonusMultiplier: 0.5 }, // 4 hours
  { type: 'energyOverflow', name: 'Energy Overflow', description: 'All heroes start with max energy and gain 200% more for 40 seconds.', durationSeconds: 40, cooldownSeconds: 10800, bonusMultiplier: 2 }, // 3 hours
  { type: 'sizeReduction', name: 'Minimize Foe', description: 'All enemies are shrunk, reducing their stats by 40% for 30 seconds.', durationSeconds: 30, cooldownSeconds: 14400, bonusMultiplier: 0.4 }, // 4 hours
  { type: 'sizeIncrease', name: 'Maximize Heroes', description: 'All heroes are enlarged, increasing their stats by 40% for 30 seconds.', durationSeconds: 30, cooldownSeconds: 14400, bonusMultiplier: 0.4 }, // 4 hours
  { type: 'instantKill', name: 'Divine Judgment', description: 'Each attack has a 10% chance to instantly kill normal enemies for 20 seconds.', durationSeconds: 20, cooldownSeconds: 43200, bonusMultiplier: 0.1 }, // 12 hours
  { type: 'damageShield', name: 'Damage Absorber', description: 'All heroes gain a shield equal to 100% of their max health for 25 seconds.', durationSeconds: 25, cooldownSeconds: 18000, bonusMultiplier: 1 }, // 5 hours
  { type: 'buffExtension', name: 'Duration Mastery', description: 'All buff durations on heroes increased by 300% for 60 seconds.', durationSeconds: 60, cooldownSeconds: 21600, bonusMultiplier: 3 }, // 6 hours
  { type: 'debuffExtension', name: 'Suffering Prolonged', description: 'All debuff durations on enemies increased by 300% for 60 seconds.', durationSeconds: 60, cooldownSeconds: 21600, bonusMultiplier: 3 }, // 6 hours
  { type: 'perfectDodge', name: 'Phantom Dance', description: 'All heroes have 75% dodge chance for 15 seconds.', durationSeconds: 15, cooldownSeconds: 14400, bonusMultiplier: 0.75 }, // 4 hours
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
