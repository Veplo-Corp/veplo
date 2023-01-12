import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Box, Image } from '@chakra-ui/react'
import Circle_Color from '../atoms/Circle_Color'
import { Product } from '../../src/interfaces/product.interface'
import { COLORS } from '../mook/colors'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import useWindowSize from '../Hooks/useWindowSize'
import { imageKitUrl } from '../utils/imageKitUrl'
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter'


const Box_Dress: React.FC<{ product: Product; eventHandler: any, toShop: any }> = ({ product, eventHandler, toShop }) => {
    const [productcolorsCSS, setProductcolorsCSS] = useState<any[]>([]);
    const [width, height] = useWindowSize();
    //const [dimensionUrl, setDimensionUrl] = useState('&tr=w-571,h-825')
    const [urlProduct, seturlProduct] = useState(product.photos[0])

    useEffect(() => {
        let colorsCSS = [];
        for (let i = 0; i < product.colors.length; i++) {
            const colorCSS = COLORS.filter(color => color.name === product.colors[i])[0].cssColor
            colorsCSS.push(colorCSS)
        }
        setProductcolorsCSS(colorsCSS)
    }, [product])

    useEffect(() => {
    //   if(width > 1000){
    //     setDimensionUrl('&tr=w-447,h-660')
    //   }
    }, [width])
    


    return (
        <Box minW='20' /* maxW='350' */ mb={'5'} borderRadius='lg' overflow='hidden' className='cursor-pointer'
            _active={{
                transform: 'scale(1)', /* 'scale(0.99)' */
            }}>
            {/* <Image fallbackSrc='https://via.placeholder.com/150' onClick={() => eventHandler(product)} src={product.photos[0]} alt={'immagine non disponibile'} /> */}
            {product?.photos && <LazyLoadImage src={imageKitUrl(urlProduct,447, 660 )}
                onClick={() => eventHandler(product)}
                onMouseEnter={()=> {
                    seturlProduct(product.photos[1])
                }}
                onMouseLeave={()=> {
                    seturlProduct(product.photos[0])
                }}
                //PlaceholderSrc={PlaceholderImage}
                effect="blur"
                alt="Image Alt"
                className="w-fit"
            />}
            <Box pb='1' px={'0'}>
                <Box
                    // mt='1'
                    zIndex={50}
                    fontWeight='name'
                    as='h2'
                    lineHeight='tight'
                    noOfLines={1}
                    fontSize='sm'
                    onClick={() => toShop(product.shopId, product.shopOptions.city, product.shopOptions.name)}
                >
                    {toUpperCaseFirstLetter(product.shopOptions.name)}
                </Box>
                <Box
                    onClick={() => eventHandler(product)}
                    fontWeight='normal'
                    as='h1'
                    noOfLines={1}
                    lineHeight='tight'
                    fontSize='13px'
                    className='italic'
                >
                    {product.brand}
                </Box>
                <Box
                    onClick={() => eventHandler(product)}
                    fontWeight='bold'
                    as='h1'
                    fontSize='sm'
                    noOfLines={1}
                    mt={-1}
                >
                    {product.name.toUpperCase()}
                    {/* {height} - {width} */}
                </Box>
                <div className='flex justify-between mt-2 mr-1'>
                    <Box
                        onClick={() => eventHandler(product)}
                        fontWeight='bold'
                        as='h4'
                        fontSize='xs'
                        color='green.600'
                        lineHeight='none'
                        noOfLines={1}
                        mt={'1'}
                    >
                        {Number(product.price).toFixed(2).replace('.', ',')} €
                    </Box>
                    <Circle_Color eventHanlder={() => eventHandler(product)} colors={productcolorsCSS} dimension={4} space={1} />
                </div>
            </Box>
        </Box>
    )
}

export default Box_Dress