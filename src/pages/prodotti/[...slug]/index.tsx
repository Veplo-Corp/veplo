import { useLazyQuery } from '@apollo/client';
import { Box, Button, HStack, Input, InputGroup, Skeleton, SkeletonCircle, SkeletonText, Stack, Text, VStack, color } from '@chakra-ui/react';
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
import { motion } from 'framer-motion';
import Shop_not_Allowed from '../../../../components/utils/Shop_not_Allowed';


const RANGE = 5


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
    const searchedText: string = slug[3];




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
                microCategory: microgategoryName
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

interface PropsOpenModal {
    orderBy: boolean,
    category: boolean,
    size: boolean,
    color: boolean,
    price: boolean,
    brand: boolean,
    fit: boolean
}


interface PropsFilter {
    category?: string,
    sizes?: string,
    colors?: string,
    price?: {
        min?: number,
        max?: number
    },
    brand?: string,
    fit?: string
}

const index: FC<{ products: Product[], category: string, microCategory: string, gender: 'f' | 'm' }> = ({ products, microCategory, category, gender }) => {

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [productsFounded, setproductsFounded] = useState<Product[]>([])
    const dispatch = useDispatch();
    const [getProducts, productsFounder] = useLazyQuery(GET_PRODUCTS);
    const [microcategory, setMicrocategory] = useState<string[]>([])
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
                    ...filter
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

    useEffect(() => {

        // verificare se l'utente è arrivato sulla pagina con il pulsante "Indietro"
        console.log(window.history.state.key === sessionStorage.getItem("key"));
        console.log(window.history.state.key, sessionStorage.getItem("key"));


        if (window.history.state.key === sessionStorage.getItem("key")) {
            setproductsFounded([])
            const productsFounded = sessionStorage.getItem("productsFounded");
            if (!productsFounded) return
            setproductsFounded(JSON.parse(productsFounded))
            const scrollPosition = sessionStorage.getItem('scrollPosition');
            if (!scrollPosition) return
            console.log(scrollPosition);
            setTimeout(() => {
                window.scrollTo(0, parseInt(scrollPosition));
            }, 500);
            setHasMoreData(true)
        }
        else {

            setHasMoreData(true)
            const microcategory: any = Object.values(CATEGORIES)[gender === 'm' ? 1 : 0].abbigliamento.find(element => element.name === category)
            setproductsFounded(products)
            if (!microcategory?.types) {
                setSizeProduct('')
                return setMicrocategory([])
            }
            setMicrocategory(microcategory?.types);
            setSizeProduct(microcategory.sizes);

            const { slug } = router.query
            if (typeof slug === 'object' && slug?.length === 3) {
                setSlug(slug)
            }
            setFilter({})
        }




    }, [products])


    useEffect(() => {
        if (gender) {
            setInLocalStorage('genderSelected', gender)
            dispatch(
                changeGenderSelected(gender)
            );
        }
    }, [gender])





    const mountedRef = useRef(true)

    const fetchSpecificItem = useCallback(async (filters: any) => {
        console.log('gender', gender);
        console.log(microCategory);

        try {
            const newProducts = async () => {
                return await getProducts({
                    variables: {
                        offset: 0,
                        limit: RANGE,
                        filters: {
                            macroCategory: toUpperCaseFirstLetter(category),
                            //inserire la microcategoria
                            microCategory: microCategory ? microCategory : '',
                            gender: gender,
                            ...filters
                        }
                    }
                })
            }
            newProducts().then(products => {
                console.log(products);

                if (!products.data?.products.products) return
                console.log(products.data?.products.products);

                setproductsFounded(products.data?.products.products)
                setHasMoreData(true)
            })
        } catch (error) {
            console.log(error);

        }
    }, [mountedRef, gender, microCategory]) // add variable as dependency

    useEffect(() => {

        const filters = getFilterValue()

        if (Object.keys(filters).length < 1) {
            return
        }
        fetchSpecificItem(filters);

        return () => {
            mountedRef.current = false;   // clean up function
        };
    }, [router.query, fetchSpecificItem]);




    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 200);

    }, [])



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

                setFilter(prevstate => {
                    return {
                        ...prevstate,
                        colors: colors
                    }
                })
                filter['colors'] = [colors]

            }
            if (typeof sizes === 'string') {
                setFilter(prevstate => {
                    return {
                        ...prevstate,
                        sizes: sizes
                    }
                })
                filter['sizes'] = [sizes.split(' ')[0]]
            }
            if (typeof minPrice === 'string') {
                setFilter(prevstate => {
                    return {
                        ...prevstate,
                        price: {
                            ...prevstate.price,
                            min: Number(minPrice)
                        }
                    }
                })
                filter['minPrice'] = Number(minPrice)
            }
            if (typeof maxPrice === 'string') {
                setFilter(prevstate => {
                    return {
                        ...prevstate,
                        price: {
                            ...prevstate.price,
                            max: Number(maxPrice)
                        }
                    }
                })
                filter['maxPrice'] = Number(maxPrice)
            }

            return filter
        }
        return {}

    }




    return (
        <>
            <PostMeta
                canonicalUrl={'https://www.veplo.it' + router.asPath}
                title={`${category === '' ? 'Abbigliamento' : category} ${gender === 'f' ? 'donna' : 'uomo'} | Veplo`}
                subtitle={`Tutto l'abbigliamento ${gender === 'f' ? 'donna' : 'uomo'} - ${category === '' ? 'Vestiti' : category} | Abbigliamento · Scarpe · Vestiti | scopri le offerte | vivi Veplo`}
                image={''}
                description={`Tutto l'abbigliamento ${gender === 'f' ? 'donna' : 'uomo'} - ${category === '' ? 'Vestiti' : category} | Abbigliamento · Scarpe · Vestiti | scopri le offerte | vivi Veplo`}
            />
            <div className='relative'>
                <Desktop_Layout>
                    <Shop_not_Allowed>

                        {/* {gender &&
                    <Text
                        mt={5}
                        fontSize={'lg'}
                        fontWeight={'semibold'}
                        marginBottom={4}
                    >
                        {gender === 'f' ? 'Donna' : 'Uomo'} | {category ? category : "tutto l'abbligliamento"}
                    </Text>
                } */}


                        <Box width={'full'}
                            display={'flex'}
                        >
                            <Box
                                minWidth={'3xs'}
                                className='hidden lg:table lg:mt-4 ml-2'
                            >
                                {Object.values(CATEGORIES)[gender === 'm' ? 1 : 0].abbigliamento.map(element => {


                                    return (
                                        <Box
                                            key={element.name}
                                            mb={4}
                                            width={'fit-content'}
                                        >
                                            <Link
                                                prefetch={false}
                                                href={'/prodotti/' + (gender == 'f' ? 'donna' : 'uomo') + '-' + element.url + '/tutto/rilevanza'}
                                            >
                                                <Text
                                                    textAlign={'start'}
                                                    cursor={'pointer'}
                                                    fontWeight={'bold'}
                                                    fontSize={'md'}
                                                    className='hover:underline'
                                                >
                                                    {element.name}

                                                </Text>

                                                {element.name === category && <Box
                                                    className={`h-[8px] bg-red-500 mt-[-12px]`}>
                                                </Box>}
                                            </Link>


                                        </Box>
                                    )
                                })}
                            </Box>

                            <Box
                                className='w-full relative lg:mt-2'
                            >

                                <div
                                    className='mb-2 overflow-x-scroll lg:overflow-hidden flex gap-4 pb-3'
                                >

                                    {microcategory.length > 0 && <Button
                                        minW={'fit-content'}
                                        bg={slug[1] !== 'tutto' ? 'black' : 'white'}
                                        position={'relative'}
                                        color={slug[1] !== 'tutto' ? 'white' : 'black'}
                                        _hover={
                                            {
                                                bg: slug[1] !== 'tutto' ? 'black' : 'white'
                                            }
                                        }
                                        borderWidth={1}
                                        borderColor={'#DFDFDF'}
                                        borderRadius={'10px'}
                                        padding={6}
                                        fontWeight={'bold'}
                                        _focus={{
                                            bg: slug[1] !== 'tutto' ? 'black' : 'white'
                                        }}
                                        _active={{
                                            transform: 'scale(0.98)',
                                        }}
                                        fontSize={'18px'}
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
                                        bg={'white'}
                                        position={'relative'}
                                        color={'black'}
                                        _hover={{ bg: 'white' }}
                                        borderWidth={1}
                                        borderColor={'#DFDFDF'}
                                        borderRadius={'10px'}
                                        padding={6}
                                        _focus={{
                                            bg: 'white'
                                        }}
                                        _active={{
                                            transform: 'scale(0.98)',
                                        }}
                                        fontSize={'18px'}
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
                                        {filter.sizes ? 'Taglia ' + filter.sizes.toLocaleUpperCase() : 'Taglia'}
                                    </Button>
                                    }
                                    <Button
                                        minW={'fit-content'}
                                        bg={'white'}
                                        position={'relative'}
                                        color={'black'}
                                        _hover={{ bg: 'white' }}
                                        borderWidth={1}
                                        borderColor={'#DFDFDF'}
                                        borderRadius={'10px'}
                                        padding={6}
                                        fontWeight={'bold'}
                                        _focus={{
                                            bg: 'white'
                                        }}
                                        _active={{
                                            transform: 'scale(0.98)',
                                        }}
                                        fontSize={'18px'}
                                        onClick={() => {
                                            setIsOpen(prevstate => {
                                                return {
                                                    ...prevstate,
                                                    color: true
                                                }
                                            })
                                        }}
                                    >
                                        {filter.colors ? filter.colors : 'Colore'}
                                    </Button>
                                    {false && <Button

                                        minW={'fit-content'}
                                        bg={'white'}
                                        position={'relative'}
                                        color={'black'}
                                        _hover={{ bg: 'white' }}
                                        borderWidth={1}
                                        borderColor={'#DFDFDF'}
                                        borderRadius={'10px'}
                                        padding={6}
                                        _focus={{
                                            bg: 'white'
                                        }}
                                        _active={{
                                            transform: 'scale(0.98)',
                                        }}
                                        fontSize={'18px'}
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
                                        bg={'white'}
                                        position={'relative'}
                                        color={'black'}
                                        _hover={{ bg: 'white' }}
                                        borderWidth={1}
                                        borderColor={'#DFDFDF'}
                                        borderRadius={'10px'}
                                        padding={6}
                                        fontWeight={'bold'}
                                        _focus={{
                                            bg: 'white'
                                        }}
                                        _active={{
                                            transform: 'scale(0.98)',
                                        }}
                                        fontSize={'18px'}
                                        onClick={() => {
                                            setIsOpen(prevstate => {
                                                return {
                                                    ...prevstate,
                                                    price: true
                                                }
                                            })
                                        }}
                                    >
                                        {filter.price?.min ? 'da ' + filter.price?.min + '€ ' : ''}
                                        {filter.price?.max ? 'fino a ' + filter.price?.max + '€' : ''}
                                        {!filter.price?.min && !filter.price?.max ? 'Prezzo' : ''}
                                    </Button>
                                </div>

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
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-5 gap-y-5 w-full">

                                                {productsFounded.length > 0 ?
                                                    (
                                                        productsFounded.map((product: Product) => {

                                                            const { colors } = router.query
                                                            return (
                                                                <Transition
                                                                    key={product.id}
                                                                    appear={productsFounded.length > 0}
                                                                    show={productsFounded.length > 0}
                                                                    enter="transition-opacity duration-500 transform"
                                                                    enterFrom="opacity-0"
                                                                    enterTo="opacity-100"
                                                                    leave="transition-opacity duration-500 transform"
                                                                    leaveFrom="opacity-0"
                                                                    leaveTo="opacity-0"
                                                                >
                                                                    <Box_Dress handleEventSelectedDress={() => {
                                                                        sessionStorage.setItem("key", window.history.state.key)
                                                                        sessionStorage.setItem("productsFounded", JSON.stringify(productsFounded))
                                                                        sessionStorage.setItem('scrollPosition', window.pageYOffset.toString());
                                                                    }} showStoreHeader={true} product={product} color={typeof colors === 'string' ? colors : undefined}></Box_Dress>
                                                                </Transition>

                                                            )
                                                        })
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
                                                            padding='0' bg='white' display={'flex'} gap={1.5}>
                                                            <SkeletonCircle size='14' />
                                                            <Box
                                                                margin={'auto'}
                                                            >
                                                                <SkeletonText
                                                                    width={[56, 48]}

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



                        </Box>
                    </Shop_not_Allowed>

                </Desktop_Layout >
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
                    >
                        {microcategory.map((element: string) => {
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
                                        pr={[0, 44]}
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
                        className={`grid ${sizeProduct === 'shoes_sizes' ? 'grid-cols-4 gap-2' : 'grid-cols-3 gap-2'} `}
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
                                    background={element.name === router.query.colors ? 'gray.100' : 'white'}
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

                                        if (element.name === router.query.colors) {
                                            let filter = getFilterValue();
                                            delete filter['colors'];
                                            return router.push({
                                                pathname: router.asPath.split('?')[0],
                                                query: {
                                                    ...filter
                                                }
                                            },
                                            )
                                        } else {
                                            const filter = getFilterValue();
                                            router.push({
                                                pathname: router.asPath.split('?')[0],
                                                query: {
                                                    ...filter,
                                                    colors: [element.name]
                                                }
                                            })
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
                        if (filter.price?.min) {
                            price['minPrice'] = filter.price?.min
                        }
                        if (filter.price?.max && (!filter.price?.min || filter.price?.max > filter.price?.min)) {
                            console.log(filter.price?.max);
                            console.log(filter.price?.min);

                            price['maxPrice'] = filter.price?.max
                        } else {
                            delete filterValues['maxPrice']
                        }

                        if (filterValues.maxPrice !== filter.price?.max || filterValues.minPrice !== filter.price?.min) {
                            if (!filter.price?.max) {
                                delete filterValues['maxPrice']
                            }
                            if (!filter.price?.min) {
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

                        {/* <InputLeftAddon rounded={10} paddingY={6} children='€' paddingInline={6} /> */}
                        <Input
                            rounded={10}
                            paddingY={6}
                            borderWidth={0}
                            autoComplete='off'
                            type="number"
                            value={filter.price?.min || ""}
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
                                            price: {
                                                ...prevstate.price,
                                                min: number
                                            }
                                        }
                                    })
                                }

                            }}
                        />

                        <span className='mx-4 my-auto font-black'>
                            -
                        </span>

                        {/* <InputLeftAddon rounded={10} paddingY={6} children='€' paddingInline={6} /> */}
                        <Input
                            rounded={10}
                            paddingY={6}
                            autoComplete='off'
                            type="number"
                            value={filter.price?.max || ""}
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
                                            price: {
                                                ...prevstate.price,
                                                max: number
                                            }
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
            </div>
        </>



    )
}


export default index