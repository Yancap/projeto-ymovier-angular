import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { OAuthService } from '../../core/services/oauth/oauth.service';
import { Subscription } from 'rxjs';
import { StripeService } from '../../core/services/stripe/stripe.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() public movie!: Movie;
  @Input() public closeModal!: () => void;
  @ViewChild('sectionModal') sectionModal!: ElementRef<HTMLSelectElement>;
  @ViewChild('containerModal') containerModal!: ElementRef<HTMLDivElement>;
  @ViewChild('iframeDiv') iframeDiv!: ElementRef<HTMLDivElement>;
  public viewMovie = false;
  public user!: AuthenticatedUser;
  public redirectToCheckoutSubscription!: Subscription;

  constructor(private oAuthService: OAuthService, private stripeService: StripeService) {}

  ngOnInit(): void {
    this.oAuthService.user.subscribe((user) => {
      this.user = user;
    });
  }

  ngAfterViewInit(): void {
    if (this.iframeDiv) {
      this.iframeDiv.nativeElement.innerHTML = this.movie.iframe;
    }
    if (this.sectionModal && this.containerModal) {
      if (window.matchMedia('(max-width:768px)').matches) {
        this.sectionModal.nativeElement.style.backgroundImage = `url( ${this.movie.background.url} )`;
        this.containerModal.nativeElement.style.backgroundColor = `${this.movie.main_color}C1`;
      }
    }
  }

  public watchMovie() {
    this.viewMovie = true;
    setTimeout(() => {
      const iframeDiv = document.querySelector('div.film');

      if (iframeDiv) {
        iframeDiv.innerHTML = this.movie.iframe;
      }
    }, 1);
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
