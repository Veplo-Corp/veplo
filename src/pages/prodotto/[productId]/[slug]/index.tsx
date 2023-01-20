import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout';
import { Box, Image } from '@chakra-ui/react';
import GET_SINGLE_PRODUCT from '../../../../lib/apollo/queries/getSingleProduct'
import { useLazyQuery, useQuery } from '@apollo/client';
import { Product } from '../../../../interfaces/product.interface';
import { initApollo } from '../../../../lib/apollo';
import Circle_Color from '../../../../../components/atoms/Circle_Color';
import Size_Box from '../../../../../components/atoms/Size_Box';
import Horizontal_Line from '../../../../../components/atoms/Horizontal_Line';
import createUrlSchema from '../../../../../components/utils/create_url';
import { Color, COLORS } from '../../../../../components/mook/colors';
import { createTextCategory } from '../../../../../components/utils/createTextCategory';
import 'react-lazy-load-image-component/src/effects/blur.css';
import GET_PRODUCTS_FROM_SHOP from '../../../../lib/apollo/queries/geetProductsShop';
import { toProductPage } from '../../../../../components/utils/toProductPage';
import Image_Product from '../../../../../components/organisms/Image_Product';
import GET_SINGLE_SHOP from '../../../../lib/apollo/queries/getSingleShop';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { imageKitUrl } from '../../../../../components/utils/imageKitUrl';
import PostMeta from '../../../../../components/organisms/PostMeta';
import Link from 'next/link';


export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking', // can also be true or false
    }
}

export async function getStaticProps(ctx: any) {
    const { productId } = ctx.params
    // Call an external API endpoint to get posts.
    // You can use any data fetching library

    //! old graphQL schema
    const apolloClient = initApollo()
    //console.log(productId);
    try {
        const { data } = await apolloClient.query({
            query: GET_SINGLE_PRODUCT,
            variables: { id: productId },
            //!useless
            // fetchPolicy: 'cache-first',
            // nextFetchPolicy: 'cache-only',
        })


        return {
            props: {
                product: data.product,
                //?understand cache in GraphQL
                initialApolloState: apolloClient.cache.extract(),
            },
            revalidate: 60, // In seconds
        }

    } catch (e: any) {
        console.log(e);


        return {
            props: {
                errorLog: e.graphQLErrors[0].name,
                //?understand cache in GraphQL
                initialApolloState: apolloClient.cache.extract(),
            },
            revalidate: 60, // In seconds
        }
    }

    return {

    }
}






const index: React.FC<{ product: Product, errorLog?: string, initialApolloState: any }> = ({ product, errorLog, initialApolloState }) => {
    const colors = useRef<Color[]>(COLORS)
    const router = useRouter();
    const { slug } = router.query
    const [productcolorsCSS, setProductcolorsCSS] = useState<any[]>([]);

    console.log(errorLog);


    const [textCategory, setTextCategory] = useState('vestito')

    useEffect(() => {

        if (errorLog) {
            console.log(errorLog);

            router.push({
                pathname: '/404',
                query: { error: errorLog },
            })
        }
    }, [errorLog])


    const toProduct = (product: Product) => {
        const newUrl = toProductPage(product)
        if (newUrl) {
            router.push(`/prodotto/${product.id}/${newUrl}`)
        }

    }




    const [getFilterProduct, shopProductsData] = useLazyQuery(GET_PRODUCTS_FROM_SHOP);


    useEffect(() => {
        if (!product) return
        
        const category = createTextCategory(product.macroCategory, product.microCategory)
        setTextCategory(category)
        const url_slug_correct = createUrlSchema([product.brand, product.name, category])
        if (url_slug_correct !== slug) {
            router.push({
                pathname: `/prodotto/${router.query.productId}/${url_slug_correct}`,
            },
                undefined, { shallow: true }
            )
        }
        const fetchData = async () => {
            await getFilterProduct({
                variables: { id: product.shopId, limit: 5, offset: 0 },
            })
        }

        fetchData()

        let colorsCSS = [];
        for (let i = 0; i < product.colors.length; i++) {
            const colorCSS = colors.current.filter(color => color.name === product.colors[i])[0].cssColor
            colorsCSS.push(colorCSS)
        }
        setProductcolorsCSS(colorsCSS)



    }, [])


    //!handle error case

    //const router = useRouter();
    //const query = router.query;
    //decodeURI
    //console.log(decodeURIComponent(query.nome));


    const chatWithStore = async () => {
        const apolloClient = initApollo()
        //get Shop phone number
        try {
            const { data, error } = await apolloClient.query({
                query: GET_SINGLE_SHOP,
                variables: { id: product.shopId },
            })
            if (error) return
            window.open(
                `https://wa.me/+39${data.shop.phone}?text=ciao, ero su Veplo.it e stavo visitando il tuo negozio ${product.shopOptions.name}. Avrei bisogno di una informazione sul prodotto *${product.name} - ${product.brand}*`
                , '_blank')
        } catch (e) {
            console.log(e);
        }
    }


    //console.log(imageKitUrl(product.photos[0], 171, 247));




    return (
        <>
            {product && <Desktop_Layout>
                <PostMeta
                    canonicalUrl={'https://www.veplo.it' + router.asPath}
                    //riverdere length description 150 to 160
                    title={`${product.name.toUpperCase()} ${product.brand} - ${product.macroCategory} - ${product.shopOptions.city} - Veplo.it`}
                    subtitle={`${product.name.toUpperCase()} ${product.brand} - ${product.macroCategory} a ${product.price}€ | vivi Veplo`}
                    image={imageKitUrl(product.photos[0], 171, 247)}
                    description={`${product.name.toUpperCase()} ${product.brand} - ${product.macroCategory} - Veplo.it`} />

                <div className='md:flex justify-between w-full'>
                    <Image_Product product={product} />
                    <Box className='md:block md:w-5/12 xl:w-1/2 md:pl-4 xl:pr-10'>
                        <Box
                            fontWeight='normal'
                            as='h2'
                            lineHeight='tall'
                            noOfLines={1}
                            fontSize='sm'
                        >

                            {product.macroCategory} - {product.microCategory}
                            {product.gender === 'F' && <span className='ml-1'>per donna</span>}
                            {product.gender === 'M' && <span className='ml-1'>per uomo</span>}
                        </Box>
                        <Box
                            fontWeight='normal'
                            as='h2'
                            noOfLines={1}
                            mt='-2'
                            fontSize='3xl'
                            className='italic'
                        >
                            {product.brand}
                        </Box>
                        <Box
                            fontWeight='semibold'
                            as='h1'
                            noOfLines={2}
                            mt='-1'
                            fontSize='3xl'
                            lineHeight={'33px'}
                        >
                            {`${product.name.toLocaleUpperCase()}`}
                            <span className='font-normal'>{` - ${textCategory}`}</span>
                        </Box>
                        <Box
                            fontWeight='medium'
                            as='h1'
                            noOfLines={1}
                            mt='3'
                            fontSize='medium'
                        >
                            {product.price.toFixed(2).replace('.', ',')}€
                        </Box>
                        <Box
                            fontWeight='light'
                            as='h1'
                            noOfLines={1}
                            mt='6'
                            fontSize='md'
                        >
                            {product.colors.length}
                            {product.colors.length === 1 && <span className='ml-1'>colorazione disponibile</span>}
                            {product.colors.length > 1 && <span className='ml-1'>colorazioni disponibili</span>}
                        </Box>
                        <div className='mt-2'>
                            <Circle_Color colors={productcolorsCSS} dimension={10} space={4} />
                        </div>
                        <Box
                            fontWeight='light'
                            as='h1'
                            noOfLines={1}
                            mt='6'
                            mb={3}
                            fontSize='md'
                        >
                            Taglie disponibili
                        </Box>
                        <Size_Box
                            borderWidth='1px'
                            py={3}
                            borderRadius={5}
                            fontSize={'xl'}
                            fontWeight={'normal'}
                            sizes={product.sizes}
                            gender={product.gender}
                            macrocategory={product.macroCategory}
                        />

                        <Box
                            fontWeight='light'
                            as='h1'
                            noOfLines={2}
                            mt='6'
                            mb={3}
                            fontSize='md'
                            onClick={() => {

                            }}

                        >
                            Hai bisogno di più informazioni sul prodotto? <span className='underline underline-offset-2 cursor-pointer'
                                onClick={chatWithStore}
                            >contatta il titolare del negozio</span>
                        </Box>


                        <>
                            <Link href={`/negozio/${product.shopId}/${createUrlSchema([product.shopOptions.city, product.shopOptions.name])}`}>
                                <a >
                                    <Box
                                        fontWeight='light'
                                        as='h1'
                                        noOfLines={1}
                                        mt='6'
                                        mb={3}
                                        fontSize='md'
                                    >
                                        Altri prodotti di <span className='underline underline-offset-2 cursor-pointer'>{product.shopOptions.name}</span>
                                    </Box>
                                </a>
                            </Link>


                            <div className="overflow-x-scroll flex gap-4 ">
                                {shopProductsData?.data?.shop.products.map((element: Product) => {

                                    return (
                                        <Link key={element.id} href={`/prodotto/${element.id}/${toProductPage(element)}`}>
                                            <a >
                                                <div  className={`${element.id === product.id ? 'hidden' : 'flex'} gap-4 w-fit`} >
                                                    <Box borderRadius='lg' overflow='hidden'
                                                        borderWidth={1.5}
                                                        marginBottom={4}
                                                        className={`w-28 lg:w-36 aspect-[8.5/12] object-cover`}
                                                    // onClick={() => toProduct(element)}
                                                    >
                                                        <LazyLoadImage
                                                            src={
                                                                imageKitUrl(element.photos[0], 171, 247)
                                                            }//placeholderSrc={'/static/grayScreen.png'}
                                                            effect="blur"
                                                            alt={element.name}
                                                            className=' cursor-pointer hover:scale-105 w-full h-full object-cover'
                                                        />
                                                    </Box>
                                                </div>
                                            </a>
                                        </Link>
                                    )
                                })}
                                <Link href={`/negozio/${product.shopId}/${createUrlSchema([product.shopOptions.city, product.shopOptions.name])}`}>
                                    <a >
                                        <div className={`flex gap-4 w-fit`} >
                                            <Box borderRadius='lg' overflow='hidden'
                                                borderWidth={1.5}
                                                marginBottom={4}
                                                className={`w-28 lg:w-36 aspect-[8.5/12] object-cover flex cursor-pointer bg-gray-100`}
                                                // onClick={() => {
                                                //     const slug = createUrlSchema([product.shopOptions.city, product.shopOptions.name])
                                                //     router.push(`/negozio/${product.shopId}/${slug}`)
                                                // }}
                                                _active={{
                                                    transform: 'scale(0.98)',
                                                }}
                                            >
                                                <div className='m-auto text-center'>
                                                    <p>
                                                        vai al<br /> negozio
                                                    </p>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 m-auto">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                                    </svg>

                                                </div>


                                            </Box>
                                        </div>
                                    </a>
                                </Link>


                            </div>
                        </>
                    </Box>
                </div>
                {/* <Horizontal_Line />
                <Box
                    fontWeight='medium'
                    as='h1'
                    noOfLines={1}
                    className='text-2xl md:text-5xl'
                    lineHeight={'normal'}
                >
                    Prodotti simili
                </Box>
                <Box
                    fontWeight='normal'
                    as='h1'
                    noOfLines={1}
                    mb={3}
                    className='text-xl md:text-4xl'
                    lineHeight={'normal'}
                >
                    scopri altri negozi con prodotti simili
                </Box> */}
            </Desktop_Layout>}
        </>

    )
}

export default index