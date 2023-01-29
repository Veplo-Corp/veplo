// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios'



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const search_text = req.query.search_text
    const uri_mapbox = process.env.MAPBOX_API;
    const endpoint = 'mapbox.place';
    let types = ['address', 'place'];
    const lng_lat = req.query.lng_lat
    if (req.query.type === 'shop') {
        types = ['address']
    }

    try {
            const request =
                await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${search_text}.json?types=${types}&limit=3&country=it&language=it&proximity=${lng_lat}&access_token=${uri_mapbox}`)
            res.status(200).json({ data: request.data.features })

    } catch (e) {
        res.status(200).json({ data: e })
    }



}
