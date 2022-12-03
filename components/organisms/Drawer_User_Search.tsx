import { ChevronUpIcon, SearchIcon } from '@chakra-ui/icons'
import { Box, Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, InputGroup, InputLeftElement, useDisclosure } from '@chakra-ui/react'
import { Disclosure, Tab } from '@headlessui/react'
import MobileDetect from 'mobile-detect'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { CATEGORIES } from '../mook/categories'
import createUrlSchema from '../utils/create_url'

const Drawer_User_Search: React.FC<{ openDrawerMath: number, address_user: any, handleChangeAddress: any }> = ({ openDrawerMath, address_user, handleChangeAddress }) => {
    const [isAndroid, setIsAndroid] = useState(false)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            let type = new MobileDetect(window.navigator.userAgent)
            console.log(type);
            if(type.os() === "AndroidOS"){ 
                setIsAndroid(true)           
            }
        }
    }, [])
    
    




    const { isOpen, onOpen, onClose } = useDisclosure()
    const [categories] = useState(CATEGORIES)
    const router = useRouter()
    useEffect(() => {        
        //console.log(openDrawerMath);
        if (openDrawerMath !== 1 && openDrawerMath>0 && openDrawerMath !== undefined) {            
            onOpen()
        }
    }, [openDrawerMath])

    const classNames = (...classes: any[]) => {
        return classes.filter(Boolean).join(' ')
    }

    const handleCategoryClicked = (catObject: any, indexArray: any) => {
        let gender: string = 'donna'
        if (indexArray === 1) {
            gender = 'uomo'
        }
        const categorySelectedUrl = createUrlSchema([gender, catObject])
        router.push(`/prodotti/${address_user.city?.toLocaleLowerCase()}-${address_user.postcode}/${categorySelectedUrl}`)
        onClose()
    }

    const handleClickShop = () => {
        router.push(`/negozi/${address_user.city?.toLocaleLowerCase()}-${address_user.postcode}`)
    }

    return (
        <>
            <Drawer onClose={onClose} isOpen={isOpen} size={['full', 'md']}
                placement={'right'}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton size={'lg'} mt={'0'} />
                    <DrawerHeader borderWidth={0} borderBottomWidth={1} borderColor={'gray.200'} py={'3'} px={'4'}>
                        <p className="font-black text-2xl italic text-black-900  ">DINTORNI</p>
                    </DrawerHeader>
                    <DrawerBody p={0}>
                        {/* //! regitra impresa */}
                        {/* <Box
                            borderBottomWidth={1} borderColor={'gray.200'}
                            height={14}
                            className='flex justify-between'
                            fontSize={'lg'}
                            backgroundColor={'facebook.800'}
                            color={'white'}
                            fontWeight={'semibold'}
                            onClick={() => {
                                onClose()
                                router.push('/shop/login')
                            }}
                        >
                            <Box className='m-auto'>
                                Registra gratis la tua impresa
                            </Box>
                        </Box> */}
                        <InputGroup>
                            <InputLeftElement
                                height={14}
                                color={'gray.400'}
                                pointerEvents='none'
                                children={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                }
                            />
                            <Input
                                focusBorderColor='none'
                                height={14} borderRadius={0} borderWidth={0} borderBottomWidth={1} type='text' placeholder='Cerca negozi o vestiti' />
                        </InputGroup>
                        <Tab.Group >
                            <Tab.List className='w-full flex justify-between h-12 border-0	border-b border-inherit	'>
                                {Object.keys(categories).map((category) => (
                                    <Tab
                                        key={category}
                                        className={({ selected }) =>
                                            classNames(
                                                'text-lg font-semibold w-2/6',
                                                selected
                                                    ? 'underline underline-offset-2'
                                                    : ''
                                            )
                                        }
                                    >
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </Tab>
                                ))}
                                <Tab className='text-lg font-semibold w-2/6' onClick={() => {
                                    onClose()
                                    handleClickShop()
                                }}>
                                    Negozi
                                </Tab>
                            </Tab.List>
                            <Tab.Panels>
                                {Object.values(categories).map((categories, indexArray) => {
                                    return (
                                        <Tab.Panel key={indexArray}>
                                            <ul>
                                                {categories.abbigliamento.map((catObject, idx) => {
                                                    return (
                                                        <Disclosure key={idx}>
                                                            {({ open }) => (
                                                                <>
                                                                    <Disclosure.Button className="py-2 px-6 w-full flex my-auto justify-between h-12 border-0 border-b">

                                                                        <p className='text-lg font-medium my-auto'>
                                                                            {catObject.name}
                                                                        </p>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                                                            className={`${open ? 'rotate-180 transform' : ''
                                                                                } w-6 h-6 my-auto`}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                                        </svg>
                                                                    </Disclosure.Button>
                                                                    <Disclosure.Panel>
                                                                        {catObject.types.map((type: string, idx) => {
                                                                            return (
                                                                                <div
                                                                                    onClick={() => {
                                                                                        handleCategoryClicked(catObject.name, indexArray)
                                                                                    }}
                                                                                    key={idx} className='bg-slate-50 py-2 px-6 h-12 border-0 border-b text-md font-medium flex'>
                                                                                    <p className='my-auto'>
                                                                                        {type.charAt(0).toUpperCase() + type.slice(1)}

                                                                                    </p>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </Disclosure.Panel>
                                                                </>
                                                            )}
                                                        </Disclosure>
                                                    )
                                                })}
                                            </ul>
                                        </Tab.Panel>
                                    )
                                })}

                            </Tab.Panels>
                        </Tab.Group>
                    </DrawerBody>
                    <DrawerFooter background={'#355CC1'} pb={`${isAndroid ? '20' : '6'}`} borderTopRadius={'3xl'} >
                        <Center width={'full'} >
                            <div className='text-center	'>
                                {address_user && <p className='text-white text-lg font-semibold mb-1'>
                                    {address_user.placeType === 'address' && <span>{address_user.address}{address_user.streetNumber && <span> {address_user.streetNumber}</span>}, </span>}  {address_user.city}
                                </p>}
                                <Button onClick={() => {
                                    onClose()
                                    handleChangeAddress()
                                }} colorScheme={'gray'} borderRadius={'3xl'} width={100}>cambia</Button>
                            </div>
                        </Center>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default Drawer_User_Search