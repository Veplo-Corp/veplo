import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'
import Navbar from '../molecules/Home_Navbar'
import JoinUs_Navbar from '../molecules/JoinUs_Navbar'
import { Box, Button, useToast } from '@chakra-ui/react'
import Input_Search_Item from '../atoms/Input_Search_Item'
import Circle_Color from '../atoms/Circle_Color'
import { useSelector } from 'react-redux'
import Drawer_Address from './Drawer_Address'
import redirectToAddressForm from '../utils/redirect_to_address_form'
import Show_Categories_NavBar from '../molecules/Show_Categories_NavBar'
import Drawer_User_Menu from './Drawer_User_Menu'


const Header = () => {
    const router: NextRouter = useRouter()
    const genere: 'uomo' | 'donna' | undefined = router.query.genere
    const [showMenu, setshowMenu] = useState(false);
    const [openDrawer, setopenDrawer] = useState(1);
    const [openDrawerMenuMobile, setOpenDrawerMenuMobile] = useState(1);
    const user = useSelector((state) => state.user.user);


    const toast = useToast()

    const [showCategory, setshowCategory] = useState({
        show: false,
        gender: ''
    });
    const address_user = useSelector((state) => state.address.address);
    // console.log(address_user);

    const handleShowCategory = (value?, gender?) => {
        if (address_user) {
            if (value === false) {
                setshowCategory({
                    show: false,
                    gender: ''
                })
            } else {
                setshowCategory((actualValue) => {
                    return {
                        show: true,
                        gender: gender
                    }
                })
            }
        }
        else {
            toast({
                title: 'Non hai collegato un indirizzo',
                description: "collega un indirizzo per permetterci di trovare il meglio per te",
                status: 'info',
                duration: 6000,
                isClosable: true,
            })
            return setopenDrawer(Math.random())
        }
    }


    return (
        <div onMouseLeave={() => setshowCategory({
            show: false,
            gender: ''
        })} >
            <Drawer_Address openDrawerMath={openDrawer} />
            <Drawer_User_Menu handleChangeAddress={() => {
                setopenDrawer(Math.random())
            }} address_user={address_user} openDrawerMath={openDrawerMenuMobile} />

            {!user && <JoinUs_Navbar />}
            {/* Menu button, Search button and Dintorni Logo for screen >=md */}
            <div className=" fixed z-50 top-3 right-2 md:hidden">
                <button
                    type="button" className="inline-flex mt-0.5 rounded-md px-1  active:bg-gray-100 focus:outline-none" aria-expanded="false">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-black">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>
            <div className="pl-2 md:pl-8 fixed z-50 top-3 md:top-4  right-12 md:hidden">
                <button
                    onClick={() => {
                        setOpenDrawerMenuMobile(Math.random())
                    }}
                    type="button" className="inline-flex mt-0.5 rounded-md px-1 active:bg-gray-100 focus:outline-none" aria-expanded="false">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-black">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>

                </button>
            </div>
            <div className={`hidden md:flex pl-2 lg:pl-8 fixed z-50 ${!user ? 'top-10' : 'top-3'} -mt-px`}> {/* lg:w-0 lg:flex-1 */}
                {!address_user && <Link href="/">
                    <a className="font-black text-xl md:text-3xl italic text-black-900  ">DINTORNI</a>
                </Link>}
                {(!user || !user.isShop) && address_user &&
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6 mt-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <p className="font-sm text-sm mt-2 ml-1 cursor-pointer"
                            onClick={() => setopenDrawer(Math.random())}
                        >
                            {address_user.placeType === 'address' && <span>{address_user.address}{address_user.streetNumber && <span> {address_user.streetNumber}</span>}, </span>}  {address_user.city}
                        </p>
                    </>
                }

            </div>

            <div className={`w-full z-10 fixed top-0 ${!user ? 'md:top-7' : 'md:top-0'} bg-white`}>
                <div className="mx-auto max-w-full border-b-2 border-gray-100">
                    <div className="py-3 lg:justify-start lg:space-x-10">
                        <div className='flex items-center justify-between h-8 '>
                            {user && !user.isShop &&
                                <>
                                    <Navbar genere={genere} showCategory={showCategory.show} onShowCategory={handleShowCategory} />
                                    <div className="  w-full md:hidden">
                                        <Link href="/">
                                            <a className="font-black mt-2 ml-5 text-2xl italic text-black-900  ">DINTORNI</a>
                                        </Link>
                                    </div>
                                </>
                            }
                            <div className={`hidden md:flex gap-3 fixed ${!user ? 'top-9' : 'top-2'} right-2 lg:right-8 z-10`}> {/* pr-80 */}

                                {user && user.isShop ?
                                    (<Button variant='ghost' borderRadius={100} colorScheme={'gray'} p={0} ml={'-1'}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                                        </svg>
                                    </Button>)
                                    :
                                    (
                                        <>
                                            <Input_Search_Item />
                                            <Link href={'/'}>
                                                <a>
                                                    <Circle_Color colors={['gray.200']} dimension={10} space={'0'} />
                                                </a>
                                            </Link>
                                        </>
                                    )
                                }
                            </div>
                        </div>

                    </div>
                    {showCategory.show &&
                        <Show_Categories_NavBar gender={showCategory.gender} closeCategory={handleShowCategory} />
                    }
                </div>

                {/* <!--
        Mobile menu, show/hide based on mobile menu state.

        Entering: "duration-200 ease-out"
        From: "opacity-0 scale-95"
        To: "opacity-100 scale-100"
        Leaving: "duration-100 ease-in"
        From: "opacity-100 scale-100"
        To: "opacity-0 scale-95"
  --> */}
                {showMenu && <div className="fixed inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden">
                    <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="px-5 pt-5 pb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                                </div>
                                <div className="-mr-2">
                                    <button type="button" className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                        <span className="sr-only">Close menu</span>
                                        {/* <!-- Heroicon name: outline/x-mark --> */}
                                        {/* <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg> */}
                                    </button>
                                </div>
                            </div>
                            <div className="mt-6">
                                <nav className="grid gap-y-8">
                                    <a href="#" className="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50">
                                        {/* <!-- Heroicon name: outline/chart-bar --> */}
                                        {/* <svg className="h-6 w-6 flex-shrink-0 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                    </svg> */}
                                        <span className="ml-3 text-base font-medium text-gray-900">Analytics</span>
                                    </a>

                                    <a href="#" className="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50">
                                        {/* <!-- Heroicon name: outline/cursor-arrow-rays --> */}
                                        {/* <svg className="h-6 w-6 flex-shrink-0 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                                    </svg> */}
                                        <span className="ml-3 text-base font-medium text-gray-900">Engagement</span>
                                    </a>

                                    <a href="#" className="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50">
                                        {/* <!-- Heroicon name: outline/shield-check --> */}
                                        {/* <svg className="h-6 w-6 flex-shrink-0 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                    </svg> */}
                                        <span className="ml-3 text-base font-medium text-gray-900">Security</span>
                                    </a>

                                    <a href="#" className="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50">
                                        {/* <!-- Heroicon name: outline/squares-2x2 --> */}
                                        {/* <svg className="h-6 w-6 flex-shrink-0 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                    </svg> */}
                                        <span className="ml-3 text-base font-medium text-gray-900">Integrations</span>
                                    </a>

                                    <a href="#" className="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50">
                                        {/* <!-- Heroicon name: outline/arrow-path --> */}
                                        {/* <svg className="h-6 w-6 flex-shrink-0 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12c0-1.232.046-2.453.138-3.662a4.006 4.006 0 013.7-3.7 48.678 48.678 0 017.324 0 4.006 4.006 0 013.7 3.7c.017.22.032.441.046.662M4.5 12l-3-3m3 3l3-3m12 3c0 1.232-.046 2.453-.138 3.662a4.006 4.006 0 01-3.7 3.7 48.657 48.657 0 01-7.324 0 4.006 4.006 0 01-3.7-3.7c-.017-.22-.032-.441-.046-.662M19.5 12l-3 3m3-3l3 3" />
                                    </svg> */}
                                        <span className="ml-3 text-base font-medium text-gray-900">Automations</span>
                                    </a>
                                </nav>
                            </div>
                        </div>
                        <div className="space-y-6 py-6 px-5 ">
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                <a href="#" className="text-base font-medium text-gray-900 hover:text-gray-700">Pricing</a>

                                <a href="#" className="text-base font-medium text-gray-900 hover:text-gray-700">Docs</a>

                                <a href="#" className="text-base font-medium text-gray-900 hover:text-gray-700">Help Center</a>

                                <a href="#" className="text-base font-medium text-gray-900 hover:text-gray-700">Guides</a>

                                <a href="#" className="text-base font-medium text-gray-900 hover:text-gray-700">Events</a>

                                <a href="#" className="text-base font-medium text-gray-900 hover:text-gray-700">Security</a>
                            </div>
                            <div>
                                <a href="#" className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700">Sign up</a>
                                <p className="mt-6 text-center text-base font-medium text-gray-500">
                                    Existing customer?
                                    <a href="#" className="text-indigo-600 hover:text-indigo-500">Sign in</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        </div>

    )
}

export default Header