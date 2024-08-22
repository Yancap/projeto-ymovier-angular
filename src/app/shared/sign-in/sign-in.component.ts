import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { OAuthService } from '../../core/services/oauth/oauth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent implements OnInit {
  public user!: AuthenticatedUser;
  constructor(private oAuthService: OAuthService) {}
  ngOnInit(): void {
    this.oAuthService.user.subscribe((user) => {
      this.user = user;
    })
    // this.oAuthService.user.subscribe((user) => {
    //   this.user = user;
    // })
  }
  public login() {
    this.oAuthService.autorize();
  }

  public logout() {
    this.oAuthService.logout();
  }
}
