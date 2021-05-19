import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import assign from "lodash.assign";


// tslint:disable: no-any no-implicit-any
export function ExtendToTemplate(): (target: DecoratedByExtendToTemplate<any>, propertyKey: string) => any {
	return (target: DecoratedByExtendToTemplate<any>, propertyKey: string): any => {
		// @ts-ignore
		if (!target['_extendToTemplateProps']) {
			// @ts-ignore
			target['_extendToTemplateProps'] = [];
		}
		// @ts-ignore
		target['_extendToTemplateProps'].push(propertyKey);
		// tslint:disable-next-line: no-any
		// @ts-ignore
		function updateExtendsTemplateBridge(): void {
			// tslint:disable-next-line: no-any
			const templateBridge: Partial<any> = {};
			// @ts-ignore
			this['_extendToTemplateProps'].forEach((prop: string): void => {
				// @ts-ignore
				if (typeof this[prop] === 'undefined') {
					return;
				}
				// @ts-ignore
				if (typeof this[prop] === 'function') {
					// @ts-ignore
					templateBridge[prop] = this[prop].bind(this);
					return;
				}
				// @ts-ignore
				templateBridge[prop] = this[prop];
			});
			// @ts-ignore
			this['__extendToTemplateBridge'] = templateBridge;
		}
		target['updateExtendsTemplateBridge'] = updateExtendsTemplateBridge;
	};
}
// tslint:enable: no-any no-implicit-any

@Component({
	template: ''
})
export class DecoratedByExtendToTemplate<T> implements OnChanges {
	// When one component that extends SimpleTableComponent needs to create its
	// own, internal instance of SimpleTableComponent by way of wrapping its template,
	// we provide the _simpleTableTemplateBridge as a quick way to pass all component
	// inputs and relevant methods down to your child instance easy.
	// To use:
	//    MySimpleTableComponent extends SimpleTableComponent { ... }
	// And then in your template:
	//    <simple-table
	//      *ngIf="isInitialized"
	//      [_simpleTableTemplateBridge]="_simpleTableTemplateBridge"
	//    > <!-- Own content projected templates (which consumers may overide) -->
	//    </simple-table>
	@Input()
	public set _extendToTemplateBridge(config: Partial<T>) {
		assign(this, config);
		this.updateExtendsTemplateBridge();
	}
	public get _extendToTemplateBridge(): Partial<T> {
		return this.__extendToTemplateBridge;
	}

	constructor() {
		this.updateExtendsTemplateBridge = this.updateExtendsTemplateBridge.bind(this);
	}

	private _extendToTemplateProps: string[] | undefined;
	private __extendToTemplateBridge: Partial<T> = {};
	protected updateExtendsTemplateBridge(): void {}
    ngOnChanges(_changes: SimpleChanges): void {
        this.updateExtendsTemplateBridge();
    }
}
