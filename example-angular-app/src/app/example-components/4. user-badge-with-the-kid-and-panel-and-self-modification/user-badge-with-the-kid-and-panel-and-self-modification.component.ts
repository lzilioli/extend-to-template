import {
	Component
} from '@angular/core';
import { UserBadgeWithTheKidComponent } from '../2.B. user-badge-with-the-kid/user-badge-with-the-kid.component';

@Component({
	selector: 'user-badge-with-the-kid-and-panel-and-self-modification',
	styleUrls: [
		// Note we do NOT need the underlying stylesheet here
		// because it comes with our call to user-badge-with-panel
		// in the below inline template
		'../1. user-badge/user-badge.component.scss',
		'../2.A. user-badge-with-panel/user-badge-with-panel.component.scss',
		'./user-badge-with-the-kid-and-panel-and-self-modification.component.scss',
	],
	template: `
		<user-badge-with-the-kid
			[_extendToTemplateBridge]="_extendToTemplateBridge"
		></user-badge-with-the-kid>
		<button (click)="changeName()">Click to Change Name</button>
	`,
})
export class UserBadgeTheKidAndPanelAndSelfModificationComponent extends UserBadgeWithTheKidComponent {
	public changeName(): void {
		this.name = "RANDOM " + Math.random();
		this.nameChange.next(this.name);
	}
}
