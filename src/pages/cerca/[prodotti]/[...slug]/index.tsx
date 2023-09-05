import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { initApollo } from '../../../../lib/apollo';
import { Product, ProductsQuery } from '../../../../lib/apollo/generated/graphql';
import GET_PRODUCTS from '../../../../lib/apollo/queries/getProducts';
import getGenderandMacrocategory from '../../../../../components/utils/get_Gender_and_Macrocategory';
import { ParsedURL, parseURLProducts } from '../../../../../components/utils/parseUrlProducts';
import { Box, Button, FilterProps, HStack, Select, Skeleton, SkeletonCircle, SkeletonText, Tag, TagLabel, TagRightIcon, Text, useBreakpointValue } from '@chakra-ui/react';
import PostMeta from '../../../../../components/organisms/PostMeta';
import NoIndexSeo from '../../../../../components/organisms/NoIndexSeo';
import { useRouter } from 'next/router';
import Shop_not_Allowed from '../../../../../components/utils/Shop_not_Allowed';
import { AnimatePresence, motion } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';
import Box_Dress from '../../../../../components/molecules/Box_Dress';
import { LIST_ITEM_VARIANT } from '../../../../../components/mook/transition';
import { useLazyQuery } from '@apollo/client';
import { setInLocalStorage } from '../../../../../components/utils/setInLocalStorage';
import { changeUnivers, changeGenderSelected } from '../../../../store/reducers/user';
import { useDispatch } from 'react-redux';
import { parseSlugUrlFilter } from '../../../../../components/utils/parseUrlFilters';
import { CATEGORIES, Univers } from '../../../../../components/mook/categories';
import createUrlSchema from '../../../../../components/utils/create_url';
import toUpperCaseFirstLetter from '../../../../../components/utils/uppercase_First_Letter';
import Link from 'next/link';
import { SORT_PRODUCT, Sort } from '../../../../../components/mook/sort_products';
import { Cancel, Filter, NavArrowDown } from 'iconoir-react';
import { getParamsFiltersFromObject } from '../../../../../components/utils/getParamsFiltersFromObject';
import FiltersSelections from '../../../../../components/organisms/FiltersSelections';
import TagFilter, { FilterAccepted } from '../../../../../components/atoms/TagFilter';
import { getUnivers } from '../../../../../components/utils/getUnivers';
import { getSortingFilter } from '../../../../../components/utils/getSortingFilter';
import { findParamInURL } from '../../../../../components/utils/findParamInURL';




export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking', // can also be true
    }
}

const RANGE = typeof process.env.NEXT_PUBLIC_RANGE === 'string' ? Number(process.env.NEXT_PUBLIC_RANGE) : 3


export async function getStaticProps(ctx: any) {
    const { slug, prodotti } = ctx.params;
    const apolloClient = initApollo()
    const univers = prodotti === 'accessori' ? prodotti : 'abbigliamento'
    const parsedURL: ParsedURL | Error = parseURLProducts(slug, univers);


    if (parsedURL instanceof Error) {
        console.error(parsedURL.message);
        return {
            props: {
                slug: {},
                error: 'Errore',
                universProps: univers
            },
            // notFound: true,
            revalidate: 1 //seconds
        }
    }
    const { sorting, ...newParseURL } = parsedURL
    const sortFilter = getSortingFilter(sorting)

    try {
        const { data, errors }: { data: ProductsQuery, errors: any } = await apolloClient.query({
            query: GET_PRODUCTS,
            variables: {
                offset: 0,
                limit: RANGE,
                filters: {
                    ...newParseURL,
                    univers
                },
                sort: sortFilter
            }
        })
        return {
            props: {
                filtersProps: newParseURL,
                dataProducts: data?.products?.products,
                universProps: univers,
                sortProps: sorting
            },
            revalidate: 10 //seconds
        }
    } catch (e: any) {
        return {
            props: {
                filtersProps: newParseURL,
                products: [],
                error: 'errore',
                universProps: univers,
                sortProps: sorting
            },
            // notFound: true,
            revalidate: 1 //seconds
        }
    }
}

export interface ProductsFilter extends ParsedURL {
    sizes?: string[],
    colors?: string[],
    maxPrice?: number, //numero intero
    minPrice?: number, //numero intero
    brand?: string,
    sale?: string,
    traits?: string,
    sostenibile?: string,
    query?: string
}

const index: FC<{ filtersProps: ProductsFilter, error?: string, dataProducts: Product[], universProps: Univers, sortProps: string }> = ({ filtersProps, error, dataProducts, universProps, sortProps }) => {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([])
    const [filters, setFilters] = useState<ProductsFilter>(filtersProps)
    const [getProducts, { loading, refetch, data, subscribeToMore }] = useLazyQuery<ProductsQuery>(GET_PRODUCTS);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [univers, setUnivers] = useState<'abbigliamento' | 'accessori'>('abbigliamento')
    const [resetProducts, setResetProducts] = useState(false)
    const dispatch = useDispatch();
    const isSmallView = useBreakpointValue({ base: true, lg: false });
    const isExtraSmallView = useBreakpointValue({ base: true, sm: false });
    const [doubleGridDevice, setDoubleGridDevice] = useState(false)
    const [history, setHistory] = useState<string>()
    const [sort, setSort] = useState<Sort | string>('')
    const timeoutRef = useRef<any>(null);



    useEffect(() => {
        clearTimeout(timeoutRef.current);
        if (!router.isReady) return
        setDoubleGridDevice(localStorage.getItem('doubleGridDevice') === 'true' ? true : false)
        const fitlerSlug = router.asPath.split('?')[1]
        const filterParams: any = parseSlugUrlFilter(fitlerSlug)
        if (router.asPath.split('?')[1]) {
            setHistory(router.asPath.toLowerCase())
        }
        setInLocalStorage('univers', universProps)
        setUnivers(universProps)
        dispatch(
            changeUnivers(universProps)
        );
        setIsLoading(true)
        setHasMoreData(true)
        setSort(sortProps)
        //loading e hasmoredata resettati
        //controlla se esiste già questa sessione nel local storage
        //nel caso esiste, immette i prodotti nel local storage
        let keySession = sessionStorage.getItem("keyProductsSession")
        if (window.history.state.key === keySession) {
            const productsFounded = sessionStorage.getItem("productsInProductsPage");
            if (productsFounded) {
                setProducts([...JSON.parse(productsFounded)])
                const scrollPosition = sessionStorage.getItem('scrollPositionProducts');
                // sessionStorage.removeItem("productsInProductsPage")
                sessionStorage.removeItem("scrollPositionProducts")
                //sessionStorage.removeItem("keyProductsSession")
                setIsLoading(false)

                const newFilters = {
                    ...filtersProps,
                    ...filterParams,
                }

                setFilters(newFilters)
                if (!scrollPosition) return
                setTimeout(() => {
                    window.scrollTo({
                        top: parseInt(scrollPosition),
                        behavior: "smooth"
                    });
                    sessionStorage.removeItem("keyProductsSession")
                }, 500);
                return
            }
        }
        else {

            if (!filterParams) {
                setFilters(filtersProps)
                setProducts(dataProducts)
                if (dataProducts && dataProducts?.length % RANGE !== 0 || dataProducts?.length < RANGE) {
                    setHasMoreData(false)
                    return setIsLoading(false)
                }
                return setIsLoading(false)
            }

            else {
                setResetProducts(true)
                const newFilters = {
                    ...filtersProps,
                    ...filterParams,
                }
                setFilters(newFilters)
                const sortFilter = getSortingFilter(sortProps)

                if (router.asPath.toLowerCase() === history) {

                    const newFilters = {
                        ...filtersProps,
                        ...filterParams,
                    }
                    setFilters(newFilters)
                    const newProducts = data?.products.products ? data?.products.products : [];
                    setProducts(() => {
                        return [
                            ...newProducts
                        ]
                    })
                    setHasMoreData(true)
                    setIsLoading(false)
                    return
                }

                const fetchData = async () => {
                    try {
                        //controllare se crasha
                        setTimeout(async () => {
                            await getProducts({
                                variables: {
                                    offset: 0,
                                    limit: RANGE,
                                    //inserire la microcategoria
                                    filters: {
                                        ...newFilters,
                                        univers
                                    },
                                    sort: sortFilter
                                }
                            })
                        }, 800);
                    } catch {
                    }
                };
                fetchData();
                //TODO togli setisloading qui quando gestirai il sorting
                // setTimeout(() => {
                //     setIsLoading(false)
                // }, 800);

            }
        }


        return () => {
            // Annulla la chiamata se il componente viene smontato o la rotta cambia
            clearTimeout(timeoutRef.current);

            setIsLoading(false)
        };


    }, [router.query])




    const fetchMoreData = async () => {


        if (products.length % RANGE !== 0 || products.length < RANGE) {
            setHasMoreData(false)
            return
        }

        const sortFilter = getSortingFilter(sort)


        try {
            await getProducts({
                variables: {
                    offset: products.length,
                    limit: RANGE,
                    //inserire la microcategoria
                    filters: {
                        ...filters,
                        univers: univers
                    },
                    sort: sortFilter
                }
            })
        }
        catch (e) {
        }

    }




    useEffect(() => {
        //inserimento gender
        if (filters?.gender) {
            setInLocalStorage('genderSelected', filters?.gender)
            dispatch(
                changeGenderSelected(filters?.gender)
            );
        }
    }, [filters?.gender])

    useEffect(() => {
        if (!data) return /* setHasMoreData(false) */


        const newProducts = data.products.products ? data.products.products : [];
        if (newProducts.length % RANGE !== 0 || newProducts.length <= 0) {
            setHasMoreData(false)
            setIsLoading(false)

        }

        if (resetProducts) {
            setProducts(prevState => {
                return [
                    ...newProducts
                ]
            })
            setResetProducts(false)
        } else {
            setProducts(prevState => {
                return [
                    ...prevState,
                    ...newProducts
                ]
            })
        }

        setIsLoading(false)

    }, [data])

    const changeSort = (e: React.ChangeEvent<HTMLSelectElement>) => {

        const filtersParams = getParamsFiltersFromObject(filters)
        if (!filtersParams) return
        if (filtersParams["traits"]) {
            delete filtersParams["traits"]
            filtersParams["sostenibile"] = 'true'
        }



        const sortUrl = SORT_PRODUCT.find(element => element.url === e.target.value)?.url
        router.replace({
            pathname: `/cerca/${universProps}/${filters?.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters?.macroCategory === 'string' && filters?.macroCategory !== '' ? filters?.macroCategory.toLowerCase() : 'tutto'}/${filters.microCategory ? createUrlSchema([filters.microCategory]) : 'tutto'}/${sortUrl ? sortUrl : 'rilevanza'}`,
            query: {
                ...filtersParams
            }
        })
    }

    const filterParamsOnChangeMacrocatecory = (filters: Omit<ProductsFilter, "macroCategory" | "gender" | "microCategory">): Omit<ProductsFilter, "macroCategory" | "gender" | "microCategory"> => {
        const filterForMacrocategory = filters
        if (filterForMacrocategory["sizes"]) {
            delete filterForMacrocategory["sizes"]
        }
        return filterForMacrocategory
    }

    const changeRouter = (value: string, filterParameter: FilterAccepted) => {


        //testare se non da problemi

        const filtersParams = getParamsFiltersFromObject(filters)
        if (!filtersParams) return
        if (filtersParams["traits"]) {
            delete filtersParams["traits"]
            filtersParams["sostenibile"] = 'true'
        }


        if (filterParameter === 'macroCategory') {
            const query = filterParamsOnChangeMacrocatecory(filtersParams)
            return router.push({
                pathname: `/cerca/${universProps}/${filters?.gender === 'm' ? 'uomo' : 'donna'}-${createUrlSchema([value])}/tutto/${sort}`,
                query: {
                    ...query
                }
            })
        }
        if (filterParameter === 'microCategory') {
            return router.push({
                pathname: `/cerca/${universProps}/${filters?.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters?.macroCategory === 'string' && filters?.macroCategory !== '' ? filters?.macroCategory.toLowerCase() : 'tutto'}/${createUrlSchema([value])}/${sort}`,
                query: {
                    ...filtersParams
                }
            })
        }

        //TODO gestire anche  fit, length, materials, traits
        if (
            filterParameter === 'colors' ||
            filterParameter === 'brand'
            //filterParameter === 'fit' || filterParameter === 'length' || filterParameter === 'materials' || filterParameter === 'traits'
        ) {
            return router.push({
                pathname: `/cerca/${universProps}/${filters?.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters?.macroCategory === 'string' && filters?.macroCategory !== '' ? filters?.macroCategory.toLowerCase() : 'tutto'}/${filters.microCategory ? createUrlSchema([filters.microCategory]) : 'tutto'}/${sort}`,
                query: {
                    ...filtersParams,
                    [filterParameter]: value.toLocaleLowerCase()
                }
            })

        }
        if (filterParameter === 'sizes') {
            const size = value?.split(' (')[0].toLocaleLowerCase()
            return router.push({
                pathname: `/cerca/${universProps}/${filters?.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters?.macroCategory === 'string' && filters?.macroCategory !== '' ? filters?.macroCategory.toLowerCase() : 'tutto'}/${filters.microCategory ? createUrlSchema([filters.microCategory]) : 'tutto'}/${sort}`,
                query: {
                    ...filtersParams,
                    sizes: size ? [value.split(' (')[0].toLocaleLowerCase()] : null
                }
            })
        }
        if (filterParameter === 'sale' || filterParameter === 'sostenibile') {


            if (value === 'true') {
                return router.push({
                    pathname: `/cerca/${universProps}/${filters?.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters?.macroCategory === 'string' && filters?.macroCategory !== '' ? filters?.macroCategory.toLowerCase() : 'tutto'}/${filters.microCategory ? createUrlSchema([filters.microCategory]) : 'tutto'}/${sort}`,
                    query: {
                        ...filtersParams,
                        [filterParameter]: true
                    }
                })
            } else {
                const { [filterParameter]: removedFilterParameter, ...newFilterParameters } = filtersParams
                return router.push({
                    pathname: `/cerca/${universProps}/${filters?.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters?.macroCategory === 'string' && filters?.macroCategory !== '' ? filters?.macroCategory.toLowerCase() : 'tutto'}/${filters.microCategory ? createUrlSchema([filters.microCategory]) : 'tutto'}/${sort}`,
                    query: {
                        ...newFilterParameters,
                    }
                })
            }
        }
    }

    const deleteFilterParams = (paramters: FilterAccepted) => {
        let filtersParams: any = getParamsFiltersFromObject(filters)
        delete filtersParams[paramters]
        if (filtersParams["traits"]) {
            delete filtersParams["traits"]
            filtersParams["sostenibile"] = 'true'
        }




        if (paramters === 'macroCategory') {
            const query = filterParamsOnChangeMacrocatecory(filtersParams)
            return router.push({
                pathname: `/cerca/${universProps}/${filters?.gender === 'm' ? 'uomo' : 'donna'}-tutto/tutto/${sort}`,
                query: {
                    ...query
                }
            })
        }

        if (paramters === 'microCategory') {
            return router.push({
                pathname: `/cerca/${universProps}/${filters?.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters?.macroCategory === 'string' && filters?.macroCategory !== '' ? filters?.macroCategory.toLowerCase() : 'tutto'}/tutto/${sort}`,
                query: {
                    ...filtersParams
                }
            })
        }

        return router.push({
            pathname: `/cerca/${universProps}/${filters?.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters?.macroCategory === 'string' && filters?.macroCategory !== '' ? filters?.macroCategory.toLowerCase() : 'tutto'}/${filters.microCategory ? createUrlSchema([filters.microCategory]) : 'tutto'}/${sort}`,
            query: {
                ...filtersParams
            }
        })
    }

    const routerConfirmDrawerFilter = (filtersDrawerModal: ProductsFilter | undefined) => {

        if (!filtersDrawerModal) {
            return router.push({
                pathname: `/cerca/${universProps}/${filters?.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters?.macroCategory === 'string' && filters?.macroCategory !== '' ? filters?.macroCategory.toLowerCase() : 'tutto'}/tutto}/${sort ? sort : 'rilevanza'}`,
            })
        }
        if (typeof filtersDrawerModal.sizes?.[0] === 'string') {
            let size = filtersDrawerModal.sizes?.[0]
            filtersDrawerModal.sizes[0] = size.split(' (')[0].toLowerCase()
        }

        if (filtersDrawerModal.sale !== 'true') {
            delete filtersDrawerModal['sale']
        }
        if (filtersDrawerModal.sostenibile !== 'true') {
            delete filtersDrawerModal['sostenibile']
        }

        let filtersParams = getParamsFiltersFromObject(filtersDrawerModal)



        return router.push({
            pathname: `/cerca/${universProps}/${filters?.gender === 'm' ? 'uomo' : 'donna'}-${typeof filtersDrawerModal.macroCategory === 'string' && filtersDrawerModal.macroCategory !== '' ? filtersDrawerModal.macroCategory.toLowerCase() : 'tutto'}/${filtersDrawerModal.microCategory ? createUrlSchema([filtersDrawerModal.microCategory]) : 'tutto'}/${sort}`,
            query: {
                ...filtersParams
            }
        })

    }

    /* const SkeletonComponent = () => {
        return (
            <>
                <HStack
                    mb={3}
                    ml={2}
                    padding='0' bg='white' display={'flex'} gap={1.5}>
                    <SkeletonCircle size={[doubleGridDevice ? '12' : '14', '14', '14', '14', '16']} />
                    <Box
                        margin={'auto'}
                        ml={2}
                    >
                        <SkeletonText
                            width={[doubleGridDevice ? 24 : 56, 40, 28, 40, 48]}
                            noOfLines={1} skeletonHeight={'3'} />
                        <SkeletonText mt='2'
                            width={[doubleGridDevice ? 16 : 24, 28, 20, 32, 36]}
                            noOfLines={1} skeletonHeight={'2.5'} />
                    </Box>
                </HStack>
                <Skeleton
                    //height={['250px', '150', '500px']}
                    className={`${doubleGridDevice ? 'h-[190px]' : 'h-[360px]'} md:h-[280px] lg:h-[350px] xl:h-[400px]`}
                    borderRadius={'3xl'}
                />
            </>

        )
    } */

    const SkeletonComponent = () => {
        return (
            <>

                <div className="animate-pulse">

                    <Box
                        className='flex space-x-4 mb-3'
                    >
                        <Box className="rounded-full bg-slate-200 "
                            width={[doubleGridDevice ? '12' : '14', '14', '14', '14', '16']}
                            height={[doubleGridDevice ? '12' : '14', '14', '14', '14', '16']}
                        ></Box>
                        <Box
                            ml={2}
                            my={'auto'}
                        >
                            <Box
                                className="rounded-full bg-slate-200"
                                width={[doubleGridDevice ? 24 : 56, 40, 28, 40, 48]}
                                noOfLines={1} height={'4'} />
                            <Box mt={2.5}
                                className="rounded-full bg-slate-200"
                                width={[doubleGridDevice ? 16 : 24, 28, 20, 32, 36]}
                                noOfLines={1} height={'3'} />
                        </Box>
                    </Box>


                    <Box
                        //height={['250px', '150', '500px']}
                        className={`${doubleGridDevice ? 'h-[190px]' : 'h-[360px]'} md:h-[280px] lg:h-[350px] xl:h-[400px]  bg-slate-200 rounded-[20px] w-full`}
                    />
                </div>

            </>

        )
    }


    const saveProductsInSessionStorage = () => {
        sessionStorage.setItem("keyProductsSession", window.history.state.key)
        sessionStorage.setItem("productsInProductsPage", JSON.stringify(products))
        sessionStorage.setItem('scrollPositionProducts', window.scrollY.toString());
    }


    const ReturnTagFilter = () => {

        if (!filters) {
            return (
                <></>
            )
        }
        return (
            <HStack mt={[3, 2]} spacing={2}
                className={`flex flex-wrap ${doubleGridDevice ? 'mb-4' : 'mb-4'} sm:mb-8`}
            >
                {filters.query &&
                    <TagFilter
                        value={'query'}
                        text={'ricerca: ' + toUpperCaseFirstLetter(filters?.query)}
                        handleEvent={deleteFilterParams}
                    />
                }
                {filters?.macroCategory &&
                    <TagFilter
                        value={'macroCategory'}
                        text={'' + toUpperCaseFirstLetter(filters?.macroCategory)}
                        handleEvent={deleteFilterParams}
                    />
                }
                {filters.microCategory &&
                    <TagFilter
                        value={'microCategory'}
                        text={'' + toUpperCaseFirstLetter(filters.microCategory)}
                        handleEvent={deleteFilterParams}
                    />
                }
                {filters?.sizes &&
                    <TagFilter
                        value={'sizes'}
                        text={`Taglia ${filters.sizes[0].toUpperCase()}`}
                        handleEvent={deleteFilterParams}
                    />
                }
                {filters?.brand &&
                    <TagFilter
                        value={'brand'}
                        text={`${toUpperCaseFirstLetter(filters.brand)}`}
                        handleEvent={deleteFilterParams}
                    />
                }
                {filters?.colors &&
                    <TagFilter
                        value={'colors'}
                        text={`${toUpperCaseFirstLetter(filters.colors[0])}`}
                        handleEvent={deleteFilterParams}
                    />
                }

                {filters.minPrice &&
                    <TagFilter
                        value={'minPrice'}
                        text={`Min ${(Number(filters.minPrice) / 100).toFixed(0)}€`}
                        handleEvent={deleteFilterParams}
                    />
                }
                {filters.maxPrice &&
                    <TagFilter
                        value={'maxPrice'}
                        text={`Max ${(Number(filters.maxPrice) / 100).toFixed(0)}€`}
                        handleEvent={deleteFilterParams}
                    />
                }
                {filters.sale /* && isSmallView */ &&
                    <TagFilter
                        value={'sale'}
                        text={'Promozioni'}
                        handleEvent={deleteFilterParams}
                    />
                }
                {filters.traits /* && isSmallView */ &&
                    <TagFilter
                        value={'traits'}
                        text={'Sostenibile'}
                        handleEvent={deleteFilterParams}
                    />
                }
                {filters && getParamsFiltersFromObject(filters) !== undefined && Object.keys(getParamsFiltersFromObject(filters) || {}).length > 0 &&
                    <TagFilter
                        value={'resetta'}
                        clearTag={true}
                        text={'Resetta Filtri'}
                        handleEvent={() => {
                            return router.push({
                                pathname: `/cerca/${universProps}/${filters?.gender === 'm' ? 'uomo' : 'donna'}-${filters.macroCategory ? filters.macroCategory.toLowerCase() : 'tutto'}/tutto/${sort}`,
                            })
                        }}
                    />
                }

            </HStack>

        )
    }




    return (
        <>
            <PostMeta
                canonicalUrl={'https://www.veplo.it' + router.asPath}
                title={`${typeof filters?.macroCategory === 'string' ? toUpperCaseFirstLetter(filters?.macroCategory) : toUpperCaseFirstLetter(univers)} ${filters?.gender === 'f' ? 'donna' : 'uomo'} | Veplo`}
                subtitle={`${typeof filters?.macroCategory === 'string' ? `${typeof filters?.macroCategory} da ${filters?.gender === 'f' ? 'donna' : 'uomo'}` : `${toUpperCaseFirstLetter(univers)} da ${filters?.gender === 'f' ? 'donna' : 'uomo'}`} su Veplo | Acquista dai migliori brand made in Italy senza intermediari su Veplo | Abbigliamento · Accessori · Scarpe · Vestiti`}
                image={''}
                description={`${typeof filters?.macroCategory === 'string' ? `${typeof filters?.macroCategory} da ${filters?.gender === 'f' ? 'donna' : 'uomo'}` : `${toUpperCaseFirstLetter(univers)} da ${filters?.gender === 'f' ? 'donna' : 'uomo'}`} su Veplo | Acquista dai migliori brand made in Italy senza intermediari su Veplo | Abbigliamento · Accessori · Scarpe · Vestiti`}
            />

            <div className='relative  min-h-[120vh]'>
                <Shop_not_Allowed>
                    <Box
                        className='lg:mx-6 xl:w-10/12 2xl:w-9/12  mx-2 xl:mx-auto'
                    >
                        <Box
                            minWidth={'3xs'}
                            className='flex mt-2 lg:mt-4 gap-4 lg:gap-5 overflow-x-auto'
                        >
                            {Object.values(CATEGORIES)[filters?.gender === 'm' ? 1 : 0][univers].map((element: any) => {
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
                                                '/cerca/' + universProps + '/' + (filters?.gender == 'm' ? 'uomo' : 'donna') + '-tutto/tutto/' + sort
                                                :
                                                '/cerca/' + universProps + '/' + (filters?.gender == 'm' ? 'uomo' : 'donna') + '-' + element.url + '/tutto/' + sort
                                            }
                                        >
                                            <Text
                                                textAlign={'start'}
                                                cursor={'pointer'}
                                                color={'secondaryBlack.text'}
                                                fontSize={'14px'}
                                                className={`hover:underline hover:underline-offset-2  ${element.name === filters?.macroCategory ? 'underline underline-offset-2 font-extrabold' : 'font-medium'} `}
                                            >
                                                {element.name}
                                            </Text>
                                        </Link>
                                    </Box>
                                )
                            })}
                        </Box>
                        <Select
                            width={univers === 'abbigliamento' ? 'fit-content' : univers.length * 14.2 + 'px'}
                            value={univers}
                            onChange={(event) => {
                                return router.push({
                                    pathname: `/cerca/${event.target.value}/${filters?.gender === 'm' ? 'uomo' : 'donna'}-tutto/tutto/rilevanza`,
                                })
                            }}
                            color={'black'}
                            fontSize={'xl'}
                            fontWeight={'extrabold'}
                            pl={0}
                            ml={0}
                            variant='unstyled'
                            cursor={'pointer'}
                            mb={[3, 3]}
                            mt={[4, 6]}
                            icon={<NavArrowDown
                                strokeWidth={3}
                            />}

                        >
                            <option
                                value='abbigliamento'>Abbigliamento
                            </option>
                            <option value='accessori'>
                                Accessori
                            </option>
                        </Select>


                        <Box

                            mt={0}


                        >
                            <Box
                                justifyContent={'space-between'}
                                display={'flex'}
                            >
                                <FiltersSelections
                                    changeProductView={() => {
                                        setDoubleGridDevice(prevState => {

                                            if (prevState === true) {
                                                localStorage.setItem('doubleGridDevice', 'false')
                                            } else {
                                                localStorage.setItem('doubleGridDevice', 'true')
                                            }

                                            return !prevState
                                        })
                                    }}
                                    doubleGridDevice={doubleGridDevice}
                                    isLoading={isLoading}
                                    univers={univers}
                                    filters={filters}
                                    handleConfirmChange={changeRouter}
                                    filterDrawerConfirm={routerConfirmDrawerFilter}
                                    changePriceEventRouter={(parameters) => {
                                        const filtersParams: any = getParamsFiltersFromObject(filters)

                                        if (filtersParams["traits"]) {
                                            delete filtersParams["traits"]
                                            filtersParams["sostenibile"] = 'true'
                                        }
                                        if (filters.sale !== 'true') {
                                            delete filters['sale']
                                        }
                                        let newParams: any = {};
                                        for (let i = 0; i < parameters.length; i++) {
                                            if (parameters[i].value > 0) {
                                                newParams[parameters[i].name] = parameters[i].value
                                            } else {
                                                delete filtersParams[parameters[i].name]
                                            }
                                        }
                                        router.replace({
                                            pathname: `/cerca/${universProps}/${filters?.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters?.macroCategory === 'string' && filters?.macroCategory !== '' ? filters?.macroCategory.toLowerCase() : 'tutto'}/${filters.microCategory ? createUrlSchema([filters.microCategory]) : 'tutto'} /${sort}`,
                                            query: {
                                                ...filtersParams,
                                                ...newParams
                                            }
                                        })
                                    }}
                                    handleChangeMacroCategory={(value: string, filtersParams: ProductsFilter | undefined) => {
                                        if (!filtersParams) {
                                            return router.push({
                                                pathname: `/cerca/${universProps}/${filters?.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters?.macroCategory === 'string' && filters?.macroCategory !== '' ? filters?.macroCategory.toLowerCase() : 'tutto'}/tutto/${sort}`,
                                            })
                                        }


                                        if (filtersParams.sale !== 'true') {
                                            delete filtersParams['sale']
                                        }
                                        if (filtersParams.sostenibile !== 'true') {
                                            delete filtersParams['sostenibile']
                                        }

                                        let OmitfiltersParams = getParamsFiltersFromObject(filtersParams)
                                        if (!OmitfiltersParams) return
                                        const query = filterParamsOnChangeMacrocatecory(OmitfiltersParams)


                                        return router.push({
                                            pathname: `/cerca/${universProps}/${filters?.gender === 'm' ? 'uomo' : 'donna'}-${value !== '' ? value.toLowerCase() : 'tutto'}/tutto/` + sort,
                                            query: {
                                                ...query
                                            }
                                        })
                                    }}
                                />
                                <Select
                                    _active={{
                                        transform: 'scale(0.98)'
                                    }}
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                        </svg>
                                    }
                                    width={['full', 'fit-content']}
                                    size={'lg'}
                                    ml={2}
                                    borderRadius={'10px'}
                                    bg={'#F2F2F2'}
                                    focusBorderColor="transparent"
                                    borderColor={'#F2F2F2'}
                                    color={'secondaryBlack.text'}
                                    fontWeight={'semibold'}
                                    fontSize={['18px', '16px']}
                                    height={12}
                                    onChange={changeSort}
                                    value={sort}
                                >
                                    {
                                        SORT_PRODUCT.map((sortElement) => {
                                            return (
                                                <option key={sortElement.text} value={sortElement.url}>{sortElement.text}</option>
                                            )
                                        })
                                    }
                                </Select>

                            </Box >


                            <ReturnTagFilter />
                            {filters?.query && isSmallView && false && <Box
                                mt={5}
                                color={'black'}
                                fontSize={'xl'}
                                fontWeight={'extrabold'}
                                display={'flex'}

                            >
                                Ricerca per: {filters?.query}
                                <Cancel
                                    cursor={'pointer'}
                                    className='w-6 h-6 my-auto mb-1 ml-1'
                                    strokeWidth={2.5}
                                    onClick={() => {
                                        let filtersParams: any = getParamsFiltersFromObject(filters)
                                        delete filtersParams["query"]
                                        return router.push({
                                            pathname: `/cerca/${universProps}/${filters?.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters?.macroCategory === 'string' && filters?.macroCategory !== '' ? filters?.macroCategory.toLowerCase() : 'tutto'}/${filters.microCategory ? createUrlSchema([filters.microCategory]) : 'tutto'}/${sort}`,
                                            query: {
                                                ...filtersParams
                                            }
                                        })
                                    }}
                                />
                            </Box>}
                        </Box >





                        {!isLoading && products ?
                            (<InfiniteScroll
                                className={'mb-20'}
                                scrollThreshold={products && products.length <= RANGE * 2 ? 0.70 : products && products.length < 50 ? 0.95 : 0.97}
                                dataLength={products?.length}
                                next={fetchMoreData}
                                hasMore={hasMoreData}
                                loader={
                                    <>
                                        {products[2] &&
                                            <div className={`grid ${doubleGridDevice ? 'grid-cols-2' : 'grid-cols-1'}  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 gap-y-5 w-full`}>
                                                {isSmallView ?
                                                    (
                                                        [1, 2].map((index) => {
                                                            return (
                                                                <Box
                                                                    key={index}
                                                                >
                                                                    <SkeletonComponent />
                                                                </Box>

                                                            )
                                                        })
                                                    ) : (
                                                        [1, 2, 3].map((index) => {
                                                            return (
                                                                <Box
                                                                    key={index}
                                                                >
                                                                    <SkeletonComponent />
                                                                </Box>

                                                            )
                                                        })
                                                    )}
                                            </div>
                                        }
                                    </>
                                }
                                endMessage={
                                    <></>
                                }
                            >
                                <div className={` flex items-center justify-center `}>
                                    <div className={`grid ${doubleGridDevice ? 'grid-cols-2 gap-2 gap-y-5' : 'grid-cols-1 gap-y-9'}  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 sm:gap-2 md:gap-5 md:gap-y-8 sm:gap-y-9 w-full ${doubleGridDevice ? 'mb-6' : 'mb-10'} `}>
                                        {products.length > 0 ?
                                            (
                                                <AnimatePresence>
                                                    {products.map((product: Product, index) => {
                                                        return (
                                                            <motion.div
                                                                key={product.id}
                                                                variants={LIST_ITEM_VARIANT}
                                                                initial="hidden"
                                                                animate="visible"
                                                                exit="hidden"
                                                            >
                                                                <Box_Dress
                                                                    doubleGridDevice={isExtraSmallView && doubleGridDevice ? true : false}
                                                                    handleEventSelectedDress={saveProductsInSessionStorage}
                                                                    productLink={`/@${product.shopInfo?.name?.unique}/prodotto/${product.id}/${createUrlSchema([product?.info?.brand, product.name])}${findParamInURL('sizes', router.asPath.split('?')[1]) ? '?' + findParamInURL('sizes', router.asPath.split('?')[1]) : ''}`}
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
                                    </div >
                                </div >
                            </InfiniteScroll >)
                            : (
                                <div
                                    className={`grid ${doubleGridDevice ? 'grid-cols-2' : 'grid-cols-1'}  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 gap-y-5 w-full mb-10`}

                                >
                                    {[1, 2, 3, 4].map((index) => {
                                        return (
                                            <Box
                                                key={index}
                                            >
                                                <SkeletonComponent />
                                            </Box>

                                        )
                                    })}

                                </div>
                            )
                        }
                        {
                            !isLoading && products?.length <= 0 &&
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
                            </Box>
                        }

                    </Box >

                </Shop_not_Allowed >
            </div >
        </>
    )
}

export default index