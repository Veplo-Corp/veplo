import React, { FC, useEffect, useState } from 'react'
import { initApollo } from '../../../lib/apollo';
import { Product, ProductsQuery } from '../../../lib/apollo/generated/graphql';
import GET_PRODUCTS from '../../../lib/apollo/queries/getProducts';
import getGenderandMacrocategory from '../../../../components/utils/get_Gender_and_Macrocategory';
import { ParsedURL, parseURLProducts } from '../../../../components/utils/parseUrlProducts';
import { Box, Button, FilterProps, HStack, Select, Skeleton, SkeletonCircle, SkeletonText, Tag, TagLabel, TagRightIcon, Text, useBreakpointValue } from '@chakra-ui/react';
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
import { SORT_PRODUCT } from '../../../../components/mook/sort_products';
import { Cancel, Filter } from 'iconoir-react';
import { getParamsFiltersFromObject } from '../../../../components/utils/getParamsFiltersFromObject';
import FiltersSelections from '../../../../components/organisms/FiltersSelections';
import TagFilter, { FilterAccepted } from '../../../../components/atoms/TagFilter';


const RANGE = process.env.NODE_ENV === 'production' ? 3 : 3


export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking', // can also be true
    }
}


export async function getStaticProps(ctx: any) {
    const { slug, prodotti } = ctx.params;
    const apolloClient = initApollo()
    const parsedURL: ParsedURL | Error = parseURLProducts(slug);
    console.log(parsedURL);


    if (parsedURL instanceof Error) {
        console.error(parsedURL.message);
        return {
            props: {
                slug: {},
                error: 'Errore',
                typeProductsProps: prodotti === 'accessori' ? prodotti : 'abbigliamento'
            },
            // notFound: true,
            revalidate: 1 //seconds
        }
    }
    const { sorting, ...newParseURL } = parsedURL
    try {
        //TODO eliminare newParseURL non appena tommaso gestisce il sorting

        const { data, errors }: { data: ProductsQuery, errors: any } = await apolloClient.query({
            query: GET_PRODUCTS,
            variables: {
                offset: 0,
                limit: RANGE,
                filters: {
                    ...newParseURL
                },
            }
        })
        return {
            props: {
                //TODO eliminare newParseURL non appena tommaso gestisce il sorting
                filtersProps: newParseURL,
                dataProducts: data?.products?.products,
                typeProductsProps: prodotti === 'accessori' ? prodotti : 'abbigliamento'
            },
            revalidate: 10 //seconds
        }
    } catch (e: any) {
        return {
            props: {
                //TODO eliminare newParseURL non appena tommaso gestisce il sorting
                filtersProps: newParseURL,
                products: [],
                error: 'errore',
                typeProductsProps: prodotti === 'accessori' ? prodotti : 'abbigliamento'
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
    sale?: string
}

const index: FC<{ filtersProps: ProductsFilter, error?: string, dataProducts: Product[], typeProductsProps: 'abbigliamento' | 'accessori' }> = ({ filtersProps, error, dataProducts, typeProductsProps }) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([])
    const [filters, setFilters] = useState<ProductsFilter>(filtersProps)
    const [getProducts, { loading, refetch, data, subscribeToMore }] = useLazyQuery<ProductsQuery>(GET_PRODUCTS);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [typeProducts, setTypeProducts] = useState<'abbigliamento' | 'accessori'>('abbigliamento')
    const [resetProducts, setResetProducts] = useState(false)
    const dispatch = useDispatch();
    const isSmallView = useBreakpointValue({ base: true, lg: false });


    useEffect(() => {
        if (!router.isReady) return
        setIsLoading(true)
        setHasMoreData(true)
        setTypeProducts(typeProductsProps)
        //loading e hasmoredata resettati
        const fitlerSlug = router.asPath.split('?')[1]
        const filterParams: any = parseSlugUrlFilter(fitlerSlug)
        //TODO togliere logica non appena sale è attivo
        //if (filterParams?.sale) delete filterParams['sale']


        //controlla se esiste già questa sessione nel local storage
        //nel caso esiste, immette i prodotti nel local storage
        if (window.history.state.key === sessionStorage.getItem("keyProductsSession")) {


            const productsFounded = sessionStorage.getItem("productsInProductsPage");
            if (productsFounded) {
                setProducts(JSON.parse(productsFounded))
                const scrollPosition = sessionStorage.getItem('scrollPositionProducts');
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
                }, 500);
                return
            }
        }

        if (!filterParams) {
            setFilters(filtersProps)
            setProducts(dataProducts)
            return setIsLoading(false)
        }

        else {
            setResetProducts(true)

            const newFilters = {
                ...filtersProps,
                ...filterParams,
            }
            setFilters(newFilters)
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
                                    ...newFilters
                                }
                            }
                        })
                    }, 0);
                } catch {
                    console.log('errore caricamento');
                }
            };
            fetchData();
            //TODO togli setisloading qui quando gestirai il sorting
            // setTimeout(() => {
            //     setIsLoading(false)
            // }, 800);

        }
        return () => {
            setIsLoading(false)
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
        const newProducts = data.products.products ? data.products.products : [];
        if (newProducts.length % RANGE !== 0 || newProducts.length <= 0) {
            setHasMoreData(false)
            setIsLoading(false)
            // if (resetProducts) {
            //     setProducts([])
            //     setResetProducts(false)
            // }
            // return console.log('no more data');

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

        const sortUrl = SORT_PRODUCT.find(element => element.url === e.target.value)?.url
        router.replace({
            pathname: `/abbigliamento/${filters.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters.macroCategory === 'string' && filters.macroCategory !== '' ? filters.macroCategory.toLowerCase() : 'abbigliamento'}/${filters.microCategory ? createUrlSchema([filters.microCategory]) : 'tutto'}/${sortUrl ? sortUrl : 'rilevanza'}`,
            query: {
                ...filtersParams
            }
        })
    }

    const changeRouter = (value: string, filterParameter: FilterAccepted) => {

        const filtersParams = getParamsFiltersFromObject(filters)
        if (filterParameter === 'macroCategory') {
            return router.push({
                //TODO quando mettiamo il sorting, inseriamo il sorting variabile alla fine
                pathname: `/abbigliamento/${filters.gender === 'm' ? 'uomo' : 'donna'}-${createUrlSchema([value])}/tutto/rilevanza`,
            })
        }
        if (filterParameter === 'microCategory') {
            return router.push({
                //TODO quando mettiamo il sorting, inseriamo il sorting variabile alla fine
                pathname: `/abbigliamento/${filters.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters.macroCategory === 'string' && filters.macroCategory !== '' ? filters.macroCategory.toLowerCase() : 'abbigliamento'}/${createUrlSchema([value])}/rilevanza`,
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
                pathname: `/abbigliamento/${filters.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters.macroCategory === 'string' && filters.macroCategory !== '' ? filters.macroCategory.toLowerCase() : 'abbigliamento'}/${filters.microCategory ? createUrlSchema([filters.microCategory]) : 'tutto'}/rilevanza`,
                query: {
                    ...filtersParams,
                    [filterParameter]: value.toLocaleLowerCase()
                }
            })

        }
        if (filterParameter === 'sizes') {
            //TODO quando mettiamo il sorting, inseriamo il sorting variabile alla fine
            const size = value?.split(' ')[0].toLocaleLowerCase()
            return router.push({
                pathname: `/abbigliamento/${filters.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters.macroCategory === 'string' && filters.macroCategory !== '' ? filters.macroCategory.toLowerCase() : 'abbigliamento'}/${filters.microCategory ? createUrlSchema([filters.microCategory]) : 'tutto'}/rilevanza`,
                query: {
                    ...filtersParams,
                    sizes: size ? [value.split(' ')[0].toLocaleLowerCase()] : null
                }
            })
        }
        if (filterParameter === 'sale') {
            //TODO quando mettiamo il sorting, inseriamo il sorting variabile alla fine
            if (value === 'true') {
                return router.push({
                    pathname: `/abbigliamento/${filters.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters.macroCategory === 'string' && filters.macroCategory !== '' ? filters.macroCategory.toLowerCase() : 'abbigliamento'}/${filters.microCategory ? createUrlSchema([filters.microCategory]) : 'tutto'}/rilevanza`,
                    query: {
                        ...filtersParams,
                        sale: value
                    }
                })
            } else {
                const { sale, ...newFilterParameters } = filtersParams
                return router.push({
                    pathname: `/abbigliamento/${filters.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters.macroCategory === 'string' && filters.macroCategory !== '' ? filters.macroCategory.toLowerCase() : 'abbigliamento'}/${filters.microCategory ? createUrlSchema([filters.microCategory]) : 'tutto'}/rilevanza`,
                    query: {
                        ...newFilterParameters,
                    }
                })
            }
        }


    }

    const deleteFilterParams = (paramters: FilterAccepted) => {
        if (paramters === 'macroCategory') {
            //TODO inserire sorting
            return router.push({
                pathname: `/abbigliamento/${filters.gender === 'm' ? 'uomo' : 'donna'}-abbigliamento/tutto/rilevanza`,
            })
        }

        if (paramters === 'microCategory') {
            let filtersParams: any = getParamsFiltersFromObject(filters)
            //TODO inserire sorting
            return router.push({
                pathname: `/abbigliamento/${filters.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters.macroCategory === 'string' && filters.macroCategory !== '' ? filters.macroCategory.toLowerCase() : 'abbigliamento'}/tutto/rilevanza`,
                query: {
                    ...filtersParams
                }
            })
        }
        let filtersParams: any = getParamsFiltersFromObject(filters)
        delete filtersParams[paramters]
        //TODO inserire sorting
        return router.push({
            pathname: `/abbigliamento/${filters.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters.macroCategory === 'string' && filters.macroCategory !== '' ? filters.macroCategory.toLowerCase() : 'abbigliamento'}/${filters.microCategory ? createUrlSchema([filters.microCategory]) : 'tutto'}/rilevanza`,
            query: {
                ...filtersParams
            }
        })
    }

    const routerConfirmDrawerFilter = (filtersDrawerModal: ProductsFilter | undefined) => {
        if (!filtersDrawerModal) {
            return router.push({
                pathname: `/abbigliamento/${filters.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters.macroCategory === 'string' && filters.macroCategory !== '' ? filters.macroCategory.toLowerCase() : 'abbigliamento'}/tutto/rilevanza`,
            })
        }
        if (typeof filtersDrawerModal.sizes?.[0] === 'string') {
            let size = filtersDrawerModal.sizes?.[0]
            filtersDrawerModal.sizes[0] = size.split(' ')[0].toLowerCase()
        }

        if (filtersDrawerModal.sale !== 'true') {
            delete filtersDrawerModal['sale']
        }

        let filtersParams = getParamsFiltersFromObject(filtersDrawerModal)

        //TODO inserire sorting
        return router.push({
            pathname: `/abbigliamento/${filters.gender === 'm' ? 'uomo' : 'donna'}-${typeof filtersDrawerModal.macroCategory === 'string' && filtersDrawerModal.macroCategory !== '' ? filtersDrawerModal.macroCategory.toLowerCase() : 'abbigliamento'}/${filtersDrawerModal.microCategory ? createUrlSchema([filtersDrawerModal.microCategory]) : 'tutto'}/rilevanza`,
            query: {
                ...filtersParams
            }
        })

    }



    return (
        <>
            <NoIndexSeo />
            <PostMeta
                canonicalUrl={'https://www.veplo.it' + router.asPath}
                title={`${typeof filters.macroCategory === 'string' ? filters.macroCategory : 'Abbigliamento'} ${filters.gender === 'f' ? 'donna' : 'uomo'} | Veplo`}
                subtitle={`${typeof filters.macroCategory === 'string' ? `${typeof filters.macroCategory} da ${filters.gender === 'f' ? 'donna' : 'uomo'}` : `Tutto l'abbigliamento da ${filters.gender === 'f' ? 'donna' : 'uomo'}`} | Abbigliamento · Scarpe · Vestiti | vivi Veplo`}
                image={''}
                description={`${typeof filters.macroCategory === 'string' ? `${typeof filters.macroCategory} da ${filters.gender === 'f' ? 'donna' : 'uomo'}` : `Tutto l'abbigliamento da ${filters.gender === 'f' ? 'donna' : 'uomo'}`} | Abbigliamento · Scarpe · Vestiti | vivi Veplo`}
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
                            {Object.values(CATEGORIES)[filters.gender === 'm' ? 1 : 0].abbigliamento.sort((a: any, b: any) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1).map((element: any) => {
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
                                                '/abbigliamento/' + (filters.gender == 'f' ? 'donna' : 'uomo') + '-abbigliamento/tutto/rilevanza'
                                                :
                                                '/abbigliamento/' + (filters.gender == 'f' ? 'donna' : 'uomo') + '-' + element.url + '/tutto/rilevanza'
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
                            mb={[3, 3]}
                            mt={[4, 6]}
                        >
                            {/* {filters.macroCategory ? toUpperCaseFirstLetter(filters.macroCategory) : "Tutto l'abbigliamento"} */}
                            Abbigliamento
                        </Text>
                        <Box

                            mt={0}
                            mb={[6, 10]}
                        >
                            <Box
                                justifyContent={'space-between'}
                                display={'flex'}
                            >
                                <FiltersSelections
                                    typeProducts={typeProducts}
                                    filters={filters}
                                    handleConfirmChange={changeRouter}
                                    filterDrawerConfirm={routerConfirmDrawerFilter}
                                    changePriceEventRouter={(parameters) => {
                                        let filtersParams: any = getParamsFiltersFromObject(filters)
                                        let newParams: any = {};
                                        for (let i = 0; i < parameters.length; i++) {
                                            if (parameters[i].value > 0) {
                                                newParams[parameters[i].name] = parameters[i].value
                                            } else {
                                                delete filtersParams[parameters[i].name]
                                            }
                                        }
                                        //TODO gestire sorting appena possibile
                                        router.replace({
                                            pathname: `/abbigliamento/${filters.gender === 'm' ? 'uomo' : 'donna'}-${typeof filters.macroCategory === 'string' && filters.macroCategory !== '' ? filters.macroCategory.toLowerCase() : 'abbigliamento'}/${filters.microCategory ? createUrlSchema([filters.microCategory]) : 'tutto'}/rilevanza`,
                                            query: {
                                                ...filtersParams,
                                                ...newParams
                                            }
                                        })
                                    }}
                                    handleChangeMacroCategory={(value: string) => {
                                        return router.push({
                                            pathname: `/abbigliamento/${filters.gender === 'm' ? 'uomo' : 'donna'}-${value !== '' ? value.toLowerCase() : 'abbigliamento'}/tutto/rilevanza`,
                                        })
                                    }}
                                />
                                <Select
                                    _active={{
                                        transform: 'scale(0.98)'
                                    }}
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
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
                                >
                                    {SORT_PRODUCT.map((sortElement) => {
                                        return (
                                            <option key={sortElement.text} value={sortElement.url}>{sortElement.text}</option>
                                        )
                                    })}
                                </Select>
                            </Box>

                            <HStack mt={[3, 2]} spacing={2}
                                className='flex flex-wrap'
                            >
                                {Object.keys(filters).filter(key => !['gender'].includes(key)).map((value) => {
                                    console.log(value);

                                    let text: string = '';
                                    if (value === 'sizes' && filters.sizes?.[0]) text = `Taglia ${filters.sizes[0].toUpperCase()}`
                                    if (value === 'minPrice') text = `Min ${filters.minPrice}€`
                                    if (value === 'maxPrice') text = `Max ${filters.maxPrice}€`
                                    if (value === 'colors' && filters.colors?.[0]) text = `${toUpperCaseFirstLetter(filters.colors[0])}`
                                    if (value === 'brand' && filters.brand) text = `${toUpperCaseFirstLetter(filters.brand)}`

                                    return (

                                        <div key={value}
                                            className={`${((value === 'microCategory' && !filters.microCategory) || (!filters.macroCategory && value === 'macroCategory')) && 'hidden'}`
                                            }>
                                            {value === 'macroCategory' && filters.macroCategory &&
                                                <TagFilter
                                                    value={value}
                                                    text={'' + toUpperCaseFirstLetter(filters.macroCategory)}
                                                    handleEvent={deleteFilterParams}
                                                />
                                            }
                                            {value === 'microCategory' && filters.microCategory &&
                                                <TagFilter
                                                    value={value}
                                                    text={'' + toUpperCaseFirstLetter(filters.microCategory)}
                                                    handleEvent={deleteFilterParams}
                                                />
                                            }
                                            {(value === 'sizes' || value === 'brand' || value === 'maxPrice' || value === 'minPrice' || value === 'colors') &&
                                                <TagFilter
                                                    value={value}
                                                    text={text}
                                                    handleEvent={deleteFilterParams}
                                                />
                                            }
                                            {value === 'sale' && isSmallView &&
                                                <TagFilter
                                                    value={value}
                                                    text={'Promozioni'}
                                                    handleEvent={deleteFilterParams}
                                                />
                                            }
                                        </div>
                                    )
                                })
                                }
                            </HStack>

                        </Box>

                        {!isLoading && products ?
                            (<InfiniteScroll
                                dataLength={products?.length}
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
                                                                        sessionStorage.setItem("productsInProductsPage", JSON.stringify(products))
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
                            </Box>}

                    </Box>

                </Shop_not_Allowed>
            </div >
        </>
    )
}

export default index