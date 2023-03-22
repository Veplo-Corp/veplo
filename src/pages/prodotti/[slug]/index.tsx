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


const RANGE = 5


export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking', // can also be true or false
    }
}

export async function getStaticProps(ctx: any) {
    let { slug } = ctx.params;
    const elementGenderMacrocategory: { gender: string | null, macrocategory: string | null } = getGenderandMacrocategory(slug);
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


const index: FC<{ products: Product[], category: string, gender: 'f' | 'm' }> = ({ products, category, gender }) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [productsFounded, setproductsFounded] = useState<Product[]>([])
    const dispatch = useDispatch();
    const [getProducts, productsFounder] = useLazyQuery(GET_PRODUCTS);
    const [microcategory, setMicrocategory] = useState<string[]>([])

    console.log(router);


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
                        className='hidden lg:table'
                    >

                        {Object.values(CATEGORIES)[gender === 'm' ? 1 : 0].abbigliamento.map(element => {
                            return (
                                <Box
                                    key={element.name}
                                    mb={4}
                                    width={'fit-content'}
                                >
                                    <Link
                                        href={'/prodotti/' + gender === 'm' ? 'uomo' : 'donna' + '-' + element.url}
                                    >
                                        <Text
                                            textAlign={'start'}
                                            cursor={'pointer'}
                                            fontWeight={'bold'}
                                            fontSize={'md'}
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
                    >
                        <HStack
                            gap={4}
                            mb={4}
                        >

                            <Menu as="div" className="relative z-10 inline-block text-left">
                                <div>
                                    <Menu.Button className="inline-flex w-full justify-center rounded-[10px] bg-white border-[1px] px-4 py-3 text-md text-black font-black border-gray-300 ">
                                        <Text
                                            my={'auto'}
                                        >
                                            micro categoria
                                        </Text>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-4 h-4 my-auto ml-1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>

                                    </Menu.Button>
                                </div>
                                <Transition
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-lg bg-white border-[1px] border-gray-200">
                                        <div className="p-2 ">
                                            <Menu.Item>
                                                {({ active }) =>
                                                (
                                                    <>
                                                        {microcategory.map((category: string, index) => {
                                                            return (
                                                                <Link
                                                                    key={index}
                                                                    href={
                                                                        router.asPath.split('?')[1] ?
                                                                            `${router.asPath.split('?')[0]}/${createUrlSchema([category])}/?${router.asPath.split('?')[1]}`
                                                                            :
                                                                            `${router.asPath.split('?')[0]}/${createUrlSchema([category])}`

                                                                    }
                                                                >
                                                                    <button
                                                                        className={`hover:bg-gray-50 group flex w-full items-center rounded-md px-2 py-2 text-md font-bold`}
                                                                    >
                                                                        {category}
                                                                    </button>
                                                                </Link>
                                                            )
                                                        })}
                                                    </>
                                                )}



                                            </Menu.Item>

                                        </div>

                                    </Menu.Items>
                                </Transition>
                            </Menu>


                        </HStack>

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
                                            <div className='text-center h-screen content-center'>
                                                <div className='absolute w-full top-56'>
                                                    <h1 className='font-extrabold md:8/12 lg:w-6/12 m-auto text-xl lg:text-2xl mb-10 text-[#707070] px-9 line-clamp-2'>
                                                        Nessun prodotto trovato
                                                    </h1>
                                                    <img
                                                        className='m-auto h-28 w-28 mb-6'
                                                        src="/error/cryingBoy.svg"
                                                        alt="non trovata" />
                                                    <Button
                                                        colorScheme={'blackAlpha'}
                                                        mt={'1'}
                                                        onClick={resetFilter}
                                                    >Resetta filtri</Button>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </InfiniteScroll>}
                    </Box>



                </Box>

            </Desktop_Layout>
            {gender && <FIlter_Button gender={gender} macrocategory={category ? category : "Tutto l'abbigliamento"} />}

        </>

    )
}


export default index