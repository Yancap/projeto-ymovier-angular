import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterGender',
  standalone: true,
})
export class FilterGenderPipe implements PipeTransform {
  transform(movies: Movie[], gender: string) {
    if (!movies) return [];
    return movies.filter((movie) => movie.gender.includes(gender));
  }
}
