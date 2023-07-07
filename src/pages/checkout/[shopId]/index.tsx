import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
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
import { Firebase_User } from '../../../interfaces/firebase_user.interface';
import LoginAndRegistrationForm from '../../../../components/organisms/LoginAndRegistrationForm';

const SHIPPING_COST = 4.99;

const index = () => {
    const cartsDispatch: Cart[] = useSelector((state: any) => state.carts.carts);
    const user: Firebase_User = useSelector((state: any) => state.user.user);

    const [cart, setCart] = useState<Cart>()
    const router = useRouter()
    const [checkoutUrlMutation, { error }] = useMutation(CRATE_CHECKOUT_URL);
    const dispatch = useDispatch();
    const [editCart] = useMutation(EDIT_CART);
    const [isDisabled, setIsDisabled] = useState(false);
    const shopQuery = useQuery(GET_SHOP, {
        variables: {
            id: router.query.shopId
        }
    });
    const [shop, setShop] = useState<Shop>();
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
    const [isOpenLoginModal, setIsOpenLoginModal] = useState(false)
    const [typeLogin, setTypeLogin] = useState<'login' | 'registration' | 'reset_password'>('login')




    console.log(error?.graphQLErrors);

    useEffect(() => {
        const { shopId } = router.query;
        if (!router.isReady || !shopId || user.statusAuthentication === 'not_yet_authenticated' || !cartsDispatch) return
        const cart = cartsDispatch.filter(cart => cart.shopInfo.id === shopId)[0]
        console.log(cartsDispatch);
        let timeoutId: any;
        if (cart) {
            console.log(cart);
            setCart(cart)
        }
        if (!cart) {
            console.log('CART', cart);
            //in futuro mettiamo carrello non trovato e non reindiriziamo a negozi
            timeoutId = setTimeout(() => {
                if (shop) {
                    router.replace(`/negozio/${shop?.id}/${createUrlSchema([shop?.name])}`)
                } else {
                    router.replace(`/negozi`)
                }
            }, 4000); // Timeout di 4 secondi
            setCart(undefined)

        }
        return () => {
            clearTimeout(timeoutId);
        };
    }, [user, cartsDispatch, /* router.query */])



    useEffect(() => {
        if (!shopQuery.data) return
        setShop(shopQuery.data.shop)
    }, [shopQuery])

    useEffect(() => {
        if (!error) return
        setIsErrorModalOpen(true)
    }, [error])


    const checkoutUrl = async () => {
        if (user.isBusiness) return


        if (!user.uid) {
            return setIsOpenLoginModal(true)
        }
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
        try {
            if (user.uid) {
                await editCart({
                    variables: {
                        productVariationId: variation.id,
                        size: variation.size,
                        quantity: 0
                    }
                })
            }

        } catch {

        }


        let editedCart: Cart | undefined = undefined;


        for await (const cart of cartsDispatch) {
            for await (const element of cart.productVariations) {
                if (element.productId === variation.productId) {
                    const newVariations = cart.productVariations.filter(variationElement => variationElement.id !== variation.id || variationElement.size !== variation.size)
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
            dispatch(
                editVariationFromCart({
                    //add new Carts
                    carts: NewCarts
                })
            );

        } else {
            NewCarts = [
                ...cartsDispatch.filter(cart => cart.shopInfo.id !== editedCart?.shopInfo.id)]
            dispatch(
                editVariationFromCart({
                    //add new Carts
                    carts: NewCarts
                })
            );
        }
        if (!user.uid) {
            localStorage.setItem('carts', JSON.stringify(NewCarts))
        }







    }

    const pushToProduct = (variation: ProductVariation) => {
        router.push('/prodotto/' + variation.productId + '/' + createUrlSchema([variation.brand, variation.name]) + '?colore=' + variation.color)
    }

    const handleDeleteVariations = async () => {
        const errorVariations = error?.graphQLErrors;
        if (!errorVariations) return
        console.log(errorVariations);
        if (!user.uid) {
            return
        }
        try {
            for await (const errorVariation of errorVariations) {
                if (typeof errorVariation.path !== 'string') return
                let id: string = errorVariation.path
                id = id.trim()
                console.log(id);
                if (!cart) return
                const variations = cart.productVariations.filter(element => element.id === id)
                console.log(variations);
                for await (const variation of variations) {
                    await editCart({
                        variables: {
                            productVariationId: variation.id,
                            size: variation.size,
                            quantity: 0
                        }
                    })
                }
            }
        } catch {

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
                            <Box
                                width={'fit-content'}
                                cursor={'pointer'}
                                fontSize={['lg', '2xl']}
                                fontWeight={'extrabold'}
                                mb={[4]}
                            >
                                <Link
                                    prefetch={false}
                                    href={`/negozio/${cart.shopInfo.id}/${createUrlSchema([cart.shopInfo.name])}`}
                                >

                                    {cart?.shopInfo.name}

                                </Link>
                            </Box>


                            <VStack
                                gap={1}
                            >
                                {cart?.productVariations?.map(variation => {
                                    return (
                                        <div
                                            key={variation.id + variation.size}
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
                                    isDisabled={isDisabled}

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
                                    const variations = cart.productVariations.filter(element => element.id === id)
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
                                    isDisabled={false}
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
                    <Box
                        minHeight={'100vh'}
                    >
                        <Loading />
                    </Box>
                )
            }
            <ModalReausable
                marginTop={0}
                title='' isOpen={isOpenLoginModal}
                closeModal={() => setIsOpenLoginModal(false)}
            >
                <LoginAndRegistrationForm
                    open='modal'
                    type={typeLogin}
                    person='user'
                    handleChangeTypeOrPerson={(type, person) => {
                        if (person === 'business') return
                        setTypeLogin(type)
                    }}
                />

            </ModalReausable>
        </>



    )
}

export default index