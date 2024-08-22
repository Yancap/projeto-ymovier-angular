import { Component, OnDestroy, OnInit } from '@angular/core';
import { StripeService } from '../../core/services/stripe/stripe.service';
import { Subscription } from 'rxjs';
import { OAuthService } from '../../core/services/oauth/oauth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signature-button',
  standalone: true,
  imports: [RouterModule],
  template: `
    @if (!this.user || this.user.signature !== "active") {
      <button (click)="signature()">Assine agora</button>
    } @else {
      <button routerLink="/catalog">Ver o catalogo</button>
    }
  `,
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
    // this.oAuthService.user.subscribe((user) => {
    //   this.user = user;
    // });
  }

  public async signature() {
    if (!this.user || !this.user.isAuthenticated) {
      this.oAuthService.autorize();
    } else {
      if(this.user.signature !== "active") this.redirectToCheckoutSubscription = (
        await this.stripeService.redirectToCheckout()
      ).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.redirectToCheckoutSubscription?.unsubscribe();
  }
}
