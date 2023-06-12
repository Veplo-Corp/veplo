// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios'



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {


    try {
        const request =
            await axios.get('http://dev.veplo.it/brands')

        res.status(200).json(request.data)
    } catch (e) {
        res.status(400).json({ data: e })
    }

}