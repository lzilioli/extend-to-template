import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ExampleComponentsModule } from './example-components/example-components.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ExampleComponentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
