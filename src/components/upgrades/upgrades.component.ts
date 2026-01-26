import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { TooltipDirective } from '../../directives/tooltip.directive';

@Component({
  selector: 'app-upgrades',
  templateUrl: './upgrades.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TooltipDirective],
})
export class UpgradesComponent {
  gameService = input.required<GameService>();

  upgradeClickDamage() {
    this.gameService().levelUpClickDamage();
  }

  prestige() {
    this.gameService().prestige();
  }

  upgradeGoldMultiplier() {
    this.gameService().upgradeGoldMultiplier();
  }

  upgradePrestigePower() {
    this.gameService().upgradePrestigePower();
  }
  
  upgradeClickingFrenzy() {
    this.gameService().upgradeClickingFrenzy();
  }

  upgradeStartingGold() {
    this.gameService().upgradeStartingGold();
  }

  upgradeExpeditionSlots() {
    this.gameService().upgradeExpeditionSlots();
  }

  upgradeDungeonSlots() {
    this.gameService().upgradeDungeonSlots();
  }

  formatNumber(num: number): string {
    if (num < 1000) {
      return num.toString();
    }
    const suffixes = ["", "k", "M", "B", "T"];
    const i = Math.floor(Math.log10(num) / 3);
    const shortNum = (num / Math.pow(1000, i)).toFixed(2);
    return shortNum.replace(/\.0$/, '') + suffixes[i];
  }
}