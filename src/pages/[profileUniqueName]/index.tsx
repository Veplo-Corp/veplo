import React, { useEffect, useRef, useState } from 'react'
import Desktop_Layout from '../../../components/atoms/Desktop_Layout'
import { Box, Button, ButtonGroup, defineStyle, Divider, Flex, HStack, Spacer, Text } from '@chakra-ui/react'
import Box_Dress from '../../../components/molecules/Box_Dress'
import { useRouter } from 'next/router'
import createUrlSchema from '../../../components/utils/create_url'
import { initApollo } from '../../lib/apollo'
import GET_PRODUCTS_FROM_SHOP from '../../lib/apollo/queries/geetProductsShop'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import toUpperCaseFirstLetter from '../../../components/utils/uppercase_First_Letter'
import { imageKitUrl } from '../../../components/utils/imageKitUrl'
import PostMeta from '../../../components/organisms/PostMeta'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLazyQuery, useQuery } from '@apollo/client'
import GET_SHOP_AND_PRODUCTS from '../../lib/apollo/queries/getSingleShop'
import { Facebook, Instagram, MoreHoriz, Phone, Pin, PinAlt, Position, SmallShopAlt, TikTok } from 'iconoir-react'
import PopoverComponent, { ActionsPopover } from '../../../components/molecules/PopoverComponent'
import { numberOfLineText } from '../../../components/utils/numberOfLineText'
import { isMobile } from 'react-device-detect'
import NoIndexSeo from '../../../components/organisms/NoIndexSeo'
import { CATEGORIES } from '../../../components/mook/categories'
import { GetShopQuery, Product, ProductsQueryResponse } from '../../lib/apollo/generated/graphql'
import { LIST_ITEM_VARIANT } from '../../../components/mook/transition'
import { AnimatePresence, motion } from 'framer-motion';
import PageNotFound from '../../../components/molecules/PageNotFound'
import TagComponent from '../../../components/atoms/TagComponent'
import ShopPage from '../../../components/organisms/ShopPage'

const RANGE = typeof process.env.NEXT_PUBLIC_RANGE === 'string' ? Number(process.env.NEXT_PUBLIC_RANGE) : 12


export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking', // can also be true or false
    }
}

export async function getStaticProps(ctx: any) {
    let { shopId, slug } = ctx.params;
    const apolloClient = initApollo();
    //!creare filtro per gender
    const gender = slug[1];

    try {
        const { data }: { data: GetShopQuery } = await apolloClient.query({
            query: GET_SHOP_AND_PRODUCTS,
            variables: {
                id: shopId,
                limit: RANGE,
                offset: 0,
                filters: {
                    gender: gender ? (gender === 'uomo' ? 'm' : 'f') : null
                }
            },
        })




        return {
            props: {
                shop: data.shop,
                gender: gender ? (gender === 'uomo' ? 'm' : 'f') : null
            },
            revalidate: 60, // In seconds
        }
    } catch (e) {

        return {
            props: {

                shop: null,
                gender: gender ? (gender === 'uomo' ? 'm' : 'f') : null
            },
            revalidate: 1, // In seconds
        }
    }


}





const index: React.FC<{ shop: GetShopQuery["shop"], gender: 'f' | 'm' }> = ({ shop, gender }) => {
    return (
        <ShopPage
            shop={shop}
            gender={gender}
        />
    )
}

export default index