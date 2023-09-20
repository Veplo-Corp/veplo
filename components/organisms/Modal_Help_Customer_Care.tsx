import { EmailIcon } from '@chakra-ui/icons'
import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React, { FC } from 'react'
import ModalReausable from './ModalReausable'
import ButtonClose from '../atoms/ButtonClose'
import { useForm } from 'react-hook-form'
import { Mail, PhoneOutcome, SendMail } from 'iconoir-react'


const Modal_Help_Customer_Care: FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose, }) => {

    return (
        <Modal isOpen={isOpen} onClose={onClose}
            size={['sm', '3xl']}
        >
            <ModalOverlay />
            <ModalContent
                mx={[2, 0]}
                p={[3, 5]}
                pt={[5, 8]}
                borderRadius={'3xl'}
                pb={[5, 12]}
            >
                <ModalHeader
                    display={'flex'}
                    justifyContent={'space-between'}

                    pb={[-10, 0]}
                >

                    <Text
                        my={'auto'}
                        fontSize={'lg'}
                        fontWeight={'bold'}
                    >


                    </Text>

                    <ButtonClose handleEvent={onClose} />
                </ModalHeader>

                <ModalBody
                    mt={[-5, 0]}
                >
                    <Box
                        display={['grid', 'flex']}
                        gap={10}
                        justifyContent={'space-between'}
                    >
                        <Box>
                            <Mail
                                className='w-12 h-12 lg:w-18 lg:h-18'
                                strokeWidth={1.5}
                            />
                            <Text
                                fontSize={'lg'}
                                fontWeight={'extrabold'}
                                mt={2}
                            >
                                <Link
                                    prefetch={false}
                                    href="mailto:business@veplo.it"
                                    target="_blank" rel="noopener noreferrer"
                                >
                                    Scrivici
                                </Link>
                            </Text>
                            <Text
                                fontSize={'sm'}
                                mb={2}
                            >
                                Risponderemo il prima possibile
                            </Text>
                            <Text
                                fontSize={['md', 'lg']}
                                fontWeight={'medium'}
                            >
                                <Link
                                    prefetch={false}
                                    href="mailto:info@veplo.it"
                                    target="_blank" rel="noopener noreferrer"
                                >
                                    clienti: info@veplo.it
                                </Link>
                            </Text>
                            <Text
                                fontSize={['md', 'lg']}
                                fontWeight={'medium'}
                            >
                                <Link
                                    prefetch={false}
                                    href="mailto:business@veplo.it"
                                    target="_blank" rel="noopener noreferrer"
                                >
                                    negozi: business@veplo.it
                                </Link>
                            </Text>
                        </Box>
                        <Box>
                            <PhoneOutcome
                                className='w-12 h-12 lg:w-18 lg:h-18'
                                strokeWidth={1.5}
                            />
                            <Text
                                fontSize={'lg'}
                                fontWeight={'extrabold'}
                                mt={2}
                            >
                                <Link
                                    prefetch={false}
                                    href="mailto:business@veplo.it"
                                    target="_blank" rel="noopener noreferrer"
                                >
                                    Chiamaci
                                </Link>
                            </Text>
                            <Text
                                fontSize={'sm'}
                                mb={2}
                            >
                                dal lunedì al venerdì dalle 09:00 alle 18:00
                            </Text>

                            <Text
                                fontSize={['md', 'lg']}
                                fontWeight={'medium'}
                            >
                                <Link href="tel:+393518392262"
                                >
                                    +39 3518392262
                                </Link>
                            </Text>
                        </Box>
                    </Box>
                </ModalBody >

            </ModalContent >
        </Modal >
    )
}

export default Modal_Help_Customer_Care



// <div className='w-full flex justify-between'>
//                         <p>Invia una mail a:</p>
//                         <Link
//                             prefetch={false}
//                             href="mailto:business@veplo.it"
//                             target="_blank" rel="noopener noreferrer"
//                             className='text-blue-700 underline'
//                         >

//                             business@veplo.it
//                         </Link>
//                     </div>
//                     <div className='w-full flex justify-between mt-4'>
//                         <p>Scrivi o chiama:</p>
//                         {/* <Link href="https://wa.me/+393518392262" >
//                         <a
//                             target="_blank" rel="noopener noreferrer"
//                             className='text-blue-700 underline'
//                         >+39 3518392262
//                         </a>
//                     </Link> */}
//                         <p > +39 3518392262</p >
//                     </div > 