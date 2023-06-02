import { Button } from '@chakra-ui/react'
import { Dialog, Transition } from '@headlessui/react'
import React, { useEffect } from 'react'
import { Fragment, useState } from 'react'

export interface ErrorModal {
    title: string,
    description: string,
    closeText: string,
    openModalMath: number,
    confirmText?: string,
    handleEvent?: any,
    data?: any
}

const Modal_Error_Shop: React.FC<ErrorModal> = ({ title, description, closeText, confirmText, openModalMath, handleEvent, data }) => {
    let [isOpen, setIsOpen] = useState(false)

    function closeModal() {
        setIsOpen(false)
    }

    useEffect(() => {
        if (openModalMath !== 1 && openModalMath !== undefined) {
            setIsOpen(true)
        }
    }, [openModalMath])

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    {title}
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        {description}
                                    </p>
                                </div>
                                <div className='flex '>
                                    <div className="mt-4 m-auto mr-2">
                                        <Button
                                            colorScheme={'black'}
                                            variant='outline'
                                            onClick={closeModal}
                                        >
                                            {closeText}
                                        </Button>
                                    </div>
                                    {confirmText && confirmText.length > 0 &&
                                        <div className="mt-4">
                                            <Button
                                                onClick={() => {
                                                    handleEvent(data)
                                                    closeModal()
                                                }}
                                                colorScheme={'red'}
                                            >
                                                {confirmText}
                                            </Button>
                                        </div>
                                    }
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default Modal_Error_Shop