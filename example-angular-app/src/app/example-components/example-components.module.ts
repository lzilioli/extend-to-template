import { NgModule } from '@angular/core';
import { UserBadgeWithTheKidComponent } from './2.B. user-badge-with-the-kid/user-badge-with-the-kid.component';
import { UserBadgeWithPanelComponent } from './2.A. user-badge-with-panel/user-badge-with-panel.component';
import { UserBadgeTheKidAndPanelAndSelfModificationComponent } from './4. user-badge-with-the-kid-and-panel-and-self-modification/user-badge-with-the-kid-and-panel-and-self-modification.component';
import { UserBadgeComponent } from './1. user-badge/user-badge.component';
import { BrowserModule } from '@angular/platform-browser';
import { UserBadgeTheKidAndPanelComponent } from './3. user-badge-with-the-kid-and-panel/user-badge-with-the-kid-and-panel.component';

const moduleComponents: any[] = [
    UserBadgeComponent,
    UserBadgeWithPanelComponent,
    UserBadgeWithTheKidComponent,
    UserBadgeTheKidAndPanelComponent,
    UserBadgeTheKidAndPanelAndSelfModificationComponent,
];

@NgModule({
  declarations: [...moduleComponents],
  exports: [...moduleComponents],
  imports: [BrowserModule],
  providers: [],
  bootstrap: []
})
export class ExampleComponentsModule { }
