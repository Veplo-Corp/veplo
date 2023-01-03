import React, { useEffect, useState } from 'react'
import { Box, Image } from '@chakra-ui/react'
import Circle_Color from '../atoms/Circle_Color'
import { Product } from '../../src/interfaces/product.interface'
import { COLORS } from '../mook/colors'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Box_Dress: React.FC<{ product: Product; eventHandler: any, toShop: any }> = ({ product, eventHandler, toShop }) => {
    const [productcolorsCSS, setProductcolorsCSS] = useState<any[]>([]);
    useEffect(() => {
        let colorsCSS = [];
        for (let i = 0; i < product.colors.length; i++) {
            const colorCSS = COLORS.filter(color => color.name === product.colors[i])[0].cssColor
            colorsCSS.push(colorCSS)
        }
        setProductcolorsCSS(colorsCSS)
    }, [product])

    return (
        <Box minW='20' /* maxW='350' */ mb={'5'} borderRadius='lg' overflow='hidden' className='cursor-pointer'
            _active={{
                transform: 'scale(1)', /* 'scale(0.99)' */
            }}>
            {/* <Image fallbackSrc='https://via.placeholder.com/150' onClick={() => eventHandler(product)} src={product.photos[0]} alt={'immagine non disponibile'} /> */}
            {product?.photos && <LazyLoadImage src={product.photos[0].replace(
                
                `https://firebasestorage.googleapis.com/v0/b/dintorni-${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'}.appspot.com`, 'https://ik.imagekit.io/veplo')+'&tr=w-381,h-550'}
                onClick={() => eventHandler(product)}
                //PlaceholderSrc={PlaceholderImage}
                effect="blur"
                alt="Image Alt"
                className="w-fit"
            />}
            <Box py='1' px={'0'}>
                <Box
                    mt='1'
                    zIndex={50}
                    fontWeight='bold'
                    as='h2'
                    lineHeight='tight'
                    noOfLines={1}
                    fontSize='sm'
                    onClick={() => toShop(product.shopId, product.shopOptions.city, product.shopOptions.name)}
                >
                    {product.shopOptions.name}
                </Box>
                <Box
                    onClick={() => eventHandler(product)}
                    fontWeight='normal'
                    as='h2'
                    noOfLines={1}
                    lineHeight='tight'
                    fontSize='sm'
                    className='italic'
                >
                    {product.brand}
                </Box>
                <Box
                    onClick={() => eventHandler(product)}
                    fontWeight='normal'
                    as='h3'
                    fontSize='sm'
                    noOfLines={1}
                    mt={-1}
                >
                    {product.name.toUpperCase()}
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