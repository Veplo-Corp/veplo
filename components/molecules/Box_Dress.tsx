import React, { Fragment, useEffect, useLayoutEffect, useState } from 'react'
import { Avatar, Box, Fade, Image, ScaleFade, Text, VStack } from '@chakra-ui/react'
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
import { formatNumberWithTwoDecimals } from '../utils/formatNumberWithTwoDecimals'
import { Product } from '../../src/lib/apollo/generated/graphql'


const Box_Dress: React.FC<{ handleEventSelectedDress?: () => void, product: Product; color?: string | undefined, showStoreHeader?: boolean }> = ({ handleEventSelectedDress, product, color, showStoreHeader }) => {

    const [productcolorsCSS, setProductcolorsCSS] = useState<any[]>([]);
    const [width, height] = useWindowSize();
    //const [dimensionUrl, setDimensionUrl] = useState('&tr=w-571,h-825')
    const [urlProduct, seturlProduct] = useState<string | undefined>()
    const [indexPhoto, setindexPhoto] = useState(0)
    const [listOfSizesAvailable, setListOfSizesAvailable] = useState<string[]>([])
    const [showSize, setShowSize] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (!product.variations) return
        const colors = product.variations.map((variation: any) => {
            return COLORS.find(color => color.name === variation.color)?.cssColor
        })

        console.log(product.variations[indexPhoto].photos?.[0]);


        setProductcolorsCSS(colors)
        seturlProduct(product.variations[indexPhoto].photos?.[0] ? product.variations[indexPhoto].photos?.[0] : '');
        if (color) {
            const indexPhoto = product?.variations.findIndex((variation: any) => variation.color === color)
            if (indexPhoto >= 0) {
                console.log(indexPhoto);
                setindexPhoto(indexPhoto)
                //rimetti a 0
                seturlProduct(typeof product?.variations[indexPhoto]?.photos?.[0] === 'string' ? product?.variations[indexPhoto]?.photos?.[0] : '')
            }
        }

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



    }, [product])

    useEffect(() => {
        //   if(width > 1000){
        //     setDimensionUrl('&tr=w-447,h-660')
        //   }
    }, [width])





    return (
        <>
            {product?.variations?.[0].photos?.[0] &&
                <Box
                >

                    {showStoreHeader && <Link
                        prefetch={false}
                        onClick={handleEventSelectedDress}
                        href={product?.shopInfo?.name && product?.shopInfo?.id ? `/negozio/${product?.shopInfo?.id}/${createUrlSchema([product.shopInfo.name])}` : ''}>
                        <Box
                            _active={{
                                transform: 'scale(0.99)',
                            }}
                            display={'flex'}
                            mb={3}
                        >
                            <Avatar
                                name={product?.shopInfo?.name ? product?.shopInfo?.name : ''}
                                src={product?.shopInfo?.profilePhoto ? imageKitUrl(product.shopInfo.profilePhoto, 100, 100) : ''}
                                bg='white'
                                size={'md'}
                                borderWidth={1}
                                borderColor={'#F3F3F3'}
                            />
                            <Box
                                ml={2}
                                marginY={'auto'}
                            >
                                <Text
                                    fontWeight={'semibold'}
                                    fontSize={'md'}
                                >
                                    {product?.shopInfo?.name}
                                </Text>
                                <Text
                                    fontWeight={'normal'}
                                    fontSize={'15px'}
                                    mt={-2}
                                    color={'#909090'}
                                >
                                    {product?.info?.brand}
                                </Text>
                            </Box>
                        </Box>
                    </Link>}

                    <Box minW='20'
                        _active={{
                            transform: 'scale(0.99)',
                        }}
                        borderRadius='15px' h={'full'} overflow='hidden' className='cursor-pointer relative rounded-3xl aspect-[4.2/5]'
                        borderWidth={1}
                        position={'relative'}
                        borderColor={'#F3F3F3'}
                        background={'#FBFBFB'}
                    >
                        <Link
                            onClick={handleEventSelectedDress}
                            onMouseLeave={() => {
                                setShowSize(false)
                            }}
                            prefetch={false}
                            href={color ? `/prodotto/${product.id}/${product?.info?.brand && product.name ? createUrlScheme([product.info.brand, product.name]) : ''}?colore=${color}` : `/prodotto/${product.id}/${product?.info?.brand && product.name ? createUrlScheme([product.info.brand, product.name]) : ''}`}>
                            {showSize &&
                                <ScaleFade
                                    initialScale={0.7} in={showSize}
                                    delay={0.3}

                                    className='z-10 top-0  absolute hidden lg:flex'
                                >
                                    <VStack
                                        background={'#FFFFFF'}
                                        borderWidth={1}
                                        borderColor={'#F3F3F3'}
                                        p={1.5}
                                        borderRadius={'10px'}
                                        textAlign={'center'}
                                        minW={28}
                                        fontSize={'lg'}
                                    >

                                        {listOfSizesAvailable.slice(0, 4).map(size => {
                                            return (
                                                <Box key={size}
                                                    fontWeight={'bold'}
                                                    paddingX={7}
                                                    paddingY={2}
                                                    width={'full'}
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
                            <LazyLoadImage
                                onMouseEnter={() => {
                                    setShowSize(true)
                                }}

                                src={isMobile && urlProduct ? imageKitUrl(urlProduct) : imageKitUrl(urlProduct ? urlProduct : '', 447, 660)}

                                // onMouseEnter={() => {
                                //     if (!product?.variations[indexPhoto].photos[1]) return
                                //     seturlProduct(product?.variations[indexPhoto].photos[1])
                                // }}
                                // onMouseLeave={() => {
                                //     seturlProduct(product?.variations[indexPhoto].photos[0])
                                // }}
                                //placeholderSrc={imageKitUrl(urlProduct)}
                                //effect="blur"
                                alt={product.name ? product.name : 'immagine non trovata'}
                                className="w-fit min-h-[240px] md:min-h-0 aspect-[4.2/5] object-cover "


                            />

                            <Text
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
                            >
                                {product?.name?.toLocaleUpperCase()}
                            </Text>
                            <Box
                                position={'absolute'}
                                bottom={3}
                                left={4}
                                display={'flex'}
                            >
                                <Circle_Color colors={productcolorsCSS.slice(0, 3)} dimension={isMobile ? 7 : 6} space={2} />
                                {productcolorsCSS.length > 3 &&
                                    <>
                                        <Box onClick={() => {

                                        }}
                                            h={[7, 6]}
                                            marginLeft={1.5}
                                            paddingX={2}
                                            borderRadius={'10px'}
                                            bg={'#D9D9D9'}
                                            //borderWidth={1} borderColor={'gray.200'}
                                            style={{
                                                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
                                            }}
                                            borderWidth={'1px'}
                                            borderColor={'white'}
                                            fontWeight={'semibold'}
                                            fontSize={['md', 'sm']}
                                            textAlign={'center'}
                                            pt={'1px'}
                                        >
                                            + {productcolorsCSS.length - 3}
                                        </Box>
                                    </>
                                }
                            </Box>

                            <Box
                                position={'absolute'}
                                bottom={0}
                                right={0}
                                minW={20}
                                paddingX={3}
                                display={'flex'}

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
                                        {product.price?.v2 ? formatNumberWithTwoDecimals(Number(product.price?.v2)) : formatNumberWithTwoDecimals(Number(product.price?.v1))}€
                                    </Text>
                                    {product.price?.v2 && <Text
                                        mt={-2}
                                        fontSize={['16px', '14px']}
                                        fontWeight={'medium'}
                                        color={'primary.secondaryText'}
                                        decoration={'line-through'}
                                    >
                                        {formatNumberWithTwoDecimals(Number(product.price?.v1))}€

                                    </Text>}
                                </Box>

                            </Box>


                        </Link>
                    </Box>
                </Box >
            }
        </>




    )
}

export default Box_Dress

// <Box pb='1' px={'0'}>
//     <Box
//         // mt='1'
//         zIndex={50}
//         fontWeight='semibold'
//         as='h2'
//         lineHeight='tight'
//         noOfLines={1}
//         fontSize={['xs', 'sm']}
//     >
//         {toUpperCaseFirstLetter(product.shopInfo.name)}
//     </Box>
//     <div className='flex justify-between'>
//         <div>
//             <Box

//                 fontWeight='normal'
//                 as='h1'
//                 noOfLines={1}
//                 lineHeight='tight'
//                 fontSize={['2xs', 'xs']}
//                 className='italic'
//             >
//                 {product.info.brand}
//             </Box>
//             <Box

//                 fontWeight='semibold'
//                 as='h1'
//                 fontSize={['xs', 'sm']}
//                 noOfLines={1}
//                 mt={-1}
//             >
//                 {product.name.toUpperCase()} - {product.info.microCategory}
//                 {/* {height} - {width} */}
//             </Box>
//         </div>

//     </div>

//     <div className='flex justify-between mr-1'>
//         <Box

//             fontWeight={'bold'}
//             as='h4'
//             fontSize={['md', 'sm']}
//             color={'green.600'}
//             lineHeight='none'
//             noOfLines={1}
//             mt={'1'}
//         >
//             <span
//                 className={`${product.price?.v2 ? 'text-slate-500 font-normal line-through' : ''} mr-2`}
//             >
//                 {Number(product.price?.v1).toFixed(2).replace('.', ',')} €
//             </span>
//             {product.price?.v2 && <span className=' text-red-700 font-bold'>{product.price?.v2.toFixed(2).replace('.', ',')} €</span>}
//         </Box>

//     </div>


// </Box>