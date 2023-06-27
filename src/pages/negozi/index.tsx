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





export const getStaticProps = async () => {
    const apolloClient = initApollo();
    try {
        const { data, error } = await apolloClient.query({
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

import { gtag } from '../../lib/gtag'; // Assicurati di impostare il percorso corretto al file gtag.js
import { GTMEventType, VeploGTMEvent } from '../../lib/analytics/eventTypes';
import { useAnalytics } from '../../lib/analytics/hooks/useAnalytics';


const index: FC<{ shops: Shop[] }> = ({ shops }) => {



    const router = useRouter()
    const [gender, setGender] = useState<string>()
    const [inputSearchShop, setInputSearchShop] = useState('')



    useEffect(() => {
        // gtag('event', 'login', {
        //     method: 'Google',
        //     event_category: 'Authentication'
        // });
        //sendMessage()


        // gtag('purchase', {
        //     event_category: 'Ecommerce',
        //     transaction_id: "T_12345",
        //     value: 25.42,
        //     tax: 4.90,
        //     shipping: 5.99,
        //     currency: "USD",
        //     coupon: "SUMMER_SALE",
        //     items: [
        //         {
        //             item_id: "SKU_12345",
        //             item_name: "Stan and Friends Tee",
        //             affiliation: "Google Merchandise Store",
        //             coupon: "SUMMER_FUN",
        //             discount: 2.22,
        //             index: 0,
        //             item_brand: "Google",
        //             item_category: "Apparel",
        //             item_category2: "Adult",
        //             item_category3: "Shirts",
        //             item_category4: "Crew",
        //             item_category5: "Short sleeve",
        //             item_list_id: "related_products",
        //             item_list_name: "Related Products",
        //             item_variant: "green",
        //             location_id: "ChIJIQBpAG2ahYAR_6128GcTUEo",
        //             price: 9.99,
        //             quantity: 1
        //         },
        //         {
        //             item_id: "SKU_12346",
        //             item_name: "Google Grey Women's Tee",
        //             affiliation: "Google Merchandise Store",
        //             coupon: "SUMMER_FUN",
        //             discount: 3.33,
        //             index: 1,
        //             item_brand: "Google",
        //             item_category: "Apparel",
        //             item_category2: "Adult",
        //             item_category3: "Shirts",
        //             item_category4: "Crew",
        //             item_category5: "Short sleeve",
        //             item_list_id: "related_products",
        //             item_list_name: "Related Products",
        //             item_variant: "gray",
        //             location_id: "ChIJIQBpAG2ahYAR_6128GcTUEo",
        //             price: 20.99,
        //             promotion_id: "P_12345",
        //             promotion_name: "Summer Sale",
        //             quantity: 1
        //         }
        //     ],
        //     debug_mode: true
        // });

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
            className='mt-5 min-h-[100vh]'
        >
            <NoIndexSeo />
            {/* <PostMeta
                canonicalUrl={'https://www.veplo.it' + router.asPath}
                title={`Negozi di Abbigliamento | Veplo`}
                subtitle={`Negozi di Abbigliamento | Cerca tra tutto l'abbigliamento per uomo e donna in vendita | Abbigliamento · Scarpe · Vestiti`}
                image={''}
                description={`Negozi di Abbigliamento | Cerca tra tutto l'abbigliamento per uomo e donna in vendita | Abbigliamento · Scarpe · Vestiti`}
            /> */}
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
            <Box className="sm:grid md:pt-1 sm:grid-cols-1 lg:grid-cols-2 gap-10 w-full lg:w-10/12 2xl:w-9/12 m-auto justify-items-center mt-4"
                px={[2, 2, 2, 0]}
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