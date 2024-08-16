import { Component, OnDestroy, OnInit } from '@angular/core';
import { StripeService } from '../../core/services/stripe/stripe.service';
import { Subscription } from 'rxjs';
import { OAuthService } from '../../core/services/oauth/oauth.service';

@Component({
  selector: 'app-signature-button',
  standalone: true,
  imports: [],
  template: `<button (click)="signature()">Assine agora</button>`,
  styleUrl: './signature-button.component.scss',
})
export class SignatureButtonComponent implements OnInit, OnDestroy {
  public user!: AuthenticatedUser;
  public redirectToCheckoutSubscription!: Subscription;
  constructor(
    private stripeService: StripeService,
    private oAuthService: OAuthService
  ) {}
  ngOnInit(): void {
    this.oAuthService.user.subscribe((user) => {
      this.user = user;
    });
  }

  public async signature() {
    if (!this.user || !this.user.isAuthenticated) {
      this.oAuthService.autorize();
    } else {
      this.redirectToCheckoutSubscription = (
        await this.stripeService.redirectToCheckout()
      ).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.redirectToCheckoutSubscription?.unsubscribe();
  }
}
