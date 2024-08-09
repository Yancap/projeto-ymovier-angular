import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { OAuthService } from '../../core/services/oauth/oauth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  constructor(private oAuthService: OAuthService, private http: HttpClient) {}
  async login() {
    console.log('login 1');

    this.oAuthService.autorize();

    // this.http.post('/v1/api/auth', {}).subscribe((a) => {
    //   console.log(a);

    // })
    //const json = await as.json()
    //console.log(as);
  }

  logout() {}
}
