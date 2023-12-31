import { Box, Button, ListItem, Select, Tag, Text, UnorderedList, VStack } from '@chakra-ui/react'
import React, { FC } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { imageKitUrl } from '../utils/imageKitUrl'
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter'
import { formatNumberWithTwoDecimalsInString } from '../utils/formatNumberWithTwoDecimalsInString'
import { ArrowSeparateVertical, Cancel, Trash } from 'iconoir-react'
import ButtonClose from '../atoms/ButtonClose'
import { formatPercentage } from '../utils/formatPercentage'
import Link from 'next/link'
import { CartProductVariation } from '../../src/lib/apollo/generated/graphql'
import createUrlSchema from '../utils/create_url'
const CheckoutProduct: FC<{ shopUniqueName: string, variation: CartProductVariation, toProduct?: (variation: CartProductVariation) => void, deleteVariation?: (variation: CartProductVariation) => void, editVariation?: (variation: CartProductVariation, quantity: number) => void }> = ({ variation, shopUniqueName, deleteVariation, editVariation }) => {
    const URI = `/@${shopUniqueName}/prodotto/${variation?.productId}/${createUrlSchema([variation?.brand, variation?.name])}?colors=${variation?.color}`

    return (
        <Box
            display={'flex'}
            width={'full'}
        >
            <Link
                href={URI}
            >
                <LazyLoadImage src={
                    imageKitUrl(variation?.photo ? variation?.photo : '', 237, 247)
                }
                    //PlaceholderSrc={PlaceholderImage}
                    alt={''}

                    className='h-32 lg:h-40 aspect-[4.8/5] rounded-[10px] object-cover'
                />
            </Link>
            <Box

                height={'full'}
                ml={4}

                my={'auto'}
            >
                <UnorderedList
                    color={'#909090'}
                    fontSize={['12px', '12px', '15px']}
                    fontWeight={'medium'}
                    spacing={2}

                >
                    <Link href={URI}>
                        <ListItem>{toUpperCaseFirstLetter(variation?.brand)}</ListItem>
                    </Link>

                    <ListItem>{variation?.size?.toUpperCase()} - {toUpperCaseFirstLetter(variation?.color)}{typeof variation?.quantity === 'number' && variation?.quantity > 1 ? ' (Q.ta ' + variation?.quantity + ')' : ''} </ListItem>
                    {typeof variation?.price?.v1 === 'number' && <ListItem
                        gap={2}
                    >
                        <Box
                            display={'flex'}
                            gap={2}
                        >
                            <Text
                            >
                                {variation?.price?.v2 && typeof variation?.quantity === 'number' && variation?.price?.v2 < variation?.price?.v1 ? formatNumberWithTwoDecimalsInString(variation?.price.v2) + '€' : formatNumberWithTwoDecimalsInString(variation?.price?.v1) + '€'}
                            </Text>
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
                                    my={'auto'}
                                >- {formatPercentage(variation?.price?.discountPercentage)} %
                                </Tag>}
                        </Box>
                    </ListItem>}
                </UnorderedList>
                {deleteVariation && editVariation && <Box
                    display={'flex'}
                    mt={2}
                >
                    <Select
                        mt={1}
                        value={variation?.quantity ? variation?.quantity : 0}
                        boxShadow={'none'}
                        onChange={(event) => {
                            editVariation(variation, Number(event.target.value))
                        }}
                        width={'fit-content'}
                        focusBorderColor="transparent"
                        minW={10}
                        height={7}
                        color={'secondaryBlack.text'}
                        fontSize={'sm'}
                        fontWeight={'medium'}
                        cursor={'pointer'}
                        icon={<ArrowSeparateVertical
                            strokeWidth={3}
                        />}
                        borderRadius={'5px'}
                        iconSize='xs'
                        bg={'#F2F2F2'}
                    >

                        {Array.from({ length: typeof variation?.maxQuantity === 'number' && variation?.maxQuantity < 7 ? variation?.maxQuantity : 7 }, (_, i) => i + 1)
                            .map(item => {
                                return (<option
                                    key={item}
                                    value={item} >{item}
                                </option>)
                            })}
                    </Select>
                    <Text
                        cursor={'pointer'}
                        my={'auto'}
                        mb={0}
                        fontSize={['12px', '14px']}
                        fontWeight={'light'}
                        color={'#3A3A3A'}
                        ml={3}
                        className='underline underline-offset-2'
                        onClick={() => {
                            if (!variation) return
                            deleteVariation(variation)
                        }}
                    >
                        Rimuovi
                    </Text>
                </Box>}
            </Box>
        </Box>
    )
}

export default CheckoutProduct