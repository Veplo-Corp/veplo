import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react'
import Desktop_Layout from '../../../components/atoms/Desktop_Layout';
import Logo_Below_Header from '../../../components/molecules/Logo_Below_Header';
import { Box, Image, Tag, TagCloseButton, TagLabel, Text } from '@chakra-ui/react'
import Box_Shop from '../../../components/molecules/Box_Shop';
import { Shop } from '../../interfaces/shop.interface';
import createUrlSchema from '../../../components/utils/create_url';
import getCityAndPostcodeFromSlug from '../../../components/utils/get_City_and_Postcode_from_Slug';
import { initApollo } from '../../lib/apollo';
import GET_SHOPS_BY_LOCATION from '../../lib/apollo/queries/getShops'
import Input_Search_Item from '../../../components/atoms/Input_Search_Item';
import PostMeta from '../../../components/organisms/PostMeta';
import Link from 'next/link';
import { removeFromLocalStorage } from '../../../components/utils/removeFromLocalStorage';
import NoIndexSeo from '../../../components/organisms/NoIndexSeo';
import { getFromLocalStorage } from '../../../components/utils/getFromLocalStorage';

import { AnimatePresence, motion } from 'framer-motion';
import { LIST_ITEM_VARIANT } from '../../../components/mook/transition';
import { ShopsQuery } from '../../lib/apollo/generated/graphql';





export const getStaticProps = async () => {
    const apolloClient = initApollo();
    try {
        const { data }/* : { data: ShopsQuery } */ = await apolloClient.query({
            query: GET_SHOPS_BY_LOCATION,
            variables: {
                limit: 10,
                offset: 0,
                filters: {

                }
            },
        })
        return {
            props: {
                shops: data.shops
            },
            revalidate: 60, // In seconds
        }
    }
    catch (error) {
        console.log(error);

        return {
            props: {
                shops: []

            },
            revalidate: 60, // In seconds
        }
    }

}



const index: FC<{ shops: ShopsQuery["shops"] }> = ({ shops }) => {



    const router = useRouter()
    const [gender, setGender] = useState<string>()
    const [inputSearchShop, setInputSearchShop] = useState('')



    useEffect(() => {



        let gender = getFromLocalStorage('genderSelected')
        if (gender === 'f') {
            setGender('donna')
        }
        if (gender === 'm') {
            setGender('uomo')
        }
    }, [])




    return (
        <div
            className='mt-2 md:mt-5 min-h-[100vh]'
        >
            <PostMeta
                canonicalUrl={'https://www.veplo.it' + router.asPath}
                title={`Brand | Veplo`}
                subtitle={"Veplo è lo spazio dove trovare i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile."}
                image={""}
                description={"Veplo è lo spazio dove trovare i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile."}
            />
            {/* <div className='md:flex justify-end'>
                
                <div className='my-auto mt-2'>
                    <Input_Search_Item
                        handleChangeValue={() => { }}

                        placeholder='cerca negozio' onConfirmText={(textInput: string) => {
                            setInputSearchShop(textInput)
                        }} />
                </div>
            </div> */}
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
            <Box className="grid md:pt-1 sm:grid-cols-1 md:grid-cols-2 gap-5 sm:gap-10 md:gap-5 lg:gap-10 w-full xl:w-10/12 2xl:w-9/12 xl:m-auto justify-items-center md:mt-4"
                px={[1, 2, 2, 6, 0]}
            >
                {shops.length > 0 &&
                    shops.map((shop, index) => {

                        return (
                            <motion.div
                                key={shop.id}
                                variants={LIST_ITEM_VARIANT}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                            >
                                <Link
                                    prefetch={false} href={`/negozio/${shop.id}/${createUrlSchema([shop.name])}${gender ? '/' + gender : ''}`}>
                                    <Box_Shop scale={'scale(0.99)'} eventHandler={() => { }} shop={shop} />
                                </Link>
                            </motion.div>
                        )
                    })
                }
                {/* gestire caso in cui non ci sono negozi */}
            </Box>

        </div>
    )
}

export default index