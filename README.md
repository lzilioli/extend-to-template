# Angular - Inheriting Component Implementations AND Their Templates

There are multiple posts peppered around the internet where people are asking for better support for component inheritance in Angular.

- [Is it possible to extend a Template in Angular 2?](https://stackoverflow.com/questions/45464891/is-it-possible-to-extend-a-template-in-angular-2)
- [Template inheritance with ng-content or similar](https://github.com/angular/angular/issues/13757)
- [Angular Component Inheritance and Template Swapping](https://coryrylan.com/blog/angular-component-inheritance-and-template-swapping)
- [Component Inheritance in Angular](https://dev.to/krishnapolanki/component-inheritance-in-angular-189k)

There is an [open proposal](https://github.com/angular/angular/issues/13766) for `ng-descendant` in Angular, which would meet the open needs around accessing the template of the component which your component extends from within your components template. **If addressed, the solution documented in this repo is obviated.**

# Problem Statement

I strongly recommend you read the entirety of [the ng-descendant proposal](https://github.com/angular/angular/issues/13766) because it contextualizes the problem well.

Component composition (where you wrap one component template by making a completely new component) is not better than component inheritance for two reasons:

1. Syncing state of components via `@Input()`s and `@Output()`s makes it easy to swallow APIs and leave derivative implementations in the dust.
2. It forces us to implement all variance in behavior of our base component by way of `@Input()`s and `@Output()`s, rather than leveraging the overriding power afforded by class inheritance.

In Angular, we have strict class inheritance by way of TypeScript, but we do not have many good choices if the template of our derivative component needs to diverge in any way from the template of the base component it extends. Picture a table component that wants to display a summary of the table data above the table itself, but still wants to to emulate the full component API of a table component.

The rest of this README talks through the problem, and one proposed solution. The proposed solution is already codified within this repository, in [index.ts](./index.ts). There is also an example app ([code](https://github.com/lzilioli/extend-to-template)) ([live preview](https://lzilioli.github.io/extend-to-template/)) that illustrates how to leverage this proposed solution in your own components

# Problem Deep Dive

In lieu of `ng-descendant`, If we want one component to inherit from another, we are left with two options. This has been the case since Angular2. Neither is optimal in the template department. Let's explore them:

## Option 1 - Extend Base and Point to its Template

This option is recommended when you need to introduce functional or stylistic variance to a `BaseComponent`, but don't need to modify the template.

```typescript
@Component({
  selector: 'derived',
  styleUrls: [
    '../base/base.component.scss',
    './derived.component.scss'
  ],
  templateUrl: '../base/base.component.html'
})
export class DerivedComponent extends BaseComponent {}
```

In this case, the `DerivedComponent` inherits all of the `@Input()`s, `@Output()`s, and behaviors of the `BaseComponent` that it extends.

Note, the `templateUrl` points to the template for `base-component.html`, `derived-component` doesn't have its own template definition. If we require variance in our template, we must proceed to Option 2:

## Option 2 - Wrap the Base Component

In Option 2, people usually recommend creating a new component which wraps the base component's template, and go from there:

```typescript
@Component({
  selector: 'derived',
  template: `
    <div class="header"> ... </div>
    <div class="content>
        <!-- call to BaseComponent template here -->
        <base></base>
    </div>
    <div class="footer"> ... </div>
  `
})
export class DerivedComponent {}
```

Option 2 is attractive, until we consider the design compromises it forces us to make:

The following excerpt is from [How to inherit a component in Angular and reuse its template](https://medium.com/acute-angular/how-to-inherit-a-component-in-angular-and-reuse-its-template-88b9cbb4b55):

> Usually, we end up making a compromise [code sample redacted]. This is a compromise because this is a [Composition of objects](https://www.tutorialspoint.com/difference-between-inheritance-and-composition-in-java) rather than Inheritance. Also, it may not be clear at the beginning, but it paves the path for further > design compromises in future, OR you are not able to leverage the powers of object-oriented programming.

If we dig into some GitHub issues, we see that [enterprise developers find neither of these two options ideal](https://github.com/angular/angular/issues/7968#issuecomment-220110780). It is hard to build a white-label product without template-level extends. It is also difficult to implement variance in components for AB testing purposes.

Allow me to illustrate the design compromises. Consider the example above, this time with a filled out implementation for the `BaseComponent`, and a simplified template in the `DerivedComponent`.

```typescript
@Component({
  selector: 'base',
  template: `
    <button (click)="emitUserData()>{{buttonText}}</button>
  `
})
export class BaseComponent {
  @Input() buttonText = 'Click Me';
  @Output() userDataEmit = new EventEmitter();
  protected clickCount = 0;
  emitUserData() {
    this.clickCount = this.clickCount + 1;
    this.userDataEmit.next(this.clickCount);
  }
}

@Component({
  selector: 'derived',
  template: `<base></base>`
})
export class DerivedComponent {}
```

Let's examine some design issues with `DerivedComponent` in the above example.

In both cases, when you render either component, with `<base></base>` or `<derived></derived>`, the result on the page will be a button with the text `Click Me`. It would stand to reason, then, that you should be able to render either component as follows:

```typescript
<base
  buttonText="Hello!"
  (userDataEmit)="logButtonClick()"
></base>

<derived
  buttonText="Hello!"
  (userDataEmit)="logButtonClick()"
></derived>
```

However, if the resulting page renders two buttons, the first button saying `Hello!`, and the second saying `Click Me!`. In addition, only the first button will omit its click count when it is clicked. The second button won't invoke `logButtonClick` in your component when the button is clicked.

We would need to add some code to `DerivedComponent` in order to fix this:

```typescript
@Component({
  selector: 'derived',
  template: `
		<base
		  buttonText="buttonText"
		  (userDataEmit)="emitUserData()"
		></base>
	`
})
export class DerivedComponent {
  @Input() buttonText = 'Click Me';
  @Output() userDataEmit = new EventEmitter();
  protected clickCount = 0;
  emitUserData() {
    this.clickCount = this.clickCount + 1;
    this.userDataEmit.next(this.clickCount);
  }
}
```

We could improve this situation by extending the `BaseComponent` class:

```typescript
@Component({
  selector: 'derived',
  template: `
		<base
		  buttonText="buttonText"
		  (userDataEmit)="emitUserData()"
		></base>
	`
})
export class DerivedComponent extends BaseComponent {}
```

This looks great! But as the API of `BaseComponent` grows to include additional `@Input()`s and `@Output()`s, we will need to update the template for all implementations of `DerivedCompnent` which `extends BaseComponent` and re-uses the html element in this way. It is easy to imagine this tech debt piling up and your individual implementations of `DerivedComponent`'s API diverging from the `BaseComponent` which they are intended to implement. This is confusing for future developers who are trying to consume your `DerivedComponent` and expect anything that looks like a `BaseComponent` to support the expected `@Input()`s and `@Output()`s.

Also, if you were to override a method from `BaseComponent` in `DerivedComponent` in the above example, you might be surprised to see that your component on the page does not honor the overridden
logic that you implemented in `DerivedComponent`. This is super frustrating!

What's really going on? It may not look like it when you load up the page, because you
only see a single button when you render `<derived>` but there are two
instances of a `BaseComponent` in memory for every one `<derived>` component
you instantiate through a template. As it stands in the above code sample, it
is left as an exercise to the developers of `DerivedComponent` to make sure
their implementations support the full underlying API of the `BaseComponent`
from which they extend. As previously stated, this comes with long-term
maintainence issues as more and more specialized implementations of
components that `extend BaseComponent` are added to the codebase.

By way of component `@Input()`s and `@Output()`s is we are effectively keeping
state in sync between parent and child, and losing the ability to override method
implementations.

Case we do better?

# Proposed Solution (The Purpose of This Repo)

What if we had a list of properties that need to be passed down
from `DerivedComponent` to the instance of `BaseComponent` spawned in
`DerivedComponent`'s template? This would enable us to build a mapping of
`{ [key: keyof BaseComponent]: <value from DerivedComponent> }`
which we pass down as a single `@Input()` to `BaseComponent`. If `BaseComponent`
could handle this single input and "inherit" its values, then we could use
this object mapping input in combination with angular change detection to
keep the values in sync between `DerivedComponent` and its child `BaseComponent`
instance. `BaseComponent` could then take this object as a specialized `@Input()`
and extend those properties into itself.

```typescript
// untested code sample
@Component({
  selector: 'base',
  template: `
    <button (click)="emitUserData()>{{buttonText}}</button>
  `
})
export class BaseComponent extends DecoratedByExtendToTemplateComponent implements OnChanges {
  @Input() buttonText = 'Click Me';

  @Output() userDataEmit = new EventEmitter();
  protected clickCount = 0;

  public _extendToTemplateBridge: Partial<BaseComponent> = {};

  @Input()
	public set _extendToTemplateBridge(config: Partial<T>) {
		Object.keys(config).forEach((key: string): void => {
      if (typeof config[key]?.subscribe === 'function' && typeof config[key]?.next === 'function') {
        // Handle @Output-like objects by subscribing to our inner event
        // (which we trust our component code to invoke when appropriate)
        // by subscribing to them and passing them directly to the emitter
        // by the same name in our descendant.
				this[key].subscribe((...args: never[]): void => {
					config[key].next(...args);
				});
			} else if (typeof config[key] !== 'undefined') {
				this[key] = config[key];
			}
		})
		this.updateExtendToTemplateBridge();
	}

  emitUserData() {
    this.clickCount = this.clickCount + 1;
    this.userDataEmit.next(this.clickCount);
    // We need to call this method whenever we modify a value
    // which we are passing down to our descendant. In this case,
    // this.clickCount was just incremented by 1.
    this.updateExtendToTemplateBridge();
  }

	public ngOnChanges(_changes: SimpleChanges): void {
    this.updateExtendToTemplateBridge()
	}

	private updateExtendToTemplateBridge(): void {
    /**
     * Note this is the somewhere we still need to manually maintain a list
     * of the properties that we want to sync with our decendant template
     */
    this._extendToTemplateBridge = {
      clickCount: this.clickCount,
      buttonText: this.buttonText,
      userDataEmit: this.userDataEmit,
      emitUserData: this.emitUserData,
    };
  }
}

@Component({
  selector: 'derived',
  template: `
  ... other markup ...
  <base
    [_extendToTemplateBridge]="_extendToTemplateBridge"
  ></base>
  ... other markup ...
  `
})
export class DerivedComponent extends BaseComponent {}
```

There it is, look at how clean our implementation of DerivedComponent is,
and we don't lose any of the state, inputs, outputs, or overridable methods
in the process.

There are two remaining pain points:

1. there is a lot of boiler plate code
2. we need to manually edit the map we build in
   updateExtendToTemplateBridge whenever we modify
  our BaseComponent implementation

## Packaging it All Up

[index.ts](./index.ts) within this repo exports two things:

`ExtendToTemplate()` - Class property decorator that indicates a property should be included in the descendant call

`DecoratedByExtendToTemplateComponent` - Base class which your `BaseComponent` should extend. This base class brings with it all of the functionality required to leverage the decorations added by `ExtendToTemplate`

Lets revisit the above example, this time with the `ExtendToTemplate` decorator:

```typescript
@Component({
  selector: 'base',
  template: `
    <button (click)="emitUserData()>{{buttonText}}</button>
  `
})
export class BaseComponent extends DecoratedByExtendToTemplateComponent implements OnChanges, OnDestroy {
  @ExtendToTemplate()
  @Input() buttonText = 'Click Me';

  @ExtendToTemplate()
  @Output() userDataEmit = new EventEmitter();

  @ExtendToTemplate()
  protected clickCount = 0;

  @ExtendToTemplate()
  emitUserData() {
    this.clickCount = this.clickCount + 1;
    this.userDataEmit.next(this.clickCount);
    this.updateExtendToTemplateBridge();
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

@Component({
  selector: 'derived',
  template: `
  ... other markup ...
  <base
    [_extendToTemplateBridge]="_extendToTemplateBridge"
  ></base>
  ... other markup ...
  `
})
export class DerivedComponent extends BaseComponent {}
```

You can explore the full details of the solution by exploring the code in [example-angular-app](./example-angular-app), where the [example components](https://github.com/lzilioli/extend-to-template/tree/stable/example-angular-app/src/app/example-components) leverage this solution to build on one-another.

## Alternative Approaches

Some might argue that rather than automagically deriving the object that we
pass down to our descendant template, we could wrap our descendant template without
extending its base component, and pidgonhole all behavior in the
underlying `BaseComponent` that needs to be modified through a single
config object.

The primary downside to this approach is that it is limiting to force all variance in
a components behavior through a single config object. Many people who are in search of inheritance in
their components are seeking the benefits brought on by being able to override a single
public or protected method implementation in their specialized case. Also, this approach
doesn't solve for synchronizing `@Output()`s from descendant to parent, so you still run
the risk of your component dom APIs diverging from the implementation of the
`BaseComponent` that you wrap.

## Additional Notes

For sharing JavaScript logic, is inheritance ideal? Not necessarily. A mixin pattern where sets of functionality can be chunked off and combined into a single component might be better in some cases. There are ways to achieve this with TypeScript, but TypeScript makes it difficult to express typings for a mixin library statically. This is one of the few areas JavaScript offers more power and expressiveness than TypeScript, in my opinion. Inheritance is the next best thing.

TypeScript **does** offer [mixins](https://www.typescriptlang.org/docs/handbook/mixins.html),
and many solutions that currently use inheritance would likely be much cleaner if they
used mixins instead, however mixins does not solve any of our problems when it comes to
wrapping a component in another component without swallowing any of the underlying component
@Input and @Output apis.

## Reference

### Pro Inheritance in Angular

- https://www.bitovi.com/blog/4-reasons-to-fall-in-love-with-angular-component-inheritance
- https://blog.bitsrc.io/component-inheritance-in-angular-acd1215d5dd8
