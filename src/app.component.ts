import { Component, ChangeDetectionStrategy, signal, computed, effect, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CombatComponent } from './components/combat/combat.component';
import { TeamComponent } from './components/team/team.component';
import { UpgradesComponent } from './components/upgrades/upgrades.component';
import { GameService } from './services/game.service';
import { QuestsComponent } from './components/quests/quests.component';
import { ForgeComponent } from './components/forge/forge.component';
import { SummonComponent } from './components/summon/summon.component';
import { TowerComponent } from './components/tower/tower.component';
import { ArtifactsComponent } from './components/artifacts/artifacts.component';
import { CodexComponent } from './components/codex/codex.component';
import { SettingsComponent } from './components/settings/settings.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { ExpeditionsComponent } from './components/expeditions/expeditions.component';
import { CelestialShrineComponent } from './components/celestial-shrine/celestial-shrine.component';
import { SynergiesComponent } from './components/synergies/synergies.component';
import { AlchemyLabComponent } from './components/alchemy-lab/alchemy-lab.component';
import { HeroUnlockComponent } from './components/hero-unlock/hero-unlock.component';
import { TooltipDirective } from './directives/tooltip.directive';
import { BaseComponent } from './components/base/base.component';
import { TeamHubComponent } from './components/team-hub/team-hub.component';
import { FusionComponent } from './components/fusion/fusion.component';
import { HeroDetailComponent } from './components/hero-detail/hero-detail.component';
import { ReliquesComponent } from './components/reliques/reliques.component';
import { DungeonsComponent } from './components/dungeons/dungeons.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { PetsComponent } from './components/pets/pets.component';
import { HeroCommandComponent } from './components/hero-command/hero-command.component';
import { EnchantComponent } from './components/enchant/enchant.component';

export type View = 'quests' | 'settings' | 
             'combat' | 'forge' | 'tower' | 'expeditions' | 'celestialShrine' | 'alchemyLab' | 'enchant' |
             'team' | 'summon' | 'codex' | 'synergies' |
             'inventory' | 'upgrades' | 'artifacts' | 'heroUnlock' |
             'base' | 'teamHub' | 'fusion' | 'heroDetail' | 'reliques' | 'dungeons' | 'leaderboard' | 'pets' | 'heroCommand';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CombatComponent, TeamComponent, UpgradesComponent, QuestsComponent, ForgeComponent, SummonComponent, TowerComponent, ArtifactsComponent, CodexComponent, SettingsComponent, InventoryComponent, ExpeditionsComponent, CelestialShrineComponent, SynergiesComponent, AlchemyLabComponent, HeroUnlockComponent, TooltipDirective, BaseComponent, TeamHubComponent, FusionComponent, HeroDetailComponent, ReliquesComponent, DungeonsComponent, LeaderboardComponent, PetsComponent, HeroCommandComponent, EnchantComponent],
  host: {
    '(window:beforeunload)': 'saveGameOnExit($event)',
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class AppComponent {
  activeView = signal<View>('combat');
  heroToUnlockId = signal<number | null>(null);
  gameService = new GameService();
  
  showOfflineReport = signal(false);
  showDailyLogin = signal(false);
  isMenuOpen = signal(false);
  private elementRef = inject(ElementRef);

  dailyReward = computed(() => {
    const day = this.gameService.gameState().consecutiveLoginDays;
    return this.gameService.getDailyRewardForDay(day);
  });
  
  constructor() {
    this.gameService.startGameLoop();
    
    setTimeout(() => {
        if (this.gameService.offlineReport()) {
            this.showOfflineReport.set(true);
        } else if (this.gameService.isDailyRewardAvailable()) {
            this.showDailyLogin.set(true);
        }
    }, 500);
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  onDocumentClick(event: MouseEvent) {
    const menuButton = this.elementRef.nativeElement.querySelector('#menu-button');
    const menuDropdown = this.elementRef.nativeElement.querySelector('#menu-dropdown');
    if (this.isMenuOpen() && menuButton && !menuButton.contains(event.target as Node) && menuDropdown && !menuDropdown.contains(event.target as Node)) {
      this.isMenuOpen.set(false);
    }
  }

  changeView(view: View) {
    this.activeView.set(view);
    this.isMenuOpen.set(false);
  }

  handleNewHeroUnlock(heroId: number) {
    this.heroToUnlockId.set(heroId);
    this.changeView('heroUnlock');
  }

  saveGameOnExit(event: any) {
    this.gameService.saveGame();
  }
  
  claimOfflineReport() {
    this.gameService.clearOfflineReport();
    this.showOfflineReport.set(false);
    if (this.gameService.isDailyRewardAvailable()) {
        this.showDailyLogin.set(true);
    }
  }

  claimDailyReward() {
      this.gameService.claimDailyReward();
      this.showDailyLogin.set(false);
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
