import { Box, Button, CircularProgress, Input, InputGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React, { FC, useLayoutEffect, useState } from 'react'
import Div_input_creation from '../atoms/Div_input_creation'
import { onChangeNumberPrice } from '../utils/onChangePrice';

const Modal_Edit_Discount: FC<{ isOpen: boolean, onConfirm: any, onClose: () => void, deleteDiscount: () => void, loading: boolean; price: { v1: number, v2: number | null, discountPercentage: number | null } }> = ({ isOpen, onConfirm, deleteDiscount, onClose, loading, price }) => {

    const [priceNoDiscount, setPriceNoDiscount] = useState<any>('0');
    const [priceDiscounted, setpriceDiscounted] = useState<any>(0);
    const [discount, setDiscount] = useState<any>(0);


    const onChangePrice = (e: any) => {
        const price = onChangeNumberPrice(e)
        if (Number(price) > priceNoDiscount) {
            setDiscount('0')
            return setpriceDiscounted(priceNoDiscount)
        }
        setpriceDiscounted(price)
        const discount = ((priceNoDiscount - Number(price.replace(',', '.'))) / priceNoDiscount * 100).toFixed(2).replace('.', ',')
        setDiscount(discount)
    }

    useLayoutEffect(() => {
        console.log(price);
        
        setPriceNoDiscount(price.v1)
        if (price.v2 && price.discountPercentage) {
            setpriceDiscounted(price.v2)
            setDiscount(price.discountPercentage)
        } else {
            setpriceDiscounted(0)
            setDiscount(0)
        }
    }, [price.v1])



    return (
        <Modal isOpen={isOpen} onClose={onClose}
            size={['xs', 'sm']}

        >
            <ModalOverlay

            />
            <ModalContent
                borderRadius={'xl'}
            >
                <ModalHeader>Gestisci sconto</ModalHeader>
                <ModalCloseButton
                    onClick={onClose}
                />
                <ModalBody>
                    <Div_input_creation text='Prezzo prodotto'>
                        <InputGroup >
                            <Input
                                _disabled={{
                                    opacity: '1',
                                    background: 'gray.200'
                                }}
                                autoComplete='off'
                                maxLength={40}
                                rounded={10}
                                paddingY={6}
                                type="text"
                                disabled={true}
                                isInvalid={false}
                                value={priceNoDiscount}
                            />
                        </InputGroup>
                    </Div_input_creation>
                    <Div_input_creation text='Prezzo scontato'>
                        <InputGroup >
                            <Input
                                autoComplete='off'
                                maxLength={40}
                                rounded={10}
                                paddingY={6}
                                type="text"
                                isInvalid={false}
                                value={priceDiscounted}
                                onChange={onChangePrice}
                            />
                        </InputGroup>
                    </Div_input_creation>
                    <Div_input_creation text='Percentuale sconto applicato'>
                        <InputGroup >
                            <Input
                                autoComplete='off'
                                maxLength={40}
                                rounded={10}
                                paddingY={6}
                                type="text"
                                isInvalid={false}
                                value={discount + '%'}
                                disabled={true}
                                _disabled={{
                                    opacity: '1',
                                }}
                            />
                        </InputGroup>
                    </Div_input_creation>
                    {price.discountPercentage && <Box
                        onClick={() =>
                            deleteDiscount()
                        }
                        as='h4'
                        fontSize={['xs', 'xs']}
                        color={'green.600'}
                        lineHeight='none'
                        noOfLines={1}
                        my={'2'}
                        
                        textColor={'red.600'}
                        className='cursor-pointer'
                    >
                        elimina sconto al prodotto
                    </Box>}
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='red' variant={'outline'} mr={3} onClick={() => {
                        onClose()
                    }}>
                        Chiudi
                    </Button>
                    <Button colorScheme='green'
                        width={'36'}
                        onClick={() => {
                            onConfirm(
                                priceNoDiscount,
                                priceDiscounted,
                                discount
                            )
                        }}
                        disabled={loading || Number(priceDiscounted) <= 0}
                    // _disabled={{
                    //     opacity: '1',
                    // }}
                    >
                        {loading ?
                            (
                                <CircularProgress
                                    size='25px'
                                    isIndeterminate
                                    color='green.300'
                                />
                            ) :
                            (
                                <span>Conferma</span>
                            )
                        }
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default Modal_Edit_Discount