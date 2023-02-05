import React, { FC } from 'react'
import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import { Shop } from '../../src/interfaces/shop.interface'
import { DAYS } from '../mook/days'

const Modal_Info_Store: FC<{ isOpen: boolean, onClose: () => void, shop: Shop }> = ({ isOpen, onClose, shop }) => {


    return (
        <Modal isOpen={isOpen} onClose={onClose}
            size={['xs', 'sm']}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader pb={1}>Info {shop.name}</ModalHeader>
                <ModalCloseButton size='lg' />
                <ModalBody pb={2}>
                    <Box
                        fontWeight='semibold'
                        as='h2'
                        noOfLines={1}
                        fontSize='medium'
                        display={'flex'}
                    >
                        Giorni di apertura
                    </Box>
                    <Box
                        fontWeight='normal'
                        as='h2'
                        noOfLines={1}
                        fontSize='small'
                        display={'flex'}
                        mt={-0.5}
                    >
                        {shop.opening.days.map((dayNumber) => { return DAYS.find(day => day.id === dayNumber.toString())?.name }).join(', ')}
                    </Box>
                    <Box
                        fontWeight='semibold'
                        as='h2'
                        noOfLines={1}
                        fontSize='medium'
                        display={'flex'}
                        mt={1}
                    >
                        Orario di apertura
                    </Box>
                    <Box
                        fontWeight='normal'
                        as='h2'
                        noOfLines={1}
                        fontSize='small'
                        display={'flex'}
                        mt={-0.5}
                    >
                        {shop.opening.hours[0]} - {shop.opening.hours[1]}
                    </Box>
                    <Box
                        fontWeight='semibold'
                        as='h2'
                        noOfLines={1}
                        fontSize='medium'
                        display={'flex'}
                        mt={1}
                    >
                        Numero di telefono
                    </Box>
                    <Box
                        fontWeight='normal'
                        as='h2'
                        noOfLines={1}
                        fontSize='small'
                        display={'flex'}
                        mt={-0.5}
                    >
                        +39 {shop.phone}
                    </Box>
                </ModalBody>

                <ModalFooter>
                    <Button onClick={onClose}>Chiudi</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default Modal_Info_Store