import {
	Component,
	OnChanges
} from '@angular/core';
import { UserBadgeComponent } from '../user-badge/user-badge.component';

@Component({
	selector: 'user-badge-with-the-kid',
	styleUrls: ['./user-badge-with-the-kid.component.scss'],
	template: `
		<user-badge
			[_extendToTemplateBridge]="_extendToTemplateBridge"
		></user-badge>
		<user-badge-with-panel
			[_extendToTemplateBridge]="_extendToTemplateBridge"
		></user-badge-with-panel>
	`,
})
export class UserBadgeTheKidPrefixedComponent extends UserBadgeComponent implements OnChanges {
	deriveUserName() {
		return `The Kid ${this.name}`;
	}
}
