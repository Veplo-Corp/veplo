import { Box, Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { signOut } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth } from '../../src/config/firebase'
import { Tooltip } from '@chakra-ui/react'
import Verified_Email from '../molecules/Verified_Email/Verified_Email'
import { useRouter } from 'next/router'
import MobileDetect from 'mobile-detect'
import { deleteAuthTokenInSessionStorage } from '../utils/deleteAuthTokenSessionStorage'
import Modal_Help_Customer_Care from './Modal_Help_Customer_Care'
import { Firebase_User } from '../../src/interfaces/firebase_user.interface'
import { useSelector } from 'react-redux'
import { deleteFavouriteShopFromLocalStorage } from '../utils/deleteShopFavourite'



const Drawer_Menu: React.FC<{ user: any, isOpen: boolean, closeDrawer: () => void }> = ({ user, isOpen, closeDrawer }) => {

    const userDispatch: Firebase_User = useSelector((state: any) => state.user.user);

    const listShop = [
        {
            title: `monitora ordini`,
            url: `/shop/home/${userDispatch?.favouriteShop?.id}/ordini?statusOrder=tutti`
        },
        {
            title: 'visualizza prodotti',
            url: `/shop/home/${userDispatch?.favouriteShop?.id}/prodotti`
        },
        {
            title: 'aggiungi prodotto',
            url: `/shop/home/${userDispatch?.favouriteShop?.id}/crea-prodotto`
        },

        {
            title: `info negozio`,
            url: `/shop/home/${userDispatch?.favouriteShop?.id}/info-generali`
        }
    ]

    const list = [
        {
            title: 'cambia negozio',
            url: '/shop/home'
        },
        {
            title: 'dettagli società',
            url: '/shop/home/info-generali-account'
        },
    ]

    const router = useRouter()
    const [isOpenHelpModal, setIsOpenHelpModal] = useState(false)



    const logout = async () => {
        await signOut(auth);
        deleteAuthTokenInSessionStorage()
        deleteFavouriteShopFromLocalStorage()

        //set OpenModal 1 in Header
        router.push('/user/login?type=login&person=business')
        closeDrawer()
    }




    return (
        <Drawer
            isOpen={isOpen}
            placement='right'
            size={['xs', 'sm']}
            onClose={closeDrawer}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton size={'lg'} mt={'0'} />
                <DrawerHeader borderWidth={0} borderBottomWidth={1} borderColor={'gray.200'} py={'3'} px={4}>Menu</DrawerHeader>
                <DrawerBody px={4} py={3}>
                    <Box overflow='hidden'>
                        <Tooltip label={!user.emailVerified ? 'email non verificata' : 'email verificata'}>
                            <Box
                                mt='1'
                                fontWeight='semibold'
                                as='h4'
                                lineHeight='tight'
                                display={'flex'}
                            >
                                {user.email}

                                {user.emailVerified && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="my-auto ml-1 w-4 h-4 text-green-600">
                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                </svg>}
                            </Box>
                        </Tooltip>
                        <Box
                            fontWeight='thin'
                            as='i'
                            lineHeight='none'
                            noOfLines={1}
                            fontSize={'small'}
                            display={'flex'}
                            mb={6}
                        >
                            account creato in data: {user.createdAt}
                        </Box>

                        {userDispatch.favouriteShop &&
                            <Box
                                bgColor={'gray.100'}
                                padding={4}
                                borderRadius={'md'}
                            >
                                <Text
                                    fontSize={'lg'}
                                    fontWeight={'bold'}
                                >
                                    {userDispatch.favouriteShop?.name.toUpperCase()}
                                </Text>
                                <Text
                                    fontSize={'sm'}
                                    fontWeight={'normal'}
                                    marginBottom={3}
                                    mt={-1}
                                >
                                    {userDispatch.favouriteShop?.street}
                                </Text>
                                <VStack
                                    spacing={[4, 3]}
                                    align='stretch'
                                >
                                    {listShop.map(element => {
                                        return (<Box
                                            key={element.title}
                                            _active={{
                                                transform: `scale(0.99)`,
                                            }}

                                            fontWeight='semibold'
                                            lineHeight='none'

                                            fontSize={'mg'}
                                            display={'flex'}
                                            className={'cursor-pointer hover:underline'}
                                            onClick={() => {

                                                router.push(element.url)
                                                closeDrawer()
                                            }}
                                        >
                                            <p className='my-auto '>
                                                {element.title}
                                            </p>
                                        </Box>)
                                    })}
                                </VStack>
                            </Box>
                        }
                        <Box
                            bgColor={'gray.100'}
                            padding={4}
                            borderRadius={'md'}
                            mt={4}
                        >
                            <Text
                                fontSize={'lg'}
                                fontWeight={'bold'}
                                marginBottom={'2'}
                            >
                                Dettagli account
                            </Text>
                            <VStack
                                spacing={[4, 3]}
                                align='stretch'
                            >
                                {list.map(element => {
                                    return (<Box
                                        key={element.title}
                                        _active={{
                                            transform: `scale(0.99)`,
                                        }}

                                        fontWeight='semibold'
                                        lineHeight='none'
                                        fontSize={'mg'}
                                        display={'flex'}
                                        className={'cursor-pointer hover:underline'}
                                        onClick={() => {

                                            router.push(element.url)
                                            closeDrawer()
                                        }}
                                    >
                                        <p className='my-auto '>
                                            {element.title}
                                        </p>
                                    </Box>)
                                })}
                            </VStack>
                        </Box>
                    </Box>

                </DrawerBody>

                <DrawerFooter /*  */
                    position={'absolute'}
                    className='bottom-0'
                    padding={0}
                    width={'full'}
                >
                    <div
                        className='text-center w-full '
                    >
                        <Button
                            variant="secondary"
                            className='w-11/12 m-auto mb-4 '
                            onClick={() => {
                                setIsOpenHelpModal(true)
                            }}>
                            Hai bisogno di assistenza?
                        </Button>
                        <Button

                            className='w-11/12 m-auto mb-4 ' onClick={logout}>
                            Disconnetti Account
                        </Button>
                    </div>
                </DrawerFooter>
            </DrawerContent>
            <Modal_Help_Customer_Care
                isOpen={isOpenHelpModal}
                onClose={() => { setIsOpenHelpModal(false) }}
            />
        </Drawer >
    )
}

export default Drawer_Menu