import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import DintorniLogo_Below_Header from '../../../../components/molecules/DintorniLogo_Below_Header';
import { Box, Image, Tag, TagCloseButton, TagLabel, Text } from '@chakra-ui/react'
import Box_Shop from '../../../../components/molecules/Box_Shop';
import { Shop } from '../../../interfaces/shop.interface';
import createUrlSchema from '../../../../components/utils/create_url';
import getCityAndPostcodeFromSlug from '../../../../components/utils/get_City_and_Postcode_from_Slug';
import { initApollo } from '../../../lib/apollo';
import GET_SHOPS_BY_LOCATION from '../../../lib/apollo/queries/getShops'
import Input_Search_Item from '../../../../components/atoms/Input_Search_Item';
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
        return {
            props: {
                city: element.city,
                postcode: element.postcode,
                shops: [],
                error: e.message
            },
            revalidate: 60, // In seconds
        }
    }
}

const index: React.FC<{ city: string, postcode: null | string, shops: Shop[], error?: string }> = ({ city, postcode, shops, error }) => {
    const router = useRouter()
    const [inputSearchShop, setInputSearchShop] = useState('')
    console.log(shops);
    const [shopsFilterByName, setshopsFilterByName] = useState<Shop[]>([])
    const toStore = (shop: Shop) => {
        const url = createUrlSchema([shop.address.city, shop.name])
        router.push({
            pathname: `/negozio/${shop.id}/${url}`,
        })
    }

    useEffect(() => {
        if(inputSearchShop.length <= 3)return
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





    return (
        <Desktop_Layout>
            <div className='md:flex justify-between'>
                <DintorniLogo_Below_Header city={city} />
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
                    onClick={() => {setInputSearchShop('')}}
                    />
                </Tag>

            }
            <div className="grid grid-cols-1 md:pt-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4 w-full m-auto justify-items-center mt-4	">
                {((shops.length > 0 && inputSearchShop.length < 1) && setInputSearchShop.length <= 3) ?
                shops.map((shop) => {
                    return (
                        <Box_Shop key={shop.id} scale={'scale(0.99)'} eventHandler={toStore} shop={shop} />
                    )
                }) : shopsFilterByName.map((shop) => {
                    return (
                        <Box_Shop key={shop.id} scale={'scale(0.99)'} eventHandler={toStore} shop={shop} />
                    )
                })
                }
            </div>

        </Desktop_Layout>
    )
}

export default index