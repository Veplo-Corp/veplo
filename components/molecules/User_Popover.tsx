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



const User_Popover = () => {

    const router = useRouter();
    const user: Firebase_User = useSelector((state: any) => state?.user.user);



    const actionsNotLogged = [
        {
            name: 'Accedi',
            description: 'accedi al tuo account',
            href: '/user/login?type=login',
        },
        {
            name: 'Registrati',
            description: 'registrati per poter usufruire di tutti i servizi',
            href: '/user/login?type=registration',
        },
        {
            name: 'Sei un negozio?',
            description: 'accedi o registra gratis il tuo account',
            href: '/shop/login?type=login',
        },
    ]

    const actionsLogged = [
        {
            name: 'Impostazioni',
            description: 'gestisci le impostazioni',
            href: '/user/settings',
        },
        {
            name: 'Monitora ordini',
            description: 'vedi i tuoi ordini',
            href: undefined,
        },
        {
            name: 'Esci',
            description: 'disconnetti accont',
            href: '/user/login?type=login',
        },

    ]

    return (
        <Popover className="relative">
            <Popover.Button
                type='button'
                aria-label="user"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-9 h-9 md:w-10 md:h-10  text-gray-900`}>
                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                </svg>
            </Popover.Button>
            <Popover.Panel
                className="absolute grid grid-cols-1 cursor-pointer z-10 w-52 right-0.5 py-4 bg-gray-50 border border-gray-200 rounded-xl">
                {user?.userInfo?.name &&
                    <div className='mb-1'>
                        <Text
                            px={4}
                            fontWeight={'bold'}
                        >
                            Ciao {user?.userInfo?.name}!
                        </Text>
                        <Text
                            fontWeight={'normal'}
                            fontSize={'xs'}
                            color={'gray.500'}
                            px={4}
                            mb={2}
                            mt={-1}
                        >
                            {user.email}
                        </Text>
                        <Divider />
                    </div>
                }

                {!user ?
                    (actionsNotLogged.map((action, id) => {
                        return (
                            <Popover.Button key={id} className='text-left hover:scale-[0.98] px-4 py-[4px] pt-[8px]'>
                                <Box

                                    onClick={() => {
                                        router.push(action.href)
                                    }}
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
                            </Popover.Button>
                        )
                    })) : (actionsLogged.map((action, id) => {
                        return (
                            <Popover.Button key={id} className='text-left hover:scale-[0.98] px-4 pt-[8px]'>
                                <Box
                                    onClick={async () => {
                                        if (!action.href) return
                                        router.push(action.href)
                                        if (action.name === 'Disconnetti') {
                                            await signOut(auth)
                                            deleteAuthTokenInSessionStorage()
                                        }
                                    }}
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
                            </Popover.Button>
                        )
                    }))}

            </Popover.Panel>
        </Popover >
    )
}

export default User_Popover