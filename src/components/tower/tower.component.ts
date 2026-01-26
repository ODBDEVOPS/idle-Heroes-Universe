import { Component, ChangeDetectionStrategy, input, signal, computed, WritableSignal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService, ALL_ARTIFACTS } from '../../services/game.service';
import { Enemy } from '../../models/enemy.model';
import { Artifact } from '../../models/artifact.model';
import { TooltipDirective } from '../../directives/tooltip.directive';

type FightResult = 'victory' | 'defeat' | null;

@Component({
  selector: 'app-tower',
  templateUrl: './tower.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TooltipDirective],
})
export class TowerComponent implements OnDestroy {
  gameService = input.required<GameService>();

  isFighting = signal(false);
  fightTimer: WritableSignal<number> = signal(30);
  fightResult = signal<FightResult>(null);

  private fightInterval: any;

  enemyHpPercentage = computed(() => {
    const enemy = this.gameService().towerEnemy();
    if (!enemy || enemy.maxHp === 0) return 0;
    return (enemy.currentHp / enemy.maxHp) * 100;
  });

  towerReward = computed(() => {
    const floor = this.gameService().gameState().towerFloor;
    const prestigePoints = (floor > 0 && floor % 5 === 0) ? Math.floor(floor / 5) : 0;
    // Estimate gold reward for display
    const enemyHp = Math.floor(50 * Math.pow(1.4, floor - 1));
    const gold = Math.ceil(enemyHp / 4);
    
    let artifact: Artifact | null = null;
    const unlockedArtifactIds = this.gameService().gameState().artifacts;

    if (floor === 10 && !unlockedArtifactIds.includes(1)) {
        artifact = ALL_ARTIFACTS.find(a => a.id === 1) || null;
    } else if (floor === 20 && !unlockedArtifactIds.includes(2)) {
        artifact = ALL_ARTIFACTS.find(a => a.id === 2) || null;
    } else if (floor === 30 && !unlockedArtifactIds.includes(3)) {
        artifact = ALL_ARTIFACTS.find(a => a.id === 3) || null;
    } else if (floor === 40 && !unlockedArtifactIds.includes(4)) {
        artifact = ALL_ARTIFACTS.find(a => a.id === 4) || null;
    }

    return { gold, prestigePoints, artifact };
  });

  challengeFloor() {
    if (this.isFighting()) return;

    this.isFighting.set(true);
    this.fightResult.set(null);
    this.fightTimer.set(30);
    this.gameService().startTowerChallenge();
    
    this.fightInterval = setInterval(() => {
      if (this.gameService().gameState().autoDpsEnabled) {
        this.gameService().applyTowerDamage(this.gameService().totalDps(), 'dps');
      }
      
      const currentEnemy = this.gameService().towerEnemy();
      if (currentEnemy && currentEnemy.currentHp <= 0) {
        this.endFight(true);
        return;
      }

      this.fightTimer.update(t => t - 1);
      if (this.fightTimer() <= 0) {
        this.endFight(false);
      }
    }, 1000);
  }
  
  onEnemyClick() {
    if (!this.isFighting()) return;
    this.gameService().playerClick();
  }

  private endFight(isVictory: boolean) {
    clearInterval(this.fightInterval);
    this.isFighting.set(false);
    this.fightResult.set(isVictory ? 'victory' : 'defeat');
    this.gameService().endTowerChallenge(isVictory);
    
    setTimeout(() => {
        this.fightResult.set(null);
    }, 2500);
  }

  ngOnDestroy() {
    // Ensure cleanup if component is destroyed mid-fight
    if (this.fightInterval) {
      clearInterval(this.fightInterval);
    }
    if(this.gameService().isInTowerCombat()) {
      this.gameService().endTowerChallenge(false); // Count as a loss
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