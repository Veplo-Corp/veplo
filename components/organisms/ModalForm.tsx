import { Box, Button, IconButton, Text } from '@chakra-ui/react'
import { Dialog, Transition } from '@headlessui/react'
import React, { useEffect } from 'react'
import { Fragment, useState } from 'react'

export interface ErrorModal {
    closeModal: () => void,
    children?: any,
    isOpen: boolean,
    positionTopModal?: boolean
}

const ModalForm: React.FC<ErrorModal> = ({ closeModal, children, isOpen, positionTopModal }) => {

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
                    <div className={`flex ${positionTopModal ? 'min-h-full md:min-h-fit md:mt-32' : 'min-h-full'} items-center justify-center p-4 text-center`}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className={`w-full ${positionTopModal ? 'w-full md:w-fit' : 'max-w-md'}  transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all`}>

                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default ModalForm