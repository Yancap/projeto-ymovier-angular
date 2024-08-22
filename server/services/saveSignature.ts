import { fauna } from './fauna';
import { stripe } from './stripe';
import { query } from 'faunadb';

export async function saveSignature(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {

  const userRef = await fauna.query(
    query.Select(
      'ref',
      query.Get(
        query.Match(query.Index('user_by_stripe_customer_id'), customerId)
      )
    )
  );


  const signature = await stripe.subscriptions.retrieve(subscriptionId);
  const signatureData = {
    id: signature.id,
    user_id: userRef,
    status: signature.status,
    price_id: signature.items.data[0].price.id,
  };

  if (createAction) {
    await fauna.query(
      query.Create(query.Collection('signatures'), { data: signatureData })
    );
  } else {
    await fauna.query(
      query.Replace(
        query.Select(
          'ref',
          query.Get(
            query.Match(query.Index('signatures_by_id'), subscriptionId)
          )
        ),
        { data: signatureData }
      )
    );
  }
  return signatureData.status;
}
