// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios'



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const uri_mapbox = process.env.MAPBOX_API; 
    //const endpoint = 'mapbox.place';
    const types = ['address'] /* 'postcode', 'poi', 'place' */
    // const longitude = '12.632041'
    // const latitude = '42.550182'
    const longitude = req.query.longitude
    const latitude = req.query.latitude



    // if(search_text === undefined ||  search_text.length < 3){
        
    //     res.status(200).json({ data: [] })
    // }

    try{
        const request =
        await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?types=${types}&limit=1&country=it&language=it&access_token=${uri_mapbox}`)   
             
        res.status(200).json({ data: request.data.features})
    } catch (e){
        res.status(400).json({ data: e })
    }

}