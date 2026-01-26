import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Quest, QuestCategory } from '../../models/quest.model';

@Component({
  selector: 'app-quests',
  templateUrl: './quests.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class QuestsComponent {
  gameService = input.required<GameService>();

  questCategories: QuestCategory[] = ['Main Story', 'Daily', 'Weekly', 'Achievements'];
  activeCategory = signal<QuestCategory>('Main Story');

  groupedQuests = computed(() => {
    const groups: Record<QuestCategory, Quest[]> = {
      'Main Story': [],
      'Daily': [],
      'Weekly': [],
      'Achievements': [],
    };
    for (const quest of this.gameService().quests()) {
      groups[quest.category]?.push(quest);
    }
    return groups;
  });

  filteredQuests = computed(() => {
    return this.groupedQuests()[this.activeCategory()] || [];
  });

  changeCategory(category: QuestCategory) {
    this.activeCategory.set(category);
  }

  claimReward(questId: number) {
    this.gameService().claimQuestReward(questId);
  }

  formatNumber(num: number): string {
    if (num < 1000) {
      return num.toString();
    }
    const suffixes = ["", "k", "M", "B", "T"];
    const i = Math.floor(Math.log10(num) / 3);
    const shortNum = (num / Math.pow(1000, i)).toFixed(2);
    return shortNum + suffixes[i];
  }
}