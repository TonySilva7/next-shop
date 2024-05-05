// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import stripe from '@app/lib/stripe'
import type { NextApiRequest, NextApiResponse } from 'next'

type DataSuccess = {
  checkoutUrl: string | null
}
type DataError = {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataSuccess | DataError>,
) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ error: 'Method not allowed, please use POST' })
  }

  const priceId = req.body.priceId

  if (!priceId) {
    return res.status(400).json({ error: 'Price ID is required' })
  }

  const successUrl = `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`
  const cancelUrl = `${process.env.NEXT_URL}/`

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  })

  res.status(201).json({ checkoutUrl: checkoutSession.url })
}
