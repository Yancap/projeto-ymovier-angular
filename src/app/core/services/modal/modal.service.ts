import {
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  ViewContainerRef,
} from '@angular/core';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  public isOpen = false;
  private componentRef!: ComponentRef<ModalComponent>;
  public viewContainerRef!: ViewContainerRef
  constructor() {}

  openModal(movie: Movie) {
    this.componentRef = this.viewContainerRef.createComponent(ModalComponent);
    this.componentRef.instance.movie = movie;
    this.componentRef.instance.closeModal = () => this.closeModal(this.componentRef);
    window.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') {
        this.closeModal(this.componentRef);
      }
    });
  }

  closeModal(componentRef: ComponentRef<ModalComponent>) {
    window.removeEventListener('keydown', (ev) => {});
    componentRef.destroy();
  }

  public open() {
    this.isOpen = true;
  }

  public close() {
    this.isOpen = false;
  }
}
