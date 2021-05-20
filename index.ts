import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";

/**
 * Typically if you want to create a component that extends another component's
 * implementation, you have two options:
 *
 *   1. Create a component which extends the base component (at the class
 *      inheritance level) and refernce your base component's template
 *      file directly in your Component's `templateUrl`
 *   2. Create a component which extends the base component, but also render
 *      an instance of the base component from your components template.
 *
 * In (1), there is only one instance of the component in question, and things
 * are relatively straightforward. However, (2) is your only option
 * if you need to implement a component that looks and acts like your base
 * component in every way except that its template needs to be wrapped with
 * some additional markup.
 *
 * You often run into (2) when creating container level components, or a component
 * that wants to wrap another component's template but include custom markup above
 * or below the template of the component it wraps.
 *
 * In the latter case, because you are rendering the html element
 * from the template of your extending component, you end up with two
 * instances of SimpleTableComponent. In the latter case, what is effectively
 * taking place is Object Composition (discussed to some extent here:
 * https://www.arcanys.com/blog/angular-components-templating-and-reusability).
 *
 * The tl;dr of object composition is that its difficult to maintain and makes
 * it very easy to code up a component that swallows many bits of the API of
 * the component it is intended to wrap, but it is often required.
 * We have suffered this pain on our codebase in simple-form-component,
 * which calls to confirm-dialog-container. confirm-dialod-container exposes
 * a TON of configuration options as @Inputs() (15 to be exact). In order for
 * simple-form.component to maintain the same level of customization as
 * confirm-dialog-container, we had to expose all of the
 * confirm-dialog-container @Inputs() as @Inputs() on simple-form-component, and
 * proxy them all to our own instance of confirm-dialog-container. This ExtendToTemplate
 * paradign __could__ be applied there as well (though a refactor to remove
 * dialog concerns from a form, or to leverage content projection will likely
 * prove to be the more prudent approach in that case).
 *
 * Angular supports component class inheritance by way of javascript class
 * inheritence, but they don't at all handle the idea of template inheritance.
 * ExtendToTemplate() helps us work around this shortcoming in the
 * Angular Framework.
 *
 * This whole concept of ExtendToTemplate() as well as the _extendToTemplateBridge we
 * autogenerate and set on "ourselves" exists to support the use case in (2)
 * and make the process as seamless as possible for future developers who
 * dont care about the implementation of simple-table itself, but only know
 * they need to be able to build a table that supports a different use case and
 * the API we all expect out of a component that looks like a simple table.
 * If it looks like a simple table, it should BE a simple table.
 *
 * This ExtendToTemplate() decorator is the little piece of magic that helps
 * maintainers of SimpleTableComponent quickly add new properties or methods
 * that a parent SimpleFormComponent instance needs to keep in sync with its
 * child when wrapping the form. This enables us to enhance the underlying
 * simple table implementation while minimizing existing implementations.
 * If we add a new @Input() to simple table, all of *SimpleTable components
 * will inherit it for free, without us having to write any code.
 *
 * How's it work? We decorate any SimpleTableComponent class property that should
 * get passed down to its child SimpleTableComponent instance with the
 * @ExtendToTemplate() decorator. This decorator maintains a list of
 * all class properties that contain the decorator on the instance of the class
 * itself. This list of properties is then used to auto-generate an object
 * which we pass down to our child simple-table via the _simpleTableRenderBridge.
 *
 * Possible Future enhancements:
 * 	 - namespace support for bridging to multiple templates
 *   - native support for all Input() and Output() (eliminating the need for
 *     ExtendToTemplate decorator calls on anything thats not a function)
 *   - automatically extend all non ng* instance methods, eliminating the
 *     need for the decorator entirely
 */
export function ExtendToTemplate(): (target: DecoratedByExtendToTemplate<any>, propertyKey: string) => any {
	return (target: DecoratedByExtendToTemplate<any>, propertyKey: string): any => {
		if (!target['_extendToTemplateProps']) {
			target['_extendToTemplateProps'] = [];
		}
		target['_extendToTemplateProps'].push(propertyKey);
	};
}

@Component({
	template: ''
})
export class DecoratedByExtendToTemplate<T> implements OnChanges, OnDestroy {
	/**
	 * Automatically managed by the ExtendToTemplate decorator. This array
	 * lists the key associated with all properties on the Class instance
	 * that we should bridge down to the template.
	 */
	// @ts-ignore
	private _extendToTemplateProps: string[];

	/**
	 * Static, local copy of all of our instance properties that we
	 * bridge down to our extended template call. Caching this
	 * in onChanges prevents change detection from running infinitely
	 * due to the fact that we pass a programatically derived object as
	 * input
	 */
	private __extendToTemplateBridge: Partial<T> = {};

	private _outputSubscriptions: any[] = [];

	constructor() {
		this.updateExtendsTemplateBridge = this.updateExtendsTemplateBridge.bind(this);
	}

	public ngOnChanges(_changes: SimpleChanges): void {
        // skip over _extendToTemplateBridge, which is handled by a setter
		if (!_changes._extendToTemplateBridge) {
			this.updateExtendsTemplateBridge();
		}
    }

	public ngOnDestroy(): void {
		clearOutoutSubscriptions.bind(this)();
	}

	private updateExtendsTemplateBridge(): void {
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

	// When one component that extends another needs to create its
	// own, internal instance of that component by way of wrapping
	// its template, the base component can extend DecoratedByExtendToTemplate
	// and decorate properties that need to be synced between instances
	// with ExtendToTemplate(). From there, the decorator/base class
	// will  provide the _extendToTemplateBridge as a quick way to
	// pass all component inputs outputs, and member functions down
	// to your child instance.
	// To use:
	//    MyComponent extends DecoratedByExtendToTemplate { ... }
	//    MyComponent2 extends MyComponent { ... }
	// And then in your template for my-component-2:
	//    <my-component
	//      [_extendToTemplateBridge]="_extendToTemplateBridge"
	//    >
	//    </my-component>
	@Input()
	public set _extendToTemplateBridge(config: Partial<T>) {
		clearOutoutSubscriptions.bind(this)();
		Object.keys(config).forEach((key: string): void => {
			// @ts-ignore
			if (typeof config[key]?.subscribe === 'function' && typeof config[key]?.next === 'function') {
				// @ts-ignore
				let sub = this[key].subscribe((...args: never[]): void => {
					// @ts-ignore
					config[key].next(...args);
				});
				this._outputSubscriptions.push(sub);
				// @ts-ignore
			} else if (typeof config[key] !== 'undefined') {
				// @ts-ignore
				this[key] = config[key];
			}
		})
		this.updateExtendsTemplateBridge();
	}
	public get _extendToTemplateBridge(): Partial<T> {
		return this.__extendToTemplateBridge;
	}
}

function clearOutoutSubscriptions(): void {
	// @ts-ignore
	this._outputSubscriptions.forEach((sub: any) => {
		sub.unsubscribe();
	});
	// @ts-ignore
	this._outputSubscriptions = [];
}
