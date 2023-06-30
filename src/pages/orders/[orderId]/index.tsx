import { Box, Button, Tag, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch, useSelector } from 'react-redux';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import Loading from '../../../../components/molecules/Loading';
import ProductVariationInOrder from '../../../../components/molecules/ProductVariationInOrder';
import { STATUS } from '../../../../components/mook/statusOrderUser';
import PriceAndShippingListingCost from '../../../../components/organisms/PriceAndShippingListingCost';
import createUrlSchema from '../../../../components/utils/create_url';
import { imageKitUrl } from '../../../../components/utils/imageKitUrl';
import toUpperCaseFirstLetter from '../../../../components/utils/uppercase_First_Letter';
import { Order } from '../../../interfaces/order.interface';
import { getDateFromMongoDBDate } from '../../../../components/utils/getDateFromMongoDBDate';
import ModalReausable from '../../../../components/organisms/ModalReausable';
import FormReturn from '../../../../components/molecules/FormReturn';
import { ToastOpen } from '../../../../components/utils/Toast';
import { useMutation } from '@apollo/client';
import RETURN_ORDER from '../../../lib/apollo/mutations/returnOrder';
import { setOrders } from '../../../store/reducers/orders';
import GrayBox from '../../../../components/atoms/GrayBox';
import Modal_Help_Customer_Care from '../../../../components/organisms/Modal_Help_Customer_Care';





const index = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const orders: Order[] = useSelector((state: any) => state.orders.orders);
    const [order, setOrder] = useState<Order>();
    const [orderStatus, setOrderStatus] = useState<{ text: string, color: string, background: string }>();
    const [loading, setLoading] = useState(true)
    const [isOpenModalReturn, setIsOpenModalReturn] = useState(false)
    const { addToast } = ToastOpen();
    const [isModalHelpOpen, setIsModalHelpOpen] = useState(false)
    const [returnOrder] = useMutation(RETURN_ORDER, {
        update(cache, el, query) {
            console.log(cache);
            console.log(el);
            console.log(query);
            const OrderCacheId = cache.identify({ id: query.variables?.returnOrderId, __typename: 'Order' })
            console.log(OrderCacheId);
            cache.modify({
                id: OrderCacheId, //productId
                fields: {
                    status(/* cachedvalue */) {
                        return "RET01"
                    },
                },
                broadcast: false // Include this to prevent automatic query refresh
            });
        }
    })

    useEffect(() => {
        const { orderId } = router.query
        if (!orderId || orders.length <= 0) return
        const order = orders.filter(order => order.id === orderId)[0]
        setOrder(order)
        handleStatus(order?.status)
    }, [router?.query, orders])

    console.log(order);

    const handleStatus = (orderStatus: string) => {
        const status = STATUS.find(status => status.code === orderStatus);
        if (!status) return
        setOrderStatus({
            text: status.text,
            color: status.color,
            background: status.background
        })
    }

    const handleSubmitButton = async (form: {
        orderCode: string,
        phone: string,
        email: string,
    }) => {
        //effettuare richiesta reso qui
        //mettere in RET01
        //creare collection per richiesta reso
        try {
            await returnOrder({
                variables: {
                    returnOrderId: order?.id
                }
            })
            console.log(form);
            setIsOpenModalReturn(false)
            setOrder(prevState => {
                if (!prevState) return
                return {
                    ...prevState,
                    status: "RET01"
                }
            })
            handleStatus("RET01")
            //cambia l'order status in Redux
            const newOrders = orders.map(order => {
                if (order.code === form.orderCode) {
                    return { ...order, ["status"]: "RET01" }
                }
                return order
            })
            dispatch(
                setOrders(newOrders)
            )
        } catch {
            //aggiungere errore chiamat
            // se superati più di 15 giorni
        }


    }

    return (
        <>
            {order ? (
                <Desktop_Layout>
                    {order && <div
                        className='w-full md:w-8/12 lg:9/12 xl:w-1/2 m-auto md:mt4'
                    >
                        {orderStatus &&
                            <Box
                                display={'flex'}
                            >
                                <Tag
                                    className='m-auto md:m-0'
                                    mt={[0, 4]}

                                    px={4}
                                    py={2}
                                    borderRadius={'full'}
                                    size={'lg'}
                                    color={orderStatus.color}
                                    background={orderStatus.background}
                                >
                                    {orderStatus.text}
                                </Tag>
                            </Box>
                        }


                        {order.status === 'RET01' &&
                            <div className='mt-4'>
                                <GrayBox>
                                    <Text
                                        fontSize={'2xl'}
                                        fontWeight={'semibold'}
                                        mb={2}
                                    >
                                        Come inviare il reso?
                                    </Text>
                                    <Text
                                        fontSize={'md'}
                                        fontWeight={'normal'}
                                        mb={0}
                                    >
                                        1. Compila la <Link
                                            className='underline'
                                            target="_blank" href="https://www.datocms-assets.com/102220/1686655555-modulo-reso.pdf"
                                        >nota reso</Link>
                                    </Text>
                                    <Text
                                        fontSize={'md'}
                                        fontWeight={'normal'}
                                        mb={0}
                                    >
                                        3. Inserisci l'indirizzo di spedizione: <strong>Aggiungi indirizzo negozio*</strong>
                                    </Text>
                                    <Text
                                        fontSize={'md'}
                                        fontWeight={'normal'}
                                        mb={0}
                                    >
                                        2. Invia il reso a: <strong>{order.shop.name}</strong>
                                    </Text>

                                    <Text
                                        fontSize={'sm'}
                                        fontWeight={'normal'}
                                        mt={4}
                                    >
                                        Per qualunque dubbio domanda consulta la <Link
                                            href={'/policies/reso-e-rimborsi'}
                                            className='underline cursor-pointer'
                                        >politica di reso</Link> o <span
                                            className='underline cursor-pointer'
                                            onClick={() => setIsModalHelpOpen(true)}
                                        >contattaci</span>
                                    </Text>

                                </GrayBox>
                            </div>

                        }

                        <Box
                            display={['', 'flex']}
                            justifyContent={'space-between'}
                            mt={4}
                        >
                            <Box
                                mb={2}
                            >
                                <Text
                                    fontWeight={'bold'}
                                    fontSize={['md']}
                                >
                                    Negozio
                                </Text>
                                <Text
                                    fontWeight={'medium'}
                                    fontSize={'md'}
                                    mt={0}
                                    mb={-1}
                                >
                                    {order?.shop.name}
                                </Text>
                                <Link
                                    prefetch={false}
                                    href={'/negozio/' + order?.shop.id + '/' + createUrlSchema([order?.shop.name])}
                                    className='text-sm font-semibold underline'
                                >
                                    vai al negozio
                                </Link>
                            </Box>
                            <Box
                                mb={2}
                            >
                                <Text
                                    fontWeight={'bold'}
                                    fontSize={'md'}
                                >
                                    {order.status === 'SHIP03' ? 'Ordine consegnato' : 'Ordine effettuato'}
                                </Text>
                                <Text
                                    fontWeight={'medium'}
                                    fontSize={'md'}
                                    mt={0}
                                    mb={-1}
                                >
                                    {order.status === 'SHIP03' ?
                                        getDateFromMongoDBDate(order.history.find(status => status.status === 'SHIP03')?.date)
                                        :
                                        getDateFromMongoDBDate(order.createdAt)
                                    }

                                </Text>
                            </Box>
                            <Box
                                mb={2}
                            >
                                <Text
                                    fontWeight={'bold'}
                                    fontSize={'md'}
                                >
                                    Consegna
                                </Text>
                                <Text
                                    fontWeight={'semibold'}
                                    fontSize={'md'}
                                    mt={0}
                                    mb={-1}
                                >
                                    {order.recipient.name}
                                </Text>
                                <Text
                                    fontWeight={'medium'}
                                    fontSize={'md'}
                                    mt={0}
                                    mb={-1}
                                >
                                    {order.recipient.address.city} ({order.recipient.address.postalCode}), {order.recipient.address.line1}
                                </Text>
                            </Box>

                        </Box>

                        <Box
                            mt={[4, 2]}
                            fontWeight={'medium'}
                            display={'flex'}
                        >
                            <Text fontWeight={'semibold'} mr={1}>ORDINE: </Text>{order.code}
                        </Box>
                        <VStack
                            mt={[6, 4]}
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

                        {order.shipping?.url && <Link
                            prefetch={false}
                            href={order.shipping?.url.startsWith("https://") ? order.shipping?.url : "https://" + order.shipping?.url}
                            target="_blank"
                            className='text-lg font-bold h-fit flex'

                        >
                            <Button
                                margin={'auto'}
                                width={'full'}
                                mt={5}

                            >
                                Traccia il mio pacco
                            </Button>
                        </Link>}
                        {
                            order.status === 'SHIP03' &&
                            <Box
                                display={'flex'}
                                gap={2}
                                mt={5}
                            >
                                <Text
                                    my={'auto'}
                                    fontSize={'md'}
                                    fontWeight={'medium'}

                                >
                                    Vuoi effettuare il reso?
                                </Text>
                                <Button
                                    my={'auto'}
                                    onClick={() => { setIsOpenModalReturn(true) }}
                                    borderRadius={'md'}
                                    size={'md'}

                                    variant='link'
                                    type={'submit'}
                                    colorScheme='black'
                                >Invia richiesta</Button>
                            </Box>
                        }


                    </div>}
                </Desktop_Layout >
            ) :
                (
                    <Box
                        minHeight={'100vh'}
                    >
                        <Loading />

                    </Box>
                )
            }
            <ModalReausable title='' closeModal={() => setIsOpenModalReturn(false)} isOpen={isOpenModalReturn}>
                <FormReturn
                    handleSubmitButton={handleSubmitButton}

                    email={order?.user.email} orderCode={order?.code} phone={order?.recipient.phone} />
            </ModalReausable>
            <Modal_Help_Customer_Care
                isOpen={isModalHelpOpen}
                onClose={() => setIsModalHelpOpen(false)}
            />
        </>

    )
}

export default index