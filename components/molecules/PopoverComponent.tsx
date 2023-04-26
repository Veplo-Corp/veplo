import { Box, Text } from '@chakra-ui/react'
import { Popover, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import React, { FC, Fragment } from 'react'

interface ActionsPopover {
    icon: any,
    title: string,
    description?: string,
    handleClick: () => void
}

const PopoverComponent: FC<{ icon: any, actionsPopover: ActionsPopover[] }> = ({ icon, actionsPopover }) => {
    const router = useRouter()
    return (
        <Popover className="relative">
            <Popover.Button
                type='button'
                aria-label="user"
                className='w-10 h-10 flex rounded-full p-2 border-[#DFDFDF]
                border focus:outline-none  
                '


            >
                {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 my-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg> */}
                {icon}
            </Popover.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Popover.Panel
                    className="absolute grid grid-cols-1 mt-1 cursor-pointer z-10 w-48 md:w-52 right-0.5 py-4 bg-white border border-gray-200 rounded-xl">

                    {actionsPopover.map((action, index) => {
                        return (
                            <Popover.Button key={index} className='text-left  px-4 '>
                                <Box
                                    display={'flex'}
                                    textAlign={'start'}
                                    gap={2.5}
                                    onClick={action.handleClick}
                                >
                                    {action.icon}
                                    <Box className='w-10/12'>
                                        <Text
                                            className='my-auto'
                                            fontWeight={['semibold', 'semibold']}
                                            fontSize={['md', 'md']}
                                        >
                                            {action.title}
                                        </Text>
                                    </Box>
                                </Box>


                            </Popover.Button>
                        )
                    })}



                </Popover.Panel>
            </Transition>


        </Popover >
    )
}

export default PopoverComponent