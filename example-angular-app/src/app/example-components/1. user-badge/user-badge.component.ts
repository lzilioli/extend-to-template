
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges
} from '@angular/core';
import { DecoratedByExtendToTemplateComponent, ExtendToTemplate } from 'extend-to-template';

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
	extends DecoratedByExtendToTemplateComponent<UserBadgeComponent>
	implements OnChanges, OnDestroy, User {

    @ExtendToTemplate()
    @Input() public name: string = '';

	@ExtendToTemplate()
	@Output() nameChange: EventEmitter<string> = new EventEmitter<string>();

    @ExtendToTemplate()
    @Input() public description: string = '';
    @ExtendToTemplate()
    @Input() public tags: string[] = [];

	@ExtendToTemplate()
	@Output() public userDataEmit: EventEmitter<User> = new EventEmitter<User>();

	private nameChangeCount: number = 0;

	public emitUserData(): void {
		this.userDataEmit.next({
			name: this.name,
			description: this.description,
			tags: this.tags,
		});
	}

	@ExtendToTemplate()
	public changeName(): void {
		this.nameChangeCount = this.nameChangeCount + 1;
		this.nameChange.next(`${this.name} ${this.nameChangeCount}`);
	}

	@ExtendToTemplate()
	public deriveUserName(): string {
		return this.name;
	}

	public ngOnChanges(_changes: SimpleChanges): void {
        // be sure and call super.ngOnChanges() if you
		// override ngOnChanges when extending
		// DecoratedByExtendToTemplateComponent
	    super.ngOnChanges(_changes);
	}

	public ngOnDestroy(): void {
        // be sure and call super.ngOnDestroy() if you
		// override ngOnDestroy when extending
		// DecoratedByExtendToTemplateComponent
	    super.ngOnDestroy();
	}
}
