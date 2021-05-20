
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges
} from '@angular/core';
import { DecoratedByExtendToTemplate, ExtendToTemplate } from 'extend-to-template';

interface User {
	name: string;
	description: string;
	tags: string[];
}

@Component({
	selector: 'user-badge',
	templateUrl: './user-badge.component.html',
	styleUrls: ['./user-badge.component.scss'],
})
export class UserBadgeComponent
	extends DecoratedByExtendToTemplate<UserBadgeComponent>
	implements OnChanges, OnDestroy, User {

    @ExtendToTemplate()
    @Input() public name: string = '';
    @ExtendToTemplate()
    @Input() public description: string = '';
    @ExtendToTemplate()
    @Input() public tags: string[] = [];

	@ExtendToTemplate()
	@Output() public buttonClicked: EventEmitter<User> = new EventEmitter<User>();

	public handleButtonClick(): void {
		this.buttonClicked.next({
			name: this.name,
			description: this.description,
			tags: this.tags,
		});
	}

	@ExtendToTemplate()
	public deriveUserName(): string {
		return this.name;
	}

	public ngOnChanges(_changes: SimpleChanges): void {
        // be sure and call super.ngOnChanges() if you
		// override ngOnChanges when extending
		// DecoratedByExtendToTemplate
	    super.ngOnChanges(_changes);
	}

	public ngOnDestroy(): void {
        // be sure and call super.ngOnDestroy() if you
		// override ngOnDestroy when extending
		// DecoratedByExtendToTemplate
	    super.ngOnDestroy();
	}
}
