
import { NextApiRequest, NextApiResponse } from "next";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const stripeId = req.query.stripeId;

    let url = 'https://www.veplo.it/shop/home';

    if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'development') {
        url = 'http://localhost:3000/shop/home'
    }

    if (req.method === 'POST') {
        try {
            // Create Checkout Sessions from body params.
            const accountLink = await stripe.accountLinks.create({
                account: stripeId,
                refresh_url: url,
                return_url: url,
                type: 'account_onboarding',
            });
            res.redirect(303, accountLink.url);
        } catch (err: any) {
            res.status(err.statusCode || 500).json(err.message);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}