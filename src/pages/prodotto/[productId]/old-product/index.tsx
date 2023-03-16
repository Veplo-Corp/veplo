import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout';
import { Box, Image, Tooltip } from '@chakra-ui/react';
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
            console.log(product.shopId);

            await getFilterProduct({
                variables: { id: product.shopId, limit: 5, offset: 0, see: null },
            })
        }

        setTimeout(() => {
            fetchData()
        }, 100);





        setProductcolorsCSS(getColorsCSS(product))



    }, [product])


    const getColorsCSS = ((product: Product) => {
        let colorsCSS = [];
        for (let i = 0; i < product.colors.length; i++) {
            const colorCSS = colors.current.filter(color => color.name === product.colors[i])[0].cssColor
            colorsCSS.push(colorCSS)
        }
        return colorsCSS
    })


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

    console.log(product.price.v2 ? product.price.v2 : product.price.v1);



    return (
        <>
            {product && <Desktop_Layout>

                <PostMeta
                    canonicalUrl={'https://www.veplo.it' + router.asPath}
                    //riverdere length description 150 to 160
                    title={`${product.name.toUpperCase()} ${product.brand} - ${product.macroCategory} - ${product.shopOptions.city} - Veplo.it`}
                    subtitle={`${product.name.toUpperCase()} ${product.brand} - ${product.macroCategory} a ${product.price.v2 ? product.price.v2 : product.price.v1}€ | vivi Veplo`}
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
                            mt='0'
                            fontSize='xl'
                            className='italic'
                        >
                            {product.brand}
                        </Box>
                        <Box
                            fontWeight='bold'
                            as='h1'
                            noOfLines={2}
                            mt='-1'
                            fontSize='3xl'
                            lineHeight={'33px'}
                            pb='3'
                        >
                            {`${product.name.toLocaleUpperCase()}`}
                            <span className='font-light text-lg'>{` - ${textCategory}`}</span>
                        </Box>
                        <Box
                            fontWeight='medium'
                            as='h1'
                            noOfLines={2}
                            fontSize={['lg', 'xl']}
                            lineHeight={['4']}
                        >
                            {product.price.v2 && <span className=' text-red-700 font-bold'>{product.price.v2.toFixed(2).replace('.', ',')} €<br /></span>}

                            <span
                                className={`${product.price.v2 ? 'text-slate-500 font-normal text-sm ' : ''} mr-2`}
                            >
                                {product.price.v2 && <span>prima era: </span>}<span className={`${product.price.v2 ? 'line-through' : ''}`}>{product.price.v1.toFixed(2).replace('.', ',')} €</span>
                                {product.price.discountPercentage &&
                                    <span className='ml-2 text-red-500'>
                                        -{product.price.discountPercentage.toString().replace('.', ',')}%
                                    </span>}
                            </span>

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
                            <Circle_Color colors={productcolorsCSS} dimension={10} space={4} showTooltip={true} />
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
                            </Link>


                            <div className="overflow-x-scroll flex gap-4 ">
                                {shopProductsData?.data?.shop.products.map((element: Product) => {
                                    return (
                                        <Link key={element.id} href={`/prodotto/${element.id}/${toProductPage(element)}`}>
                                            <div className={`${element.id === product.id ? 'hidden' : 'flex'} gap-4 w-fit`} >
                                                <Box borderRadius='lg' overflow='hidden'
                                                    borderWidth={0.5}
                                                    className={`w-36`}/*  aspect-[8.5/12] */
                                                    _active={{
                                                        transform: 'scale(0.98)',
                                                    }}
                                                >
                                                    <LazyLoadImage
                                                        src={
                                                            imageKitUrl(element.photos[0], 171, 247)
                                                        }//placeholderSrc={'/static/grayScreen.png'}
                                                        effect="blur"
                                                        alt={element.name}


                                                        className=' cursor-pointer hover:scale-105  object-cover'
                                                    />
                                                    <Box
                                                        fontWeight={['light', 'normal']}
                                                        as='h1'
                                                        fontSize={['2xs', 'xs']}
                                                        noOfLines={1}
                                                        marginX={'2'}
                                                        mt={'1'}
                                                        mb={-1}
                                                    >
                                                        {element.brand}
                                                    </Box>
                                                    <Box
                                                        fontWeight='semibold'
                                                        as='h1'
                                                        fontSize={['xs', 'xs']}
                                                        noOfLines={1}
                                                        marginX={'2'}
                                                    >
                                                        {element.name.toUpperCase()}
                                                        {/* {height} - {width} */}
                                                    </Box>
                                                    <Box
                                                        fontWeight={'bold'}
                                                        as='h4'
                                                        fontSize={'xs'}
                                                        color={'green.600'}
                                                        lineHeight='none'
                                                        noOfLines={1}
                                                        marginX={'2'}

                                                    >
                                                        <span
                                                            className={`${element.price.v2 ? 'text-slate-500 font-normal line-through text-[11px]' : ''}`}
                                                        >
                                                            {Number(element.price.v1).toFixed(2).replace('.', ',')} €
                                                        </span>
                                                        {element.price.v2 && <span className=' text-red-700 font-bold ml-1'>{element.price.v2.toFixed(2).replace('.', ',')} €</span>}
                                                    </Box>
                                                    <div className='text-right flex float-right my-2 mx-2'>
                                                        <Circle_Color colors={getColorsCSS(element)} dimension={4} space={1} />
                                                    </div>
                                                </Box>

                                            </div>
                                        </Link>
                                    )
                                })}
                                <Link href={`/negozio/${product.shopId}/${createUrlSchema([product.shopOptions.city, product.shopOptions.name])}`}
                                    className={`flex gap-4 w-36 max-h-max justify-center`}
                                >
                                    <div className='my-auto'>
                                        <Box borderRadius='lg' overflow='hidden'
                                            borderWidth={0.5}
                                            paddingY={'10'}
                                            className={`w-36 h-full flex cursor-pointer bg-gray-50`}
                                            // onClick={() => {
                                            //     const slug = createUrlSchema([product.shopOptions.city, product.shopOptions.name])
                                            //     router.push(`/negozio/${product.shopId}/${slug}`)
                                            // }}
                                            _active={{
                                                transform: 'scale(0.98)',
                                            }}
                                        >
                                            <div className='m-auto text-center'>
                                                <p className='mb-4'>
                                                    vai al<br /> negozio
                                                </p>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 m-auto">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                                </svg>

                                            </div>


                                        </Box>
                                    </div>
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