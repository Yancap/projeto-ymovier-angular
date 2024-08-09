import { Component, inject, OnInit } from '@angular/core';
import {
  NavigationStart,
  Router,
  RouterEvent,
  RouterOutlet,
} from '@angular/router';
import { SignInComponent } from './shared/sign-in/sign-in.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { filter, Subscription } from 'rxjs';
import { OAuthService } from './core/services/oauth/oauth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SignInComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'projeto-ymovier-angular';
  constructor(private oAuthService: OAuthService) {}
 ngOnInit() {
    //console.log(window.location);
    this.oAuthService.checkAuth().subscribe();
  }
}
