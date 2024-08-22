import { FilterGenderPipe } from './../../core/pipes/filter-gender.pipe';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  NgZone,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ContainerCardComponent } from '../../shared/container-card/container-card.component';
import { CardComponent } from '../../shared/card/card.component';
import { PrismicService } from '../../core/services/prismic/prismic.service';
import { SearchComponent } from '../../shared/search/search.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { ModalService } from '../../core/services/modal/modal.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    ContainerCardComponent,
    CardComponent,
    FilterGenderPipe,
    SearchComponent,
    ModalComponent,
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit, AfterViewInit {
  public movies!: Movie[];
  public filterGenderPipe: FilterGenderPipe = new FilterGenderPipe();
  @ViewChild('modal', { read: ViewContainerRef, static: true }) modalContainer!: ViewContainerRef;

  constructor(
    private prismicService: PrismicService,
    private modalService: ModalService
  ) {}

  public async ngOnInit() {
    const response = (await this.prismicService.instance.getAllByType(
      'movies',
      {
        fetch: [],
        pageSize: 100,
      }
    )) as unknown as IResponseMovies[];
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

  public ngAfterViewInit(): void {
    this.modalService.viewContainerRef = this.modalContainer;
  }
}
