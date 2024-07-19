import { Component } from '@angular/core';
import { ContainerCardComponent } from '../../shared/container-card/container-card.component';
import { CardComponent } from '../../shared/card/card.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [ContainerCardComponent, CardComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent {

}
