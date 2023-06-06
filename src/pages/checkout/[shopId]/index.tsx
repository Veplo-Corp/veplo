import { useLazyQuery, useMutation } from '@apollo/client';
import { Box, Button, ButtonGroup, Divider, ListItem, Text, UnorderedList, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'
import Loading from '../../../../components/molecules/Loading';
import VariationBoxList from '../../../../components/molecules/VariationBoxList';
import NoIndexSeo from '../../../../components/organisms/NoIndexSeo'
import PriceAndShippingListingCost from '../../../../components/organisms/PriceAndShippingListingCost';
import createUrlSchema from '../../../../components/utils/create_url';
import { newTotalHandler } from '../../../../components/utils/newTotalHandler';
import { Cart, ProductVariation } from '../../../interfaces/carts.interface';
import CRATE_CHECKOUT_URL from '../../../lib/apollo/mutations/checkout';
import EDIT_CART from '../../../lib/apollo/mutations/editCart';
import { editVariationFromCart } from '../../../store/reducers/carts';
import GET_SHOP from '../../../lib/apollo/queries/getShop';
import { Shop } from '../../../interfaces/shop.interface';
import ModalReausable from '../../../../components/organisms/ModalReausable';

const SHIPPING_COST = 4.99;

const index = () => {
    const cartsDispatch: Cart[] = useSelector((state: any) => state.carts.carts);
    const [cart, setCart] = useState<Cart>()
    const router = useRouter()
    const [checkoutUrlMutation, { error }] = useMutation(CRATE_CHECKOUT_URL);
    const dispatch = useDispatch();
    const [editCart] = useMutation(EDIT_CART);
    const [isDisabled, setIsDisabled] = useState(false);
    const [getShop, shopQuery] = useLazyQuery(GET_SHOP);
    const [shop, setShop] = useState<Shop>();
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)

    // Inizializza uno stato per il timeout
    const [timeoutId, setTimeoutId] = useState<any>(null);

    // Definisce la funzione con il timeout
    function myFunctionWithTimeout() {
        // Cancella il timeout precedente, se presente
        clearTimeout(timeoutId);

        // Imposta un nuovo timeout di 5 secondi
        const newTimeoutId = setTimeout(function () {
            const { shopId } = router.query;
            const cart = cartsDispatch.filter(cart => cart.shopInfo.id === shopId)[0]
            if (!cart) {
                router.back()
            }

        }, 4000);

        // Aggiorna lo stato con l'id del nuovo timeout
        setTimeoutId(newTimeoutId);
    }

    console.log(error?.graphQLErrors);

    useEffect(() => {
        const { shopId } = router.query;

        if (!shopId || !cartsDispatch) return
        myFunctionWithTimeout()
        getShop({
            variables: {
                id: shopId
            }
        })
        console.log(cartsDispatch);
        const cart = cartsDispatch.filter(cart => cart.shopInfo.id === shopId)[0]
        if (cart) {
            console.log(cart);
            setCart(cart)
        }
        if (!cart) {
            setCart(undefined)
        }
    }, [cartsDispatch, router])



    useEffect(() => {
        if (!shopQuery.data) return
        setShop(shopQuery.data.shop)
    }, [shopQuery])

    useEffect(() => {
        if (!error) return
        setIsErrorModalOpen(true)
    }, [error])


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
                    break;
                }
            }
        }

        if (!editedCart) return


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

    const handleDeleteVariations = async () => {
        const errorVariations = error?.graphQLErrors;
        if (!errorVariations) return
        console.log(errorVariations);
        for await (const errorVariation of errorVariations) {
            if (typeof errorVariation.path !== 'string') return
            let id: string = errorVariation.path
            id = id.trim()
            console.log(id);
            if (!cart) return
            const variations = cart.productVariations.filter(element => element.variationId === id)
            console.log(variations);
            for await (const variation of variations) {
                await editCart({
                    variables: {
                        productVariationId: variation.variationId,
                        size: variation.size,
                        quantity: 0
                    }
                })
            }
        }
        return router.reload();


    }

    return (
        <>
            {cart ? (
                <>
                    <NoIndexSeo title='Veplo'></NoIndexSeo>
                    <Desktop_Layout>


                        <div className='w-full m-auto md:w-10/12 lg:w-1/2 mt-4'>
                            <Link
                                prefetch={false}
                                href={`/negozio/${cart.shopInfo.id}/${createUrlSchema([cart.shopInfo.name])}`}
                            >
                                <Text
                                    cursor={'pointer'}
                                    fontSize={['lg', '2xl']}
                                    fontWeight={'extrabold'}
                                    mb={[4]}
                                >
                                    {cart?.shopInfo.name}
                                </Text>
                            </Link>

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
                            <PriceAndShippingListingCost subTotal={cart.total} total={cart.total + (!shop?.minimumAmountForFreeShipping || shop?.minimumAmountForFreeShipping > cart.total ? SHIPPING_COST : 0)} shippingCost={!shop?.minimumAmountForFreeShipping || shop?.minimumAmountForFreeShipping > cart.total ? SHIPPING_COST : 0} />

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
                                    variant={'black'}
                                    _disabled={{
                                        bg: '#000000'
                                    }}

                                    _hover={{
                                        color: 'primary.text'
                                    }}
                                    disabled={isDisabled}

                                >Procedi
                                </Button>
                            </Box>

                            {!shop?.minimumAmountForFreeShipping || shop?.minimumAmountForFreeShipping > cart.total && <Box
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
                            </Box>}
                        </div>
                        <ModalReausable title='Carrello ingombrante' isOpen={isErrorModalOpen} closeModal={() => setIsErrorModalOpen(false)} >
                            <Text mt={2}
                                mb={3}
                                fontSize={'md'}
                                fontWeight={'medium'}
                            >
                                Dobbiamo eliminare dal carrello questi prodotti perchè non sono più disponibili o la quantità selezionata è terminata:
                            </Text>
                            <UnorderedList
                                fontSize={'md'}
                                fontWeight={'bold'}
                            >
                                {error?.graphQLErrors.map((error, index) => {
                                    if (typeof error.path !== 'string') return (<></>)
                                    let id: string = error.path
                                    id = id.trim()
                                    console.log(id);
                                    console.log(cart.productVariations);
                                    const variations = cart.productVariations.filter(element => element.variationId === id)
                                    console.log(variations);
                                    return (
                                        <div key={index}>
                                            {
                                                variations.map((variation, index) => {
                                                    return (
                                                        <ListItem
                                                            key={index}
                                                        >
                                                            {variation.name}
                                                        </ListItem>)
                                                })
                                            }
                                        </div>
                                    )


                                })}
                            </UnorderedList>
                            <ButtonGroup gap='2'
                                display={'flex'}
                                justifyContent={'right'}
                                mt={5}
                            >

                                <Button colorScheme='orange'
                                    borderRadius={'full'}
                                    paddingX={6}
                                    paddingY={5}
                                    size={'sm'}
                                    disabled={false}
                                    //disabled={images.length < 2 || color === '' || productSizeSelected[0]?.quantity === undefined || productSizeSelected[0]?.quantity < 1 || productSizeSelected[0]?.size === undefined || productSizeSelected[0]?.size === ''}
                                    onClick={handleDeleteVariations}
                                >Conferma
                                </Button>
                            </ButtonGroup>

                        </ModalReausable>
                    </Desktop_Layout>
                </>
            ) :
                (
                    <Loading />
                )
            }
        </>



    )
}

export default index