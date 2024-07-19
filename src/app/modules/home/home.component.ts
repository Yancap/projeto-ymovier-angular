import { Component } from '@angular/core';
import { SignatureButtonComponent } from '../../shared/signature-button/signature-button.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SignatureButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
