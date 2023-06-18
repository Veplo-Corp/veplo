import React, { FC, useEffect, useState } from 'react'
import { initApollo } from '../../../lib/apollo';
import { Product, ProductsQuery } from '../../../lib/apollo/generated/graphql';
import GET_PRODUCTS from '../../../lib/apollo/queries/getProducts';
import getGenderandMacrocategory from '../../../../components/utils/get_Gender_and_Macrocategory';
import { ParsedURL, parseURLProducts } from '../../../../components/utils/parseUrlProducts';
import { Box, HStack, Skeleton, SkeletonCircle, SkeletonText, Text, useBreakpointValue } from '@chakra-ui/react';
import PostMeta from '../../../../components/organisms/PostMeta';
import NoIndexSeo from '../../../../components/organisms/NoIndexSeo';
import { useRouter } from 'next/router';
import Shop_not_Allowed from '../../../../components/utils/Shop_not_Allowed';
import { AnimatePresence, motion } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';
import Box_Dress from '../../../../components/molecules/Box_Dress';
import { LIST_ITEM_VARIANT } from '../../../../components/mook/transition';


const RANGE = process.env.NODE_ENV === 'production' ? 10 : 3


export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking', // can also be true or false
    }
}


export async function getStaticProps(ctx: any) {
    let { slug } = ctx.params;
    const apolloClient = initApollo()




    const parsedURL: ParsedURL | Error = parseURLProducts(slug);

    if (parsedURL instanceof Error) {
        console.error(parsedURL.message);
        return {
            props: {
                slug: {},
                error: 'Errore'
            },
            // notFound: true,
            revalidate: 1 //seconds
        }
    }

    try {
        const { data, errors }: { data: ProductsQuery, errors: any } = await apolloClient.query({
            query: GET_PRODUCTS,
            variables: {
                offset: 0,
                limit: RANGE,
                filters: {
                    "macroCategory": parsedURL.macroCategory,
                    "microCategory": parsedURL.microCategory,
                    "gender": parsedURL.gender
                }
            }
        })
        return {
            props: {
                filtersProps: parsedURL,
                dataProducts: data?.products?.products
            },
            revalidate: 10 //seconds
        }
    } catch (e: any) {
        return {
            props: {
                filtersProps: parsedURL,
                products: [],
                error: 'errore'
            },
            // notFound: true,
            revalidate: 1 //seconds
        }
    }
}

interface ProductsFilter extends ParsedURL {
    sizes?: string[],
    colors?: string[],
    maxPrice?: number, //numero intero
    minPrice?: number, //numero intero
}

const index: FC<{ filtersProps: ProductsFilter, error?: string, dataProducts: Product[] }> = ({ filtersProps, error, dataProducts }) => {
    console.log(filtersProps);
    console.log(error);
    const router = useRouter()
    const isSmallView = useBreakpointValue({ base: true, lg: false });
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([])
    const [filters, setFilters] = useState<ProductsFilter>(filtersProps)

    useEffect(() => {
        if (!router.isReady) return
        setProducts(dataProducts)
        setFilters(filtersProps)
        setIsLoading(false)
    }, [router.query])


    return (
        <>
            <NoIndexSeo />

            <PostMeta
                canonicalUrl={'https://www.veplo.it' + router.asPath}
                title={`${filters.macroCategory} ${filters.gender === 'f' ? 'donna' : 'uomo'} | Veplo`}
                subtitle={`Tutto l'abbigliamento da ${filters.gender === 'f' ? 'donna' : 'uomo'} - ${filters.macroCategory === 'abbigliamento' ? 'Vestiti' : filters.macroCategory} | Abbigliamento · Scarpe · Vestiti | scopri le offerte | vivi Veplo`}
                image={''}
                description={`Tutto l'abbigliamento da ${filters.gender === 'f' ? 'donna' : 'uomo'} - ${filters.macroCategory === 'abbigliamento' ? 'Vestiti' : filters.macroCategory} | Abbigliamento · Scarpe · Vestiti | scopri le offerte | vivi Veplo`}
            />
            <div className='relative  min-h-[120vh]'>
                <Shop_not_Allowed>
                    <Box
                        className='lg:w-10/12 2xl:w-9/12  mx-2 lg:mx-auto'
                    >
                        {!isLoading ?
                            (<InfiniteScroll
                                dataLength={products.length}
                                next={() => { }/* fetchMoreData */}
                                hasMore={false/* hasMoreData */}
                                loader={
                                    <>
                                        {products[3] && <Text textAlign={'center'}
                                            fontWeight={'bold'}
                                        >
                                            caricamento
                                        </Text>}
                                    </>
                                }
                                endMessage={
                                    <></>
                                }
                            >
                                <div className={` flex items-center justify-center`}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-5 gap-y-5 w-full mb-10">
                                        {products.length > 0 ?
                                            (
                                                <AnimatePresence>
                                                    {products.map((product: Product, index) => {

                                                        return (
                                                            <motion.div
                                                                key={product?.id ? product?.id : Math.random() + index}
                                                                variants={LIST_ITEM_VARIANT}
                                                                initial="hidden"
                                                                animate="visible"
                                                                exit="hidden"
                                                            >
                                                                <Box_Dress
                                                                    handleEventSelectedDress={() => {
                                                                        sessionStorage.setItem("keyProductsSession", window.history.state.key)
                                                                        sessionStorage.setItem("products", JSON.stringify(products))
                                                                        sessionStorage.setItem('scrollPositionProducts', window.pageYOffset.toString());
                                                                    }}
                                                                    productLink={`/prodotto/${product.id}/${product?.info?.brand}-${product.name}${router.asPath.split('?')[1] ? '?' + router.asPath.split('?')[1] : ''}`}
                                                                    showStoreHeader={true} product={product} color={filters.colors?.[0] ? filters.colors[0] : undefined}></Box_Dress>

                                                            </motion.div>
                                                        )
                                                    })}
                                                </AnimatePresence>
                                            )
                                            : (
                                                <></>
                                            )
                                        }

                                    </div>

                                </div>
                            </InfiniteScroll>)
                            : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 gap-y-5 w-full">
                                    {[1, 2, 3, 4].map((index) => {
                                        return (
                                            <Box
                                                key={index}
                                            >
                                                <HStack
                                                    mb={3}
                                                    ml={2}
                                                    padding='0' bg='white' display={'flex'} gap={1.5}>
                                                    <SkeletonCircle size='14' />
                                                    <Box
                                                        margin={'auto'}
                                                    >
                                                        <SkeletonText
                                                            width={[56, 64]}

                                                            noOfLines={1} skeletonHeight={'3'} />
                                                        <SkeletonText mt='2'
                                                            width={[36, 28]}

                                                            noOfLines={1} skeletonHeight={'2.5'} />
                                                    </Box>

                                                </HStack>
                                                <Skeleton
                                                    startColor={'gray.100'}
                                                    endColor={'gray.300'}

                                                    //height={['250px', '150', '500px']}
                                                    className={'h-[450px] md:h-[280px] lg:h-[350px] xl:h-[400px]'}
                                                    borderRadius={'3xl'}
                                                />
                                            </Box>

                                        )
                                    })}

                                </div>
                            )
                        }
                        {
                            !isLoading && products.length <= 0 &&
                            <Box
                                mt={[10, 20]}
                                display={'flex'}
                                color={'#707070'}
                                fontWeight={'extrabold'}
                                textAlign={'center'}
                                fontSize={['2xl', '3xl']}
                                mx={10}
                            >
                                <Box
                                    marginX={'auto'}
                                >
                                    <img src="/error/cryingBoy.svg" className="w-32 md:w-48 mx-auto" alt="" />
                                    <Text
                                        mt={[6, 3]}
                                    >
                                        Nessun prodotto trovato
                                    </Text>
                                </Box>
                            </Box>}

                    </Box>

                </Shop_not_Allowed>
            </div>
        </>
    )
}

export default index