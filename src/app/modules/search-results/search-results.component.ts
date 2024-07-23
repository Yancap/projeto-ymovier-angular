import { Component } from '@angular/core';
import { SearchComponent } from '../../shared/search/search.component';
import { CardComponent } from '../../shared/card/card.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [SearchComponent, CardComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent {
  public movies!: Movie[];
}
