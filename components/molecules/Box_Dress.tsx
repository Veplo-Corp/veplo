import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Box, Image } from '@chakra-ui/react'
import Circle_Color from '../atoms/Circle_Color'
import { Product, Variation } from '../../src/interfaces/product.interface'
import { COLORS } from '../mook/colors'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import useWindowSize from '../Hooks/useWindowSize'
import { imageKitUrl } from '../utils/imageKitUrl'
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter'
import { Transition } from '@headlessui/react'


const Box_Dress: React.FC<{ product: Product; }> = ({ product }) => {
    const [productcolorsCSS, setProductcolorsCSS] = useState<any[]>([]);
    const [width, height] = useWindowSize();
    //const [dimensionUrl, setDimensionUrl] = useState('&tr=w-571,h-825')
    const [urlProduct, seturlProduct] = useState(product?.variations[0].photos[0])

    useEffect(() => {
        const colors = product.variations.map((variation: Variation) => {
            return COLORS.find(color => color.name === variation.color)?.cssColor

        })
        setProductcolorsCSS(colors)
    }, [product])

    useEffect(() => {
        //   if(width > 1000){
        //     setDimensionUrl('&tr=w-447,h-660')
        //   }
    }, [width])



    return (

        <Box minW='20' /* maxW='350' */ borderRadius='lg' overflow='hidden' className='cursor-pointer relative'
            _active={{
                transform: 'scale(1)', /* 'scale(0.99)' */
            }}>
            {product?.variations[0].photos[0] &&
                <LazyLoadImage src={imageKitUrl(urlProduct, 447, 660)}
                    onMouseEnter={() => {
                        if (!product?.variations[0].photos[1]) return
                        seturlProduct(product?.variations[0].photos[1])
                    }}
                    onMouseLeave={() => {
                        seturlProduct(product?.variations[0].photos[0])
                    }}
                    //PlaceholderSrc={PlaceholderImage}
                    //effect="blur"
                    alt={product.name}
                    className="w-fit min-h-[180px] md:min-h-0"
                />}
            {product.price?.discountPercentage && <Box

                fontWeight='medium'
                as='h1'
                fontSize={['sm', 'xs']}
                noOfLines={1}
                background={'green.700'}
                color={'white'}
                width={'fit-content'}
                px={'3'}
                py={'1'}
                className='absolute mt-[-55px] md:mt-[-48px] right-0'>
                - {product.price?.discountPercentage.toString().replace('.', ',')}%
                {/* {height} - {width} */}
            </Box>}
            <Box pb='1' px={'0'}>
                <Box
                    // mt='1'
                    zIndex={50}
                    fontWeight='semibold'
                    as='h2'
                    lineHeight='tight'
                    noOfLines={1}
                    fontSize={['xs', 'sm']}
                >
                    {toUpperCaseFirstLetter(product.shopInfo.name)}
                </Box>
                <div className='flex justify-between'>
                    <div>
                        <Box

                            fontWeight='normal'
                            as='h1'
                            noOfLines={1}
                            lineHeight='tight'
                            fontSize={['2xs', 'xs']}
                            className='italic'
                        >
                            {product.info.brand}
                        </Box>
                        <Box

                            fontWeight='semibold'
                            as='h1'
                            fontSize={['xs', 'sm']}
                            noOfLines={1}
                            mt={-1}
                        >
                            {product.name.toUpperCase()} - {product.info.microCategory}
                            {/* {height} - {width} */}
                        </Box>
                    </div>

                </div>

                <div className='flex justify-between mr-1'>
                    <Box

                        fontWeight={'bold'}
                        as='h4'
                        fontSize={['md', 'sm']}
                        color={'green.600'}
                        lineHeight='none'
                        noOfLines={1}
                        mt={'1'}
                    >
                        <span
                            className={`${product.price?.v2 ? 'text-slate-500 font-normal line-through' : ''} mr-2`}
                        >
                            {Number(product.price?.v1).toFixed(2).replace('.', ',')} €
                        </span>
                        {product.price?.v2 && <span className=' text-red-700 font-bold'>{product.price?.v2.toFixed(2).replace('.', ',')} €</span>}
                    </Box>

                </div>
                <div className='mt-2 md:mt-0 float-right pb-0.5 pr-0.5'>
                    <Circle_Color colors={productcolorsCSS} dimension={4} space={1} />
                </div>

            </Box>
        </Box>
    )
}

export default Box_Dress