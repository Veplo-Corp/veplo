import React, { useEffect, useState } from 'react'
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
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Link from 'next/link'

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

    return {
        props: {
            shop: data.shop,
            products: products?.data?.shop.products
        },
        revalidate: 60, // In seconds
    }
}





const index: React.FC<{ shop: Shop, products: Product[] }> = ({ shop, products }) => {
    const router = useRouter();
    const [addressForMaps, setaddressForMaps] = useState('')

    const toProductPageUrl = (product: Product) => {

        const newUrl = toProductPage(product)
        if (newUrl) {
            router.push(`/prodotto/${product.id}/${newUrl}`)
        }
    }

    const createAddressForMAps = () => {
        setaddressForMaps(shop.address.street.replaceAll(' ', '+')+', '+ shop.address.city.replaceAll(' ', '+'))
    }

    useEffect(() => {
        createAddressForMAps()
    }, [shop])
    
    

    return (
        <Desktop_Layout>
            <div className='md:flex w-full'>
                <Box className='w-fit'>
                    <LazyLoadImage src={shop.photo}
                        //PlaceholderSrc={PlaceholderImage}
                        effect="blur"
                        alt="Immagine non trovata"
                        className='aspect-[4.8/3] w-96 lg:w-[32rem] rounded-md object-cover'
                    />
                    <Box py={0.5} display='flex' className='justify-between	'>
                        <Box>
                            <Box
                                mt='1'
                                fontWeight='semibold'
                                as='h2'
                                noOfLines={1}
                                fontSize='medium'
                            >
                                {shop.name}
                            </Box>
                            <Box
                                fontWeight='base'
                                as='h2'
                                fontSize='11px'
                                mt={-1}
                            >
                                {shop.address.street}, {shop.address.city}
                            </Box>
                        </Box>
                        <Box display='flex' className='my-auto'>
                            <a target="_blank" rel="noopener noreferrer" href={`https://www.google.it/maps/search/${addressForMaps}`} >

                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2 hover:scale-95 cursor-pointer">
                                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <Link href={`tel:${shop.phone}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-1 hover:scale-95 cursor-pointer">
                                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                                </svg>
                            </Link>

                        </Box>

                    </Box>
                </Box>

            </div>
            {/* <Box_Shop shop={shop} width={96} height={60} scale={'1'} eventHandler={() => { }} /> */}

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
                fontWeight='base'
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