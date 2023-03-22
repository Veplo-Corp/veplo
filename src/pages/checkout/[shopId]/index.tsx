import { useMutation } from '@apollo/client';
import { Box, Button, Divider, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'
import VariationBoxList from '../../../../components/molecules/VariationBoxList';
import NoIndexSeo from '../../../../components/organisms/NoIndexSeo'
import PriceAndShippingListingCost from '../../../../components/organisms/PriceAndShippingListingCost';
import createUrlSchema from '../../../../components/utils/create_url';
import { newTotalHandler } from '../../../../components/utils/newTotalHandler';
import { Cart, ProductVariation } from '../../../interfaces/carts.interface';
import CRATE_CHECKOUT_URL from '../../../lib/apollo/mutations/checkout';
import EDIT_CART from '../../../lib/apollo/mutations/editCart';
import { editVariationFromCart } from '../../../store/reducers/carts';

const index = () => {
    const cartsDispatch: Cart[] = useSelector((state: any) => state.carts.carts);
    const [cart, setCart] = useState<Cart>()
    const router = useRouter()
    const [checkoutUrlMutation] = useMutation(CRATE_CHECKOUT_URL);
    const dispatch = useDispatch();
    const [editCart] = useMutation(EDIT_CART);
    const [isDisabled, setIsDisabled] = useState(false)

    useEffect(() => {
        const { shopId } = router.query

        const cart = cartsDispatch.filter(cart => cart.shopInfo.id === shopId)[0]
        if (cart) {
            console.log(cart);
            setCart(cart)
        }
        if (!cart) {
            setCart(undefined)
        }
    }, [cartsDispatch, router])

    const checkoutUrl = async () => {
        setIsDisabled(true)
        try {
            const create = await checkoutUrlMutation({
                variables: {
                    shopId: cart?.shopInfo.id
                }
            })
            setIsDisabled(false)
            router.push(create.data.checkout)
        }
        catch (e) {
            console.log(e);
            setIsDisabled(false)
        }
    }

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

    }

    const pushToProduct = (variation: ProductVariation) => {
        router.push('/prodotto/' + variation.productId + '/' + createUrlSchema([variation.brand, variation.name]) + '?colore=' + variation.color)
    }

    return (
        <>
            <NoIndexSeo title='Veplo'></NoIndexSeo>
            <Desktop_Layout>

                {cart &&
                    <div className='w-full m-auto md:w-10/12 lg:w-1/2 mt-4'>
                        <Text
                            fontSize={['lg', '2xl']}
                            fontWeight={'extrabold'}
                            mb={[4]}
                        >
                            {cart?.shopInfo.name}

                        </Text>
                        <VStack
                            gap={1}
                        >
                            {cart.productVariations.map(variation => {
                                return (
                                    <div
                                        key={variation.variationId + variation.size}
                                        className='w-full'
                                    >
                                        <VariationBoxList
                                            variation={variation}
                                            toProduct={() => pushToProduct(variation)}
                                            deleteVariation={() => deleteVariation(variation)}
                                        />
                                    </div>
                                )
                            })}

                        </VStack>
                        <PriceAndShippingListingCost subTotal={cart.total} total={cart.total} shippingCost={4.99} />

                        <Box
                            display={'flex'}
                            justifyContent={'end'}
                        >
                            <Button

                                mt={4}
                                mb={3}
                                onClick={checkoutUrl}

                                type={'button'}
                                borderRadius={'xl'}
                                size={'md'}
                                padding={4}
                                paddingInline={16}
                                width={'fit-content'}
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
                                disabled={isDisabled}
                                _disabled={{
                                    background: 'black'
                                }}
                            >Procedi
                            </Button>
                        </Box>

                        <Box
                            mt={5}
                            width={'full'}
                            background={'gray.100'}
                            padding={6}
                        >
                            <Text
                                fontSize={'2xl'}
                                fontWeight={'medium'}
                                mb={1}
                            >
                                Consegna prevista in 5 - 7 giorni
                            </Text>
                            <Text
                                fontSize={'sm'}
                            >
                                Costo fisso per la spedizione 4,99€
                            </Text>
                        </Box>
                    </div>}





            </Desktop_Layout>
        </>

    )
}

export default index