import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    constructor(private router: Router) {}

    badgevisible = false;
  badgevisibility() {
    this.badgevisible = true;
  }
    admin() {
  // Navigate to the dashboard component
  this.router.navigate(['/admin']);
}
  user() {
  // Navigate to the dashboard component
  this.router.navigate(['/user']);
}
  edit() {
  // Navigate to the dashboard component
  this.router.navigate(['/edit']);
}

}
``
