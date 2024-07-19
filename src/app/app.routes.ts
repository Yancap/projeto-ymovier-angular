import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { CatalogComponent } from './modules/catalog/catalog.component';

export const routes: Routes = [
  {component: HomeComponent, path: ''},
  {component: CatalogComponent, path: 'catalog'},
];
