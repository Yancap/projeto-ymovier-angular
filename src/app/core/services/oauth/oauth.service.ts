import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter, of, ReplaySubject, Subscription, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OAuthService {
  private readonly _client_id = 'Ov23liCeHvH2TP67FU5m'; //ca3cc27c2f25f109e0b1
  private readonly _client_secret = 'c3d5d694fd46ed4bdd4b3129bb0cfc9839cb87e5'; //193b760fee0ee229aca7094a28f619cc80e527f4
  private _redirect_uri: string = 'http://localhost:4000/';
  private readonly _state = '123';
  private _authCode!: string;

  constructor(private http: HttpClient, private router: Router) {}

  public getAuthCode({ url }: NavigationStart) {
    this._authCode = url.split('=')[1];
    // const search = window.location.search;
    // if (search) {
    // }
  }

  public hasCodeQueryParam({ url }: NavigationStart) {
    console.log(url);

    const regex = /^([^?&]*\?code=[^&]*)$/;
    return regex.test(url);
  }

  public autorize() {
    this._redirect_uri = window.location.origin;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${this._client_id}`; //&state=${this._state}

    //return this.http.get(`https://github.com/login/oauth/authorize?client_id=${this._client_id}`)
  }
  public checkAuth() {
    return this.router.events.pipe(
      filter((e) => e instanceof NavigationStart),
      switchMap((event) => {
        const { url } = event
        const hasQueryParam = /^([^?&]*\?code=[^&]*)$/.test(url);
        if (hasQueryParam) {
          this._authCode = url.split('=')[1];
          this.router.navigate([], {
            queryParams: {
              'yourParamName': null,
              'youCanRemoveMultiple': null,
            },
            queryParamsHandling: 'merge'
          }) //Remove Query Param
          return this.http.post(
            '/api/v1/auth',
            {
              client_id: this._client_id,
              client_secret: this._client_secret,
              code: this._authCode
            },
            {
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'X-Requested-With',
              },
            }
          ).pipe(tap((data) => {
            console.log(data);

          }));
        }
        return of();
      })
    );
  }
}
