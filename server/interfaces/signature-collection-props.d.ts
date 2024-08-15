export interface SignatureCollectionProps {
  ref: any;
  ts: number,
  data: {
    id: string;
    user_id: any;
    status: 'active' | 'canceled';
    price_id: string;
  }
}




