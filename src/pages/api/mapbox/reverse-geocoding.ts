// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios'



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const uri_mapbox = 'pk.eyJ1Ijoibmljb2xvbGVnYWN5IiwiYSI6ImNsOWVkaGsxZzFzdjEzd3A4eGlubDdnZ3cifQ.G9KaZlNas4WvUgnZiL-d7w';
    const endpoint = 'mapbox.place';
    const types = ['postcode', 'poi', 'place']
    const longitude = '12.632041'
    const latitude = '42.550182'

    // if(search_text === undefined ||  search_text.length < 3){
        
    //     res.status(200).json({ data: [] })
    // }

    try{
        const request =
        await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?types=${types}&access_token=${uri_mapbox}`)   
             
        res.status(200).json({ data: request.data.features})
    } catch (e){
        res.status(400).json({ data: e })
    }

}