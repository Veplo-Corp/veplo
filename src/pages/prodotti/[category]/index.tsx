import { useLazyQuery } from '@apollo/client';
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react'
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


const RANGE = 5


export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking', // can also be true or false
    }
}

export async function getStaticProps(ctx: any) {
    let { category } = ctx.params;
    const elementGenderMacrocategory: { gender: string | null, macrocategory: string | null } = getGenderandMacrocategory(category);
    const apolloClient = initApollo()

    try {
        if (!elementGenderMacrocategory.gender || !elementGenderMacrocategory.macrocategory) {
            throw new Error("categoria o gender non trovato");
        }
        const macrogategoryName = findMacrocategoryName(elementGenderMacrocategory.macrocategory, elementGenderMacrocategory.gender) || ''
        const { data, errors } = await apolloClient.query({
            query: GET_PRODUCTS,
            variables: {
                offset: 0,
                limit: RANGE,
                filters: {
                    macroCategory: macrogategoryName,
                    gender: elementGenderMacrocategory.gender === 'uomo' ? 'm' : 'f'
                }
            }
        })

        return {
            props: {
                gender: elementGenderMacrocategory.gender === 'uomo' ? 'm' : 'f',
                category: macrogategoryName,
                products: data?.products,
            },
            revalidate: 60 //seconds
        }
    } catch (e: any) {
        console.log(e);


        return {
            props: {
                gender: elementGenderMacrocategory.gender === 'uomo' ? 'm' : 'f',
                category: elementGenderMacrocategory.macrocategory,
                products: [],
                errorLog: 'errore'
            },
            // notFound: true,
            revalidate: 60 //seconds
        }
    }

}

interface PropsOpenModal {
    category: boolean,
    size: boolean,
    color: boolean,
    price: boolean,
    brand: boolean,
    fit: boolean
}
const index: FC<{ products: Product[], category: string, gender: 'f' | 'm' }> = ({ products, category, gender }) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [productsFounded, setproductsFounded] = useState<Product[]>([])
    const dispatch = useDispatch();
    const [getProducts, productsFounder] = useLazyQuery(GET_PRODUCTS);
    const [microcategory, setMicrocategory] = useState<string[]>([])
    const [sizeProduct, setSizeProduct] = useState<string>();
    const [isOpen, setIsOpen] = useState<PropsOpenModal>({
        category: false,
        size: false,
        color: true,
        price: false,
        brand: false,
        fit: false
    })

    console.log(router.asPath);


    const fetchMoreData = async () => {

        //TODO filter
        // let filters: any = createFilterObject(
        //     brands,
        //     minPrice,
        //     maxPrice,
        //     colors,
        //     sizes
        //   )


        if (products.length % RANGE !== 0 || productsFounder?.data?.products.length === 0) {
            setHasMoreData(false)
            return console.log('no more data');
        }

        console.log(productsFounded.length);

        const newProducts = await getProducts({
            variables: {
                offset: productsFounded.length,
                limit: RANGE,
                filters: {
                    macroCategory: category,
                    gender: gender
                }
            }
        })


        if (newProducts.data?.products) {
            setproductsFounded(prevstate => {
                return [
                    ...prevstate,
                    ...newProducts.data?.products
                ]
            })

            if (newProducts.data?.products.length % RANGE !== 0 || newProducts.data?.products.length === 0) {
                setHasMoreData(false)
                return console.log('no more data');
            }
        }

    }

    useEffect(() => {
        const microcategory = Object.values(CATEGORIES)[gender === 'm' ? 1 : 0].abbigliamento.find(element => element.name === category)
        setproductsFounded(products)

        if (!microcategory?.types) return
        setMicrocategory(microcategory?.types);
        setSizeProduct(microcategory.sizes)

    }, [products])


    const resetFilter = () => {

    }

    useEffect(() => {
        if (gender) {
            setInLocalStorage('genderSelected', gender)
            dispatch(
                changeGenderSelected(gender)
            );
        }
    }, [gender])


    console.log(gender);



    return (
        <>
            <Desktop_Layout>
                <PostMeta
                    canonicalUrl={'https://www.veplo.it' + router.asPath}
                    title={`${category === '' ? 'Abbigliamento' : category} ${gender} | Veplo`}
                    subtitle={`Tutto l'abbigliamento ${gender} - ${category === '' ? 'Vestiti' : category} | Abbigliamento · Scarpe · Vestiti | scopri le offerte | vivi Veplo`}
                    image={''}
                    description={`Tutto l'abbigliamento ${gender} - ${category === '' ? 'Vestiti' : category} | Abbigliamento · Scarpe · Vestiti | scopri le offerte | vivi Veplo`}
                />
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
                        minWidth={'xs'}
                        className='hidden lg:table w-1/4 lg:mt-0'
                    >
                        {Object.values(CATEGORIES)[gender === 'm' ? 1 : 0].abbigliamento.map(element => {


                            return (
                                <Box
                                    key={element.name}
                                    mb={4}
                                    width={'fit-content'}
                                >
                                    <Link
                                        href={'/prodotti/' + (gender == 'f' ? 'donna' : 'uomo') + '-' + element.url}
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
                        className='w-full lg:w-3/4 relative'
                    >

                        <div
                            className='mb-2 overflow-x-scroll flex gap-4 pb-3'
                        >

                            {microcategory && <Button
                                rightIcon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="ml-1 w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                }
                                minW={'fit-content'}
                                bg={'white'}
                                position={'relative'}
                                color={'black'}
                                _hover={{ bg: 'white' }}
                                borderWidth={1}
                                borderColor={'gray.300'}
                                borderRadius={'10px'}
                                padding={6}
                                _focus={{
                                    bg: 'white'
                                }}
                                _active={{
                                    transform: 'scale(0.98)',
                                }}
                                onClick={() => {
                                    setIsOpen(prevstate => {
                                        return {
                                            ...prevstate,
                                            category: true
                                        }
                                    })
                                }}
                            >
                                Categoria
                            </Button>}
                            {sizeProduct && <Button
                                rightIcon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="ml-1 w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                }
                                minW={'fit-content'}
                                bg={'white'}
                                position={'relative'}
                                color={'black'}
                                _hover={{ bg: 'white' }}
                                borderWidth={1}
                                borderColor={'gray.300'}
                                borderRadius={'10px'}
                                padding={6}
                                _focus={{
                                    bg: 'white'
                                }}
                                _active={{
                                    transform: 'scale(0.98)',
                                }}
                                onClick={() => {
                                    setIsOpen(prevstate => {
                                        return {
                                            ...prevstate,
                                            size: true
                                        }
                                    })
                                }}
                            >
                                Taglia
                            </Button>
                            }
                            <Button
                                rightIcon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="ml-1 w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                }
                                minW={'fit-content'}
                                bg={'white'}
                                position={'relative'}
                                color={'black'}
                                _hover={{ bg: 'white' }}
                                borderWidth={1}
                                borderColor={'gray.300'}
                                borderRadius={'10px'}
                                padding={6}
                                _focus={{
                                    bg: 'white'
                                }}
                                _active={{
                                    transform: 'scale(0.98)',
                                }}
                                onClick={() => {
                                    setIsOpen(prevstate => {
                                        return {
                                            ...prevstate,
                                            color: true
                                        }
                                    })
                                }}
                            >
                                Colore
                            </Button>


                        </div>

                        {!loading && <InfiniteScroll
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
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-5 gap-y-5 w-full">
                                    {productsFounded.length > 0 ?

                                        (productsFounded.map((product) => {
                                            return (
                                                <Link key={product.id} href={`/prodotto/${product.id}/${toProductPage(product)}`}>
                                                    <Box_Dress product={product}></Box_Dress>
                                                </Link>
                                            )
                                        })) : (
                                            <></>
                                        )
                                    }
                                </div>
                            </div>
                        </InfiniteScroll>}
                    </Box>



                </Box>

            </Desktop_Layout >
            {gender && <FIlter_Button gender={gender} macrocategory={category ? category : "Tutto l'abbigliamento"} />}

            {/* Modal Categorie */}
            <ModalReausable title='Categoria' closeModal={() => {
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
                    {microcategory.map(element => {
                        return (<Box
                            p={2}
                            width={'full'}
                            pr={44}
                            pl={1}
                            _hover={{
                                background: 'gray.100'
                            }}
                            cursor={'pointer'}
                            borderRadius={'lg'}
                            fontSize={'lg'}
                            fontWeight={'semibold'}
                        >
                            {element}
                        </Box>)
                    })}
                </Box>

            </ModalReausable>
            <ModalReausable title='Taglia' closeModal={() => {
                setIsOpen(prevstate => {
                    return {
                        ...prevstate,
                        size: false
                    }
                })
            }} isOpen={isOpen.size} positionTopModal={true}>
                <Box
                    mt={2}
                    className={`grid ${sizeProduct === 'shoes_sizes' ? 'grid-cols-5 gap-2' : 'grid-cols-3 gap-2'} `}
                >
                    {(sizeProduct === 'man_clothes_sizes' || sizeProduct === 'woman_clothes_sizes' || sizeProduct === 'shoes_sizes') && SIZES[sizeProduct].map(element => {
                        return (<Box
                            p={4}
                            width={'full'}
                            _hover={{
                                background: 'gray.100'
                            }}
                            textAlign={'center'}
                            cursor={'pointer'}
                            borderRadius={'lg'}
                            fontSize={'md'}
                            fontWeight={'semibold'}
                        >
                            {element}
                        </Box>)
                    })}
                </Box>

            </ModalReausable>
            <ModalReausable title='Colore' closeModal={() => {
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
                        return (<Box
                            width={'full'}
                            _hover={{
                                background: 'gray.100'
                            }}
                            p={2}
                            textAlign={'center'}
                            cursor={'pointer'}
                            borderRadius={'lg'}
                            fontSize={'md'}
                            fontWeight={'semibold'}
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
        </>

    )
}


export default index