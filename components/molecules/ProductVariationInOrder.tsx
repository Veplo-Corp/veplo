import { Box, Tag } from '@chakra-ui/react'
import React, { FC } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { imageKitUrl } from '../utils/imageKitUrl'
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter'
import { formatNumberWithTwoDecimalsInString } from '../utils/formatNumberWithTwoDecimalsInString'
import { formatPercentage } from '../utils/formatPercentage'
import { CartProductVariation } from '../../src/lib/apollo/generated/graphql'

const ProductVariationInOrder: FC<{ variation: CartProductVariation }> = ({ variation }) => {
    return (
        <Box

            display={'flex'}
            width={'full'}
        >
            <LazyLoadImage src={
                imageKitUrl(variation?.photo ? variation?.photo : '', 237, 247)
            }
                //PlaceholderSrc={PlaceholderImage}
                alt={variation?.name ? variation?.name : 'immagine non trovata'}

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
                        {toUpperCaseFirstLetter(variation?.name ? variation?.name : '')} ({variation?.color})

                        <Box
                            fontSize={'xs'}
                            fontWeight={'light'}
                            color={'gray.500'}
                            mt={-1}
                        >
                            {toUpperCaseFirstLetter(variation?.brand ? variation?.brand : '')}
                        </Box>
                        <Box
                            fontSize={'xs'}
                            fontWeight={'normal'}
                        >
                            {variation?.size?.toUpperCase()} / Quantità {variation?.quantity}
                        </Box>
                    </Box>
                    <Box

                    >
                        {variation?.price?.v2 && variation?.price?.v1 && <Box
                            fontSize={'sm'}
                            fontWeight={'normal'}
                            display={'flex'}
                        >
                            <p
                                className={`${variation?.price?.v2 < variation?.price?.v1 && variation?.price?.v2 > 0 ? 'line-through  text-gray-400' : 'font-semibold'}`}
                            > {formatNumberWithTwoDecimalsInString(variation?.price.v1)} €
                            </p>
                            {variation?.price?.v2 < variation?.price?.v1 &&
                                <p
                                    className='font-semibold ml-1'
                                >{variation?.price.v2 && formatNumberWithTwoDecimalsInString(variation?.price.v2)} € </p>
                            }
                        </Box>}
                        <Box
                            display={'flex'}
                            justifyContent={'end'}
                            textAlign={'end'}
                        >
                            {typeof variation?.price?.discountPercentage === 'number' && variation?.price?.discountPercentage > 0 &&
                                <Tag
                                    size={['xs', 'sm']}
                                    px={2}
                                    py={1}
                                    width={'fit-content'}
                                    color={'successTag.text'}
                                    bgColor={'successTag.bg'}
                                    borderRadius={'full'}
                                    fontSize={'2xs'}
                                    height={'fit-content'}
                                >- {formatPercentage(variation?.price?.discountPercentage)} %
                                </Tag>}
                        </Box>
                    </Box>
                </Box>





            </Box>



        </Box>
    )
}

export default ProductVariationInOrder