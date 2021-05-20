There are multiple posts peppered around the internet where people are asking for better support for component inheritance in Angular.

- [Is it possible to extend a Template in Angular 2?](https://stackoverflow.com/questions/45464891/is-it-possible-to-extend-a-template-in-angular-2)
- [Template inheritance with ng-content or similar](https://github.com/angular/angular/issues/13757)
- [Angular Component Inheritance and Template Swapping](https://coryrylan.com/blog/angular-component-inheritance-and-template-swapping)
- [Component Inheritance in Angular](https://dev.to/krishnapolanki/component-inheritance-in-angular-189k)

There is an [open proposal](https://github.com/angular/angular/issues/13766) for `ng-descendant` in Angular, which would meet the open needs around accessing the template of the component which your component extends from within your components template. **If addressed, the solution documented in this repo is obviated.**

In lieu of this proposal being addressed, If we want one component to inherit from another, we are left with two options. This has been the case since Angular2. Neither is optimal in the template department. Let's explore them.

## Option 1 - Extend Base and Point to its Template

This option is recommended when you need to introduce functional or stylistic variance to a `BaseComponent`, but don't need to modify the template.

```
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

In this case, the `DerivedComponent` inherits all of the `@Inputs()`, `@Outputs()`, and behaviors of the `BaseComponent` that it extends. Note, the `templateUrl` points to the template for `base-component.html`, `derived-component` doesn't have its own template definition.

## Option 2 - Wrap the Base Component

In Option 2, people usually recommend creating a new component which wraps the base component's template, and go from there:

```
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

```
@Component({
  selector: 'base',
  template: `
    <button (click)="handleButtonClick()>{{buttonText}}</button>
  `
})
export class BaseComponent {
  @Input() buttonText = 'Click Me'
  @Output() buttonClicked = new EventEmitter();
  private clickCount = 0;
  handleButtonClick() {
    this.clickCount = this.clickCount + 1;
    this.buttonClicked.next(this.clickCount);
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

```
<base
  buttonText="Hello!"
  (buttonClicked)="logButtonClick()"
></base>

<derived
  buttonText="Hello!"
  (buttonClicked)="logButtonClick()"
></derived>
```

However, if the resulting page renders two buttons, the first button saying `Hello!`, and the second saying `Click Me!`. In addition, only the first button will omit its click count when it is clicked. The second button won't invoke `logButtonClick` in your component when the button is clicked.

We would need to add some code to `DerivedComponent` in order to fix this:

```
@Component({
  selector: 'derived',
  template: `
		<base
		  buttonText="buttonText"
		  (buttonClicked)="handleButtonClick()"
		></base>
	`
})
export class DerivedComponent {
  @Input() buttonText = 'Click Me'
  @Output() buttonClicked = new EventEmitter();
  private clickCount = 0;
  handleButtonClick() {
    this.clickCount = this.clickCount + 1;
    this.buttonClicked.next(this.clickCount);
  }
}
```

We could improve this situation by extending the `BaseComponent` class:

```
@Component({
  selector: 'derived',
  template: `
		<base
		  buttonText="buttonText"
		  (buttonClicked)="handleButtonClick()"
		></base>
	`
})
export class DerivedComponent extends BaseComponent {}
```

This looks great! But as the API of `BaseComponent` grows to include additional @Inputs and @Outputs, we will need to update the template for all implementations of `DerivedCompnent` which `extends BaseComponent` and re-uses the html element in this way. It is easy to imagine this tech debt piling up and your individual implementations of `DerivedComponent`'s API diverging from the `BaseComponent` which they are intended to implement. This is confusing for future developers who are trying to consume your `DerivedComponent` and expect anything that looks like a `BaseComponent` to support the expected `@Inputs()` and `@Outputs()`.



## Reference

### Pro Inheritance in Angular

- https://www.bitovi.com/blog/4-reasons-to-fall-in-love-with-angular-component-inheritance
- https://blog.bitsrc.io/component-inheritance-in-angular-acd1215d5dd8

## Additional Notes

For sharing JavaScript logic, is inheritance ideal? Not necessarily. A mixin pattern where sets of functionality can be chunked off and combined into a single component might be better in some cases. There are ways to achieve this with TypeScript, but TypeScript makes it difficult to express typings for a mixin library statically. This is one of the few areas JavaScript offers more power and expressiveness than TypeScript, in my opinion. Inheritance is the next best thing.
