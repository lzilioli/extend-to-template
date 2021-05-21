import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	public twoWayBindedName: string = 'The Developer!';
	public logResults(...args: unknown[]): void {
		console.log('one of the buttons was clicked', ...args);
	}
}
