import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  public movie = {
    title: 'Filme de Terror Aleatório',
    year: 2020,
    img: {
      url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fbr.pinterest.com%2Frogerpiassa%2Fcards-de-horror%2F&psig=AOvVaw1WNJtFx8uWkfGA-JWJEUhJ&ust=1721435225938000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCIjDy4vssYcDFQAAAAAdAAAAABAE',
    },
    gender: 'Terror, Horror',
    review: '80',
  };
}
