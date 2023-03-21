import Link from 'next/link';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Firebase_User } from '../../src/interfaces/firebase_user.interface';
import User_Popover from '../molecules/User_Popover';
import Navbar from '../molecules/Old-Home_Navbar'
import CategoryNavbar from '../molecules/CategoryNavbar';
import { Box } from '@chakra-ui/react';
import Drawer_Menu from './Drawer_Menu';
import CartDrawer from './CartDrawer';
import Drawer_User_Search from './Old-Drawer_User_Search';
import DrawerSearchProducts from './DrawerSearchProducts';

const Header = () => {

    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const [showMacrocategory, setshowMacrocategory] = useState(true)
    const [openDrawerBusinessAccount, setopenDrawerBusinessAccount] = useState(false)
    const [openDrawerCart, setOpenDrawerCart] = useState(false)
    const [isOpenUserDrawerSearch, setisOpenUserDrawerSearch] = useState(false)

    const searchCategory = () => {
        // if (!address_user) {

        //     toast({
        //         title: 'Non hai collegato un indirizzo',
        //         description: "collega un indirizzo per permetterci di trovare il meglio per te",
        //         status: 'info',
        //         duration: 6000,
        //         isClosable: true,
        //     })
        //     return setopenDrawer(Math.random())
        // }
        // setOpenDrawerSearch(Math.random())
    }

    const closeDrawerBusinessAccount = () => {
        setopenDrawerBusinessAccount(false)
    }

    return (
        <>
            <header className="inset-x-0 top-0 z-50 fixed bg-white"
                onMouseLeave={() => {
                    setshowMacrocategory(false)
                }
                }
                onMouseEnter={() => {
                    setshowMacrocategory(true)
                }
                }
            >
                <nav className="flex items-center justify-between px-4 md:px-6 py-4 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <Link href="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                className="h-8 w-auto"
                                src={'/static/veplo.svg'}
                                alt='Veplo'
                            />
                        </Link>
                    </div>

                    <div>
                        {(!user || !user.Not_yet_Authenticated_Request) && (!user || !user.isBusiness) &&
                            <CategoryNavbar showMacrocategory={showMacrocategory} />
                        }
                    </div>

                    <div className="flex lg:flex-1 lg:justify-end ">
                        {(!user || !user.Not_yet_Authenticated_Request) && (!user || !user.isBusiness) &&
                            <div className='flex gap-3'>
                                <Box
                                    className='flex lg:hidden'
                                    marginY={'auto'}
                                    height={'fit-content'}
                                    onClick={() => {
                                        setisOpenUserDrawerSearch(true)
                                    }}
                                    cursor={'pointer'}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-7 h-7">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>

                                </Box>
                                {user?.uid && <Box
                                    marginY={'auto'}
                                    height={'fit-content'}
                                    onClick={() => {
                                        setOpenDrawerCart(true)
                                    }}
                                    cursor={'pointer'}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-7 h-7">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg>
                                </Box>}
                                <Box
                                    marginY={'auto'}
                                    height={'fit-content'}
                                >
                                    <User_Popover />

                                </Box>


                            </div>
                        }
                        {
                            user?.isBusiness &&
                            <button
                                onClick={() => {
                                    setopenDrawerBusinessAccount(true)
                                }}
                                type="button"
                                aria-label="menu"
                                className="inline-flex mt-0.5 rounded-md px-1  active:bg-gray-100 focus:outline-none" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            </button>
                        }


                    </div>
                </nav>
            </header>
            {user?.isBusiness && <Drawer_Menu isOpen={openDrawerBusinessAccount} user={user} closeDrawer={closeDrawerBusinessAccount} />}
            <CartDrawer isOpen={openDrawerCart} closeDrawer={() => setOpenDrawerCart(false)} />
            <DrawerSearchProducts isOpen={isOpenUserDrawerSearch} closeDrawer={() => setisOpenUserDrawerSearch(false)} />
        </>

    )
}

export default Header