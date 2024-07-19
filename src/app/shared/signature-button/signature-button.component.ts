import { Component } from '@angular/core';

@Component({
  selector: 'app-signature-button',
  standalone: true,
  imports: [],
  template: `<button onClick="{handleSignature}">Assine agora</button>`,
  styleUrl: './signature-button.component.scss',
})
export class SignatureButtonComponent {}
