import { ActivatedRoute, Router } from '@angular/router';
import {
  afterNextRender,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { SearchComponent } from '../../shared/search/search.component';
import { CardComponent } from '../../shared/card/card.component';
import { PrismicService } from '../../core/services/prismic/prismic.service';
import * as prismic from '@prismicio/client';
import { ReplaySubject, Subscription } from 'rxjs';
import { ModalService } from '../../core/services/modal/modal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [SearchComponent, CardComponent, CommonModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  public movies: ReplaySubject<Movie[]> = new ReplaySubject();
  public subscription!: Subscription;
  @ViewChild('modal', { read: ViewContainerRef, static: true })
  modalContainer!: ViewContainerRef;

  constructor(
    private prismicService: PrismicService,
    private route: ActivatedRoute,
    private modalService: ModalService
  ) {
    afterNextRender(() => {
      this.subscription = this.route.queryParams.subscribe(async (query) => {
        const response = await Promise.all([
          this.queryByTags(query['search']),
          this.queryByTitles(query['search']),
        ]);

        const responseWithoutDuplicates = this.removeDuplicate([
          ...response[0],
          ...response[1],
        ]);
        this.movies.next(responseWithoutDuplicates.map((movie) => ({
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
        })))

      });
    });
  }

  ngOnInit() {}

  public ngAfterViewInit(): void {
    this.modalService.viewContainerRef = this.modalContainer;
  }

  private queryByTags(query: string) {
    return this.prismicService.instance.getAllByType('movies', {
      filters: [prismic.filter.any('document.tags', query.split(' '))],

      pageSize: 100,
    }) as unknown as Promise<IResponseMovies[]>;
  }

  private queryByTitles(query: string) {
    return this.prismicService.instance.getAllByType('movies', {
      filters: [prismic.filter.fulltext('my.movies.title', query)],

      pageSize: 100,
    }) as unknown as Promise<IResponseMovies[]>;
  }

  private removeDuplicate(list: IResponseMovies[]) {
    const map = Object.create(null);

    for (const item of list) {
      const id = item['id'];

      if (!map[id]) {
        map[id] = item;
      }
    }

    return Object.values(map) as IResponseMovies[];
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
