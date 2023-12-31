// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios'



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const uri_mapbox = process.env.MAPBOX_API;
    const endpoint = 'mapbox.place';
    const types = ['postcode']

    const longitude = req.query.longitude
    const latitude = req.query.latitude
    const postcode = req.query.postcode
    const city = req.query.city
    let address = req.query.address
    const placeType = req.query.placeType
    const streetNumber = req.query.streetNumber

    address = streetNumber !== 'undefined' ? (address + ' ' + streetNumber) : address;


    // return res.status(200).json({ address_user: response})

    if (placeType === 'address' || placeType === 'place') {
        try {
            const request = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?types=${types}&limit=1&country=IT&language=it&access_token=${uri_mapbox}`)
            const CAP_location = {
                postcode: request.data.features[0].text_it,
                location: request.data.features[0].geometry,
                city: request.data.features[0].context.text_it
            }
            return res.status(200).json({ CAP_location: CAP_location })
        } catch (e) {
            return res.status(400).json({ data: e })
        }
    }

    // if(placeType === 'place'){
    //     try{
    //         const request = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?types=${types}&limit=2&country=IT&language=it&access_token=${uri_mapbox}`)   
    //         const CAP_location = {
    //             postcode: request.data.features[0].text_it,
    //             location: request.data.features[0].geometry,
    //         }
    //         return res.status(200).json({ CAP_location: CAP_location})   

    //         return res.status(200).json({ address_user: address_user})
    //     } catch (e){
    //         return res.status(400).json({ data: e })
    //     }
    // }


}