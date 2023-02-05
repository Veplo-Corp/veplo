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
                <ModalHeader
                    px={[4, 6]}
                    pb={1}>Info {shop.name}</ModalHeader>
                <ModalCloseButton size='lg'
                    px={[4, 6]}
                />
                <ModalBody pb={2}
                    px={[4, 6]}
                >
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
                        justifyContent='space-between'
                        mt={-0.5}
                    >
                        <p>
                            +39 {shop.phone}
                        </p>
                        <div className='flex'>
                            <a href={`tel:+39${shop.phone}`}
                                className='my-auto'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href={`https://wa.me/+39${shop.phone}?text=ciao, ero su Veplo.it e stavo visitando il tuo negozio ${shop.name}. Avrei bisogno di una informazione`} target="_blank"
                                className='my-auto m-2'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </Box>
                    <Box
                        fontWeight='semibold'
                        as='h2'
                        noOfLines={1}
                        fontSize='medium'
                        display={'flex'}
                        mt={1}
                    >
                        Indirizzo negozio
                    </Box>
                    <Box
                        fontWeight='normal'
                        as='h2'
                        noOfLines={1}
                        fontSize='small'
                        display={'flex'}
                        justifyContent='space-between'
                        mt={-0.5}
                    >
                        <p>
                            {shop.address.city}, {shop.address.street}
                        </p>
                        <a target="_blank" rel="noopener noreferrer" href={`https://www.google.it/maps/search/${shop.address.street.replaceAll(' ', '+') + ', ' + shop.address.city.replaceAll(' ', '+')}`}
                            className='my-auto m-2'

                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 hover:scale-95 cursor-pointer">
                                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                        </a>
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