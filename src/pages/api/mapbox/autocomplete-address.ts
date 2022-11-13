// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios'



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const search_text = req.query.search_text
    const uri_mapbox = 'pk.eyJ1Ijoibmljb2xvbGVnYWN5IiwiYSI6ImNsOWVkaGsxZzFzdjEzd3A4eGlubDdnZ3cifQ.G9KaZlNas4WvUgnZiL-d7w';
    const endpoint = 'mapbox.place';
    let types = ['address', 'place' ]

    if(req.query.type === 'shop'){
        types = ['address']
    }
    

    if(search_text === undefined ||  search_text.length < 3){
        
        res.status(200).json({ data: [] })
    }

    try{
        const request =
        await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${search_text}.json?types=${types}&limit=2&country=it&language=it&access_token=${uri_mapbox}`)        
        res.status(200).json({ data: request.data.features })
    } catch (e){
        res.status(200).json({ data: e })
    }

}
