import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { CatalogComponent } from './modules/catalog/catalog.component';
import { SearchResultsComponent } from './modules/search-results/search-results.component';

export const routes: Routes = [
  {component: HomeComponent, path: ''},
  {component: CatalogComponent, path: 'catalog'},
  {component: SearchResultsComponent, path: 'search'},
];
