declare interface Movie {
  slug: string | null;
  background: {
    alt: string;
    url: string;
  };
  gender: string;
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
  }[];
  review: string;
  runtime: string | number;
  title: string;
  trailer: { url: string };
  video: {
    height: string;
    html: string;
    width: string;
  };
  year: number;
}
