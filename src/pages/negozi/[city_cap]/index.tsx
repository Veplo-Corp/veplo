import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import Logo_Below_Header from '../../../../components/molecules/Logo_Below_Header';
import { Box, Image, Tag, TagCloseButton, TagLabel, Text } from '@chakra-ui/react'
import Box_Shop from '../../../../components/molecules/Box_Shop';
import { Shop } from '../../../interfaces/shop.interface';
import createUrlSchema from '../../../../components/utils/create_url';
import getCityAndPostcodeFromSlug from '../../../../components/utils/get_City_and_Postcode_from_Slug';
import { initApollo } from '../../../lib/apollo';
import GET_SHOPS_BY_LOCATION from '../../../lib/apollo/queries/getShops'
import Input_Search_Item from '../../../../components/atoms/Input_Search_Item';
import PostMeta from '../../../../components/organisms/PostMeta';
import Link from 'next/link';
export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking', // can also be true or false
    }
}

export async function getStaticProps(ctx: any) {
    let { city_cap } = ctx.params;
    const element: { city: string, postcode: string | null } = getCityAndPostcodeFromSlug(city_cap);

    try {
        const apolloClient = initApollo()
        //console.log(productId);
        const { data, error } = await apolloClient.query({
            query: GET_SHOPS_BY_LOCATION,
            variables: {
                range: 5000,
                limit: 10,
                offset: 0,
                filters: {
                    cap: element.postcode
                }
            },
        })
        return {
            props: {
                city: element.city,
                postcode: element.postcode,
                shops: data.shops
            },
            revalidate: 60, // In seconds
        }
    } catch (e: any) {
        console.log(e.graphQLErrors[0].name);

        return {
            props: {
                city: element.city,
                postcode: element.postcode,
                shops: [],
                errorLog: e.graphQLErrors[0].name
            },
            revalidate: 60, // In seconds
        }
        // return {
        //     notFound: true, // triggers 404
        //     revalidate: 60, // In seconds
        // };
    }
}

const index: React.FC<{ city: string, postcode: null | string, shops: Shop[], errorLog?: string }> = ({ city, postcode, shops, errorLog }) => {

    const router = useRouter()

    const [inputSearchShop, setInputSearchShop] = useState('')
    console.log(shops);
    const [shopsFilterByName, setshopsFilterByName] = useState<Shop[]>([])
    const toStore = (shop: Shop) => {
        // const url = createUrlSchema([shop.address.city, shop.name])
        // router.push({
        //     pathname: `/negozio/${shop.id}/${url}`,
        // })
    }

    useEffect(() => {
        if (inputSearchShop.length <= 3) return
        const apolloClient = initApollo()
        const fetchData = async () => {
            return await apolloClient.query({
                query: GET_SHOPS_BY_LOCATION,
                variables: {
                    range: 5000,
                    limit: 10,
                    offset: 0,
                    filters: {
                        cap: postcode,
                        name: inputSearchShop
                    }
                },
            })
        }
        fetchData().then((shops) => {
            console.log(shops?.data.shops);
            setshopsFilterByName(shops?.data.shops);
        })




        return () => {

        }
    }, [inputSearchShop])


    useEffect(() => {
        if (errorLog) {
            console.log(errorLog);

            router.push({
                pathname: '/404',
                query: { error: errorLog },
            })
        }
    }, [errorLog])




    return (
        <Desktop_Layout>
            <PostMeta
                canonicalUrl={'https://www.veplo.it' + router.asPath}
                title={`Negozi di Abbigliamento a ${city} | Veplo`}
                subtitle={`Negozi di Abbigliamento a ${city} | Cerca tra tutto l'abbigliamento per uomo e donna in vendita a ${city} e dintorni| Abbigliamento · Scarpe · Vestiti`}
                image={''}
                description={`Negozi di Abbigliamento a ${city} | Cerca tra tutto l'abbigliamento per uomo e donna in vendita a ${city} e dintorni| Abbigliamento · Scarpe · Vestiti`}
            />
            <div className='md:flex justify-end'>
                {/* <Logo_Below_Header city={city} /> */}
                <div className='my-auto mt-2'>
                    <Input_Search_Item placeholder='cerca negozio' onConfirmText={(textInput: string) => {
                        setInputSearchShop(textInput)
                    }} />
                </div>
            </div>
            {
                inputSearchShop.length > 3 &&
                <Tag
                    size={['sm', 'lg']}
                    padding={'2'}
                    borderRadius='full'
                    variant='solid'
                    colorScheme='green'
                    marginTop={3}
                >
                    <TagLabel>
                        <p
                            className='font-medium pt:10 md:mt-0 text-sm md:text-lg'
                        >Risultati per {inputSearchShop}</p>
                    </TagLabel>
                    <TagCloseButton
                        onClick={() => { setInputSearchShop('') }}
                    />
                </Tag>

            }
            <div className="grid grid-cols-1 md:pt-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4 w-full m-auto justify-items-center mt-4	">
                {((shops.length > 0 && inputSearchShop.length < 1) && setInputSearchShop.length <= 3) ?
                    shops.map((shop) => {
                        return (
                            <Link key={shop.id} href={`/negozio/${shop.id}/${createUrlSchema([shop.address.city, shop.name])}`}>
                                <a >
                                    <Box_Shop  scale={'scale(0.99)'} eventHandler={toStore} shop={shop} />
                                </a>
                            </Link>
                        )
                    }) : shopsFilterByName.map((shop) => {
                        return (
                            <Link key={shop.id} href={`/negozio/${shop.id}/${createUrlSchema([shop.address.city, shop.name])}`}>
                                <a >
                                    <Box_Shop  scale={'scale(0.99)'} eventHandler={toStore} shop={shop} />
                                </a>
                            </Link>
                        )
                    })
                }
            </div>

        </Desktop_Layout>
    )
}

export default index