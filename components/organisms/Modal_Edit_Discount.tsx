import { Button, CircularProgress, Input, InputGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React, { FC, useState } from 'react'
import Div_input_creation from '../atoms/Div_input_creation'
import { onChangeNumberPrice } from '../utils/onChangePrice';

const Modal_Edit_Discount: FC<{ isOpen: boolean, onConfirm: () => void, onClose: () => void, loading: boolean }> = ({ isOpen, onConfirm, onClose, loading }) => {
    const [priceDiscounted, setpriceDiscounted] = useState<any>(120);
    const [discount, setDiscount] = useState<any>(0);

    const onChangePrice = (e: any) => {
        const price = onChangeNumberPrice(e)
        if (Number(price) > 120) {
            setDiscount('0')
            return setpriceDiscounted(120)
        }
        setpriceDiscounted(price)
        const discount = ((120 - Number(price.replace(',', '.'))) / 120 * 100).toFixed(2).replace('.', ',')
        setDiscount(discount)
    }



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
                                value={120}
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
                            onConfirm()
                        }}
                        disabled={loading}
                        _disabled={{
                            opacity: '1',
                        }}
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