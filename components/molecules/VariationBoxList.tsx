import { Box, Button, Tag, Text, VStack } from '@chakra-ui/react'
import React, { FC } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Cart, ProductVariation } from '../../src/interfaces/carts.interface'
import { imageKitUrl } from '../utils/imageKitUrl'
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter'

const VariationBoxList: FC<{ variation: ProductVariation, toProduct: (variation: ProductVariation) => void, deleteVariation: (variation: ProductVariation) => void }> = ({ variation, toProduct, deleteVariation }) => {
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
            >
                <Box
                    paddingLeft={3}
                    display={'flex'}
                    justifyContent={'space-between'}
                >
                    <Box
                        fontSize={'normal'}
                        fontWeight={'medium'}
                        cursor={'pointer'}
                        onClick={() => toProduct(variation)}
                    >
                        {toUpperCaseFirstLetter(variation.name)} ({variation.color})
                    </Box>
                    <Text
                        cursor={'pointer'}
                        color={'red.500'}
                        display={'flex'}
                        alignItems={'start'}
                        justifyContent={'end'}
                        onClick={() => deleteVariation(variation)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>

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
                </Box>
            </Box>



        </Box>
    )
}

export default VariationBoxList