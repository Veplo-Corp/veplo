import { NextApiRequest, NextApiResponse } from "next";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const stripeId = req.query.stripeId

    if (req.method === 'POST') {
        try {
            // Create Checkout Sessions from body params.
            const account = await stripe.accounts.retrieve(
                stripeId
            );
            res.status(200).json({ account: account })
        } catch (err: any) {
            res.status(err.statusCode || 500).json(err.message);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}