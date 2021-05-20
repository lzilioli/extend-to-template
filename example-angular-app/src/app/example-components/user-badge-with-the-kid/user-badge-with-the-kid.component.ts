import {
	Component,
	OnChanges
} from '@angular/core';
import { UserBadgeComponent } from '../user-badge/user-badge.component';

/**
 * @extends UserBadgeComponent
 * @overrides deriveUserName()
 */
@Component({
	selector: 'user-badge-with-the-kid',
	styleUrls: [
		'../user-badge/user-badge.component.scss',
		'./user-badge-with-the-kid.component.scss'
	],
	templateUrl: '../user-badge/user-badge.component.html',
})
export class UserBadgeTheKidComponent extends UserBadgeComponent implements OnChanges {
	/**
	 * Overrides deriveUserName to prefix this.name with
	 * "The Kid". The base implementation returns this.name
	 * without modifications.
	 * @returns name, prefixed with "The Kid"
	 */
	deriveUserName() {
		return `The Kid ${this.name}`;
	}
}

@Component({
	selector: 'user-badge-with-the-kid-and-panel',
	styleUrls: [
		'../user-badge/user-badge.component.scss',
		'./user-badge-with-the-kid.component.scss'
	],
	template: `
		<user-badge-with-panel
			[_extendToTemplateBridge]="_extendToTemplateBridge"
		></user-badge-with-panel>
	`,
})
export class UserBadgeTheKidAndPanelComponent extends UserBadgeTheKidComponent implements OnChanges {}
