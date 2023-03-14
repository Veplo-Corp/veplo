import Link from 'next/link';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Firebase_User } from '../../src/interfaces/firebase_user.interface';
import User_Popover from '../molecules/User_Popover';
import Navbar from '../molecules/Old-Home_Navbar'
import CategoryNavbar from '../molecules/CategoryNavbar';
import { Box } from '@chakra-ui/react';

const Header = () => {

    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const [showMacrocategory, setshowMacrocategory] = useState(true)



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

    return (
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
            <nav className="flex items-center justify-between px-6 py-2 lg:px-8" aria-label="Global">
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

                <div className="hidden lg:flex lg:flex-1 lg:justify-end ">
                    {(!user || !user.Not_yet_Authenticated_Request) && (!user || !user.isBusiness) &&
                        <div className='mt-2 flex gap-3'>
                            <Box
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                            </Box>

                            <User_Popover />

                        </div>
                    }


                </div>
            </nav>
        </header>
    )
}

export default Header