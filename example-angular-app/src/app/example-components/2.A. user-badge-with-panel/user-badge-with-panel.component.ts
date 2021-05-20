
import {
	Component,
	OnChanges
} from '@angular/core';
import { UserBadgeComponent } from '../1. user-badge/user-badge.component';

@Component({
	selector: 'user-badge-with-panel',
	styleUrls: [
		'../1. user-badge/user-badge.component.scss',
		'./user-badge-with-panel.component.scss'
	],
	template: `
	<div class="panel">
		<user-badge
			[_extendToTemplateBridge]="_extendToTemplateBridge"
		></user-badge>
	</div>`,
})
export class UserBadgeWithPanelComponent extends UserBadgeComponent implements OnChanges {

}
