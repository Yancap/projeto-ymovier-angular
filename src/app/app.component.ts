import { Component, Inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignInComponent } from './shared/sign-in/sign-in.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { PLATFORM_ID } from '@angular/core';
import { OAuthService } from './core/services/oauth/oauth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SignInComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private oAuthService: OAuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.oAuthService.authenticate().subscribe();
    }
  }
}
