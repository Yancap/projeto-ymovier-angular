import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment.development';
import { concatMap, first, tap, throwError } from 'rxjs';
import { OAuthService } from '../oauth/oauth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  public stripejs!: Stripe;
  constructor(private oAuthService: OAuthService, private http: HttpClient) {}

  private async loadStripe() {
    return loadStripe(environment.STRIPE_PUBLIC_KEY).then((instance) => {
      if (instance) this.stripejs = instance;
      else throw new Error('Erro na configuração do StripeJS');
    });
  }

  public async getStripeCheckoutSession() {
    if (!this.stripejs) await this.loadStripe();
    return this.http.post<ISessionId>('/api/signature', {
      email: this.oAuthService.user.getValue().email,
    });
  }

  public async redirectToCheckout() {
    if (!this.stripejs) await this.loadStripe();
    return (await this.getStripeCheckoutSession()).pipe(
      tap(async ({ sessionId }) => {
        await this.stripejs.redirectToCheckout({ sessionId });
      })
    );
  }
}
