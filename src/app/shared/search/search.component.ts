import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  @ViewChild('input') inputElement!: ElementRef<HTMLInputElement>;
  constructor(private router: Router) {}

  public search() {
    const searchTerm = this.inputElement.nativeElement.value;

    if (searchTerm)
      this.router.navigate(['/search'], {
        queryParams: { search: searchTerm },
      });
    this.inputElement.nativeElement.value = '';
  }
}
