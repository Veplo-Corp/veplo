import { useLazyQuery } from '@apollo/client';
import { Box, Button, HStack, Input, InputGroup, Select, Skeleton, SkeletonCircle, SkeletonText, Stack, Text, VStack, color, useBreakpointValue } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import Box_Dress from '../../../../components/molecules/Box_Dress';
import FIlter_Button from '../../../../components/molecules/FIlter_Button';
import { CATEGORIES } from '../../../../components/mook/categories';
import PostMeta from '../../../../components/organisms/PostMeta';
import { findMacrocategoryName } from '../../../../components/utils/find_macrocategory_name';
import getGenderandMacrocategory from '../../../../components/utils/get_Gender_and_Macrocategory';
import { setInLocalStorage } from '../../../../components/utils/setInLocalStorage';
import { toProductPage } from '../../../../components/utils/toProductPage';
import { Product } from '../../../interfaces/product.interface';
import { initApollo } from '../../../lib/apollo';
import GET_PRODUCTS from '../../../lib/apollo/queries/getProducts';
import { changeGenderSelected } from '../../../store/reducers/user';
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@chakra-ui/icons';
import createUrlSchema from '../../../../components/utils/create_url';
import MenuBottonFilter from '../../../../components/atoms/MenuBottonFilter';
import TransitionFilter from '../../../../components/atoms/TransitionFilter';
import { SIZES } from '../../../../components/mook/sizes';
import { COLORS } from '../../../../components/mook/colors';
import Circle_Color from '../../../../components/atoms/Circle_Color';
import ModalReausable from '../../../../components/organisms/ModalReausable';
import toUpperCaseFirstLetter from '../../../../components/utils/uppercase_First_Letter';
import { findMicrocategoryName } from '../../../../components/utils/find_microcategory_name';
import Div_input_creation from '../../../../components/atoms/Div_input_creation';
import { AnimatePresence, motion } from 'framer-motion';
import Shop_not_Allowed from '../../../../components/utils/Shop_not_Allowed';
import NoIndexSeo from '../../../../components/organisms/NoIndexSeo';
import { Filter } from 'iconoir-react';
import DrawerFilter from '../../../../components/organisms/DrawerFilter';


const RANGE = 2

//motion
const listItemVariants = {
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
    hidden: {
        opacity: 0,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

const SORT_PRODUCT = [
    {
        text: 'Rilevanza',
        url: 'rilevanza'
    },
    {
        text: 'Ultime uscite',
        url: 'ultime-uscite'
    },
    {
        text: 'Prezzo decrescente',
        url: 'prezzo-decrescente'
    },
    {
        text: 'Prezzo crescente',
        url: 'prezzo-crescente'
    },

]




export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking', // can also be true or false
    }
}

export async function getStaticProps(ctx: any) {


    // console.log(ctx.params.slug);
    // return {
    //     props: {
    //         gender: 'm',
    //         category: 'mario',
    //         products: [],
    //     },
    // }
    let { slug } = ctx.params;

    const elementGenderMacrocategory: { gender: string | null, macrocategory: string | null } = getGenderandMacrocategory(slug[0]);
    const microgategoryNameUrl: string = slug[1];
    const sortType: string = slug[2];

    const apolloClient = initApollo()

    try {
        if (!elementGenderMacrocategory.gender || !elementGenderMacrocategory.macrocategory) {
            throw new Error("categoria o gender non trovato");
        }
        const macrogategoryName = findMacrocategoryName(elementGenderMacrocategory.macrocategory, elementGenderMacrocategory.gender) || ''
        const microgategoryName = findMicrocategoryName(elementGenderMacrocategory.macrocategory, elementGenderMacrocategory.gender, microgategoryNameUrl) || ''


        let filter: {
            macroCategory?: string,
            microCategory?: string,
            gender?: 'm' | 'f'
        } = {

        }
        if (macrogategoryName) {
            filter.macroCategory = macrogategoryName
        }
        if (microgategoryName) {
            filter.microCategory = microgategoryName
        }
        if (elementGenderMacrocategory.gender) {
            filter.gender = elementGenderMacrocategory.gender === 'uomo' ? 'm' : 'f'
        }


        const { data, errors } = await apolloClient.query({
            query: GET_PRODUCTS,
            variables: {
                offset: 0,
                limit: RANGE,
                filters: filter
            }
        })





        return {
            props: {
                gender: filter.gender,
                category: macrogategoryName,
                products: data?.products.products,
                microCategory: microgategoryName,
                sortType: sortType ? sortType : 'rilevanza'
            },
            revalidate: 10 //seconds
        }
    } catch (e: any) {


        return {
            props: {
                gender: elementGenderMacrocategory.gender === 'uomo' ? 'm' : 'f',
                category: elementGenderMacrocategory.macrocategory,
                products: [],
                errorLog: 'errore'
            },
            // notFound: true,
            revalidate: 1 //seconds
        }
    }

}

export interface PropsOpenModal {
    orderBy: boolean,
    category: boolean,
    size: boolean,
    color: boolean,
    price: boolean,
    brand: boolean,
    fit: boolean
}


export interface PropsFilter {
    sizes?: string[],
    colors?: string[],
    maxPrice?: number,
    minPrice?: number
    brand?: string,
    fit?: string,
}

const index: FC<{ products: Product[], category: string, microCategory: string, gender: 'f' | 'm', sortType: string }> = ({ products, microCategory, category, gender, sortType }) => {
    const isSmallView = useBreakpointValue({ base: true, lg: false });
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [productsFounded, setproductsFounded] = useState<Product[]>([])
    const dispatch = useDispatch();
    const [getProducts, productsFounder] = useLazyQuery(GET_PRODUCTS);
    const [microcategoryTypes, setMicrocategoryTypes] = useState<string[]>([])
    const [microcategory, setMicrocategory] = useState<string>()
    const [drawerFilter, setDrawerFilter] = useState(false)
    const [filterCount, setfilterCount] = useState(0)
    const [sizeProduct, setSizeProduct] = useState<string>();
    const [isOpen, setIsOpen] = useState<PropsOpenModal>({
        orderBy: false,
        category: false,
        size: false,
        color: false,
        price: false,
        brand: false,
        fit: false
    });
    const [cachedProducts, setcachedProducts] = useState(false)
    const [filter, setFilter] = useState<PropsFilter>({

    })
    const [slug, setSlug] = useState<any[]>([])



    const fetchMoreData = async () => {

        //FILTER
        const filter = getFilterValue()
        console.log(filter);


        if (products.length % RANGE !== 0 || productsFounder?.data?.products.length === 0) {
            setHasMoreData(false)
            return console.log('no more data');
        }



        const newProducts = await getProducts({
            variables: {
                offset: productsFounded.length,
                limit: RANGE,
                //inserire la microcategoria
                filters: {
                    macroCategory: category,
                    gender: gender,
                    ...filter,
                    microCategory: microCategory ? microCategory : ''
                }
            }
        })


        if (newProducts.data?.products.products) {

            setproductsFounded(prevstate => {
                const productsArray = [
                    ...prevstate,
                    ...newProducts.data?.products.products
                ]
                console.log(productsArray);

                return [
                    ...productsArray
                ]
            })

            if (newProducts.data?.products.products.length % RANGE !== 0 || newProducts.data?.products.products.length === 0) {
                setHasMoreData(false)
                return console.log('no more data');
            }
        }
    }


    //const fetchMoreData = async () => { }

    const setDefaultProducts = () => {
        if (window.history.state.key === sessionStorage.getItem("keyProductsSession")) {
            setLoading(false)
            setproductsFounded([])
            const productsFounded = sessionStorage.getItem("productsFounded");
            if (!productsFounded) return setproductsFounded(products)
            setproductsFounded(JSON.parse(productsFounded))
            const scrollPosition = sessionStorage.getItem('scrollPositionProducts');
            if (!scrollPosition) return
            console.log(scrollPosition);
            //window.scrollTo(0, parseInt(scrollPosition));
            setTimeout(() => {
                window.scrollTo({
                    top: parseInt(scrollPosition),
                    behavior: "smooth"
                });
            }, 500);
            setcachedProducts(true)
            setHasMoreData(true)
            return true
        }

        return false


    }

    useEffect(() => {

        const microcategoryTypes: any = Object.values(CATEGORIES)[gender === 'm' ? 1 : 0].abbigliamento.find(element => element.name === category)
        if (!microcategoryTypes?.types) {
            setSizeProduct('')
            return setMicrocategoryTypes([])
        }
        setMicrocategoryTypes(microcategoryTypes?.types);
        setSizeProduct(microcategoryTypes.sizes);
        const { slug } = router.query
        if (typeof slug === 'object' && slug?.length === 3) {
            setSlug(slug)
        }
    }, [products])


    useEffect(() => {
        //setMicrocategory(microCategory)
        if (gender) {
            setInLocalStorage('genderSelected', gender)
            dispatch(
                changeGenderSelected(gender)
            );
        }
    }, [gender, category])



    const mountedRef = useRef(true)

    const fetchSpecificItem = useCallback(async (filters: any) => {
        console.log('gender', gender);
        if (microCategory) {
            filters = {
                ...filters,
                microCategory
            }
        }

        console.log(filters);
        try {
            setTimeout(async () => {
                const newProducts = await getProducts({
                    variables: {
                        offset: 0,
                        limit: RANGE,
                        filters: {
                            macroCategory: toUpperCaseFirstLetter(category),
                            gender: gender,
                            ...filters
                        }
                    }
                })
                if (!newProducts?.data?.products.products) return setLoading(false)
                console.log(newProducts.data?.products.products);
                setproductsFounded(newProducts.data?.products.products)
                setHasMoreData(true)
                setLoading(false)
            }, 200);

            return
        } catch (error) {
            console.log(error);
        }

    }, [mountedRef, gender, microCategory, category]) // add variable as dependency

    useEffect(() => {
        filterLength()
        setLoading(true)
        if (!router.isReady) return
        const filters = getFilterValue()
        filterLength(filters)
        setHasMoreData(true)

        const cachedData = setDefaultProducts()
        console.log(cachedData);

        if (cachedData) return

        if (Object.keys(filters).length < 1) {
            setFilter({})
            setLoading(false)
            setHasMoreData(true)

            // setHasMoreData(true)
            // if (window.history.state.key !== sessionStorage.getItem("keyProductsSession") || cachedProducts) {
            //     return setproductsFounded(products)
            // }
            setproductsFounded(products)
            return
        }
        fetchSpecificItem(filters);
        setHasMoreData(true)

        return () => {
            mountedRef.current = false;   // clean up function

        };
    }, [router.query]);







    const getFilterValue = () => {
        const { sizes, colors, maxPrice, minPrice } = router.query
        if (colors || sizes || maxPrice || minPrice) {
            let filter: {
                colors?: string[],
                sizes?: string[],
                maxPrice?: number,
                minPrice?: number,
            } = {}


            if (typeof colors === 'string' && colors !== undefined) {
                filter['colors'] = [colors]

            }
            if (typeof sizes === 'string') {
                filter['sizes'] = [sizes.split(' ')[0]]
            }

            //! da rivedere logica quando inseriamo max e min price perchè questa non funziona
            if (typeof minPrice === 'string') {

                filter['minPrice'] = Number(minPrice)
            }
            if (typeof maxPrice === 'string') {

                filter['maxPrice'] = Number(maxPrice)
            }

            console.log(filter);

            setFilter(prevstate => {
                return {
                    ...filter
                }
            })


            return filter
        }
        return {}

    }

    const filterLength = (filter?: PropsFilter) => {
        let count = 0;
        if (microCategory) count = 1;
        if (!filter) return setfilterCount(count)
        if (Object.keys(filter)) {
            count += Object.keys(filter)?.length
        }
        return setfilterCount(count)
    }


    const changeSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const sortUrl = SORT_PRODUCT.find(element => element.url === e.target.value)?.url
        router.replace({
            pathname: `/prodotti/${gender === 'm' ? 'uomo' : 'donna'}-${category ? category.toLowerCase() : 'abbigliamento'}/${microCategory ? createUrlSchema([microCategory]) : 'tutto'}/${sortUrl ? sortUrl : 'rilevanza'}`,
            query: {
                ...filter
            }
        })
    }




    return (
        <>
            <NoIndexSeo />

            <PostMeta
                canonicalUrl={'https://www.veplo.it' + router.asPath}
                title={`${category === '' ? 'Abbigliamento' : category} ${gender === 'f' ? 'donna' : 'uomo'} | Veplo`}
                subtitle={`Tutto l'abbigliamento ${gender === 'f' ? 'donna' : 'uomo'} - ${category === '' ? 'Vestiti' : category} | Abbigliamento · Scarpe · Vestiti | scopri le offerte | vivi Veplo`}
                image={''}
                description={`Tutto l'abbigliamento ${gender === 'f' ? 'donna' : 'uomo'} - ${category === '' ? 'Vestiti' : category} | Abbigliamento · Scarpe · Vestiti | scopri le offerte | vivi Veplo`}
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
                            {Object.values(CATEGORIES)[gender === 'm' ? 1 : 0].abbigliamento.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1).map(element => {
                                return (
                                    <Box
                                        key={element.name}
                                        mb={4}
                                        className='whitespace-nowrap'
                                    >
                                        <Link
                                            prefetch={false}
                                            href={'/prodotti/' + (gender == 'f' ? 'donna' : 'uomo') + '-' + element.url + '/tutto/rilevanza'}
                                        >
                                            <Text
                                                textAlign={'start'}
                                                cursor={'pointer'}
                                                color={'secondaryBlack.text'}
                                                fontSize={'14px'}
                                                className={`hover:underline hover:underline-offset-2  ${element.name === category ? 'underline underline-offset-2 font-extrabold' : 'font-medium'}`}
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
                            {category ? toUpperCaseFirstLetter(category) : "Tutto l'abbigliamento"}
                        </Text>
                        {isSmallView
                            ? (
                                <Box
                                    justifyContent={'space-between'}
                                    display={'flex'}
                                    mb={6}
                                    gap={2}
                                >
                                    <Button

                                        height={12}
                                        variant={'grayPrimary'}
                                        gap={1}
                                        paddingX={4}
                                        borderRadius={'10px'}
                                        onClick={() => { setDrawerFilter(true) }}
                                    >
                                        <Filter
                                            className='w-6 h-6'
                                            strokeWidth={2.5}
                                        />
                                        {filterCount > 0 && <Text
                                            fontSize={'lg'}
                                            fontWeight={'semibold'}
                                        >
                                            {filterCount}
                                        </Text>}
                                    </Button>
                                    <Select
                                        _active={{
                                            transform: 'scale(0.98)'
                                        }}
                                        icon={
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                            </svg>
                                        }
                                        width={'full'}
                                        size={'lg'}
                                        borderRadius={'10px'}
                                        bg={'#F2F2F2'}
                                        focusBorderColor="transparent"
                                        borderColor={'#F2F2F2'}
                                        color={'secondaryBlack.text'}
                                        fontWeight={'semibold'}
                                        fontSize={'lg'}
                                        height={12}
                                        onChange={changeSort}
                                        value={SORT_PRODUCT.find(type => type.url.toLowerCase() === sortType.toLowerCase())?.url}
                                    >
                                        {SORT_PRODUCT.map((sortElement) => {
                                            return (
                                                <option key={sortElement.text} value={sortElement.url}>{sortElement.text}</option>
                                            )
                                        })}

                                    </Select>
                                </Box>
                            )
                            : (
                                <Box

                                    justifyContent={'space-between'}
                                    display={'flex'}
                                >
                                    <div
                                        className='mb-12 overflow-x-scroll lg:overflow-hidden flex gap-4'
                                    >
                                        {microcategoryTypes.length > 0 && <Button
                                            minW={'fit-content'}
                                            position={'relative'}
                                            bg={slug[1] !== 'tutto' ? 'black' : 'white'}
                                            color={slug[1] !== 'tutto' ? 'white' : 'secondaryBlack.text'}
                                            _hover={
                                                {
                                                    bg: slug[1] !== 'tutto' ? 'black' : 'white'
                                                }
                                            }
                                            _focus={{
                                                bg: slug[1] !== 'tutto' ? 'black' : 'white'
                                            }}
                                            borderWidth={1}
                                            borderColor={'secondaryBlack.borderColor'}
                                            borderRadius={'10px'}
                                            height={12}
                                            paddingX={8}
                                            fontWeight={'bold'}

                                            _active={{
                                                transform: 'scale(0.98)',
                                            }}
                                            fontSize={'16px'}
                                            onClick={() => {
                                                setIsOpen(prevstate => {
                                                    return {
                                                        ...prevstate,
                                                        category: true
                                                    }
                                                })
                                            }}
                                        >
                                            {slug[1] !== 'tutto' ? microCategory : 'Categoria'}
                                        </Button>}
                                        {sizeProduct && sizeProduct.length > 0 && <Button
                                            minW={'fit-content'}
                                            position={'relative'}
                                            borderWidth={1}
                                            borderColor={'secondaryBlack.borderColor'}
                                            borderRadius={'10px'}
                                            height={12}
                                            paddingX={8}

                                            bg={filter.sizes ? 'black' : 'white'}
                                            color={filter.sizes ? 'white' : 'secondaryBlack.text'}
                                            _hover={
                                                {
                                                    bg: filter.sizes ? 'black' : 'white'
                                                }
                                            }
                                            _focus={{
                                                bg: filter.sizes ? 'black' : 'white'
                                            }}
                                            _active={{
                                                transform: 'scale(0.98)',
                                            }}
                                            fontSize={'16px'}
                                            fontWeight={'bold'}
                                            onClick={() => {
                                                setIsOpen(prevstate => {
                                                    return {
                                                        ...prevstate,
                                                        size: true
                                                    }
                                                })
                                            }}
                                        >
                                            {filter.sizes ? 'Taglia ' + filter.sizes[0].toLocaleUpperCase() : 'Taglia'}
                                        </Button>
                                        }
                                        <Button
                                            minW={'fit-content'}
                                            position={'relative'}
                                            bg={filter.colors && filter.colors?.length > 0 ? 'black' : 'white'}
                                            color={filter.colors && filter.colors?.length > 0 ? 'white' : 'secondaryBlack.text'}
                                            _hover={
                                                {
                                                    bg: filter.colors && filter.colors?.length > 0 ? 'black' : 'white'
                                                }
                                            }
                                            _focus={{
                                                bg: filter.colors && filter.colors?.length > 0 ? 'black' : 'white'
                                            }}

                                            borderWidth={1}
                                            borderColor={'secondaryBlack.borderColor'}
                                            borderRadius={'10px'}
                                            height={12}
                                            paddingX={8}
                                            fontWeight={'bold'}
                                            _active={{
                                                transform: 'scale(0.98)',
                                            }}
                                            fontSize={'16px'}
                                            onClick={() => {
                                                setIsOpen(prevstate => {
                                                    return {
                                                        ...prevstate,
                                                        color: true
                                                    }
                                                })
                                            }}
                                        >
                                            {filter.colors ? toUpperCaseFirstLetter(filter.colors[0].toLocaleLowerCase()) : 'Colore'}
                                        </Button>
                                        {false && <Button
                                            minW={'fit-content'}
                                            bg={'white'}
                                            position={'relative'}
                                            color={'black'}
                                            _hover={{ bg: 'white' }}
                                            borderWidth={1}
                                            borderColor={'secondaryBlack.borderColor'}
                                            borderRadius={'10px'}
                                            height={12}
                                            paddingX={8}
                                            _focus={{
                                                bg: 'white'
                                            }}
                                            _active={{
                                                transform: 'scale(0.98)',
                                            }}
                                            fontSize={'16px'}
                                            onClick={() => {
                                                setIsOpen(prevstate => {
                                                    return {
                                                        ...prevstate,
                                                        orderBy: true
                                                    }
                                                })
                                            }}
                                        >
                                            Ordina
                                        </Button>}
                                        <Button
                                            minW={'fit-content'}
                                            bg={filter.maxPrice || filter.minPrice ? 'black' : 'white'}
                                            color={filter.maxPrice || filter.minPrice ? 'white' : 'secondaryBlack.text'}
                                            _hover={
                                                {
                                                    bg: filter.maxPrice || filter.minPrice ? 'black' : 'white'
                                                }
                                            }
                                            _focus={{
                                                bg: filter.maxPrice || filter.minPrice ? 'black' : 'white'
                                            }}
                                            borderWidth={1}
                                            borderColor={'secondaryBlack.borderColor'}
                                            borderRadius={'10px'}
                                            height={12}
                                            paddingX={8}
                                            fontWeight={'bold'}

                                            _active={{
                                                transform: 'scale(0.98)',
                                            }}
                                            fontSize={'16px'}
                                            onClick={() => {
                                                setIsOpen(prevstate => {
                                                    return {
                                                        ...prevstate,
                                                        price: true
                                                    }
                                                })
                                            }}
                                        >
                                            {filter.minPrice ? 'da ' + filter.minPrice + '€ ' : ''}
                                            {filter.maxPrice ? 'fino a ' + filter.maxPrice + '€' : ''}
                                            {!filter.minPrice && !filter.maxPrice ? 'Prezzo' : ''}
                                        </Button>
                                    </div>
                                    <Select
                                        _active={{
                                            transform: 'scale(0.98)'
                                        }}
                                        icon={
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                            </svg>
                                        }
                                        width={'fit-content'}
                                        size={'lg'}
                                        borderRadius={'10px'}
                                        bg={'#F2F2F2'}
                                        focusBorderColor="transparent"
                                        borderColor={'#F2F2F2'}
                                        color={'secondaryBlack.text'}
                                        fontWeight={'semibold'}
                                        fontSize={'16px'}
                                        height={12}
                                        onChange={changeSort}
                                    >
                                        {SORT_PRODUCT.map((sortElement) => {
                                            return (
                                                <option key={sortElement.text} value={sortElement.url}>{sortElement.text}</option>
                                            )
                                        })}
                                    </Select>
                                </Box>)}



                        {!loading ?
                            (<InfiniteScroll
                                dataLength={productsFounded.length}
                                next={fetchMoreData}
                                hasMore={hasMoreData}
                                loader={
                                    <>
                                        {productsFounded[3] && <Text textAlign={'center'}
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
                                        {productsFounded.length > 0 ?
                                            (
                                                <AnimatePresence>
                                                    {productsFounded.map((product: Product) => {

                                                        const { colors } = router.query
                                                        return (
                                                            <motion.div
                                                                key={product.id}
                                                                variants={listItemVariants}
                                                                initial="hidden"
                                                                animate="visible"
                                                                exit="hidden"
                                                            >
                                                                <Box_Dress
                                                                    handleEventSelectedDress={() => {
                                                                        sessionStorage.setItem("keyProductsSession", window.history.state.key)
                                                                        sessionStorage.setItem("productsFounded", JSON.stringify(productsFounded))
                                                                        sessionStorage.setItem('scrollPositionProducts', window.pageYOffset.toString());
                                                                    }}
                                                                    productLink={`/prodotto/${product.id}/${product?.info?.brand}-${product.name}${router.asPath.split('?')[1] ? '?' + router.asPath.split('?')[1] : ''}`}
                                                                    showStoreHeader={true} product={product} color={filter.colors?.[0] ? filter.colors[0] : undefined}></Box_Dress>

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
                                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-5 gap-y-5 w-full">
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
                                                    className={'h-[450px] lg:h-[350px] xl:h-[400px]'}
                                                    borderRadius={'3xl'}
                                                />
                                            </Box>

                                        )
                                    })}

                                </div>
                            )
                        }
                        {
                            !loading && productsFounded.length <= 0 &&
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


                {/* {gender && <FIlter_Button gender={gender} macrocategory={category ? category : "Tutto l'abbigliamento"} />} */}

                {/* Modal Categorie */}
                <ModalReausable
                    marginTop={32}
                    title='Categoria' closeModal={() => {
                        setIsOpen(prevstate => {
                            return {
                                ...prevstate,
                                category: false
                            }
                        })
                    }} isOpen={isOpen.category} positionTopModal={true}>
                    <Box
                        mt={3}
                        className={`${sizeProduct === 'shoes_sizes' ? 'grid grid-cols-2 md:grid-cols-4 gap-5' : ''} min-w-[300px]`}
                    >
                        {microcategoryTypes.map((element: string) => {
                            let url = router.asPath.split('?')[1] ?
                                `/prodotti/${slug[0]}/${createUrlSchema([element])}/${slug[2]}?${router.asPath.split('?')[1]}`
                                : `/prodotti/${slug[0]}/${createUrlSchema([element])}/${slug[2]}`
                            if (element === microCategory) {
                                url = url.replace(createUrlSchema([element]), 'tutto')
                            }
                            return (
                                <Link
                                    prefetch={false}

                                    key={element}
                                    onClick={() => {
                                        setIsOpen(prevstate => {
                                            return {
                                                ...prevstate,
                                                category: false
                                            }
                                        })
                                        setHasMoreData(true)

                                    }}
                                    href={url}
                                >
                                    <Box
                                        p={2}
                                        width={'full'}

                                        pl={2}
                                        _hover={{
                                            background: 'gray.100'
                                        }}
                                        background={microCategory === element ? 'gray.100' : 'white'}
                                        cursor={'pointer'}
                                        borderRadius={'lg'}
                                        fontSize={'lg'}
                                        fontWeight={'semibold'}
                                    >
                                        {element}
                                    </Box>
                                </Link>

                            )
                        })}
                    </Box>

                </ModalReausable>
                <ModalReausable
                    marginTop={32} title='Taglia' closeModal={() => {
                        setIsOpen(prevstate => {
                            return {
                                ...prevstate,
                                size: false
                            }

                        })
                    }} isOpen={isOpen.size} positionTopModal={true}>
                    <Box
                        mt={2}
                        className={`grid ${sizeProduct === 'shoes_sizes' ? 'grid-cols-4 md:grid-cols-6 gap-2' : 'grid-cols-3 gap-2'} `}
                    >
                        {(sizeProduct === 'man_clothes_sizes' || sizeProduct === 'woman_clothes_sizes' || sizeProduct === 'shoes_sizes') && SIZES[sizeProduct].map(element => {
                            return (<Box
                                key={element}
                                p={4}
                                width={'full'}
                                _hover={{
                                    background: 'gray.100'
                                }}
                                background={element.split(' ')[0] === router.query.sizes ? 'gray.100' : 'white'}
                                textAlign={'center'}
                                cursor={'pointer'}
                                borderRadius={'lg'}
                                fontSize={'md'}
                                fontWeight={'semibold'}
                                onClick={() => {
                                    setIsOpen(prevstate => {
                                        return {
                                            ...prevstate,
                                            size: false
                                        }
                                    })
                                    setHasMoreData(true)


                                    if (element.split(' ')[0] === router.query.sizes) {
                                        let filter = getFilterValue();
                                        delete filter['sizes'];

                                        return router.push({
                                            pathname: router.asPath.split('?')[0],
                                            query: {
                                                ...filter
                                            }
                                        })
                                    } else {
                                        const filter = getFilterValue();
                                        router.push({
                                            pathname: router.asPath.split('?')[0],
                                            query: {
                                                ...filter,
                                                sizes: [element.split(' ')[0]]
                                            }
                                        })
                                    }
                                }
                                }
                            >
                                {element.toLocaleUpperCase()}
                            </Box>)
                        })}
                    </Box>

                </ModalReausable>
                <ModalReausable
                    marginTop={32} title={'Colore'} closeModal={() => {
                        setIsOpen(prevstate => {
                            return {
                                ...prevstate,
                                color: false
                            }
                        })
                    }} isOpen={isOpen.color} positionTopModal={true}>
                    <Box
                        mt={3}
                        className={`grid grid-cols-2 md:grid-cols-3 gap-4`}
                    >
                        {COLORS.map(element => {
                            return (
                                <Box
                                    key={element.cssColor}
                                    width={'full'}
                                    _hover={{
                                        background: 'gray.100'
                                    }}
                                    background={element.name.toLocaleLowerCase() === router.query.colors ? 'gray.100' : 'white'}
                                    p={2}
                                    textAlign={'center'}
                                    cursor={'pointer'}
                                    borderRadius={'lg'}
                                    fontSize={'md'}
                                    fontWeight={'semibold'}
                                    onClick={() => {

                                        setIsOpen(prevstate => {
                                            return {
                                                ...prevstate,
                                                color: false
                                            }
                                        })
                                        setHasMoreData(true)
                                        if (element.name.toLocaleLowerCase() === router.query.colors) {
                                            let filter = getFilterValue();
                                            setHasMoreData(true)
                                            delete filter['colors'];
                                            router.replace({
                                                pathname: router.asPath.split('?')[0],
                                                query: {
                                                    ...filter
                                                },
                                            },
                                                undefined
                                            )
                                            setFilter(prevstate => {
                                                const newPrevstate = prevstate
                                                delete newPrevstate.colors
                                                return {
                                                    ...newPrevstate,
                                                }
                                            })
                                        } else {
                                            const filter = getFilterValue();
                                            sessionStorage.removeItem("keyProductsSession")
                                            router.replace({
                                                pathname: router.asPath.split('?')[0],
                                                query: {
                                                    ...filter,
                                                    colors: [element.name.toLocaleLowerCase()]
                                                },
                                            },
                                                undefined,
                                                { shallow: true }
                                            )
                                        }
                                    }
                                    }
                                >
                                    <div
                                        className='flex m-auto'
                                    >
                                        <div className='my-auto mr-2'>
                                            <Circle_Color colors={[element.cssColor]} dimension={4} space={0} />

                                        </div>
                                        <Text
                                            my={'auto'}
                                        >
                                            {element.name}
                                        </Text>
                                    </div>

                                </Box>)
                        })}
                    </Box>

                </ModalReausable>
                <ModalReausable
                    marginTop={32} title={'Prezzo'} closeModal={() => {

                        const filterValues = getFilterValue();
                        let price: {
                            minPrice?: number,
                            maxPrice?: number
                        } = {}
                        if (filter.minPrice) {
                            price['minPrice'] = filter.minPrice
                        }
                        if (filter.maxPrice && (!filter.minPrice || filter.maxPrice > filter.minPrice)) {
                            console.log(filter.maxPrice);
                            console.log(filter.minPrice);

                            price['maxPrice'] = filter.maxPrice
                        } else {
                            delete filterValues['maxPrice']
                        }

                        if (filterValues.maxPrice !== filter.maxPrice || filterValues.minPrice !== filter.minPrice) {
                            if (!filter.maxPrice) {
                                delete filterValues['maxPrice']
                            }
                            if (!filter.minPrice) {
                                delete filterValues['minPrice']
                            }

                            router.push({
                                pathname: router.asPath.split('?')[0],
                                query: {
                                    ...filterValues,
                                    ...price
                                }
                            })
                        }



                        setIsOpen(prevstate => {
                            return {
                                ...prevstate,
                                price: false
                            }
                        })
                        setHasMoreData(true)


                    }}
                    isOpen={isOpen.price} positionTopModal={true}>
                    <Box
                        mt={3}
                        className={`flex justify-between`}
                        marginTop={4}
                    >

                        {/* <InputLeftAddon rounded={10}    height={12} children='€' paddingInline={6} /> */}
                        <Input
                            rounded={10}
                            height={12}
                            borderWidth={0}
                            autoComplete='off'
                            type="number"
                            value={filter.minPrice || ""}
                            onWheel={(e: any) => e.target.blur()}
                            placeholder={'minimo'}
                            _placeholder={{
                                fontWeight: '450',
                                color: '#A19F9F'
                            }}
                            fontWeight={'semibold'}
                            fontSize={['md', 'lg']}
                            background={'#F2F2F2'}
                            textAlign={"center"}
                            isInvalid={false}
                            onChange={(e) => {
                                const number = Number(e.target.value.replace('/[^1-9]/g', ""))
                                if (number >= 0) {
                                    setFilter(prevstate => {
                                        return {
                                            ...prevstate,
                                            minPrice: number
                                        }
                                    })
                                }

                            }}
                        />

                        <span className='mx-4 my-auto font-black'>
                            -
                        </span>

                        {/* <InputLeftAddon rounded={10}    height={12} children='€' paddingInline={6} /> */}
                        <Input
                            rounded={10}
                            height={12}
                            autoComplete='off'
                            type="number"
                            value={filter.maxPrice || ""}
                            onWheel={(e: any) => e.target.blur()}
                            placeholder={'massimo'}
                            fontSize={['md', 'lg']}
                            background={'#F2F2F2'}
                            textAlign={"center"}
                            _placeholder={{
                                fontWeight: '450',
                                color: '#A19F9F'
                            }}
                            borderWidth={0}
                            fontWeight={'semibold'}
                            isInvalid={false}
                            onChange={(e) => {
                                const number = Number(e.target.value.replace('/[^1-9]/g', ""))
                                if (number >= 0) {
                                    setFilter(prevstate => {
                                        return {
                                            ...prevstate,
                                            maxPrice: number
                                        }
                                    })
                                }

                            }}
                        />

                    </Box>
                    {/* <Stack align={'end'} mt={2} >

                    <Button

                        mt={2}
                        

                        type={'button'}
                        borderRadius={'xl'}
                        size={'md'}
                        padding={4}
                        paddingInline={12}
                        width={'fit-content'}
                        height={'fit-content'}
                        bg={'black.900'}
                        color={'white'}
                        _hover={{ bg: 'black.900' }}
                        _focus={{
                            bg: 'black.900'
                        }}
                        _active={{
                            transform: 'scale(0.98)',
                        }}
                        _disabled={{
                            background: 'black'
                        }}
                    >
                        conferma
                    </Button>
                </Stack> */}

                </ModalReausable>
            </div >
            <DrawerFilter
                defaultFilter={filter}
                microcategoryTypes={microcategoryTypes}
                defaultMicroCategory={microCategory}
                sizeProduct={sizeProduct ? sizeProduct : ''}
                isOpenDrawer={drawerFilter}
                closeDrawer={(filter, microCategory) => {


                    // router.replace({
                    //     pathname: `/prodotti/${gender === 'm' ? 'uomo' : 'donna'}-${category ? category.toLowerCase() : 'abbigliamento'}/${microCategory ? createUrlSchema([microCategory]) : 'tutto'}/${sortType ? sortType : 'rilevanza'}`,
                    //     query: {
                    //         ...filter
                    //     }
                    // })


                    //controlla se il path nuovo è uguale a quello vecchio per non pushare senza senso
                    let pathname = `/prodotti/${gender === 'm' ? 'uomo' : 'donna'}-${category ? category.toLowerCase() : 'abbigliamento'}/${microCategory ? createUrlSchema([microCategory]) : 'tutto'}/${sortType ? sortType : 'rilevanza'}`;
                    const query = new URLSearchParams(filter as Record<string, string>).toString();
                    if (query) {
                        pathname = pathname + `?${query}`;
                    }
                    if (router.asPath !== pathname) {
                        router.push(pathname)
                    }
                    setDrawerFilter(false)
                }}
            />
        </>



    )
}


export default index