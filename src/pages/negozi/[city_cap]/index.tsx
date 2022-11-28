import { useRouter } from 'next/router';
import React from 'react'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import DintorniLogo_Below_Header from '../../../../components/molecules/DintorniLogo_Below_Header';
import { Box, Image } from '@chakra-ui/react'
import Box_Shop from '../../../../components/molecules/Box_Shop';
import { Shop, SHOP } from '../../../interfaces/shop.interface';
import createUrlSchema from '../../../../components/utils/create_url';
import getCityAndPostcodeFromSlug from '../../../../components/utils/get_City_and_Postcode_from_Slug';
import { initApollo } from '../../../lib/apollo';
import GET_SINGLE_SHOP from '../../../lib/apollo/queries/getSingleShop'
export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking', // can also be true or false
    }
}

export async function getStaticProps(ctx) {
    let { city_cap } = ctx.params;
    const element: { city: string, postcode: string | null } = getCityAndPostcodeFromSlug(city_cap);
    const apolloClient = initApollo()
    //console.log(productId);
    const { data, error } = await apolloClient.query({
        query: GET_SINGLE_SHOP,
        variables: { id: '6373bb3c0742ade8758b1a97' },
    })

    console.log(data);

    return {
        props: {
            city: element.city,
            postcode: element.postcode,
            shops: [data.shop]
        }
    }
}

const index: React.FC<{ city: string, postcode: null | string, shops:Shop[] }> = ({ city, postcode, shops }) => {
    const router = useRouter()

   
    const toStore = (shop: SHOP) => {
        console.log(shop);
        const url = createUrlSchema([shop.address.city, shop.name])
        router.push({
            pathname: `/negozio/${shop.id}/${url}`,
        })
    }

    console.log(shops);
    
    return (
        <Desktop_Layout>
            <DintorniLogo_Below_Header city={city} />
            <div className="grid grid-cols-1 md:pt-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4 w-full m-auto justify-items-center	">
                {shops[0] != null && shops.map((shop) => {
                    return (
                        <Box_Shop key={shop.id} scale={'scale(0.99)'}  eventHandler={toStore} shop={shop} width={420} height={250} />
                    )
                })}
            </div>

        </Desktop_Layout>
    )
}

export default index