import { Component, ChangeDetectionStrategy, output, input, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { View } from '../../app.component';
import { GameService, ALL_MINING_OPERATIONS, ALL_EXPEDITIONS, ALL_DUNGEONS } from '../../services/game.service';
import { EquipmentItem } from '../../models/equipment.model';
import { Rarity } from '../../models/hero.model';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class BaseComponent implements OnDestroy {
  viewChange = output<View>();
  gameService = input.required<GameService>();

  currentTime = signal(Date.now());
  private timerInterval: any;

  isGoldMineModalOpen = signal(false);
  miningClaimResult = signal<number | null>(null);
  
  activeMiningOperation = computed(() => {
    const activeOpState = this.gameService().gameState().activeMiningOperation;
    if (!activeOpState) return null;

    const details = ALL_MINING_OPERATIONS.find(op => op.id === activeOpState.operationId);
    if (!details) return null;

    const now = this.currentTime();
    const remainingSeconds = Math.max(0, Math.floor((activeOpState.completionTime - now) / 1000));
    const progress = Math.min(100, (1 - (remainingSeconds / details.durationSeconds)) * 100);

    return {
      ...details,
      remainingSeconds,
      completionTime: activeOpState.completionTime,
      progress
    };
  });

  activeExpeditions = computed(() => {
    const now = this.currentTime();
    return this.gameService().gameState().ongoingExpeditions.map(oe => {
        const details = ALL_EXPEDITIONS.find(e => e.id === oe.expeditionId)!;
        return {
            ...oe,
            name: details.name,
            details: details,
            remainingSeconds: Math.max(0, Math.floor((oe.completionTime - now) / 1000)),
        };
    }).sort((a,b) => a.completionTime - b.completionTime);
  });

  activeDungeonRuns = computed(() => {
    const now = this.currentTime();
    return this.gameService().gameState().activeDungeonRuns.map(run => {
      const details = ALL_DUNGEONS.find(d => d.id === run.dungeonId)!;
      return {
        ...run,
        name: details.name,
        details: details,
        difficulty: run.difficulty,
        remainingSeconds: Math.max(0, Math.floor((run.completionTime - now) / 1000)),
      };
    }).sort((a,b) => a.completionTime - b.completionTime);
  });

  availableMiningOperations = computed(() => {
    const currentStage = this.gameService().gameState().stage;
    return ALL_MINING_OPERATIONS.map(op => ({
        ...op,
        isAvailable: currentStage >= op.stageRequirement,
    }));
  });

  constructor() {
    this.timerInterval = setInterval(() => {
      this.currentTime.set(Date.now());
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

  navigateTo(view: View) {
    this.viewChange.emit(view);
  }

  formatNumber(num: number): string {
    if (num < 1000) return num.toFixed(0);
    const suffixes = ["", "k", "M", "B", "T"];
    const i = Math.floor(Math.log10(num) / 3);
    const shortNum = (num / Math.pow(1000, i)).toFixed(1);
    return shortNum.replace(/\.0$/, '') + suffixes[i];
  }

  formatDuration(s: number): string {
    if (s <= 0) return "Ready";
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    if (h !== '00') return `${h}:${m}:${sec}`;
    return `${m}:${sec}`;
  }
  
  startMiningOperation(operationId: number) {
    this.gameService().startMiningOperation(operationId);
  }

  claimMiningReward() {
      const reward = this.gameService().claimMiningOperation();
      if (reward > 0) {
          this.miningClaimResult.set(reward);
          setTimeout(() => this.miningClaimResult.set(null), 3000);
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
}