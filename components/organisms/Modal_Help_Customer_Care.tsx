import { EmailIcon } from '@chakra-ui/icons'
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import Link from 'next/link'
import React, { FC } from 'react'

const Modal_Help_Customer_Care: FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose, }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}
            size={['xs', 'sm']}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Assistenza Negozi</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <div className='w-full flex justify-between'>
                        <p>Invia una mail a:</p>
                        <Link
                            prefetch={false}
                            href="mailto:business@veplo.it"
                            target="_blank" rel="noopener noreferrer"
                            className='text-blue-700 underline'
                        >

                            business@veplo.it
                        </Link>
                    </div>
                    <div className='w-full flex justify-between mt-4'>
                        <p>Scrivi o chiama:</p>
                        {/* <Link href="https://wa.me/+393403033922" >
                            <a
                                target="_blank" rel="noopener noreferrer"
                                className='text-blue-700 underline'
                            >+39 3403033922
                            </a>
                        </Link> */}
                        <p>+39 3403033922</p>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button onClick={onClose}>Chiudi</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default Modal_Help_Customer_Care