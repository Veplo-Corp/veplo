import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, useDisclosure } from '@chakra-ui/react'
import { signOut } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth } from '../../src/config/firebase'
import { Tooltip } from '@chakra-ui/react'
import Verified_Email from '../molecules/Verified_Email'
import { useRouter } from 'next/router'
import MobileDetect from 'mobile-detect'

const list = [
    {
        title: 'visualizza prodotti',
        url: '/shop/prodotti'
    },
    {
        title: 'il tuo negozio',
        url: '/shop'
    }
]

const Drawer_Menu: React.FC<{ openDrawerMath: number, user: any, onCloseModal: any }> = ({ openDrawerMath, user, onCloseModal }) => {
    const router = useRouter()
    const [bottomPadding, setbottomPadding] = useState(25)
    const { isOpen, onOpen, onClose } = useDisclosure()
    useEffect(() => {
        //console.log('openDrawerMath:',openDrawerMath);

        if (openDrawerMath !== 1 && openDrawerMath !== undefined) {
            onOpen()
        }
    }, [openDrawerMath])


    const logout = async () => {
        await signOut(auth);
        //set OpenModal 1 in Header
        onCloseModal()
        onClose()
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            let type = new MobileDetect(window.navigator.userAgent)
            //console.log(type);            
            if (type.os() === "AndroidOS" || type.os() === 'iOS') {
                const newHeight = window.innerHeight;
                const screenHeight = screen.availHeight;
                
                setbottomPadding(screenHeight - newHeight - (type.os() === 'iOS' ? 60 : 40))
                const updateWindowDimensions = () => {
                    const newHeight = window.innerHeight;
                    const screenHeight = screen.availHeight;
                    console.log(newHeight);
                    console.log(screenHeight);
                    console.log(screenHeight - newHeight);
                    setbottomPadding(screenHeight - newHeight - (type.os() === 'iOS' ? 60 : 40))
                    console.log("updating height");
                };
                window.addEventListener("resize", updateWindowDimensions);
                return () => window.removeEventListener("resize", updateWindowDimensions)
            }
        }
    }, []);


    return (
        <Drawer
            isOpen={isOpen}
            placement='right'
            size={['full', 'sm']}
            onClose={() => {
                onClose()
                onCloseModal()
            }}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton size={'lg'} mt={'0'} />
                <DrawerHeader borderWidth={0} borderBottomWidth={1} borderColor={'gray.200'} py={'3'} px={4}>Menu</DrawerHeader>
                <DrawerBody px={4} py={3}>
                    <Box maxW='sm' overflow='hidden'>
                        {user && user.emailVerified === true ? (

                            <Tooltip label='email verificata'>
                                <Box
                                    mt='1'
                                    fontWeight='semibold'
                                    as='h4'
                                    lineHeight='tight'
                                    noOfLines={1}
                                    display={'flex'}
                                >
                                    {user.email}

                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="my-auto ml-1 w-4 h-4 text-green-600">
                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                    </svg>
                                </Box>
                            </Tooltip>
                        ) :
                            (
                                <>
                                    <Verified_Email />
                                </>
                            )
                        }
                        <Box
                            fontWeight='thin'
                            as='i'
                            lineHeight='none'
                            noOfLines={1}
                            fontSize={'small'}
                            display={'flex'}
                            mb={10}
                        >
                            account creato in data: {user.createdAt}
                        </Box>
                        {list.map(element => {
                            return (<Box
                                key={element.title}
                                _active={{
                                    transform: `scale(0.99)`,
                                }}
                                mt={4}
                                fontWeight='semibold'
                                lineHeight='none'
                                noOfLines={1}
                                fontSize={'mg'}
                                display={'flex'}
                                className={'cursor-pointer hover:underline'}
                                onClick={() => {
                                    router.push(element.url)
                                    onClose()
                                }}
                            >
                                <p className='my-auto'>
                                    {element.title}
                                </p>
                            </Box>)
                        })}

                    </Box>

                </DrawerBody>
                <DrawerFooter paddingBottom={`${bottomPadding}px`}>
                    <Button w={'full'} onClick={logout}>
                        Disconnetti Account
                    </Button>
                </DrawerFooter>

            </DrawerContent>
        </Drawer>
    )
}

export default Drawer_Menu