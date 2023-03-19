import { Box, Button, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Tag, Text, VStack } from '@chakra-ui/react'
import React, { FC, useEffect } from 'react'
import { Cart, ProductVariation } from '../../src/interfaces/carts.interface'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { imageKitUrl } from '../utils/imageKitUrl'
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter'
import { useDispatch, useSelector } from 'react-redux'
import createUrlSchema from '../utils/create_url'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import EDIT_CART from '../../src/lib/apollo/mutations/editCart'
import { editVariationFromCart } from '../../src/store/reducers/carts'
import { newTotalHandler } from '../utils/newTotalHandler'

const CartDrawer: FC<{ isOpen: boolean, closeDrawer: () => void }> = ({ isOpen, closeDrawer }) => {
    const cartsDispatch: Cart[] = useSelector((state: any) => state.carts.carts);
    const [editCart] = useMutation(EDIT_CART);
    const router = useRouter()
    const dispatch = useDispatch();


    const CARTS_MOOK: Cart[] = [
        {
            id: '6415736c8561882630645131',
            userId: '6410ace3850a8aeb92bcbc9e',
            shopInfo: {
                id: '6415736c8561882630645131',
                name: 'Negozio da Peppa',
                city: 'Terni',
                status: 'active',
            },
            total: 200,
            productVariations: [
                {
                    id: '6415736c8561882630645132',
                    variationId: '6413937b80a960b926c291c4',
                    photo: '00722023-9a71-4ab8-a314-9413055fd92d',
                    productId: 'dd',
                    name: 'maglietta',
                    brand: 'Lacoste',
                    quantity: 1,
                    color: 'Verde',
                    size: 's',
                    price: {
                        v1: 100,
                        v2: 0,
                        discountPercentage: 0,
                    },
                },
                {
                    id: '6415736c8561882630645132',
                    variationId: '6413937b80a960b926c291c4',
                    photo: '032010c4-38de-4904-bbe2-be377bf9b398',
                    name: 'Giubbotto',
                    brand: 'Nike',
                    quantity: 2,
                    productId: 'dd',
                    color: 'Multicolore',
                    size: 'm',
                    price: {
                        v1: 200,
                        v2: 160,
                        discountPercentage: 20,
                    },
                }
            ]
        },
        {
            id: '6415736c8561882630645131',
            userId: '6410ace3850a8aeb92bcbc9e',
            shopInfo: {
                id: '6415736c8561882630645131',
                name: 'Negozio da Peppa',
                city: 'Terni',
                status: 'active',
            },
            total: 200,
            productVariations: [
                {
                    id: '6415736c8561882630645132',
                    variationId: '6413937b80a960b926c291c4',
                    photo: '00722023-9a71-4ab8-a314-9413055fd92d',
                    name: 'maglietta',
                    brand: 'Lacoste',
                    quantity: 1,
                    color: 'Verde',
                    productId: 'dd',
                    size: 's',
                    price: {
                        v1: 100,
                        v2: 0,
                        discountPercentage: 0,
                    },
                },
                {
                    id: '6415736c8561882630645132',
                    variationId: '6413937b80a960b926c291c4',
                    photo: '032010c4-38de-4904-bbe2-be377bf9b398',
                    name: 'Giubbotto',
                    brand: 'Nike',
                    quantity: 2,
                    color: 'Multicolore',
                    productId: 'dd',
                    size: 'm',
                    price: {
                        v1: 200,
                        v2: 160,
                        discountPercentage: 20,
                    },
                }
            ]
        }
    ]





    const deleteVariation = async (variation: ProductVariation) => {
        await editCart({
            variables: {
                productVariationId: variation.variationId,
                size: variation.size,
                quantity: 0
            }
        })

        let editedCart: Cart | undefined = undefined;


        for await (const cart of cartsDispatch) {
            for await (const element of cart.productVariations) {
                if (element.productId === variation.productId) {
                    const newVariations = cart.productVariations.filter(variationElement => variationElement.variationId !== variation.variationId || variationElement.size !== variation.size)
                    console.log(cart.productVariations, newVariations);

                    const newCart = {
                        ...cart,
                        productVariations: newVariations,
                        total: newTotalHandler(newVariations)
                    }
                    editedCart = newCart
                }
            }
        }

        if (!editedCart) return

        console.log(editedCart);

        let NewCarts: Cart[] = [];

        if (editedCart.total > 0) {
            NewCarts = [
                ...cartsDispatch.filter(cart => cart.shopInfo.id !== editedCart?.shopInfo.id),
                editedCart
            ]
        } else {
            NewCarts = [
                ...cartsDispatch.filter(cart => cart.shopInfo.id !== editedCart?.shopInfo.id)]
        }



        dispatch(
            editVariationFromCart({
                //add new Carts
                carts: NewCarts
            })
        );

        if (NewCarts.length <= 0) {
            closeDrawer()
        }
    }

    return (
        <Drawer
            isOpen={isOpen}
            placement='right'
            size={['full', 'md']}
            onClose={closeDrawer}
        >
            <DrawerOverlay />
            <DrawerContent >
                <DrawerHeader
                    borderBottomWidth='1px'
                    className='flex justify-between'
                    paddingLeft={[3, 4]}
                >
                    <h3
                        className='text-2xl font-medium'
                    >
                        Carrello
                    </h3>
                    <Box
                        cursor={'pointer'}
                        marginY={'auto'}
                        onClick={closeDrawer}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Box>
                </DrawerHeader>
                <DrawerBody
                    padding={[3, 4]}

                >
                    <VStack gap={4}

                    >
                        {cartsDispatch && cartsDispatch.map((cart, index) => {
                            return (
                                <Box key={index}
                                    width={'full'}
                                >
                                    <Box
                                        width={'full'}
                                    >
                                        <Text
                                            fontSize={'2xl'}
                                            fontWeight={'bold'}
                                            mb={3}
                                        >{cart.shopInfo.name}</Text>
                                        <VStack
                                            gap={1}
                                        >
                                            {cart.productVariations.map((variation, index) => {
                                                return (
                                                    <Box
                                                        key={index}
                                                        display={'flex'}
                                                        width={'full'}
                                                    >
                                                        <LazyLoadImage src={
                                                            imageKitUrl(variation.photo, 171, 247)
                                                        }
                                                            //PlaceholderSrc={PlaceholderImage}
                                                            alt={variation.name}
                                                            className='w-2/12 rounded-md object-cover'
                                                        />
                                                        <Box
                                                            display={'flex'}
                                                            justifyContent={'space-between'}
                                                            w={'full'}
                                                            py={2}
                                                            paddingLeft={3}
                                                        >
                                                            <Box>
                                                                <Box
                                                                    fontSize={'normal'}
                                                                    fontWeight={'medium'}
                                                                    cursor={'pointer'}
                                                                    onClick={() => {
                                                                        router.push('/prodotto/' + variation.productId + '/' + createUrlSchema([variation.brand, variation.name]) + '?colore=' + variation.color)
                                                                        closeDrawer()
                                                                    }}
                                                                >
                                                                    {toUpperCaseFirstLetter(variation.name)} ({variation.color})
                                                                </Box>
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
                                                            >
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
                                                                                size={'sm'}
                                                                                width={'fit-content'}
                                                                                color={'white'}
                                                                                bgColor={'#38A736'}
                                                                                borderRadius={'full'}
                                                                                fontSize={'xs'}
                                                                                height={'fit-content'}
                                                                                mt={[0, -2]}
                                                                            >- {variation.price.discountPercentage.toString().replace('.', ',')} %
                                                                            </Tag>}
                                                                    </Box>

                                                                </Box>
                                                            </Box>
                                                        </Box>

                                                    </Box>

                                                )
                                            })}
                                            {/* <Box
                                                width={'full'}
                                                display={'flex'}
                                                justifyContent={'space-between'}
                                            >
                                                <Box
                                                    fontSize={'md'}
                                                >
                                                    totale
                                                </Box>
                                                <Box
                                                    fontWeight={'semibold'}
                                                >
                                                    {cart.total.toString().replace('.', ',')} €
                                                </Box>
                                            </Box> */}
                                        </VStack>
                                        <Button
                                            mt={4}
                                            mb={3}
                                            onClick={() => { }}
                                            type={'button'}
                                            borderRadius={'xl'}
                                            size={'lg'}
                                            padding={5}
                                            paddingInline={10}
                                            width={'full'}
                                            height={'fit-content'}
                                            bg={'black.900'}
                                            color={'white'}
                                            _hover={{ bg: 'black.900' }}
                                            _focus={{
                                                bg: 'black.900'
                                            }}
                                            _active={{
                                                transform: 'scale(0.98)',
                                            }}
                                        >paga {cart.total.toString().replace('.', ',')} €</Button>

                                    </Box>
                                    <Divider
                                        colorScheme={'red'}
                                        size={'md'}
                                    />
                                </Box>


                            )
                        })}

                    </VStack>

                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}

export default CartDrawer