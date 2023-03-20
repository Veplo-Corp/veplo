import React, { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'
import Navbar from '../molecules/Old-Home_Navbar'
import JoinUs_Navbar from '../molecules/JoinUs_Navbar'
import { background, Box, Button, useToast } from '@chakra-ui/react'
import Input_Search_Item from '../atoms/Input_Search_Item'
import Circle_Color from '../atoms/Circle_Color'
import { useSelector } from 'react-redux'
import Drawer_Address from './Drawer_Address'
import Show_Categories_NavBar from '../molecules/Show_Categories_NavBar'
import Drawer_User_Search from './Old-Drawer_User_Search'
import Drawer_Menu from './Drawer_Menu'
import User_Popover from '../molecules/User_Popover'
import { Firebase_User } from '../../src/interfaces/firebase_user.interface'
import { Transition } from '@headlessui/react'
import To_Home_Logo from '../molecules/To_Home_Logo'
import { useLazyQuery } from '@apollo/client'
import GET_BUSINESS from '../../src/lib/apollo/queries/business'
import { Business } from '../../src/interfaces/business.interface'


const OldHeader = () => {
    const router: NextRouter = useRouter()
    const genere: any = router.query.genere
    const [showMenu, setshowMenu] = useState(false);
    const [openDrawer, setopenDrawer] = useState(1);
    const [openDrawerSearch, setOpenDrawerSearch] = useState(0);
    const [openDrawerMenu, setOpenDrawerMenu] = useState(1);
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const [stripeDashboardVisible, setStripeDashboardVisible] = useState(false);
    const [stripeId, setStripeId] = useState<string>();

    const [getBusiness, { error, data }] = useLazyQuery(GET_BUSINESS);


    useEffect(() => {
        if (!user?.Not_yet_Authenticated_Request && user?.isBusiness && user?.accountId) {
            getBusiness({
                variables: {
                    id: user.accountId
                }
            }).then((value) => {
                const business: Business = value.data?.business
                console.log(business?.status);
                switch (business?.status) {
                    case 'active':
                        setStripeDashboardVisible(true)
                        setStripeId(business.stripe.id)
                        break;
                    default:
                        // code block
                        setStripeDashboardVisible(false)
                        break;
                }
            })
        }

        return () => {

        }
    }, [user])



    const toast = useToast()

    const [showCategory, setshowCategory] = useState({
        show: false,
        gender: ''
    });
    const address_user = useSelector((state: any) => state.address.address);
    // console.log(address_user);

    useEffect(() => {
        if (openDrawerSearch === 0) {
            setOpenDrawerSearch(1)
        } else {
            setOpenDrawerSearch(Math.random())
        }
    }, [address_user])

    const handleShowCategory = (value?: any, gender?: any) => {
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
    }

    const searchCategory = () => {
        if (!address_user) {

            toast({
                title: 'Non hai collegato un indirizzo',
                description: "collega un indirizzo per permetterci di trovare il meglio per te",
                status: 'info',
                duration: 6000,
                isClosable: true,
            })
            return setopenDrawer(Math.random())
        }
        setOpenDrawerSearch(Math.random())
    }



    /* <Transition show={!user?.Not_yet_Authenticated_Request}
                    enter="transition-opacity duration-[750ms]"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                > */

    return (
        <div onMouseLeave={() => setshowCategory({
            show: false,
            gender: ''
        })} >

            <Drawer_Address openDrawerMath={openDrawer} />

            <Drawer_User_Search handleChangeAddress={() => {
                setopenDrawer(Math.random())
            }} address_user={address_user} openDrawerMath={openDrawerSearch} />

            {!user && <JoinUs_Navbar />}

            {/* Menu button, Search button and Veplo Logo for screen >=md */}
            {user && user.isBusiness && <div className=" fixed z-50 top-3 right-2 md:hidden">
                <button
                    onClick={() => {
                        setOpenDrawerMenu(Math.random())
                    }}
                    type="button"
                    aria-label="menu"
                    className="inline-flex mt-0.5 rounded-md px-1  active:bg-gray-100 focus:outline-none" aria-expanded="false">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-black">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>}
            <div className={` md:pl-2 fixed z-50 ${!user ? 'top-3 md:top-9' : 'top-3'} left-3 `}> {/* lg:w-0 lg:flex-1 */}
                {!user?.isBusiness &&
                    <To_Home_Logo href='/' />
                }
                {user?.isBusiness &&
                    <To_Home_Logo href='/shop/home' />
                }
            </div>

            <div className={` pl-2 lg:pl-8 fixed z-50 ${!user ? 'top-3 md:top-10' : 'top-3'} right-16 `}> {/* lg:w-0 lg:flex-1 */}
                {(!user || !user.Not_yet_Authenticated_Request) && !user?.isBusiness && address_user &&
                    <div className='hidden md:flex cursor-pointer'
                        onClick={() => setopenDrawer(Math.random())}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6 mt-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <p className="font-sm text-sm mt-2 ml-1"

                        >
                            {address_user.city}{address_user.placeType === 'address' && <span>, {address_user.address}{address_user.streetNumber && <span> {address_user.streetNumber}</span>}</span>}
                        </p>
                    </div>
                }
            </div>

            <div className={`w-full z-10 fixed top-0 ${!user ? 'md:top-7' : 'md:top-0'} bg-white`}>
                <div className="mx-auto max-w-full ">
                    <div className="py-3 lg:justify-start lg:space-x-10">
                        <div className='flex items-center justify-between h-8 '>

                            {(!user || !user.Not_yet_Authenticated_Request) && (!user || !user.isBusiness) &&
                                <>
                                    <Navbar showCategory={showCategory.show} onShowCategory={handleShowCategory} openAddressModal={searchCategory} />

                                </>
                            }
                            <Transition show={!user?.Not_yet_Authenticated_Request}
                                enter="transition-opacity duration-[200ms]"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                            >

                                {/* button for Mobile */}
                                {(!user || !user.Not_yet_Authenticated_Request) && (!user || !user.isBusiness) &&
                                    <div className={`pl-2 md:pl-8 fixed z-50 top-3 md:top-4 right-2 md:hidden`}>
                                        {/* searchButton */}
                                        <div className='flex gap-0.5'>
                                            <button
                                                aria-label="search"
                                                onClick={searchCategory}
                                                type="button" className="inline-flex m-auto mb-2 rounded-md px-1 active:bg-gray-100 focus:outline-none" aria-expanded="false">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-black">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                                </svg>
                                            </button>
                                            <User_Popover />
                                        </div>
                                    </div>
                                }
                            </Transition>




                            <div className={`hidden md:flex gap-2 fixed ${!user ? 'top-9' : 'top-2'} right-4 z-10`}> {/* pr-80 */}
                                {(!user || !user.Not_yet_Authenticated_Request) && !user?.isBusiness &&
                                    <>
                                        <User_Popover />
                                    </>
                                }
                                {user && user.isBusiness &&
                                    <>
                                        {stripeDashboardVisible &&
                                            <form action={`/api/stripe/dashboard-link?stripeId=${stripeId}`}
                                                method="POST"
                                                target="_blank"
                                            >
                                                <Button
                                                    bgColor={'#6772E5'}
                                                    fontSize={'md'}
                                                    fontWeight={'semibold'}
                                                    textColor={'white'}
                                                    mr={'2'}
                                                    _hover={{
                                                        background: '#6772E5'
                                                    }}
                                                    _active={{
                                                        background: '#6772E5'
                                                    }}
                                                    type='submit'
                                                >
                                                    Vai alla Dashboard Pagamenti
                                                </Button>
                                            </form>
                                        }
                                        <button
                                            onClick={() => {
                                                setOpenDrawerMenu(Math.random())
                                            }}
                                            aria-label="menu"
                                            type="button" className="inline-flex mt-1 rounded-md px-1  active:bg-gray-100 focus:outline-none" aria-expanded="false">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-black">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                            </svg>
                                        </button>

                                    </>


                                }
                            </div>
                        </div>

                    </div>
                    {/* {showCategory.show &&
                        <Show_Categories_NavBar gender={showCategory.gender} closeCategory={handleShowCategory} closeShowCategory={() => {
                            setshowCategory({
                                show: false,
                                gender: ''
                            })
                        }} />
                    } */}
                </div>
            </div>

        </div >

    )
}

export default OldHeader