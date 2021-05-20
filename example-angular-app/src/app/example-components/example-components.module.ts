import { NgModule } from '@angular/core';
import { UserBadgeWithTheKidComponent } from './user-badge-with-the-kid/user-badge-with-the-kid.component';
import { UserBadgeWithPanelComponent } from './user-badge-with-panel/user-badge-with-panel.component';
import { UserBadgeComponent } from './user-badge/user-badge.component';
import { BrowserModule } from '@angular/platform-browser';
import { UserBadgeTheKidAndPanelComponent } from './user-badge-with-the-kid-and-panel/user-badge-with-the-kid-and-panel.component';

const moduleComponents: any[] = [
    UserBadgeComponent,
    UserBadgeWithPanelComponent,
    UserBadgeWithTheKidComponent,
    UserBadgeTheKidAndPanelComponent,
];

@NgModule({
  declarations: [...moduleComponents],
  exports: [...moduleComponents],
  imports: [BrowserModule],
  providers: [],
  bootstrap: []
})
export class ExampleComponentsModule { }
