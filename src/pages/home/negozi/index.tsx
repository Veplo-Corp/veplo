import { useRouter } from 'next/router';
import React from 'react'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import DintorniLogo_Below_Header from '../../../../components/molecules/DintorniLogo_Below_Header';
import { Box, Image } from '@chakra-ui/react'
import Box_Shop from '../../../../components/molecules/Box_Shop';


const index = () => {
    const router = useRouter();
    const query = router.query;

    const SHOP = {
        name: 'Sartoria Rizzo Merlini',
        categories: 'Vintage, Sportwear, Elegante',
        /* arr.join(' ,') */
        address: 'Terni, via roma 21',
        reviews: 441,
        stars: 4.3,
        imageUrl: 'https://cdn-cadem.nitrocdn.com/hOeLBQEvFRAuluYShWUGCyLWKEOmQkPB/assets/static/optimized/rev-dba1e8b/wp-content/uploads/2019/08/grigio-chiaro-1-300x300.jpg',
        imageAlt: 'Rear view of modern dress',
        id: 'ID12345'
    }

    let shops: any[] = [];

    for (let i = 0; i < 20; i++) {
        shops.push(SHOP)
    }

    const toStore = (shop) => {
        console.log(shop);
        router.push({
            pathname: `/home/negozi/${shop.id}`,
            //aggiungi le info che vuoi
            // query: {
            //     terni: 'stupenda'
            // }
    })
    }

return (
    <Desktop_Layout>
        <DintorniLogo_Below_Header citta={query.citta} />
        <div className="grid grid-cols-1 md:pt-4 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4 w-full m-auto justify-items-center	">
            {shops.map((shop) => {
                return (
                    <Box_Shop key={Math.random()} scale={'scale(0.99)'} key={Math.random()} eventHandler={toStore} shop={shop} width={420} height={250} />

                )
            })}
        </div>
    </Desktop_Layout>
)
}

export default index