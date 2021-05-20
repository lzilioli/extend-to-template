import {
	Component,
	OnChanges
} from '@angular/core';
import { UserBadgeComponent } from '../1. user-badge/user-badge.component';

/**
 * @extends UserBadgeComponent
 * @overrides deriveUserName() to prepend "The Kid" to the name when displaying it in the user-panel.
 */
@Component({
	selector: 'user-badge-with-the-kid',
	styleUrls: [
		'../1. user-badge/user-badge.component.scss',
		'./user-badge-with-the-kid.component.scss'
	],
	templateUrl: '../1. user-badge/user-badge.component.html',
})
export class UserBadgeWithTheKidComponent extends UserBadgeComponent implements OnChanges {
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
