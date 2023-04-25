import { useLazyQuery, useMutation } from '@apollo/client'
import { Box, Button, Input, InputGroup, Tag, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import Desktop_Layout from '../../../../../../../components/atoms/Desktop_Layout'
import GrayBox from '../../../../../../../components/atoms/GrayBox'
import ProductVariationInOrder from '../../../../../../../components/molecules/ProductVariationInOrder'
import { STATUS_ORDER_SHOP } from '../../../../../../../components/mook/statusOrderBusiness'
import Modal_Help_Customer_Care from '../../../../../../../components/organisms/Modal_Help_Customer_Care'
import PriceAndShippingListingCost from '../../../../../../../components/organisms/PriceAndShippingListingCost'
import { ToastOpen } from '../../../../../../../components/utils/Toast'
import { Firebase_User } from '../../../../../../interfaces/firebase_user.interface'
import { Order } from '../../../../../../interfaces/order.interface'
import ADD_CODE_AND_COURIER_TO_ORDER from '../../../../../../lib/apollo/mutations/addCodeAndCourierToOrder'
import GET_ORDER from '../../../../../../lib/apollo/queries/getOrder'
import Link from 'next/link'

const index = () => {
    const { addToast } = ToastOpen();
    const [isOpenHelpModal, setIsOpenHelpModal] = useState(false)
    const [getOrder, { error, data }] = useLazyQuery(GET_ORDER);
    const router = useRouter()
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const [order, setOrder] = useState<Order>();
    const { register, handleSubmit, reset, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<{ code: string, courier: string }>({
        mode: "all",
    });
    const [orderStatus, setOrderStatus] = useState<{ text: string, color: string }>();

    const [editCurrierInfo] = useMutation(ADD_CODE_AND_COURIER_TO_ORDER, {
        update(cache, el, query) {
            console.log(cache);
            console.log(el);
            console.log(query);

            const OrderCacheId = cache.identify({ id: query.variables?.id, __typename: 'Order' })
            console.log(OrderCacheId);
            cache.modify({
                id: OrderCacheId, //productId
                fields: {
                    status(/* cachedvalue */) {
                        return "SHIP01"
                    },
                    shipping() {
                        return {
                            url: null,
                            courier: query.variables?.options?.courier,
                            code: query.variables?.options?.code,
                        }
                    }
                },
                broadcast: false // Include this to prevent automatic query refresh
            });
            addToast({ position: 'top', title: 'Spedizione inserita con successo', description: `hai inserito con successo il codice di spedizione dell'ordine ${order?.code} `, status: 'success', duration: 5000, isClosable: false })
            router.push(`/shop/home/${router.query?.shopId}/ordini`)
        }
    })


    useEffect(() => {
        const { shopId, orderId } = router.query
        if (user?.isBusiness || shopId) {
            getOrder({
                variables: {
                    id: orderId,
                    statuses: null
                }
            }).then(response => {
                if (response?.data) {
                    console.log(response.data);
                    setOrder(response.data?.order)
                }

            })
        }
    }, [user, router])

    const onSubmitFormOrder = async (orderInfo: { courier: string, code: string }) => {
        console.log(orderInfo);
        try {
            await editCurrierInfo({
                variables: {
                    id: order?.id,
                    options: orderInfo
                }
            })
        } catch (error: any) {
            console.log(error);

        }

    }

    const handleStatus = (orderStatus: string) => {
        const status = STATUS_ORDER_SHOP.find(status => status.code === orderStatus);
        if (!status) return
        setOrderStatus({
            text: status.description,
            color: status.orderStatus.color
        })
    }

    return (
        <>

            <Desktop_Layout>

                {order &&
                    <>
                        <Box
                            className='w-screen md:w-3/4 xl:w-1/2 m-auto mt-8'
                        >
                            {orderStatus &&
                                <Box
                                    display={'flex'}
                                >
                                    <Tag
                                        className='m-auto md:m-0'
                                        mt={[0, 4]}
                                        mb={4}
                                        px={4}
                                        py={2}
                                        borderRadius={'full'}
                                        size={'lg'}
                                        fontWeight={'semibold'}
                                        colorScheme={orderStatus.color}
                                        // borderWidth={2}
                                        borderColor={'black'}
                                    >
                                        {orderStatus.text}
                                    </Tag>
                                </Box>
                            }
                            <GrayBox>
                                <Text
                                    fontSize={'2xl'}
                                    fontWeight={'semibold'}
                                    mb={3}
                                >
                                    Informazioni Utente
                                </Text>
                                <VStack
                                    gap={1}
                                    align='stretch'
                                >
                                    <Box>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'medium'}
                                            mb={-1}
                                        >
                                            Nome
                                        </Text>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'normal'}
                                        >
                                            {order.user.name} {order.user.surname}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'medium'}
                                            mb={-1}
                                        >
                                            email
                                        </Text>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'normal'}
                                        >
                                            {order.user.email}
                                        </Text>
                                    </Box>

                                </VStack>
                            </GrayBox>
                        </Box>
                        <Box
                            className='w-full md:w-3/4 xl:w-1/2 m-auto mt-8 mb-32'
                        >
                            <GrayBox>
                                <Text
                                    fontSize={'2xl'}
                                    fontWeight={'semibold'}
                                    mb={3}
                                >
                                    Dettaglio Spedizione
                                </Text>
                                <VStack
                                    gap={1}
                                    align='stretch'
                                >
                                    <Box>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'medium'}
                                            mb={-1}
                                        >
                                            Ordine
                                        </Text>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'normal'}
                                        >
                                            {order?.code}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'medium'}
                                            mb={-1}
                                        >
                                            Pagamento
                                        </Text>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'normal'}
                                        >
                                            {STATUS_ORDER_SHOP.find(element => element.code === order?.status) ?
                                                STATUS_ORDER_SHOP.find(element => element.code === order?.status)?.payment.text : 'Errore'
                                            }
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'medium'}
                                            mb={-1}
                                        >
                                            Indirizzo
                                        </Text>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'normal'}
                                        >
                                            {order.recipient.address.postalCode}, {order.recipient.address.city}, {order.recipient.address.line1}{order.recipient.address.line2 ? ',' : ''}
                                        </Text>
                                        {order.recipient.address.line2 && <Text>
                                            Info aggiuntive: {order.recipient.address.line2}
                                        </Text>}
                                    </Box>
                                    <Box>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'medium'}
                                            mb={-1}
                                        >
                                            A chi consegnare
                                        </Text>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'normal'}
                                        >
                                            {order.recipient.name}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'medium'}
                                            mb={-1}
                                        >
                                            Numero di telefono
                                        </Text>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'normal'}
                                        >
                                            {order.recipient.phone}
                                        </Text>
                                    </Box>
                                </VStack>

                            </GrayBox>
                            {order &&
                                <Box
                                    my={8}
                                >
                                    <VStack

                                        mt={[6, 10]}
                                        width={'full'}
                                        gap={4}
                                    >
                                        {order.productVariations.map((variation, index) => {
                                            return (
                                                <div key={index} className='w-full'>
                                                    <ProductVariationInOrder variation={variation} />
                                                </div>
                                            )
                                        })}
                                    </VStack>
                                    <PriceAndShippingListingCost subTotal={order.totalDetails.subTotal} total={order.totalDetails.total} shippingCost={order.totalDetails.amountShipping} />
                                </Box>
                            }
                            <GrayBox>
                                {order?.status === 'PAY01' &&
                                    <>
                                        <Text
                                            fontSize={'2xl'}
                                            fontWeight={'medium'}
                                        >
                                            Inserisci spedizione
                                        </Text>
                                        <form onSubmit={handleSubmit(onSubmitFormOrder)}>
                                            <InputGroup
                                                gap={5}
                                                mt={4}
                                            >
                                                <Input
                                                    placeholder='Codice spedizione'
                                                    id='codice spedizione'
                                                    autoComplete='off'
                                                    type='text'
                                                    py={6}
                                                    rounded={'10px'}
                                                    _placeholder={{
                                                        color: 'gray.600',
                                                        fontWeight: '400'
                                                    }}
                                                    background={'white'}
                                                    variant='outline'
                                                    {...register("code", {
                                                        required: true,
                                                        minLength: 6
                                                    })}
                                                >
                                                </Input>
                                                <Input
                                                    placeholder='Corriere'
                                                    id='corriere'
                                                    type='text'
                                                    py={6}
                                                    rounded={'10px'}
                                                    _placeholder={{
                                                        color: 'gray.600',
                                                        fontWeight: '400'
                                                    }}
                                                    {...register("courier", {
                                                        required: true,
                                                        minLength: 2
                                                    })}
                                                    background={'white'}
                                                    variant='outline'
                                                >
                                                </Input>

                                            </InputGroup>

                                            <Button
                                                mt={5}
                                                onClick={() => { }}
                                                borderRadius={'md'}
                                                size={'xl'}
                                                padding={4}
                                                px={10}
                                                width={'fit-content'}
                                                height={'fit-content'}
                                                bg={'black.900'}
                                                color={'white'}
                                                type={'submit'}
                                                _hover={{ bg: 'black.900' }}
                                                _focus={{
                                                    bg: 'black.900'
                                                }}

                                                _active={{
                                                    transform: 'scale(0.98)',
                                                }}
                                            >Conferma</Button>
                                        </form>
                                    </>
                                }
                                {(order?.status !== 'CRE01' && order?.status !== 'PAY01') &&
                                    <>
                                        <Text
                                            fontSize={'2xl'}
                                            fontWeight={'semibold'}
                                            mb={2}
                                        >
                                            Spedizione
                                        </Text>
                                        <Box

                                            display={['grid', 'flex']}
                                            gap={[2, 8]}
                                        >
                                            <Box>
                                                <Text
                                                    fontSize={'lg'}
                                                    fontWeight={'medium'}
                                                    mb={-1}
                                                >
                                                    Codice Spedizione
                                                </Text>
                                                <Text
                                                    fontSize={'md'}
                                                    fontWeight={'normal'}
                                                >
                                                    {order.shipping.code}
                                                </Text>
                                            </Box>
                                            <Box >
                                                <Text
                                                    fontSize={'lg'}
                                                    fontWeight={'medium'}
                                                    mb={-1}
                                                >
                                                    Corriere
                                                </Text>
                                                <Text
                                                    fontSize={'md'}
                                                    fontWeight={'normal'}
                                                >
                                                    {order.shipping.courier}
                                                </Text>
                                            </Box>
                                            {(order?.status === 'SHIP01' || order?.status === 'SHIP02') && <Button
                                                mx={'auto'}
                                                mr={0}
                                                mt={2}

                                                borderRadius={'md'}
                                                size={'xl'}
                                                padding={4}
                                                px={10}
                                                width={'fit-content'}
                                                height={'fit-content'}
                                                bg={'black.900'}
                                                color={'white'}

                                                _hover={{ bg: 'black.900' }}
                                                _focus={{
                                                    bg: 'black.900'
                                                }}
                                                onClick={() => setIsOpenHelpModal(true)}
                                                _active={{
                                                    transform: 'scale(0.98)',
                                                }}
                                            >Modifica</Button>}

                                        </Box>
                                        {order?.shipping?.url && <Link
                                            prefetch={false}
                                            href={order?.shipping?.url.startsWith("https://") ? order.shipping?.url : "https://" + order.shipping?.url}
                                            target="_blank"
                                            className='text-lg font-bold h-fit flex'
                                        >
                                            <Button
                                                margin={'auto'}
                                                width={'full'}
                                                mt={5}
                                                colorScheme='green'
                                            >
                                                Traccia il pacco
                                            </Button>
                                        </Link>}
                                    </>
                                }
                            </GrayBox>
                        </Box>
                    </>
                }
            </Desktop_Layout >

            <Modal_Help_Customer_Care isOpen={isOpenHelpModal} onClose={() => setIsOpenHelpModal(false)} />
        </>

    )
}

export default index