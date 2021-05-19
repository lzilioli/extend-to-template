
import {
	Component,
	Input,
	OnChanges
} from '@angular/core';
import { DecoratedByExtendToTemplate, ExtendToTemplate } from 'index';

@Component({
	selector: 'user-badge',
	templateUrl: './user-badge.component.html',
	styleUrls: ['./user-badge.component.scss'],
})
export class UserBadgeComponent
	extends DecoratedByExtendToTemplate<UserBadgeComponent>
	implements OnChanges {

    @ExtendToTemplate()
    @Input() public name: string = '';
    @ExtendToTemplate()
    @Input() public description: string = '';
    @ExtendToTemplate()
    @Input() public badges: string[] = [];

	constructor() {
		super();
	}

	@ExtendToTemplate()
	public deriveUserName(): string {
		return this.name;
	}

	// public ngOnChanges(_changes: SimpleChanges): void {
    //     // be sure and call super.ngOnChanges() if you override it
	//     super.ngOnChanges(_changes);
	// }
	// TODO illustrate bridging @Output()s
}
