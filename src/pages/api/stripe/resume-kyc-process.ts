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
            const accountLink = await stripe.accountLinks.create({
                account: stripeId,
                refresh_url: 'https://www.veplo.it',
                return_url: 'https://www.veplo.it/shop/prodotti',
                type: 'account_onboarding',
            });
            console.log(accountLink.url);
            res.redirect(303, accountLink.url);
        } catch (err: any) {
            res.status(err.statusCode || 500).json(err.message);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}