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
import VariationBoxList from '../molecules/VariationBoxList'

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

    const pushToProduct = (variation: ProductVariation) => {
        router.push('/prodotto/' + variation.productId + '/' + createUrlSchema([variation.brand, variation.name]) + '?colore=' + variation.color)
        closeDrawer()
    }

    const pushToCheckout = (cartId: string) => {
        router.push('/checkout/' + cartId)
        closeDrawer()
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
                                <Box key={index} width={'full'}>
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
                                                    <div key={index}
                                                        className='w-full'
                                                    >
                                                        <VariationBoxList variation={variation} toProduct={pushToProduct} deleteVariation={deleteVariation} />
                                                    </div>
                                                )
                                            })}
                                        </VStack>

                                    </Box>
                                    <Button
                                        mt={4}
                                        mb={3}
                                        onClick={() => {
                                            pushToCheckout(cart.id)
                                        }}
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