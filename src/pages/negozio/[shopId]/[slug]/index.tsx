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
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@chakra-ui/icons'
import toUpperCaseFirstLetter from '../../../../../components/utils/uppercase_First_Letter'
import { imageKitUrl } from '../../../../../components/utils/imageKitUrl'
import PostMeta from '../../../../../components/organisms/PostMeta'

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
        variables: { id: shopId, limit: 100, offset: 0 },
        //!useless
        fetchPolicy: 'cache-first',
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
        setaddressForMaps(shop.address.street.replaceAll(' ', '+') + ', ' + shop.address.city.replaceAll(' ', '+'))
    }

    useEffect(() => {
        createAddressForMAps()
    }, [shop])



    return (
        <Desktop_Layout>
            <PostMeta
                canonicalUrl={'https://www.veplo.it' + router.asPath}
                title={`${toUpperCaseFirstLetter(shop.name)} a ${shop.address.city}, ${shop.address.street} - CAP ${shop.address.postcode} - Veplo.it`}
                subtitle={`Visita il negozio di abbigliamento ${shop.name} a ${shop.address.city}, ${shop.address.street} - CAP ${shop.address.postcode} | Abbigliamento · Scarpe · Vestiti | scopri le offerte | vivi Veplo`}
                image={shop.photo}
                description={`Visita il negozio di abbigliamento ${shop.name} a ${shop.address.city}, ${shop.address.street} - CAP ${shop.address.postcode} | Abbigliamento · Scarpe · Vestiti | scopri le offerte | vivi Veplo`}
            />
            <div className='md:flex w-full'>
                <Box className='w-fit'>
                    <LazyLoadImage src={
                        imageKitUrl(shop.photo, 720, 450)
                    }

                        //PlaceholderSrc={PlaceholderImage}
                        effect="blur"
                        alt={shop.name}
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
                                display={'flex'}
                            >
                                <span>
                                    {toUpperCaseFirstLetter(shop.name)}
                                </span>
                                {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 my-auto ml-1">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                                </svg> */}

                            </Box>

                            <Box
                                fontWeight='base'
                                as='h2'
                                fontSize='11px'
                                mt={-1}
                                display={'flex'}
                                className='cursor-pointer'
                            >
                                <span>
                                    {shop.address.city}, {shop.address.street}
                                </span>

                            </Box>
                        </Box>
                        <Box display='flex' className='my-auto'>
                            <a target="_blank" rel="noopener noreferrer" href={`https://www.google.it/maps/search/${addressForMaps}`} >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-1 hover:scale-95 cursor-pointer">
                                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href={`https://wa.me/+39${shop.phone}?text=ciao, ero su Veplo.it e stavo visitando il tuo negozio ${shop.name}. Avrei bisogno di una informazione`} target="_blank" >

                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-1 hover:scale-95 cursor-pointer">
                                    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
                                </svg>
                            </a>
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
                        <Link href={`/prodotto/${product.id}/${toProductPage(product)}`}>
                            <a >
                                <Box_Dress /* eventHandler={toProductPageUrl} */ key={product.id} product={product}
                                    toShop={() => { }}
                                ></Box_Dress>
                            </a>
                        </Link>
                    )
                })}
            </div>}
        </Desktop_Layout>

    )
}

export default index