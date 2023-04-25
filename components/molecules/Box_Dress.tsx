import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Avatar, Box, Image, Text } from '@chakra-ui/react'
import Circle_Color from '../atoms/Circle_Color'
import { Product, Variation } from '../../src/interfaces/product.interface'
import { COLORS } from '../mook/colors'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import useWindowSize from '../Hooks/useWindowSize'
import { imageKitUrl } from '../utils/imageKitUrl'
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter'
import { Transition } from '@headlessui/react'
import Link from 'next/link'
import { toProductPage } from '../utils/toProductPage'
import createUrlSchema from '../utils/create_url'


const Box_Dress: React.FC<{ product: Product; color?: string | undefined }> = ({ product, color }) => {
    const [productcolorsCSS, setProductcolorsCSS] = useState<any[]>([]);
    const [width, height] = useWindowSize();
    //const [dimensionUrl, setDimensionUrl] = useState('&tr=w-571,h-825')
    const [urlProduct, seturlProduct] = useState<string>('')
    const [indexPhoto, setindexPhoto] = useState(0)

    useEffect(() => {

        const colors = product.variations.map((variation: Variation) => {
            return COLORS.find(color => color.name === variation.color)?.cssColor
        })
        setProductcolorsCSS(colors)
        if (color) {
            const indexPhoto = product?.variations.findIndex(variation => variation.color === color)
            if (indexPhoto >= 0) {
                console.log(indexPhoto);
                setindexPhoto(indexPhoto)
                //rimetti a 0
                return seturlProduct(product?.variations[indexPhoto].photos[0])

            }
        }
        seturlProduct(product?.variations[indexPhoto].photos[0])



    }, [product])

    useEffect(() => {
        //   if(width > 1000){
        //     setDimensionUrl('&tr=w-447,h-660')
        //   }
    }, [width])



    return (
        <>
            {product?.variations[0].photos[0] &&
                <Box

                >
                    <Link href={`/negozio/${product.shopInfo.id}/${createUrlSchema([product.shopInfo.name])}`}>

                        <Box
                            display={'flex'}
                            mb={3}
                        >
                            <Avatar
                                name={product.shopInfo.name}
                                src={product.info.macroCategory}
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
                                    {product.shopInfo.name}
                                </Text>
                                <Text
                                    fontWeight={'normal'}
                                    fontSize={'15px'}
                                    mt={-2}
                                    color={'#909090'}
                                >
                                    {product.info.brand}
                                </Text>
                            </Box>
                        </Box>
                    </Link>

                    <Box minW='20' borderRadius='15px' h={'full'} overflow='hidden' className='cursor-pointer relative aspect-[4/5] rounded-3xl'
                        borderWidth={1}
                        borderColor={'#F3F3F3'}
                    >

                        <Link href={color ? `/prodotto/${product.id}/${toProductPage(product)}?colore=${color}` : `/prodotto/${product.id}/${toProductPage(product)}`}>

                            <LazyLoadImage
                                src={imageKitUrl(urlProduct, 447, 660)}
                                // onMouseEnter={() => {
                                //     if (!product?.variations[indexPhoto].photos[1]) return
                                //     seturlProduct(product?.variations[indexPhoto].photos[1])
                                // }}
                                // onMouseLeave={() => {
                                //     seturlProduct(product?.variations[indexPhoto].photos[0])
                                // }}
                                effect="blur"
                                alt={product.name}
                                //className="w-fit min-h-[240px] md:min-h-0 object-cover"
                                className="w-fit min-h-[240px] md:min-h-0 object-cover "

                            />
                            <Box
                                fontSize={'md'}
                                fontWeight={'bold'}
                                py={0}
                                px={2}
                                bgColor={'#D9D9D9'}
                                position={'absolute'}
                                top={3}
                                left={3}
                                borderRadius={'full'}
                            >{product.name.toLocaleUpperCase()}</Box>
                            <Box
                                position={'absolute'}
                                bottom={3}
                                left={4}
                                display={'flex'}
                            >
                                <Circle_Color colors={productcolorsCSS.slice(0, 3)} dimension={6} space={1} />
                                {productcolorsCSS.length > 3 &&
                                    <>
                                        <Box onClick={() => {

                                        }} h={6}
                                            marginLeft={1}
                                            paddingX={2}
                                            borderRadius={'10px'} bg={'#D9D9D9'}
                                            //borderWidth={1} borderColor={'gray.200'}
                                            style={{
                                                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
                                            }}
                                            borderWidth={'1px'}
                                            borderColor={'white'}
                                            fontWeight={'semibold'}
                                            fontSize={'sm'}
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
                                paddingX={5}
                                paddingY={'6px'}
                                background={'#B55844'}
                                roundedTopLeft={'15px'}

                            >
                                <Text
                                    fontSize={['20px', '16px']}
                                    fontWeight={'bold'}
                                    color={'white'}
                                >
                                    {product.price?.v2 ? Number(product.price?.v2).toFixed(2).replace('.', ',') : Number(product.price?.v2).toFixed(2).replace('.', ',')}€
                                </Text>
                                {product.price?.v2 && <Text
                                    mt={-2}
                                    fontSize={['18px', '14px']}
                                    fontWeight={'medium'}
                                    color={'#BEA6A0'}
                                    decoration={'line-through'}
                                >
                                    {Number(product.price?.v1).toFixed(2).replace('.', ',')}
                                </Text>}
                            </Box>


                        </Link>
                    </Box>
                </Box>
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