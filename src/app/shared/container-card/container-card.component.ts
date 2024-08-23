import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-container-card',
  standalone: true,
  imports: [],
  templateUrl: './container-card.component.html',
  styleUrl: './container-card.component.scss',
})
export class ContainerCardComponent implements AfterViewInit {
  @ViewChild('containerCard') containerCard!: ElementRef<HTMLDivElement>;
  @ViewChild('leftArrow') leftArrow!: ElementRef<HTMLDivElement>;
  public isPressTimeout!: any;
  public movies!: Movie[];

  public ngAfterViewInit() {
    if (this.containerCard.nativeElement?.scrollLeft === 0) {
      if (this.leftArrow.nativeElement) {
        this.leftArrow.nativeElement.style.display = 'none';
      }
    } else {
      if (this.leftArrow.nativeElement) {
        this.leftArrow.nativeElement.style.display = 'flex';
      }
    }
  }

  public onScroll() {
    if (window.innerWidth > 480) this.handleScrollLeft('no-scroll');
  }

  public handleScrollLeft(action: string = 'none') {
    if (this.containerCard.nativeElement) {
      if (this.containerCard.nativeElement.scrollLeft === 0) {
        if (this.leftArrow.nativeElement) {
          this.leftArrow.nativeElement.style.display = 'none';
        }
      } else {
        if (this.leftArrow.nativeElement) {
          this.leftArrow.nativeElement.style.display = 'flex';
        }
      }
      if (action !== 'no-scroll') {
        this.isPressTimeout = setInterval(() => {
          this.containerCard.nativeElement.scrollBy({
            left: -3,
          });
        }, 1);
      }
    }
  }
  public handleScrollRight() {

    if (this.containerCard.nativeElement && window.screen.width > 480) {
      if (this.leftArrow.nativeElement) {
        this.leftArrow.nativeElement.style.display = 'flex';
      }
      this.isPressTimeout = setInterval(() => {
        this.containerCard.nativeElement.scrollBy({
          left: 3,
        });
      }, 1);
    }
  }

  public handleMouseUp() {
    clearInterval(this.isPressTimeout)
  }
}
