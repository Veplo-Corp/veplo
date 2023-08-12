import React, { useEffect, useRef, useState } from 'react'
import { initApollo } from '../../lib/apollo'
import GET_SHOP_AND_PRODUCTS_BY_PROFILE_UNIQUE_NAME from '../../lib/apollo/queries/getShopAndProductsByUniqueName'
import { GetShopQuery, ShopByUniqueNameQuery } from '../../lib/apollo/generated/graphql'
import ShopPage from '../../../components/organisms/ShopPage'
const RANGE = typeof process.env.NEXT_PUBLIC_RANGE === 'string' ? Number(process.env.NEXT_PUBLIC_RANGE) : 12


export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking', // can also be true or false
    }
}

export async function getStaticProps(ctx: any) {
    let { profileUniqueName } = ctx.params;
    const apolloClient = initApollo();
    //!creare filtro per gender


    try {
        const { data }: { data: ShopByUniqueNameQuery } = await apolloClient.query({
            query: GET_SHOP_AND_PRODUCTS_BY_PROFILE_UNIQUE_NAME,
            variables: {
                name: profileUniqueName.replace("@", "").toLowerCase(),
                limit: RANGE,
                offset: 0,
                filters: {
                }
            },
        })



        return {
            props: {
                shop: data.shopByUniqueName,
            },
            revalidate: 60, // In seconds
        }

    } catch (e) {

        return {
            props: {

                shop: null,
            },
            revalidate: 1, // In seconds
        }
    }


}





const index: React.FC<{ shop: GetShopQuery["shop"] }> = ({ shop }) => {

    return (
        <ShopPage
            shop={shop}
            gender={undefined}
        />
    )
}

export default index