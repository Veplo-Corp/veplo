import React, { Fragment, useState } from 'react'
import Circle_Color from '../atoms/Circle_Color'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Box, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { Firebase_User } from '../../src/interfaces/firebase_user.interface'
import { signOut } from 'firebase/auth'
import { auth } from '../../src/config/firebase'
import { deleteAuthTokenInSessionStorage } from '../utils/deleteAuthTokenSessionStorage'
import { Divider } from '@chakra-ui/react'
import { NavArrowRight, User } from 'iconoir-react'



const User_Popover = () => {

    const router = useRouter();
    const user: Firebase_User = useSelector((state: any) => state?.user.user);


    const actionsNotLogged = [
        {
            name: 'Accedi',
            description: 'accedi al tuo account',
            href: '/user/login?type=login&person=user',
        },
        {
            name: 'Registrati',
            description: 'registrati per poter usufruire di tutti i servizi',
            href: '/user/login?type=registration&person=user',
        },
        {
            name: 'Sei un brand?',
            //description: 'accedi o registra gratis il tuo account',
            href: '/user/login?type=login&person=business',
        },
    ]

    const actionsLogged = [
        {
            name: 'Monitora ordini',
            description: 'vedi i tuoi ordini',
            href: '/orders',
        },
        {
            name: 'Seguiti',
            description: 'i tuoi seguiti',
            href: '/profili/seguiti',
        },
        {
            name: 'Impostazioni',
            description: 'gestisci le impostazioni',
            href: '/user/settings',
        },
        {
            name: 'Esci',
            description: 'disconnetti accont',
            href: '/user/login?type=login&person=user',
        },

    ]

    return (
        <Popover className="relative">
            <Popover.Button
                type='button'
                aria-label="user"
                className='bg-[#F2F2F2] rounded-full p-2 focus:outline-none'
            >
                {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 my-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg> */}
                <User
                    strokeWidth={2}
                    className="w-6 h-6 my-auto"
                />
            </Popover.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-400"
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
                    className="absolute grid grid-cols-1 cursor-pointer z-10 w-52 mt-2 right-0.5 py-4 bg-white border border-white rounded-[20px]">
                    {user?.userInfo?.name &&
                        <div className='mb-1'>
                            <Text
                                px={4}
                                fontWeight={'bold'}
                                mb={2}
                            >
                                Ciao {user?.userInfo?.name}!
                            </Text>
                            {/* <Text
                            fontWeight={'normal'}
                            fontSize={'xs'}
                            color={'gray.500'}
                            px={4}
                            mb={2}
                            mt={-1}
                        >
                            {user.email}
                        </Text> */}
                            <Divider />
                        </div>
                    }

                    {!user?.uid ?
                        (actionsNotLogged.map((action, id) => {
                            return (
                                <Popover.Button key={id} className='text-left focus:scale-[0.99] '>
                                    <Box
                                        display={'flex'}
                                        justifyContent={'space-between'}
                                        onClick={() => {
                                            router.push(action.href)
                                        }}
                                    >
                                        <Box
                                            width={'75%'}
                                            paddingX={4}
                                            paddingY={1.5}

                                        >
                                            <Box
                                                fontSize={'md'}
                                                fontWeight={'medium'}
                                                lineHeight={'none'}
                                                mb={'0.5'}
                                            >
                                                {action.name}
                                            </Box>
                                            <Box
                                                fontSize={'2xs'}
                                                fontWeight={'base'}
                                                lineHeight={'1.1'}
                                                color={'gray.400'}
                                            >
                                                {action.description}
                                            </Box>
                                        </Box>
                                        {/* <NavArrowRight

                                            className='w-7 my-auto mr-2'
                                            strokeWidth={1.8}
                                        /> */}
                                    </Box>

                                </Popover.Button>
                            )
                        })) : (actionsLogged.map((action, id) => {
                            return (
                                <Popover.Button key={id} className='text-left focus:scale-[0.99]'>
                                    <Box
                                        display={'flex'}
                                        justifyContent={'space-between'}

                                        onClick={async () => {
                                            if (action.name === 'Esci') {
                                                await signOut(auth)

                                                deleteAuthTokenInSessionStorage()
                                                setTimeout(() => {
                                                    router.reload()
                                                }, 1000);
                                            }
                                            if (!action.href) return
                                            router.push(action.href)
                                        }}
                                    >
                                        <Box
                                            width={'75%'}
                                            paddingX={4}
                                            paddingY={1.5}

                                        >
                                            <Box
                                                fontSize={'md'}
                                                fontWeight={'medium'}
                                                lineHeight={'none'}
                                                mb={'0.5'}
                                            >
                                                {action.name}
                                            </Box>
                                            <Box
                                                fontSize={'2xs'}
                                                fontWeight={'base'}
                                                lineHeight={'1.1'}
                                                color={'gray.400'}
                                            >
                                                {action.description}
                                            </Box>
                                        </Box>
                                        {/* <NavArrowRight

                                            className='w-7 my-auto mr-2'
                                            strokeWidth={1.8}
                                        /> */}
                                    </Box>

                                </Popover.Button>
                            )
                        }))}

                </Popover.Panel>
            </Transition>

        </Popover >
    )
}

export default User_Popover