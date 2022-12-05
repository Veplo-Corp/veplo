import React from 'react'
import Box_Shop from '../../../../../components/molecules/Box_Shop'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout'
import { Box, defineStyle, Divider } from '@chakra-ui/react'
import Box_Dress from '../../../../../components/molecules/Box_Dress'
import { useRouter } from 'next/router'
import Horizontal_Line from '../../../../../components/atoms/Horizontal_Line'
import { Product } from '../../../../interfaces/product.interface'
import { Shop } from '../../../../interfaces/shop.interface'
import createUrlSchema from '../../../../../components/utils/create_url'
import GET_SINGLE_SHOP from '../../../../lib/apollo/queries/getSingleShop'
import { initApollo } from '../../../../lib/apollo'
import GET_PRODUCTS_FROM_SHOP from '../../../../lib/apollo/queries/geetProductsShop'
import { toProductPage } from '../../../../../components/utils/toProductPage'

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking', // can also be true or false
    }
}

export async function getStaticProps(ctx: any) {
    let { shopId } = ctx.params;
    const apolloClient = initApollo()
    //console.log(productId);
    const { data, error } = await apolloClient.query({
        query: GET_SINGLE_SHOP,
        variables: { id: shopId },
    })



    const products = await apolloClient.query({
        query: GET_PRODUCTS_FROM_SHOP,
        variables: { id: shopId },
        //!useless
        fetchPolicy: 'cache-first',
        // nextFetchPolicy: 'cache-only',
    })

    console.log(data);

    console.log(data);

    return {
        props: {
            shop: data.shop,
            products: products?.data?.shop.products
        }
    }
}





const index: React.FC<{ shop: Shop, products: Product[] }> = ({ shop, products }) => {
    console.log(products);

    const router = useRouter();

    const toProductPageUrl = (product: Product) => {

        const newUrl = toProductPage(product)
        if (newUrl) {
            router.push(`/prodotto/${product.id}/${newUrl}`)
        }
    }

    return (
        <Desktop_Layout>
            <Box_Shop shop={shop} width={96} height={60} scale={'1'} eventHandler={() => { }} />
            <Horizontal_Line />
            <Box
                fontWeight='medium'
                as='h1'
                noOfLines={1}
                className='text-2xl md:text-5xl'
                lineHeight={'normal'}
            >
                I prodotti di {shop.name}
            </Box>
            <Box
                fontWeight='normal'
                as='h1'
                noOfLines={1}
                mb={3}
                className='text-xl md:text-4xl'
                lineHeight={'normal'}
            >
                tutti i prodotti
            </Box>
            {products && <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
                {products.map((product) => {
                    return (
                        <Box_Dress eventHandler={toProductPageUrl} key={product.id} product={product}
                            toShop={() => { }}
                        ></Box_Dress>
                    )
                })}
            </div>}
        </Desktop_Layout>

    )
}

export default index