import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import Logo_Below_Header from '../../../../components/molecules/Logo_Below_Header';
import { Box, HStack, Image, Select, Tag, TagCloseButton, TagLabel, Text } from '@chakra-ui/react'
import Box_Shop from '../../../../components/molecules/Box_Shop';
import { Shop } from '../../../interfaces/shop.interface';
import createUrlSchema from '../../../../components/utils/create_url';
import getCityAndPostcodeFromSlug from '../../../../components/utils/get_City_and_Postcode_from_Slug';
import { initApollo } from '../../../lib/apollo';
import GET_SHOPS from '../../../lib/apollo/queries/getShops'
import Input_Search_Item from '../../../../components/atoms/Input_Search_Item';
import PostMeta from '../../../../components/organisms/PostMeta';
import Link from 'next/link';

import { AnimatePresence, motion } from 'framer-motion';
import { LIST_ITEM_VARIANT } from '../../../../components/mook/transition';
import { ShopsQuery } from '../../../lib/apollo/generated/graphql';
import { getGender } from '../../../../components/utils/getGender';
import { NavArrowDown } from 'iconoir-react';
import { SHOP_CATEGORIES } from '../../../../components/mook/shopCategories';
import toUpperCaseFirstLetter from '../../../../components/utils/uppercase_First_Letter';


export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking', // can also be true or false
    }
}


export const getStaticProps = async (ctx: any) => {
    const { slug } = ctx.params
    const listType = slug[0].toLowerCase();
    const listCategory = slug[1] ? [slug[1].toLowerCase()] : null;

    const apolloClient = initApollo();
    try {
        const { data }/* : { data: ShopsQuery } */ = await apolloClient.query({
            query: GET_SHOPS,
            variables: {
                limit: 100,
                offset: 0,
                filters: {
                    categories: listCategory
                }
            },
        })
        return {
            props: {
                shops: data.shops,
                listType: listType === 'shop' ? 'shop' : 'brand',
                listCategory: listCategory ? listCategory[0].toLowerCase() : ''
            },
            revalidate: 60, // In seconds
        }
    }
    catch (error) {
        return {
            props: {
                shops: [],
                listType: listType === 'shop' ? 'shop' : 'brand',
                listCategory: listCategory ? listCategory[0].toLowerCase() : ''
            },
            revalidate: 1, // In seconds
        }
    }

}



const index: FC<{ shops: ShopsQuery["shops"], listType: 'brand' | 'shop', listCategory: string }> = ({ shops, listType, listCategory }) => {

    const router = useRouter()
    const [gender, setGender] = useState<string>()
    const [inputSearchShop, setInputSearchShop] = useState('')



    useEffect(() => {
        const genderName = getGender()
        if (genderName) return setGender(genderName)

    }, [])





    return (
        <Box
            px={[2, 2, 2, 6, 0]}
            className='mt-2 md:mt-5 min-h-[100vh]  w-full xl:w-10/12 2xl:w-9/12 xl:m-auto justify-items-center'
        >
            <PostMeta
                canonicalUrl={'https://www.veplo.it' + router.asPath}
                title={`Brand${listCategory ? ' | ' + toUpperCaseFirstLetter(listCategory) : ''} | Veplo`}
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
            <Box
                minWidth={'3xs'}
                className='flex mt-2 lg:mt-4 gap-4 lg:gap-5 overflow-x-auto'
            >
                {SHOP_CATEGORIES.map((element) => {
                    return (
                        <Box
                            key={element}
                            mb={4}
                            className='whitespace-nowrap'
                        >
                            <Link
                                prefetch={false}
                                href={element.toLowerCase() === listCategory ? '/profili/' + listType : '/profili/' + listType + '/' + element.toLowerCase()}
                            >
                                <Text
                                    textAlign={'start'}
                                    cursor={'pointer'}
                                    color={'secondaryBlack.text'}
                                    fontSize={'14px'}
                                    className={`hover:underline hover:underline-offset-2  ${element.toLowerCase() === listCategory?.toLowerCase() ? 'underline underline-offset-2 font-extrabold' : 'font-medium'} `}
                                >
                                    {toUpperCaseFirstLetter(element)}
                                </Text>
                            </Link>
                        </Box>
                    )
                })}
            </Box>



            <Select
                width={listType === 'shop' ? 'fit-content' : listType?.length * 18.5 + 'px'}
                value={listType}
                onChange={(event) => {
                    return router.push({
                        pathname: `/profili/${event.target.value}`,
                    })
                }}
                color={'black'}
                fontSize={'xl'}
                fontWeight={'extrabold'}
                pl={0}
                ml={0}
                variant='unstyled'
                cursor={'pointer'}
                mb={[3, 3]}
                mt={[4, 6]}
                icon={<NavArrowDown
                    strokeWidth={3}
                />}

            >
                <option
                    value='brand'>Brand
                </option>
                <option value='shop'>
                    Negozi
                </option>
            </Select>
            <Box className="grid md:pt-1 sm:grid-cols-1 md:grid-cols-2 sm:gap-10 md:gap-5 lg:gap-20 md:mt-4 mb-32"

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
                                    prefetch={false} href={`/@${shop?.name?.unique}`}>
                                    <Box_Shop scale={'scale(0.99)'} eventHandler={() => { }} shop={shop} />
                                </Link>
                            </motion.div>
                        )
                    })
                }
                {/* gestire caso in cui non ci sono negozi */}
            </Box>

        </Box>
    )
}

export default index