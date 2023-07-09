import { Box, Button, Tag, Text, VStack } from '@chakra-ui/react'
import React, { FC } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Cart, ProductVariation } from '../../src/interfaces/carts.interface'
import { imageKitUrl } from '../utils/imageKitUrl'
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter'
import { formatNumberWithTwoDecimals } from '../utils/formatNumberWithTwoDecimals'
import { Cancel } from 'iconoir-react'
import ButtonClose from '../atoms/ButtonClose'
const VariationBoxList: FC<{ variation: ProductVariation, toProduct: (variation: ProductVariation) => void, deleteVariation: (variation: ProductVariation) => void }> = ({ variation, toProduct, deleteVariation }) => {

    return (
        <Box

            display={'flex'}
            width={'full'}
        >
            <LazyLoadImage src={
                imageKitUrl(variation.photo, 237, 247)
            }
                //PlaceholderSrc={PlaceholderImage}
                alt={variation.name}

                className='w-2/12 max-w-[70px] rounded-md object-cover'
            />
            <Box
                width={'full'}
                height={'full'}
            >
                <Box
                    paddingLeft={3}
                    display={'flex'}
                    justifyContent={'space-between'}
                >
                    <Box
                        fontSize={['sm', 'medium']}
                        fontWeight={'medium'}
                        cursor={'pointer'}
                        onClick={() => toProduct(variation)}
                    >
                        {toUpperCaseFirstLetter(variation.name)} ({variation.color})
                    </Box>
                    <Text
                        cursor={'pointer'}
                        color={'black'}
                        display={'flex'}
                        alignItems={'start'}
                        justifyContent={'end'}
                        onClick={() => deleteVariation(variation)}
                    >
                        <Cancel
                            strokeWidth={2}
                            className="w-6 h-6 my-auto"
                        />
                    </Text>
                </Box>
                <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    paddingLeft={3}
                    width={'full'}
                    height={'full'}

                >
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

                    <Box
                        display={'grid'}
                        pt={2}
                    >

                        <Box
                            display={'grid'}
                            alignItems={'end'}
                        >
                            <Box
                                fontSize={'sm'}
                                fontWeight={'normal'}
                                display={'flex'}
                            >
                                <p
                                    className={`${variation?.price?.v2 && variation?.price?.v2 > 0 ? 'line-through  text-gray-400' : 'font-semibold'}`}
                                > {formatNumberWithTwoDecimals(variation?.price?.v1)} €
                                </p>
                                {variation?.price?.v2 && variation?.price?.v2 > 0 &&
                                    <p
                                        className='font-semibold ml-1'
                                    >{variation?.price.v2 && formatNumberWithTwoDecimals(variation.price.v2)} € </p>
                                }
                            </Box>
                            <Box
                                display={'flex'}
                                justifyContent={'end'}
                            >
                                {typeof variation?.price?.discountPercentage === 'number' && variation?.price?.discountPercentage > 0 &&
                                    <Tag
                                        size={['xs', 'sm']}
                                        px={2}
                                        py={1}
                                        width={'fit-content'}
                                        color={'secondary.text'}
                                        bgColor={'secondary.bg'}
                                        borderRadius={'full'}
                                        fontSize={'2xs'}
                                        height={'fit-content'}
                                    >- {formatNumberWithTwoDecimals(variation?.price?.discountPercentage)} %
                                    </Tag>}
                            </Box>

                        </Box>
                    </Box>
                </Box>
            </Box>



        </Box>
    )
}

export default VariationBoxList