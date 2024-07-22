import { FilterGenderPipe } from './../../core/pipes/filter-gender.pipe';
import { Component, inject, OnInit } from '@angular/core';
import { ContainerCardComponent } from '../../shared/container-card/container-card.component';
import { CardComponent } from '../../shared/card/card.component';
import { PrismicService } from '../../core/services/prismic/prismic.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [ContainerCardComponent, CardComponent, FilterGenderPipe],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit {
  public movies!: Movie[];
  public filterGenderPipe: FilterGenderPipe = new FilterGenderPipe();

  constructor(private prismicService: PrismicService) {}

  public async ngOnInit() {
    const response = (await this.prismicService.instance.getAllByType(
      'movies',
      {
        fetch: [],
        pageSize: 100,
      }
    )) as unknown as IResponseMovies[];
    console.log(response);

    this.movies = await response.map((movie) => ({
      slug: movie.uid,
      ...movie.data,
      gender: movie.data.gender.map((gen) => gen.type).join(', '),
      runtime: movie.data.runtime
        ? `${Math.floor(movie.data.runtime / 60)}h ${
            movie.data.runtime - 60 * Math.floor(movie.data.runtime / 60)
          }min`
        : 0,
      video: {
        height: 'auto',
        width: 'auto',
        html: movie.data.video.html?.replace(
          /(?:width|height)="(\d+)"/g,
          'class="iframe" '
        ),
      },
    }));
  }
}
