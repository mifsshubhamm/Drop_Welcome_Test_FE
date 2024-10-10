import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

/**
 * @component AppComponent
 * 
 * The `AppComponent` serves as the root component of the Angular application.
 * It is responsible for bootstrapping the application and defining the main layout.
 * 
 * @import { Component } from '@angular/core'
 * @import { RouterModule, RouterOutlet } from '@angular/router'
 * 
 * @selector app-root
 * 
 * @templateUrl ./app.component.html
 * @styleUrl ./app.component.css
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  /**
   * @public title
   * @type {string}
   * 
   * The title of the application, used for display purposes.
   */
  title:string = 'hacker_news_ui';
}
