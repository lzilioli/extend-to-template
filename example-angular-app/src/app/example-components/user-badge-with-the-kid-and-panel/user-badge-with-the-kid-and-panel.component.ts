import {
	Component,
	OnChanges
} from '@angular/core';
import { UserBadgeWithTheKidComponent } from '../user-badge-with-the-kid/user-badge-with-the-kid.component';

@Component({
	selector: 'user-badge-with-the-kid-and-panel',
	styleUrls: [
		// Note we do NOT need the underlying stylesheet here
		// because it comes with our call to user-badge-with-panel
		// in the below inline template
		// '../user-badge/user-badge.component.scss',
		'./user-badge-with-the-kid-and-panel.component.scss'
	],
	template: `
		<user-badge-with-panel
			[_extendToTemplateBridge]="_extendToTemplateBridge"
		></user-badge-with-panel>
	`,
})
export class UserBadgeTheKidAndPanelComponent extends UserBadgeWithTheKidComponent {}
