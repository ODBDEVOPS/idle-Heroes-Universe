import { Component, ChangeDetectionStrategy, input, computed, signal, effect, OnDestroy, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Rarity } from '../../models/hero.model';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { EnemyType } from '../../models/enemy.model';

interface Particle {
  id: number;
  left: string;
  top: string;
  size: string;
  backgroundColor: string;
  animationDelay: string;
  tx: string;
  ty: string;
}

@Component({
  selector: 'app-combat',
  templateUrl: './combat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TooltipDirective],
})
export class CombatComponent implements OnDestroy {
  gameService = input.required<GameService>();

  particles = signal<Particle[]>([]);
  activatingSkillHeroId = signal<number | null>(null);
  healthBarHit = signal(false);
  dpsChanged = signal(false);
  enemyIsCharging = signal(false);
  enemyIsAttacking = signal(false);
  
  private enemyAttackInterval: any;

  enemyHpPercentage = computed(() => {
    const enemy = this.gameService().currentEnemy();
    if (!enemy || enemy.maxHp === 0) return 0;
    return (enemy.currentHp / enemy.maxHp) * 100;
  });

  delayedEnemyHpPercentage = signal(100);
  private hpUpdateTimeout: any;

  constructor() {
    // Effect to create particles on normal damage
    effect(() => {
        const flashes = this.gameService().damageFlashes();
        if(flashes.length > 0) {
            const lastFlash = flashes[flashes.length-1];
            switch(lastFlash.type) {
                case 'click':
                    this.createParticles(5, 'click');
                    break;
                case 'dps':
                     this.createParticles(2, 'dps');
                    break;
            }
        }
    }, { allowSignalWrites: true });

    // Effect for skill particles
    effect(() => {
      const skill = this.gameService().lastSkillUsed();
      if (skill) {
        const particleCount: Record<Rarity, number> = {
          'Common': 20,
          'Rare': 30,
          'Epic': 45,
          'Legendary': 60,
          'Mythic': 80
        };
        this.createParticles(particleCount[skill.rarity], 'skill', skill.rarity);
      }
    }, { allowSignalWrites: true });

    // Effect to handle the delayed health bar
    effect(() => {
        const currentPercentage = this.enemyHpPercentage();
        
        // When a new enemy arrives, hp goes to 100. Reset immediately.
        if (currentPercentage === 100) {
            if (this.hpUpdateTimeout) clearTimeout(this.hpUpdateTimeout);
            this.delayedEnemyHpPercentage.set(100);
        } else {
            // Otherwise, schedule the update. Clear any pending update to prevent overlaps.
            if (this.hpUpdateTimeout) clearTimeout(this.hpUpdateTimeout);
            this.hpUpdateTimeout = setTimeout(() => {
                this.delayedEnemyHpPercentage.set(currentPercentage);
            }, 300);
        }
    }, { allowSignalWrites: true });

     // Effect for health bar hit flash
    effect(() => {
        if (this.gameService().damageFlashes().length > 0) {
            if (!untracked(this.healthBarHit)) {
                this.healthBarHit.set(true);
                setTimeout(() => this.healthBarHit.set(false), 200);
            }
        }
    }, { allowSignalWrites: true });

    // Effect for DPS change pulse
    effect((onCleanup) => {
        const previousDps = untracked(() => this.gameService().totalDps());
        const currentDps = this.gameService().totalDps();

        if (currentDps !== previousDps && previousDps !== 0) { // check previousDps to avoid firing on init
            this.dpsChanged.set(true);
            const timeoutId = setTimeout(() => this.dpsChanged.set(false), 500);
            onCleanup(() => clearTimeout(timeoutId));
        }
    }, { allowSignalWrites: true });

    // Effect to manage enemy attack animations
    effect((onCleanup) => {
      const enemy = this.gameService().currentEnemy();

      // Always clear previous interval when enemy changes
      if (this.enemyAttackInterval) {
        clearInterval(this.enemyAttackInterval);
      }
      // Reset animation states for the new enemy
      this.enemyIsCharging.set(false);
      this.enemyIsAttacking.set(false);

      if (enemy) {
        this.enemyAttackInterval = setInterval(() => {
          // Use untracked here as the enemy object itself is the dependency for the effect,
          // and we don't want the interval callback to re-trigger the effect.
          untracked(() => {
            if (this.gameService().currentEnemy().isBoss) {
              this.triggerBossAttack();
            } else {
              this.triggerNormalAttack();
            }
          });
        }, 5000 + Math.random() * 3000); // Attack every 5-8 seconds
      }

      onCleanup(() => {
        if (this.enemyAttackInterval) {
          clearInterval(this.enemyAttackInterval);
        }
      });
    }, { allowSignalWrites: true });
  }

  ngOnDestroy() {
    if (this.hpUpdateTimeout) {
      clearTimeout(this.hpUpdateTimeout);
    }
    if (this.enemyAttackInterval) {
        clearInterval(this.enemyAttackInterval);
    }
  }

  onEnemyClick() {
    this.gameService().playerClick();
  }

  activateSkill(heroId: number) {
    this.gameService().activateHeroSkill(heroId);
    this.activatingSkillHeroId.set(heroId);
    setTimeout(() => this.activatingSkillHeroId.set(null), 300);
  }

  toggleAutoDps() {
    this.gameService().toggleAutoDps();
  }

  toggleAutoSkill() {
    this.gameService().toggleAutoSkill();
  }
  
  private triggerBossAttack() {
    if (this.enemyIsCharging() || this.enemyIsAttacking()) return; // Don't interrupt an ongoing attack
    
    this.enemyIsCharging.set(true);
    setTimeout(() => {
      this.enemyIsCharging.set(false);
      this.enemyIsAttacking.set(true);
      setTimeout(() => this.enemyIsAttacking.set(false), 400); // duration of attack animation
    }, 1500); // duration of charge animation
  }

  private triggerNormalAttack() {
    if (this.enemyIsCharging() || this.enemyIsAttacking()) return; // Don't interrupt an ongoing attack

    this.enemyIsAttacking.set(true);
    setTimeout(() => this.enemyIsAttacking.set(false), 400); // duration of attack animation
  }

  private createParticles(count: number, type: 'dps' | 'click' | 'skill' | 'stage_clear', rarity?: Rarity): void {
    const newParticles: Particle[] = [];
    
    const skillColors: Record<Rarity, string[]> = {
        'Common': ['#9ca3af', '#e5e7eb'],
        'Rare': ['#3b82f6', '#93c5fd'],
        'Epic': ['#a855f7', '#d8b4fe'],
        'Legendary': ['#facc15', '#fde047', '#ffffff'],
        'Mythic': ['#ef4444', '#f97316', '#facc15']
    };

    const colors = {
        dps: ['#ffffff'],
        click: ['#fde047'],
        skill: rarity ? skillColors[rarity] : skillColors['Common'],
        stage_clear: ['#fde047', '#a855f7', '#a78bfa', '#f97316', '#4ade80']
    };
    
    const sizeMultiplier: Record<Rarity, number> = {
      'Common': 1.0,
      'Rare': 1.1,
      'Epic': 1.2,
      'Legendary': 1.4,
      'Mythic': 1.6
    };
    const baseSize = type === 'skill' ? 6 : 3;
    const randomSize = type === 'skill' ? 8 : 4;
    const rarityMultiplier = (type === 'skill' && rarity) ? sizeMultiplier[rarity] : 1.0;

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 60 + 20;
        newParticles.push({
            id: Math.random(),
            left: `${Math.random() * 40 + 30}%`,
            top: `${Math.random() * 40 + 30}%`,
            size: `${(Math.random() * randomSize + baseSize) * rarityMultiplier}px`,
            backgroundColor: colors[type][Math.floor(Math.random() * colors[type].length)],
            animationDelay: `${Math.random() * 0.1}s`,
            tx: `${Math.cos(angle) * distance}px`,
            ty: `${Math.sin(angle) * distance}px`,
        });
    }

    this.particles.update(p => [...p, ...newParticles]);
    setTimeout(() => {
      this.particles.update(p => p.filter(particle => !newParticles.some(np => np.id === particle.id)));
    }, 500);
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

  getEnemyNameColor(type: EnemyType): string {
    switch (type) {
      case 'Armored': return 'text-gray-300';
      case 'Swift': return 'text-cyan-300';
      case 'Hoarder': return 'text-yellow-300';
      case 'Boss': return 'text-red-300';
      case 'Squad': return 'text-orange-300';
      default: return 'text-white';
    }
  }

  getEnemyTypeBadgeClass(type: EnemyType): string {
    switch (type) {
      case 'Armored': return 'bg-gray-700/50 border-gray-500 text-gray-300';
      case 'Swift': return 'bg-cyan-900/50 border-cyan-700 text-cyan-300';
      case 'Hoarder': return 'bg-yellow-900/50 border-yellow-700 text-yellow-300';
      case 'Squad': return 'bg-orange-900/50 border-orange-700 text-orange-300';
      default: return 'hidden';
    }
  }

  getEnemyTypeTooltip(type: EnemyType): string {
    switch (type) {
      case 'Armored': return 'Armored: Reduces all incoming damage by 30%.';
      case 'Swift': return 'Swift: Has less health and gives less gold.';
      case 'Hoarder': return 'Hoarder: Has high health but drops a massive amount of gold.';
      case 'Squad': return 'Squad: A group of enemies. Tougher and more rewarding than a single foe.';
      default: return '';
    }
  }

  getRarityBorderClass(rarity: Rarity | undefined): string {
    const map: Record<Rarity, string> = {
      'Mythic': 'border-red-500',
      'Legendary': 'border-yellow-400',
      'Epic': 'border-purple-500',
      'Rare': 'border-blue-500',
      'Common': 'border-gray-500',
    };
    return rarity ? map[rarity] : map['Common'];
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

  getRarityBgClass(rarity: Rarity): string {
    switch (rarity) {
        case 'Mythic': return 'bg-gradient-to-br from-red-700 to-gray-800';
        case 'Legendary': return 'bg-gradient-to-br from-yellow-600 to-gray-800';
        case 'Epic': return 'bg-gradient-to-br from-purple-700 to-gray-800';
        case 'Rare': return 'bg-gradient-to-br from-blue-700 to-gray-800';
        default: return 'bg-gradient-to-br from-gray-600 to-gray-800';
    }
  }

  getSkillSlashClass(rarity: Rarity): string {
    const slashClasses: Record<Rarity, string> = {
        'Mythic': 'via-red-400/80',
        'Legendary': 'via-yellow-300/80',
        'Epic': 'via-purple-400/80',
        'Rare': 'via-blue-400/80',
        'Common': 'via-gray-300/80',
    };
    return slashClasses[rarity] || slashClasses['Common'];
  }
}