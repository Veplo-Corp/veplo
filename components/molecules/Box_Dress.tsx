import React, { FC, memo, useEffect, useState } from 'react'
import { Box, Fade, Image, ScaleFade, Tag, Text, Tooltip, VStack, useBreakpointValue } from '@chakra-ui/react'
import Circle_Color from '../atoms/Circle_Color'
import { COLORS } from '../mook/colors'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import useWindowSize from '../Hooks/useWindowSize'
import { imageKitUrl } from '../utils/imageKitUrl'

import Link from 'next/link'
import createUrlSchema from '../utils/create_url'
import { isMobile } from 'react-device-detect'
import { useRouter } from 'next/router'
import { formatNumberWithTwoDecimalsInString } from '../utils/formatNumberWithTwoDecimalsInString'
import { Product, ProductVariation } from '../../src/lib/apollo/generated/graphql'
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css';
import 'swiper/css/pagination';
import ProfilePhoto from './ProfilePhoto'
import { SustainableTraits, arraySustainableTraits } from '../mook/productParameters/traits'
import { Leaf } from 'iconoir-react'
import { manipulateUrlForProductColorAndSize } from '../utils/manipulateUrlForProductColorAndSize';
import ToolTipComponent from '../atoms/ToolTipComponent';


const Box_Dress: React.FC<{ overflowCards?: boolean, handleEventSelectedDress?: () => void, product: Product; color?: string | undefined, showStoreHeader?: boolean, productLink: string, doubleGridDevice: boolean }> = ({ handleEventSelectedDress, product, color, showStoreHeader, productLink, overflowCards, doubleGridDevice }) => {
    const [productcolorsCSS, setProductcolorsCSS] = useState<any[]>([]);
    //const [dimensionUrl, setDimensionUrl] = useState('&tr=w-571,h-825')
    const [urlProduct, seturlProduct] = useState<string | undefined>()
    const [indexPhoto, setindexPhoto] = useState(0)
    const [listOfSizesAvailable, setListOfSizesAvailable] = useState<string[]>([])
    const [listOfSizesAvailableForSpecificVariation, setListOfSizesAvailableForSpecificVariation] = useState<any>()
    const [showSize, setShowSize] = useState(false)
    const [isSustainable, setIsSustainable] = useState(false)
    const router = useRouter()
    const isSmallView = useBreakpointValue({ base: true, md: false });
    const [productLinkPage, setProductLinkPage] = useState(productLink)

    const checkIfProductIsSustainable = (parole: string[] | null | undefined): boolean => {
        if (!parole) return false
        return parole.some(parola => arraySustainableTraits.includes(parola as SustainableTraits));
    }





    const handleSetPhotoUrl = (colorSelected: string | undefined) => {

        if (!product?.variations) return

        if (!colorSelected) {
            const url = product.variations[indexPhoto].photos?.[0] ? product.variations[indexPhoto].photos?.[0] : ''
            const sizeAvailable = product.variations[indexPhoto].lots?.map(lot => {
                if (typeof lot.quantity === 'number' && lot.quantity <= 0) return
                return lot.size
            })
            if (sizeAvailable && sizeAvailable?.length > 0) {
                setListOfSizesAvailableForSpecificVariation(sizeAvailable ? sizeAvailable : [])
            } else {
                setListOfSizesAvailableForSpecificVariation([])
            }

            seturlProduct(url)
            const udpateUrl = manipulateUrlForProductColorAndSize(undefined, undefined, productLink)
            setProductLinkPage(udpateUrl)

            return
        }

        const variationIndex: any = product.variations?.findIndex(variation => variation?.color?.toLowerCase() === colorSelected.toLowerCase())


        if (variationIndex >= 0) {
            const udpateUrl = manipulateUrlForProductColorAndSize(colorSelected, undefined, productLinkPage)
            setProductLinkPage(udpateUrl)

            //checkSizeAvailable per colore selezionato
            const sizeAvailable = product.variations[variationIndex].lots?.map(lot => {
                if (typeof lot.quantity === 'number' && lot.quantity <= 0) return
                return lot.size
            })
            if (sizeAvailable && sizeAvailable?.length > 0) {
                setListOfSizesAvailableForSpecificVariation(sizeAvailable ? sizeAvailable : [])
            } else {
                setListOfSizesAvailableForSpecificVariation([])
            }
            setindexPhoto(variationIndex)
            //cambio URI link per mandarlo al colore giusto cliccato

            seturlProduct(typeof product?.variations[variationIndex]?.photos?.[0] === 'string' ? product?.variations[variationIndex]?.photos?.[0] : '')
        }
    }


    const sizeAvailable = (variations: ProductVariation[]) => {
        const sizes = [
            "xxs",
            "xs",
            "s",
            "m",
            "l",
            "xl",
            "xxl",
            "3xl",
            "4xl",
            "5xl",
        ]
        const totalSize: string[] = variations.map((variation) => {
            if (!variation.lots) return
            return variation?.lots.filter(lot => lot?.quantity && lot?.quantity > 0).map((lot: any) => {
                return lot.size
            })

        }).flat().filter((value: any, index: any, self: any) => {
            return self.indexOf(value) === index;
        }).sort().sort(function (a: string, b: string) {
            return sizes.indexOf(a) - sizes.indexOf(b)
        });
        setListOfSizesAvailable(totalSize)
    }

    const CircleColorComponent = () => {
        return (
            <Box display={'flex'}>
                <Circle_Color colors={productcolorsCSS.slice(0, 4)} dimension={doubleGridDevice ? '20px' : isMobile ? '22px' : 6} space={2}
                    handleColorFocused={(color: string) => {
                        if (isSmallView) return
                        handleSetPhotoUrl(color)
                    }}

                />
                {productcolorsCSS.length > 4 &&
                    <Box

                        px={2}
                        ml={doubleGridDevice ? 1 : 1.5}
                        borderRadius={'10px'}
                        bg={'#F2F2F2'}
                        //borderWidth={1} borderColor={'gray.200'}

                        borderWidth={'1px'}
                        borderColor={'white'}
                        fontWeight={'semibold'}
                        fontSize={[doubleGridDevice ? 'xs' : 'md', 'sm']}
                        textAlign={'center'}
                    >
                        +{productcolorsCSS.length - 4}
                    </Box>
                }
            </Box>
        )
    }


    useEffect(() => {
        if (!product.variations) return
        const colors = product.variations.map((variation: any) => {
            return COLORS.find(color => color.name === variation?.color)?.cssColor
        })

        const isProductSustainable = checkIfProductIsSustainable(product.info?.traits)
        setIsSustainable(isProductSustainable)
        setProductcolorsCSS(colors)
        handleSetPhotoUrl(color)
        sizeAvailable(product.variations)


    }, [product, color])







    return (
        <>
            {
                product?.variations?.[0].photos?.[0] &&
                <Box>
                    {showStoreHeader && <Link
                        prefetch={false}
                        onClick={handleEventSelectedDress}
                        href={product?.shopInfo?.name?.unique ? `/@${product.shopInfo.name.unique}` : ''}>
                        <Box
                            display={'flex'}
                            mb={doubleGridDevice ? 1 : 3}
                        >
                            <ProfilePhoto
                                doubleGridDevice={doubleGridDevice}
                                imgName={product?.shopInfo?.name?.visualized}
                                scr={product?.shopInfo?.profilePhoto}
                                primaryText={product?.shopInfo?.name?.visualized}
                                secondaryText={'@' + product?.shopInfo?.name?.unique}
                            />
                        </Box>
                    </Link>}

                    <Box minW='20'
                        _active={{
                            transform: 'scale(0.99)',
                        }}
                        borderRadius={'20px'}
                        h={'full'} overflow='hidden' className='cursor-pointer h-full'
                        position={'relative'}
                    //background={'#FBFBFB'}
                    >
                        <Link
                            onClick={handleEventSelectedDress}
                            onMouseLeave={() => {
                                setShowSize(false)
                            }}
                            prefetch={false}
                            href={productLinkPage}

                        >
                            {isSustainable &&
                                <ToolTipComponent
                                    smallView={doubleGridDevice}
                                    label={'Prodotto sostenibile'}
                                    icon={<Leaf
                                        className='m-auto'
                                        height={doubleGridDevice ? '16px' : '19px'}
                                        width={doubleGridDevice ? '16px' : '19px'}
                                        strokeWidth={2.1}
                                    />}
                                />
                            }
                            {showSize &&
                                <ScaleFade
                                    initialScale={0.7} in={showSize}
                                    delay={0.3}
                                    className='top-2 left-2 absolute hidden lg:flex z-20'
                                >
                                    <VStack
                                        className='bg-opacity-80 bg-[#FFFFFF]'
                                        p={1.5}
                                        borderRadius={'15px'}
                                        textAlign={'center'}
                                        minW={24}
                                    >
                                        {listOfSizesAvailable.slice(0, 4).map(size => {
                                            return (
                                                <Box key={size}
                                                    fontWeight={'bold'}
                                                    paddingX={2}
                                                    py={2}
                                                    justifyContent={'center'}
                                                    width={'full'}
                                                    fontSize={size?.length > 6 ? 'sm' : 'lg'}
                                                    className='bg-[#EEEEEE] hover:bg-[#FF5A78] hover:text-white'
                                                    borderRadius={'xl'}
                                                    onMouseEnter={() => {
                                                        const udpateUrl = manipulateUrlForProductColorAndSize(undefined, size, productLinkPage)
                                                        setProductLinkPage(udpateUrl)
                                                    }}
                                                >
                                                    {size.toLocaleUpperCase()}
                                                    {!listOfSizesAvailableForSpecificVariation.includes(size) &&
                                                        <Text
                                                            fontSize={'2xs'}
                                                            fontWeight={'medium'}
                                                            className='hover:text-white'
                                                            mt={-0.5}
                                                            lineHeight={'1'}
                                                        >
                                                            altri colori
                                                        </Text>}
                                                </Box>
                                            )
                                        })}
                                        {listOfSizesAvailable.length > 4 &&
                                            <Box
                                                fontWeight={'bold'}
                                                paddingX={4}
                                                paddingY={2}
                                                width={'full'}
                                                background={'#EEEEEE'}
                                                borderRadius={'xl'}
                                            >
                                                {listOfSizesAvailable.length - 4} in più
                                            </Box>
                                        }
                                    </VStack>
                                </ScaleFade>
                            }

                            {(isSmallView && !overflowCards) ?
                                (
                                    <Swiper
                                        spaceBetween={1}
                                        slidesPerView={1}
                                        loop
                                        pagination={{
                                            clickable: true
                                        }}
                                        modules={[Pagination, Navigation]}
                                    >
                                        {product.variations?.[indexPhoto].photos?.map((photoUrl, index) => {
                                            return (
                                                <SwiperSlide key={index}>
                                                    <LazyLoadImage
                                                        effect="blur"
                                                        onMouseEnter={() => {
                                                            setShowSize(true)
                                                        }}
                                                        src={isMobile && photoUrl ? imageKitUrl(photoUrl) : imageKitUrl(photoUrl ? photoUrl : '', 630, 660)}
                                                        alt={product.name ? product.name : ''}
                                                        className={`lg:w-full ${doubleGridDevice ? 'min-h-[180px]' : 'min-h-[350px] sm:min-h-[300px]'}  md:min-h-0 aspect-[4.8/5] object-cover rounded-[20px]`}
                                                    />
                                                </SwiperSlide>
                                            )
                                        })}
                                    </Swiper>)
                                :
                                (
                                    <LazyLoadImage
                                        effect="blur"
                                        onMouseEnter={() => {
                                            setShowSize(true)
                                        }}
                                        src={isMobile && urlProduct ? imageKitUrl(urlProduct) : imageKitUrl(urlProduct ? urlProduct : '', 630, 660)}
                                        alt={product.name ? product.name : ''}
                                        className={`w-full min-h-[300px] sm:min-h-[300px] aspect-[4.8/5] object-cover rounded-[20px]`}
                                    />
                                )
                            }
                            {!doubleGridDevice && <Box
                                className='absolute bottom-4 left-4 flex z-10'
                            >
                                <CircleColorComponent />
                            </Box>}
                        </Link>

                    </Box >
                    <Box
                        display={doubleGridDevice ? 'grid' : 'flex'}
                        mt={doubleGridDevice ? -1 : 2}
                        justifyContent={doubleGridDevice ? '' : 'space-between'}
                        ml={doubleGridDevice ? '1px' : 3}
                        mr={doubleGridDevice ? 1 : 3}
                    >
                        <Box
                            display={'grid'}
                            gap={0}
                            width={'full'}
                            mb={doubleGridDevice ? 1 : 0}
                        >
                            <Text
                                fontSize={'md'}
                                fontWeight={'semibold'}
                                py={0}
                                borderRadius={'full'}
                                noOfLines={1}
                                zIndex={10}
                                maxW={doubleGridDevice ? 'full' : product.price?.v2 ? '65%' : '73%'}

                            >
                                {product?.name?.toLocaleUpperCase()}
                            </Text>
                            <Text
                                fontSize={doubleGridDevice ? 'sm' : 'md'}
                                fontWeight={'medium'}
                                mt={doubleGridDevice ? '-4px' : '-4px'}
                                borderRadius={'full'}
                                noOfLines={1}
                                color={'#909090'}
                                zIndex={10}
                            >
                                {product?.info?.brand}
                            </Text>
                        </Box>

                        <Box
                            display={'flex'}
                            gap={1}
                            fontSize={doubleGridDevice ? 'sm' : 'md'}
                            mt={doubleGridDevice ? '-4px' : '0px'}
                            mb={doubleGridDevice ? 1 : 0}
                        >
                            {
                                typeof product?.price?.v2 === 'number' &&
                                typeof product?.price?.v1 === 'number' &&
                                product?.price?.v2 < product?.price?.v1 && <Text
                                    fontWeight={'semibold'}
                                    color={'#909090'}
                                    decoration={'line-through'}
                                >
                                    {formatNumberWithTwoDecimalsInString(Number(product.price?.v1))}
                                </Text>}
                            <Text

                                fontWeight={'semibold'}
                            >
                                {product.price?.v2 ? formatNumberWithTwoDecimalsInString(Number(product.price?.v2)) : formatNumberWithTwoDecimalsInString(Number(product.price?.v1))}€
                            </Text>
                        </Box>
                        {doubleGridDevice && <CircleColorComponent />}
                    </Box>
                </Box >
            }
        </>


    )
}

export default Box_Dress
