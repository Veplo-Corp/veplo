import React, { FC, useEffect, useState } from 'react'
import { initApollo } from '../../../lib/apollo';
import { Product, ProductsQuery } from '../../../lib/apollo/generated/graphql';
import GET_PRODUCTS from '../../../lib/apollo/queries/getProducts';
import getGenderandMacrocategory from '../../../../components/utils/get_Gender_and_Macrocategory';
import { ParsedURL, parseURLProducts } from '../../../../components/utils/parseUrlProducts';
import { Box, FilterProps, HStack, Skeleton, SkeletonCircle, SkeletonText, Text, useBreakpointValue } from '@chakra-ui/react';
import PostMeta from '../../../../components/organisms/PostMeta';
import NoIndexSeo from '../../../../components/organisms/NoIndexSeo';
import { useRouter } from 'next/router';
import Shop_not_Allowed from '../../../../components/utils/Shop_not_Allowed';
import { AnimatePresence, motion } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';
import Box_Dress from '../../../../components/molecules/Box_Dress';
import { LIST_ITEM_VARIANT } from '../../../../components/mook/transition';
import { useLazyQuery } from '@apollo/client';
import { setInLocalStorage } from '../../../../components/utils/setInLocalStorage';
import { changeGenderSelected } from '../../../store/reducers/user';
import { useDispatch } from 'react-redux';
import { parseSlugUrlFilter } from '../../../../components/utils/parseUrlFilters';
import { CATEGORIES } from '../../../../components/mook/categories';
import createUrlSchema from '../../../../components/utils/create_url';
import toUpperCaseFirstLetter from '../../../../components/utils/uppercase_First_Letter';
import Link from 'next/link';


const RANGE = process.env.NODE_ENV === 'production' ? 10 : 3


export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking', // can also be true
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
                    ...parsedURL
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
    const [getProducts, { loading, refetch, data, subscribeToMore }] = useLazyQuery<ProductsQuery>(GET_PRODUCTS);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [resetProducts, setResetProducts] = useState(false);

    const dispatch = useDispatch();




    useEffect(() => {
        if (!router.isReady) return
        //loading e hasmoredata resettati
        const fitlerSlug = router.asPath.split('?')[1]
        const filterParams = parseSlugUrlFilter(fitlerSlug)
        setIsLoading(true)

        if (!filterParams) {
            setFilters(filtersProps)
            setProducts(dataProducts)
            return setIsLoading(false)
        }

        else {
            setProducts([])
            const newFilters = {
                ...filtersProps,
                ...filterParams,
            }
            setFilters(newFilters)
            const fetchData = async () => {
                try {
                    setTimeout(async () => {
                        await getProducts({
                            variables: {
                                offset: products.length,
                                limit: RANGE,
                                //inserire la microcategoria
                                filters: {
                                    ...newFilters
                                }
                            }
                        })
                    }, 500);

                } catch {
                    console.log('errore caricamento');
                }
            };

            fetchData();
            setResetProducts(true)

        }

    }, [router.query])

    const fetchMoreData = async () => {
        if (products.length % RANGE !== 0) {
            setHasMoreData(false)
            return console.log('no more data');
        }


        try {
            await getProducts({
                variables: {
                    offset: products.length,
                    limit: RANGE,
                    //inserire la microcategoria
                    filters: {
                        ...filters
                    }
                }
            })
        }
        catch (e) {
            console.log(e);

        }

    }

    useEffect(() => {
        if (filters.gender) {
            setInLocalStorage('genderSelected', filters.gender)
            dispatch(
                changeGenderSelected(filters.gender)
            );
        }
    }, [filters.gender])

    useEffect(() => {
        if (!data) return
        setIsLoading(false)
        const newProducts = data.products.products ? data.products.products : [];

        if (newProducts.length % RANGE !== 0) {
            setHasMoreData(false)
            return console.log('no more data');
        }

        setProducts(prevState => {
            return [
                ...prevState,
                ...newProducts
            ]
        })
    }, [data])




    return (
        <>
            <NoIndexSeo />

            <PostMeta
                canonicalUrl={'https://www.veplo.it' + router.asPath}
                title={`${filters.macroCategory ? filters.macroCategory : 'Abbigliamento'} ${filters.gender === 'f' ? 'donna' : 'uomo'} | Veplo`}
                subtitle={`Tutto l'abbigliamento da ${filters.gender === 'f' ? 'donna' : 'uomo'} - ${filters.macroCategory === 'abbigliamento' ? 'Vestiti' : filters.macroCategory} | Abbigliamento · Scarpe · Vestiti | scopri le offerte | vivi Veplo`}
                image={''}
                description={`Tutto l'abbigliamento da ${filters.gender === 'f' ? 'donna' : 'uomo'} - ${filters.macroCategory === 'abbigliamento' ? 'Vestiti' : filters.macroCategory} | Abbigliamento · Scarpe · Vestiti | scopri le offerte | vivi Veplo`}
            />
            <div className='relative  min-h-[120vh]'>



                <Shop_not_Allowed>
                    <Box
                        className='lg:w-10/12 2xl:w-9/12  mx-2 lg:mx-auto'
                    >
                        <Box
                            minWidth={'3xs'}
                            className='flex mt-2 lg:mt-4 gap-4 lg:gap-5 overflow-x-auto'
                        >
                            {Object.values(CATEGORIES)[filters.gender === 'm' ? 1 : 0].abbigliamento.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1).map(element => {
                                return (
                                    <Box
                                        key={element.name}
                                        mb={4}
                                        className='whitespace-nowrap'

                                    >
                                        <Link
                                            prefetch={false}
                                            href={element.url === createUrlSchema([filters?.macroCategory ? filters?.macroCategory : ''])
                                                ?
                                                '/prodotti/' + (filters.gender == 'f' ? 'donna' : 'uomo') + '-abbigliamento/tutto/rilevanza'
                                                :
                                                '/prodotti/' + (filters.gender == 'f' ? 'donna' : 'uomo') + '-' + element.url + '/tutto/rilevanza'
                                            }
                                        >
                                            <Text
                                                textAlign={'start'}
                                                cursor={'pointer'}
                                                color={'secondaryBlack.text'}
                                                fontSize={'14px'}
                                                className={`hover:underline hover:underline-offset-2  ${element.name === filters.macroCategory ? 'underline underline-offset-2 font-extrabold' : 'font-medium'}`}
                                            >
                                                {element.name}
                                            </Text>
                                        </Link>
                                    </Box>
                                )
                            })}
                        </Box>
                        <Text
                            color={'black'}
                            fontSize={'xl'}
                            fontWeight={'extrabold'}
                            mb={[3, 6]}
                            mt={[4, 8]}
                        >
                            {filters.macroCategory ? toUpperCaseFirstLetter(filters.macroCategory) : "Tutto l'abbigliamento"}
                        </Text>
                        {!isLoading ?
                            (<InfiniteScroll
                                dataLength={products.length}
                                next={fetchMoreData}
                                hasMore={hasMoreData}
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