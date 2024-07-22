declare interface IResponsePrismic {
  id: string;
  uid: string | null;
  url: string | null;
  type: string;
  href: string;
  tags: string[];
  first_publication_date: string;
  last_publication_date: string;
  slugs: string[];
  linked_documents: string[];
  lang: string;
  alternate_languages: string[];
  data: any;
}

declare interface IRichText {
  type: string;
  text: string;
  spans: {
    start: number;
    end: number;
    type: string;
  }[];
  direction: string;
}
