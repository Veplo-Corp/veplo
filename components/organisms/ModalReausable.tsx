import { Box, Button, IconButton, Text } from '@chakra-ui/react'
import { Dialog, Transition } from '@headlessui/react'
import React, { memo, useEffect } from 'react'
import { Fragment, useState } from 'react'
import ButtonClose from '../atoms/ButtonClose'

export interface ErrorModal {
    title: string,
    closeModal: () => void,
    children?: any,
    isOpen: boolean,
    positionTopModal?: boolean,
    marginTop?: number
}

const ModalReausable: React.FC<ErrorModal> = ({ title, closeModal, children, isOpen, positionTopModal, marginTop }) => {






    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50"
                onClose={closeModal}>
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
                <div className="fixed inset-0 overflow-y-auto ">
                    <div className={`flex ${positionTopModal ? 'min-h-full md:min-h-fit' : 'min-h-full'} ${marginTop ? `md:mt-${marginTop}` : ''} items-center justify-center p-3 text-center`}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className={`w-full ${positionTopModal ? 'w-full md:w-fit' : 'max-w-md'}  transform overflow-hidden rounded-2xl bg-white p-6 px-4 md:px-6 text-left align-middle shadow-xl transition-all`}>
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between"
                                >
                                    <Text
                                        fontSize={'xl'}
                                        fontWeight={`${positionTopModal ? 'bold' : 'semibold'}`}
                                        marginY={'auto'}
                                    >
                                        {title}
                                    </Text>
                                    <Box
                                        cursor={'pointer'}
                                    >
                                        <ButtonClose
                                            handleEvent={closeModal}
                                        />
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