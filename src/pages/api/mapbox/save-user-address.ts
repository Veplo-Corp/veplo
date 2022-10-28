// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios'



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const uri_mapbox = 'pk.eyJ1Ijoibmljb2xvbGVnYWN5IiwiYSI6ImNsOWVkaGsxZzFzdjEzd3A4eGlubDdnZ3cifQ.G9KaZlNas4WvUgnZiL-d7w';
    const endpoint = 'mapbox.place';
    const types = ['postcode']

    const longitude = req.query.longitude
    const latitude = req.query.latitude
    const postcode = req.query.postcode
    const city = req.query.city
    const address = req.query.address
    const placeType = req.query.placeType

    // const response = {
    //     longitude,
    //     latitude,
    //     postcode,
    //     city,
    //     address,
    //     placeType
    // };

    // console.log(response);
    // return res.status(200).json({ address_user: response})

    if(placeType === 'address'){
        try{
            const request = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?types=${types}&limit=2&country=IT&language=it&access_token=${uri_mapbox}`)   
            const CAP = {
                postcode: request.data.features[0].text_it,
                longitude: request.data.features[0].geometry.coordinates[0],
                latitude: request.data.features[0].geometry.coordinates[1],
            }
            const address_user = {
                postcode,
                city,
                address,
                longitude,
                latitude,
                CAP,
                placeType
            }        
    
            return res.status(200).json({ address_user: address_user})
        } catch (e){
            return res.status(400).json({ data: e })
        }
    }

    if(placeType === 'place'){
        try{
            const request = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?types=${types}&limit=2&country=IT&language=it&access_token=${uri_mapbox}`)   
            const CAP = {
                postcode: request.data.features[0].text_it,
                longitude: request.data.features[0].geometry.coordinates[0],
                latitude: request.data.features[0].geometry.coordinates[1],
            }
            const address_user = {
                city,
                longitude,
                latitude,
                CAP,
                placeType
            }        
    
            return res.status(200).json({ address_user: address_user})
        } catch (e){
            return res.status(400).json({ data: e })
        }
    }
    

}