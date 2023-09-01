import { Box, Text } from '@chakra-ui/react'
import { Popover, Transition } from '@headlessui/react'
import { MoreHoriz } from 'iconoir-react'
import { useRouter } from 'next/router'
import React, { FC, Fragment } from 'react'

export interface ActionsPopover {
    icon: any,
    title: string,
    description?: string,
    handleClick: () => void
}

const PopoverComponent: FC<{ icon: any, actionsPopover: ActionsPopover[] }> = ({ icon, actionsPopover }) => {

    return (
        <Popover className="relative">
            <Popover.Button
                type='button'
                aria-label="user"
                className='w-9 h-9 md:w-12 md:h-12 rounded-full p-1.5 md:p-2 border-[#DFDFDF] border focus:outline-none'
            >


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
                    style={{
                        boxShadow: "0px 0px 20px 0px rgba(144, 144, 144, 0.25)",
                    }}
                    className="absolute grid grid-cols-1 gap-1.5 cursor-pointer z-10 w-52 mt-2 right-0.5 py-4 bg-white border border-white rounded-[20px]">
                    {actionsPopover.map((action, index) => {
                        return (
                            <Popover.Button key={index} className='text-left  px-4 '>
                                <Box
                                    py={1.5}
                                    display={'flex'}
                                    textAlign={'start'}
                                    gap={2}
                                    onClick={action.handleClick}
                                    color={'primaryBlack.text'}
                                >
                                    {action.icon}
                                    <Box className='w-10/12 my-auto mb-0'>
                                        <Text
                                            className=''
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