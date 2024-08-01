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
  @ViewChild('sectionModal') sectionModal!: ElementRef<HTMLSelectElement>;
  @ViewChild('containerModal') containerModal!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {}

  ngAfterViewInit(): void {

    if (this.sectionModal && this.containerModal) {
      console.log(window.matchMedia('(max-width:768px)').matches);

      if (window.matchMedia('(max-width:768px)').matches) {
        console.log(this.movie);
        this.sectionModal.nativeElement.style.backgroundImage = `url( ${this.movie.background.url} )`;
        this.containerModal.nativeElement.style.backgroundColor = `${this.movie.main_color}C1`;
        console.log(this.sectionModal.nativeElement.style);
      }
    }
  }
}
