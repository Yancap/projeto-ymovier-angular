import { Component, OnInit } from '@angular/core';
import { SearchComponent } from '../../shared/search/search.component';
import { CardComponent } from '../../shared/card/card.component';
import { PrismicService } from '../../core/services/prismic/prismic.service';
import * as prismic from '@prismicio/client';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [SearchComponent, CardComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent implements OnInit {
  public movies!: Movie[];
  public query: string = '';
  constructor(private prismicService: PrismicService) {}
  public async ngOnInit() {
    const response = await Promise.all([
      this.queryByTags(),
      this.queryByTitles(),
    ]);
    const responseWithoutDuplicates = this.removeDuplicate([
      ...response[0],
      ...response[1],
    ]);

    this.movies = responseWithoutDuplicates.map((movie) => ({
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

  public queryByTags() {
    return this.prismicService.instance.getAllByType('movies', {
      filters: [prismic.filter.any('document.tags', this.query.split(' '))],

      pageSize: 100,
    }) as unknown as Promise<IResponseMovies[]>;
  }

  public queryByTitles() {
    return this.prismicService.instance.getAllByType('movies', {
      filters: [prismic.filter.fulltext('my.movies.title', this.query)],

      pageSize: 100,
    }) as unknown as Promise<IResponseMovies[]>;
  }

  public removeDuplicate(list: IResponseMovies[]) {
    const map = Object.create(null);

    for (const item of list) {
      const id = item['id'];

      // Irá inserir no "mapa" somente elementos cujo o ID não estiver lá.
      if (!map[id]) {
        map[id] = item;
      }
    }

    // No final, retorne os valores do mapa:
    return Object.values(map) as IResponseMovies[];
  }
}
