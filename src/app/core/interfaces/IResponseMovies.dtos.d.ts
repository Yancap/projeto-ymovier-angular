declare interface IResponseMovies extends IResponsePrismic {
  data: IMovie;
}

declare interface IMovie {
  background: {
    alt: string;
    url: string;
  };
  gender: { type: string }[];
  iframe: string;
  main_color: string;
  plot: string;
  parental_rating: number;
  poster: {
    alt: string;
    url: string;
  };
  production: {
    name: string;
    role: string;
  };
  review: string;
  runtime: number;
  title: string;
  trailer: { url: string };
  video: {
    embed_url: string;
    height: string;
    html: string;
    width: string;
  };
  year: number;
}
