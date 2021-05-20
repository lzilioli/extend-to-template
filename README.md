- [Is it possible to extend a Template in Angular 2?
](https://stackoverflow.com/questions/45464891/is-it-possible-to-extend-a-template-in-angular-2)
- [Angular Component Inheritance and Template Swapping](https://coryrylan.com/blog/angular-component-inheritance-and-template-swapping)
  - Cons: Templates are totally disjointed. If there were more inputs, outputs, or need to share, this is hard
  - [Template inheritance with ng-content or similar](https://github.com/angular/angular/issues/13757)
    - https://wicket.apache.org/learn/examples/markupinheritance.html
    - https://github.com/angular/angular/issues/13766

[How to inherit a component in Angular and reuse its template](https://medium.com/acute-angular/how-to-inherit-a-component-in-angular-and-reuse-its-template-88b9cbb4b55)

> Usually, we end up making a compromise and do something like this.
```
@Component({
  selector: 'eg-child',
  template: `<eg-base></eg-base>`,
})
export class ChildComponent {
  // ...
}
```
> This is a compromise because this is a [Composition of objects](https://www.tutorialspoint.com/difference-between-inheritance-and-composition-in-java) rather than Inheritance. Also, it may not be clear at the beginning, but it paves the path for further > design compromises in future, OR you are not able to leverage the powers of object-oriented programming.

Pro Inheritance:
https://www.bitovi.com/blog/4-reasons-to-fall-in-love-with-angular-component-inheritance
https://blog.bitsrc.io/component-inheritance-in-angular-acd1215d5dd8

I will note, in an ideal world, composition of objects would be well supported by typescript, and a lot of these problems we are trying to solve with inheritance go away, however since typescript only supports class extension via inheritance, I think this is the way to go.
