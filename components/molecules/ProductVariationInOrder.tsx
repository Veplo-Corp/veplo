import { Box, Tag } from '@chakra-ui/react'
import React, { FC } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { ProductVariationInOrder } from '../../src/interfaces/order.interface'
import { imageKitUrl } from '../utils/imageKitUrl'
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter'

const ProductVariationInOrder: FC<{ variation: ProductVariationInOrder }> = ({ variation }) => {
    return (
        <Box

            display={'flex'}
            width={'full'}
        >
            <LazyLoadImage src={
                imageKitUrl(variation.photo, 171, 247)
            }
                //PlaceholderSrc={PlaceholderImage}
                alt={variation.name}

                className='w-2/12 max-w-[70px] rounded-md object-cover'
            />
            <Box
                width={'full'}
                height={'full'}
                ml={2}
            >
                <Box display={'flex'}
                    justifyContent={'space-between'}
                >
                    <Box
                        fontSize={'normal'}
                        fontWeight={'medium'}
                    >
                        {toUpperCaseFirstLetter(variation.name)} ({variation.color})
                    </Box>
                    <Box>
                        <Box
                            fontSize={'sm'}
                            fontWeight={'normal'}
                            display={'flex'}
                        >
                            <p
                                className={`${variation?.price.v2 && variation?.price?.v2 > 0 ? 'line-through  text-gray-400' : 'font-semibold'}`}
                            > {variation.price.v1.toString().replace('.', ',')} €
                            </p>
                            {variation?.price.v2 && variation.price.v2 > 0 &&
                                <p
                                    className='font-semibold ml-1'
                                >{variation?.price.v2 && variation.price.v2.toString().replace('.', ',')} € </p>
                            }
                        </Box>
                        <Box
                            display={'flex'}
                            justifyContent={'end'}
                            textAlign={'end'}
                        >
                            {variation?.price.discountPercentage && variation.price.discountPercentage > 0 &&
                                <Tag
                                    size={['xs', 'sm']}
                                    px={2}
                                    py={1}
                                    width={'fit-content'}
                                    color={'white'}
                                    bgColor={'#38A736'}
                                    borderRadius={'full'}
                                    fontSize={'2xs'}
                                    height={'fit-content'}
                                >- {variation.price.discountPercentage.toString().replace('.', ',')} %
                                </Tag>}
                        </Box>
                    </Box>
                </Box>




                <Box
                >
                    <Box
                        fontSize={'xs'}
                        fontWeight={'light'}
                        color={'gray.500'}
                        mt={-1}
                    >
                        {toUpperCaseFirstLetter(variation.brand)}
                    </Box>
                    <Box
                        fontSize={'xs'}
                        fontWeight={'normal'}
                    >
                        {variation.size.toUpperCase()} / Quantità {variation.quantity}
                    </Box>
                </Box>
            </Box>



        </Box>
    )
}

export default ProductVariationInOrder