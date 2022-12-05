import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout';
import { Box, Image} from '@chakra-ui/react';
import GET_SINGLE_PRODUCT from '../../../../lib/apollo/queries/getSingleProduct'
import { useQuery } from '@apollo/client';
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
    const { data, error } = await apolloClient.query({
        query: GET_SINGLE_PRODUCT,
        variables: { id: productId },
        //!useless
        // fetchPolicy: 'cache-first',
        // nextFetchPolicy: 'cache-only',
    })


    return {
        props: {
            product: data.product || null,
            error: error || null,
            //?understand cache in GraphQL
            initialApolloState: apolloClient.cache.extract(),
        },
        revalidate: 60, // In seconds
    }
}






const index: React.FC<{ product: Product, error: string, initialApolloState: any }> = ({ product, error, initialApolloState }) => {
    const colors = useRef<Color[]>(COLORS)
    const router = useRouter();
    const { slug } = router.query
    const [productcolorsCSS, setProductcolorsCSS] = useState<any[]>([]);

    

    const [textCategory, setTextCategory] = useState('vestito')

    useEffect(() => {
        let colorsCSS = [];
        for (let i = 0; i < product.colors.length; i++) {
            const colorCSS = colors.current.filter(color => color.name === product.colors[i])[0].cssColor
            colorsCSS.push(colorCSS)
        }
        setProductcolorsCSS(colorsCSS)


    }, [product])


    const toProduct = (product: Product) => {
        const newUrl = toProductPage(product)
        if (newUrl) {
            router.push(`/prodotto/${product.id}/${newUrl}`)
        }

    }
    const shopProductsData = useQuery(GET_PRODUCTS_FROM_SHOP, {
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'cache-first',
        variables: { id: product.shopId },
        // pollInterval: 500,
        // notifyOnNetworkStatusChange: true,
    }).data;


    useEffect(() => {
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


    }, [product])


    //!handle error case

    //const router = useRouter();
    //const query = router.query;
    //decodeURI
    //console.log(decodeURIComponent(query.nome));









    return (
        <>

            <Desktop_Layout>
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
                            noOfLines={1}
                            mt='6'
                            mb={3}
                            fontSize='md'
                            onClick={() => {
                                //navigare su negozio
                            }}
                        >
                            Altri prodotti di {product.shop.name}
                        </Box>

                        <div className="overflow-x-scroll flex w-full gap-4 ">
                            {shopProductsData?.shop.products.map((element: Product) => {
                                return (
                                    <div key={element.id} className={`${element.id === product.id ? 'hidden' : 'flex'}  gap-4 w-fit`}
                                    >
                                        <Box mb={'5'} borderRadius='lg' overflow='hidden'
                                            width={36}
                                            borderWidth={1.5}
                                            className={`cursor-pointerw-32 lg:w-40`}
                                            onClick={() => toProduct(element)}
                                        >
                                            <Image className='hover:scale-105' src={element.photos[0]} alt={'immagine non trovata'} />
                                        </Box>
                                    </div>)

                            })}
                        </div>
                    </Box>
                </div>
                <Horizontal_Line />
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
                </Box>
            </Desktop_Layout>
        </>

    )
}

export default index