import { Box, Button, IconButton, Text } from '@chakra-ui/react'
import { Dialog, Transition } from '@headlessui/react'
import React, { useEffect } from 'react'
import { Fragment, useState } from 'react'

export interface ErrorModal {
    title: string,
    closeModal: () => void,
    children?: any,
    isOpen: boolean,
    positionTopModal?: boolean
}

const ModalReausable: React.FC<ErrorModal> = ({ title, closeModal, children, isOpen, positionTopModal }) => {

    function handleCloseButton() {
        closeModal()
    }


    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleCloseButton}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className={`flex ${positionTopModal ? 'min-h-fit mt-32' : 'min-h-full'} items-center justify-center p-4 text-center`}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className={`w-full ${positionTopModal ? 'w-fit' : 'max-w-md'}  transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}>
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between"
                                >
                                    <Text
                                        fontSize={'xl'}
                                        fontWeight={`${positionTopModal ? 'bold' : 'medium'}`}
                                        marginY={'auto'}
                                    >
                                        {title}
                                    </Text>
                                    <Box
                                        cursor={'pointer'}
                                    >
                                        <svg

                                            onClick={closeModal}
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </Box>


                                </Dialog.Title>
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default ModalReausable