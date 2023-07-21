import React, { Fragment, useEffect, useLayoutEffect, useState } from 'react'
import { Box, Fade, Image, ScaleFade, Tag, Text, Tooltip, VStack, useBreakpointValue } from '@chakra-ui/react'
import Circle_Color from '../atoms/Circle_Color'
import { Variation } from '../../src/interfaces/product.interface'
import { COLORS } from '../mook/colors'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import useWindowSize from '../Hooks/useWindowSize'
import { imageKitUrl } from '../utils/imageKitUrl'
import createUrlScheme from "../utils/create_url"

import Link from 'next/link'
import { toProductPage } from '../utils/toProductPage'
import createUrlSchema from '../utils/create_url'
import { isMobile } from 'react-device-detect'
import { useRouter } from 'next/router'
import { formatNumberWithTwoDecimalsInString } from '../utils/formatNumberWithTwoDecimalsInString'
import { Product } from '../../src/lib/apollo/generated/graphql'
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css';
import 'swiper/css/pagination';
import ProfilePhoto from './ProfilePhoto'
import { SustainableTraits, arraySustainableTraits } from '../mook/productParameters/traits'
import { Leaf } from 'iconoir-react'


const Box_Dress: React.FC<{ overflowCards?: boolean, handleEventSelectedDress?: () => void, product: Product; color?: string | undefined, showStoreHeader?: boolean, productLink: string }> = ({ handleEventSelectedDress, product, color, showStoreHeader, productLink, overflowCards }) => {

    const [productcolorsCSS, setProductcolorsCSS] = useState<any[]>([]);
    const [width, height] = useWindowSize();
    //const [dimensionUrl, setDimensionUrl] = useState('&tr=w-571,h-825')
    const [urlProduct, seturlProduct] = useState<string | undefined>()
    const [indexPhoto, setindexPhoto] = useState(0)
    const [listOfSizesAvailable, setListOfSizesAvailable] = useState<string[]>([])
    const [showSize, setShowSize] = useState(false)
    const [isSustainable, setIsSustainable] = useState(false)
    const router = useRouter()
    const isSmallView = useBreakpointValue({ base: true, md: false });
    const [productLinkPage, setProductLinkPage] = useState(productLink)

    const checkIfProductIsSustainable = (parole: string[] | null | undefined): boolean => {
        if (!parole) return false
        console.log(parole);

        return parole.some(parola => arraySustainableTraits.includes(parola as SustainableTraits));
    }

    const handleSetPhotoUrl = (colorSelected: string | undefined) => {
        if (!product?.variations) return

        if (!colorSelected) {
            const url = product.variations[indexPhoto].photos?.[0] ? product.variations[indexPhoto].photos?.[0] : ''
            return seturlProduct(url)

        }
        const variationIndex: any = product.variations?.findIndex(variation => variation.color?.toLowerCase() === colorSelected.toLowerCase())

        if (variationIndex >= 0) {
            setindexPhoto(variationIndex)
            //cambio URI link per mandarlo al colore giusto cliccato
            console.log(productLinkPage);
            // const URI = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' + productLinkPage :
            //     'https://www.veplo.it' + productLinkPage
            // console.log(URI);
            let updatedURL = productLinkPage;


            const colorExists = updatedURL.includes('colors=');
            const sizesExist = updatedURL.includes('sizes=');

            if (colorExists) {
                // Sostituisci il valore del parametro "color" con il colore fornito
                updatedURL = updatedURL.replace(/colors=[^&]+/, `colors=${colorSelected.toLocaleLowerCase()}`);
            } else {
                if (sizesExist) {
                    // Aggiungi il parametro "color" con il colore fornito
                    updatedURL += `&colors=${colorSelected.toLocaleLowerCase()}`;
                } else {
                    // Aggiungi il parametro "color" con il colore fornito, gestendo il caso in cui ci siano già parametri o meno
                    updatedURL += updatedURL.includes('?') ? `&colors=${colorSelected.toLocaleLowerCase()}` : `?colors=${colorSelected.toLocaleLowerCase()}`;
                }
            }

            console.log(updatedURL);
            setProductLinkPage(updatedURL.toString())
            seturlProduct(typeof product?.variations[variationIndex]?.photos?.[0] === 'string' ? product?.variations[variationIndex]?.photos?.[0] : '')





            //rimetti a 0
        }
    }

    useEffect(() => {
        if (!product.variations) return
        const colors = product.variations.map((variation: any) => {
            return COLORS.find(color => color.name === variation.color)?.cssColor
        })

        const isProductSustainable = checkIfProductIsSustainable(product.info?.traits)
        setIsSustainable(isProductSustainable)
        setProductcolorsCSS(colors)
        handleSetPhotoUrl(color)

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

        const totalSize: string[] = product.variations.map((variation: any) => {
            return variation.lots.map((lot: any) => {
                return lot.size
            })

        }).flat().filter((value: any, index: any, self: any) => {
            return self.indexOf(value) === index;
        }).sort().sort(function (a: string, b: string) {
            return sizes.indexOf(a) - sizes.indexOf(b)
        });


        setListOfSizesAvailable(totalSize)



    }, [product, color])

    useEffect(() => {
        //   if(width > 1000){
        //     setDimensionUrl('&tr=w-447,h-660')
        //   }
    }, [width])



    const ToolTipComponent = () => {
        return (<Tooltip label='Prodotto sostenibile'
            bg='white'
            color='primaryBlack.text'
            borderRadius={'full'}
            boxShadow={'sm'}
            fontWeight={'medium'}
        >
            <Box
                position={'absolute'}
                zIndex={20}
                top={3.5}
                right={'15px'}
                height={8}
                width={8}
                margin={'none'}
                padding={'none'}
                background={'white'}
                borderRadius={'full'}
                display={'flex'}
            >
                <Leaf
                    className='m-auto'
                    height={'19px'}
                    width={'19px'}
                    strokeWidth={2.1}
                />
            </Box>
        </Tooltip>)
    }

    return (
        <>
            {
                product?.variations?.[0].photos?.[0] &&
                <Box >

                    {showStoreHeader && <Link
                        prefetch={false}
                        onClick={handleEventSelectedDress}
                        href={product?.shopInfo?.name && product?.shopInfo?.id ? `/negozio/${product?.shopInfo?.id}/${createUrlSchema([product.shopInfo.name])}` : ''}>
                        <Box
                            display={'flex'}
                            mb={3}
                        >
                            <ProfilePhoto
                                imgName={product?.shopInfo?.name}
                                scr={product?.shopInfo?.profilePhoto}
                                primaryText={product?.shopInfo?.name}
                                secondaryText={product?.info?.brand}
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
                        //href={color ? `/prodotto/${product.id}/${product?.info?.brand && product.name ? createUrlScheme([product.info.brand, product.name]) : ''}?colore=${color}` : `/prodotto/${product.id}/${product?.info?.brand && product.name ? createUrlScheme([product.info.brand, product.name]) : ''}`}
                        >
                            {isSustainable &&
                                <ToolTipComponent />
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
                                        minW={16}

                                    >

                                        {listOfSizesAvailable.slice(0, 4).map(size => {
                                            return (
                                                <Box key={size}
                                                    fontWeight={'bold'}
                                                    paddingX={size.length > 3 ? 1 : 6}
                                                    py={size.length > 6 ? 2 : 2}

                                                    justifyContent={'center'}
                                                    width={'full'}
                                                    fontSize={size.length > 6 ? 'sm' : 'lg'}
                                                    background={'#EEEEEE'}
                                                    borderRadius={'xl'}
                                                >
                                                    {size.toLocaleUpperCase()}
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
                                                        className="lg:w-full min-h-[350px] sm:min-h-[300px] md:min-h-0 aspect-[4.8/5] object-cover rounded-[20px] "
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
                                        className="w-full min-h-[350px] sm:min-h-[300px] aspect-[4.8/5] object-cover rounded-[20px]"
                                    />
                                )

                            }


                            {/* <Text
                                fontSize={'md'}
                                fontWeight={'bold'}
                                py={0}
                                px={2}
                                bgColor={'#D9D9D9'}
                                position={'absolute'}
                                top={3}
                                left={3}
                                borderRadius={'full'}
                                noOfLines={1}
                                mr={3}
                                zIndex={10}
                            >
                                {product?.name?.toLocaleUpperCase()}
                            </Text> */}
                            <Box
                                position={'absolute'}
                                bottom={[3, 3]}
                                left={4}
                                display={'flex'}
                                zIndex={10}
                            >
                                <Circle_Color colors={productcolorsCSS.slice(0, 5)} dimension={isMobile ? '22px' : 6} space={2}
                                    handleColorFocused={(color: string) => {
                                        if (isSmallView) return
                                        handleSetPhotoUrl(color)

                                    }}
                                />
                                {productcolorsCSS.length > 5 &&
                                    <Tag

                                        onClick={() => {

                                        }}
                                        h={['24px', 6]}
                                        px={2}
                                        ml={1.5}
                                        borderRadius={'10px'}
                                        bg={'#D8D8D8'}
                                        //borderWidth={1} borderColor={'gray.200'}
                                        style={{
                                            boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
                                        }}
                                        borderWidth={'1px'}
                                        borderColor={'white'}
                                        fontWeight={'semibold'}
                                        fontSize={['md', 'sm']}
                                        textAlign={'center'}
                                    >
                                        +{productcolorsCSS.length - 5}
                                    </Tag>
                                }
                            </Box>

                            {/* <Box
                                position={'absolute'}
                                bottom={0}
                                right={0}
                                minW={20}
                                paddingX={3}
                                display={'flex'}
                                zIndex={50}

                                paddingY={product.price?.v2 ? '6px' : '12px'}
                                background={'primary.bg'}
                                roundedTopLeft={'15px'}

                            >
                                <Box
                                    mx={'auto'}
                                >
                                    <Text
                                        fontSize={['22px', '18px']}
                                        fontWeight={'bold'}
                                        color={'primary.text'}
                                    >
                                        {product.price?.v2 ? formatNumberWithTwoDecimalsInString(Number(product.price?.v2)) : formatNumberWithTwoDecimalsInString(Number(product.price?.v1))}€
                                    </Text>
                                    {product.price?.v2 && <Text
                                        mt={-2}
                                        fontSize={['16px', '14px']}
                                        fontWeight={'medium'}
                                        color={'primary.secondaryText'}
                                        decoration={'line-through'}
                                    >
                                        {formatNumberWithTwoDecimalsInString(Number(product.price?.v1))}€

                                    </Text>}
                                </Box>

                            </Box> */}


                        </Link>

                    </Box >
                    <Box
                        display={'flex'}
                        mt={2}
                        justifyContent={'space-between'}
                        mx={3}
                    >
                        <Text
                            fontSize={'md'}
                            fontWeight={'semibold'}
                            py={0}
                            top={3}
                            left={3}
                            borderRadius={'full'}
                            noOfLines={1}
                            zIndex={10}
                            maxW={product.price?.v2 ? '65%' : '73%'}

                        >
                            {product?.name?.toLocaleUpperCase()}
                        </Text>
                        <Box
                            display={'flex'}
                            gap={1}

                        >
                            {
                                typeof product?.price?.v2 === 'number' &&
                                typeof product?.price?.v1 === 'number' &&
                                product?.price?.v2 < product?.price?.v1 && <Text

                                    fontSize={'md'}
                                    fontWeight={'semibold'}
                                    color={'#909090'}
                                    decoration={'line-through'}
                                >
                                    {formatNumberWithTwoDecimalsInString(Number(product.price?.v1))}
                                </Text>}
                            <Text
                                fontSize={'md'}
                                fontWeight={'semibold'}
                            >
                                {product.price?.v2 ? formatNumberWithTwoDecimalsInString(Number(product.price?.v2)) : formatNumberWithTwoDecimalsInString(Number(product.price?.v1))}€
                            </Text>

                        </Box>
                    </Box>

                </Box >
            }
        </>




    )
}

export default Box_Dress
