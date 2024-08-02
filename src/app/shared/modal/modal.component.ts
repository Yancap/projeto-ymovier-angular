import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnInit, AfterViewInit {
  @Input() public movie!: Movie;
  @Input() public closeModal!: () => void;
  @ViewChild('sectionModal') sectionModal!: ElementRef<HTMLSelectElement>;
  @ViewChild('containerModal') containerModal!: ElementRef<HTMLDivElement>;
  @ViewChild('iframeDiv') iframeDiv!: ElementRef<HTMLDivElement>;
  public viewMovie = false;

  constructor() {}
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    console.log(this.iframeDiv);
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
}
