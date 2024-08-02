import { Component, Input } from '@angular/core';
import { ModalService } from '../../core/services/modal/modal.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input()
  public movie!: Movie;

  constructor(public modalService: ModalService) {}

  public openModal() {
    this.modalService.openModal(this.movie);
  }
}
