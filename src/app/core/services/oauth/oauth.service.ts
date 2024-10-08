import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { config } from 'dotenv';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  filter,
  first,
  map,
  Observable,
  of,
  ReplaySubject,
  Subscription,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OAuthService {
  //private _redirect_uri: string = 'http://localhost:4000/';
  private readonly _client_id = environment.client_id;
  private _authCode!: string;
  //public user: ReplaySubject<AuthenticatedUser> = new ReplaySubject(1);
  public user: BehaviorSubject<AuthenticatedUser> = new BehaviorSubject({
    name: '',
    email: '',
    avatar_url: '',
    isAuthenticated: false.valueOf(),
  });

  constructor(private http: HttpClient, private router: Router) {}

  public getAuthCode({ url }: NavigationStart) {
    this._authCode = url.split('=')[1];
  }

  public hasCodeQueryParam({ url }: NavigationStart) {
    const regex = /^([^?&]*\?code=[^&]*)$/;
    return regex.test(url);
  }

  public autorize() {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${this._client_id}`;
  }

  public logout() {
    sessionStorage.removeItem('token');
    this.user.next({
      name: '',
      email: '',
      avatar_url: '',
      isAuthenticated: false,
    });
  }

  public authenticate() {
    const token = sessionStorage.getItem('token');
    if (token) {
      return this.getUserData(token).pipe(
        catchError((error: IResponseGithubOAuthError) => {
          if ((error.status = '401')) {
            sessionStorage.removeItem('token');
            this.autorize();
            return of();
          }
          tap(() => {
            this.user.next({
              name: '',
              avatar_url: '',
              email: '',
              isAuthenticated: false,
            });
          });
          return throwError(() => ({
            message: 'Usuário ainda não autorizou!',
          }));
        }),
        tap((data) => {
          this.saveUserData(data.email).subscribe();
        })
      );
    }
    return this.accessToken().pipe(
      first(),
      concatMap((data) => this.getUserData(data.access_token)),
      tap((data) => sessionStorage.setItem('token', data.token)),
      tap((data) => {
        this.saveUserData(data.email).subscribe();
      })
    );
    //(data) => this.getUserData(data.access_token))
  }

  public accessToken() {
    return this.router.events.pipe(
      filter((e) => e instanceof NavigationStart),
      switchMap((event) => {
        const { url } = event;
        const hasQueryParam = /^([^?&]*\?code=[^&]*)$/.test(url);

        if (hasQueryParam) {
          this._authCode = url.split('=')[1];
          return this.http.post<IResponseGithubOAuth>(
            '/api/auth',
            {
              code: this._authCode,
            },
            {
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'X-Requested-With',
              },
            }
          );
        }

        return throwError(() => ({
          message: 'Usuário ainda não autorizou!',
        }));
      })
    );
  }

  public getUserData(token: string) {
    return this.http
      .get<IResponseAuthenticatedUser>('https://api.github.com/user', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        concatMap((user) => {
          return this.getSession(user.email).pipe(
            tap(({ activeSignature }) => {
              this.user.next({
                name: user.name,
                email: user.email,
                avatar_url: user.avatar_url,
                isAuthenticated: true,
                signature: activeSignature,
              });
            }),
            catchError((err) => {
              this.user.next({
                name: user.name,
                email: user.email,
                avatar_url: user.avatar_url,
                isAuthenticated: true,
              });
              return throwError(() => ({
                message: 'Erro na hora de buscar a assinatura!',
                error: err,
              }));
            }),
            map(() => ({ ...user, token }))
          );
        })
        // tap((user) => {

        //   this.user.next({ ...user, isAuthenticated: true });
        //   this.user.next({ ...user, isAuthenticated: true });
        // }),
        //map((user) => ({ ...user, token }))
      );
  }

  private saveUserData(email: string) {
    return this.http
      .post('/api/save_user', {
        email,
      })
      .pipe(
        take(1),
        catchError((err) => throwError(() => err))
      );
  }

  public getSession(email: string) {
    return this.http.post<{ activeSignature: 'active' | 'canceled' | null }>(
      '/api/session',
      {
        email,
      }
    );
    // .pipe(
    //   take(1),
    //   catchError((err) => throwError(() => err)),
    //   tap(({ activeSignature }) =>
    //     this.user.next({
    //       ...this.user.getValue(),
    //       signature: activeSignature,
    //     })
    //   )
    // );
  }

  private handleError(error: IResponseGithubOAuthError) {}
}
