import { useLazyQuery } from '@apollo/client';
import { Button, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import Box_Dress from '../../../../components/molecules/Box_Dress';
import FIlter_Button from '../../../../components/molecules/FIlter_Button';
import PostMeta from '../../../../components/organisms/PostMeta';
import { findMacrocategoryName } from '../../../../components/utils/find_macrocategory_name';
import getGenderandMacrocategory from '../../../../components/utils/get_Gender_and_Macrocategory';
import { setInLocalStorage } from '../../../../components/utils/setInLocalStorage';
import { toProductPage } from '../../../../components/utils/toProductPage';
import { Product } from '../../../interfaces/product.interface';
import { initApollo } from '../../../lib/apollo';
import GET_PRODUCTS from '../../../lib/apollo/queries/getProducts';
import { changeGenderSelected } from '../../../store/reducers/user';


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


    console.log(productsFounder);



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
        setproductsFounded(products)
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
                {gender &&
                    <Text
                        fontSize={'lg'}
                        fontWeight={'semibold'}
                        marginBottom={4}
                    >
                        {gender === 'f' ? 'Donna' : 'Uomo'} | {category ? category : "tutto l'abbligliamento"}
                    </Text>
                }
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
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 gap-y-5 w-full">
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
            </Desktop_Layout>
            {gender && <FIlter_Button gender={gender} macrocategory={category ? category : "Tutto l'abbigliamento"} />}

        </>

    )
}


export default index