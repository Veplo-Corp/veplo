import { Box, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { CATEGORIES } from '../mook/categories'
import { Disclosure, Tab } from '@headlessui/react'
import createUrlSchema from '../utils/create_url'
import { Firebase_User } from '../../src/interfaces/firebase_user.interface'
import { useSelector } from 'react-redux'

const DrawerSearchProducts: FC<{ isOpen: boolean, closeDrawer: () => void }> = ({ isOpen, closeDrawer }) => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [categories] = useState(CATEGORIES)
    const router = useRouter();
    const user: Firebase_User = useSelector((state: any) => state.user.user);

    useEffect(() => {
        if (user?.genderSelected) {
            setSelectedIndex(user?.genderSelected === 'm' ? 1 : 0)
        }
    }, [user])


    const classNames = (...classes: any[]) => {
        return classes.filter(Boolean).join(' ')
    }

    const handleCategoryClicked = (catObject: any, indexArray: any, microcategory?: string) => {
        let gender: string = 'donna'
        if (indexArray === 1) {
            gender = 'uomo'
        }
        console.log(catObject);
        const categoryForUrl = Object.values(categories)[indexArray].abbigliamento.find(category => category.name === catObject)?.url

        if (!categoryForUrl) {
            router.push(`/prodotti/${gender}-abbigliamento/tutto/rilevanza`)
        } else {
            const categorySelectedUrl = createUrlSchema([gender, categoryForUrl])
            router.push(`/prodotti/${categorySelectedUrl}/${microcategory ? createUrlSchema([microcategory]) : 'tutto'}/rilevanza`)
        }
        closeDrawer()
    }


    return (
        <>
            <Drawer onClose={closeDrawer} isOpen={isOpen} size={['full', 'sm']}
                placement={'right'}>
                <DrawerOverlay />
                <DrawerContent
                >
                    <DrawerHeader
                        borderBottomWidth='1px'
                        className='flex justify-between'
                        paddingLeft={[3, 4]}
                    >
                        <h3
                            className='text-2xl font-medium'
                        >
                            Cerca
                        </h3>
                        <Box
                            cursor={'pointer'}
                            marginY={'auto'}
                            onClick={closeDrawer}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Box>
                    </DrawerHeader>
                    <DrawerBody
                        p={0}


                    >
                        <Tab.Group
                            selectedIndex={selectedIndex} onChange={setSelectedIndex}
                        >
                            <Tab.List className='w-full flex justify-between h-12 border-0	border-b border-inherit'>
                                {/* <Tab></Tab> */}
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
                                    router.push('/negozi')
                                    closeDrawer()
                                }}>
                                    Negozi
                                </Tab>
                            </Tab.List>

                            <Tab.Panels
                                className={'mb-20'}
                            >
                                {/* <Tab.Panel></Tab.Panel> */}
                                {Object.values(categories).map((categories, indexArray) => {
                                    return (
                                        <Tab.Panel key={indexArray}>
                                            <div
                                                className="py-2 px-6 w-full flex justify-between h-12 border-0 border-b cursor-pointer"
                                                onClick={() => {
                                                    handleCategoryClicked('tutto l’abbigliamento', indexArray)
                                                }}
                                            >
                                                <p className='my-auto text-lg font-bold'>
                                                    Tutto l'abbigliamento
                                                </p>
                                            </div>
                                            <ul>
                                                {categories.abbigliamento.map((catObject, idx) => {
                                                    return (
                                                        <Disclosure key={idx}>
                                                            {({ open }) => (
                                                                <>
                                                                    <Disclosure.Button className="py-2 px-6 w-full flex my-auto justify-between h-12 border-0 border-b"
                                                                        /* delete when you filter by microcategory */
                                                                        onClick={() => {
                                                                            //handleCategoryClicked(catObject.name, indexArray)
                                                                        }}
                                                                    >

                                                                        <p className='text-lg font-bold my-auto'>
                                                                            {catObject.name}
                                                                        </p>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                                                            className={`${open ? 'rotate-180 transform' : ''
                                                                                } w-6 h-6 my-auto`}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                                        </svg>
                                                                    </Disclosure.Button>
                                                                    <Disclosure.Panel>
                                                                        <div

                                                                            onClick={() => {
                                                                                handleCategoryClicked(catObject.name, indexArray)
                                                                            }}
                                                                            key={idx} className='bg-slate-50 py-2 px-6 h-12 border-0 border-b text-md font-semibold flex cursor-pointer'>
                                                                            <p className='my-auto'>
                                                                                Tutti i prodotti della categoria
                                                                            </p>
                                                                        </div>
                                                                        {catObject.types.map((type: string, idx) => {
                                                                            return (
                                                                                <div

                                                                                    onClick={() => {
                                                                                        handleCategoryClicked(catObject.name, indexArray, type)
                                                                                    }}
                                                                                    key={idx} className='bg-slate-50 py-2 px-6 h-12 border-0 border-b text-md font-semibold flex cursor-pointer'>
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

                </DrawerContent>
            </Drawer>
        </>
    )
}

export default DrawerSearchProducts