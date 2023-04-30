import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Firebase_User } from '../../src/interfaces/firebase_user.interface';
import User_Popover from '../molecules/User_Popover';
import Navbar from '../molecules/Old-Home_Navbar'
import CategoryNavbar from '../molecules/CategoryNavbar';
import { Box, Button, Tag, Text } from '@chakra-ui/react';
import Drawer_Menu from './Drawer_Menu';
import CartDrawer from './CartDrawer';
import Drawer_User_Search from './Old-Drawer_User_Search';
import DrawerSearchProducts from './DrawerSearchProducts';
import { useLazyQuery } from '@apollo/client';
import GET_BUSINESS from '../../src/lib/apollo/queries/business';
import { Business } from '../../src/interfaces/business.interface';
import { Medal1St, Search, ShoppingBag, User } from 'iconoir-react';
import Input_Search_Item from '../atoms/Input_Search_Item';
import { useRouter } from 'next/router';
import { getFromLocalStorage } from '../utils/getFromLocalStorage';
import { Cart } from '../../src/interfaces/carts.interface';
import createUrlSchema from '../utils/create_url';

const Header = () => {
    const router = useRouter()
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const cartsDispatch: Cart[] = useSelector((state: any) => state.carts.carts);
    const [numberOfProductsInCarts, setnumberOfProductsInCarts] = useState<number>(0)
    const [showMacrocategory, setshowMacrocategory] = useState(true)
    const [openDrawerBusinessAccount, setopenDrawerBusinessAccount] = useState(false)
    const [openDrawerCart, setOpenDrawerCart] = useState(false)
    const [isOpenUserDrawerSearch, setisOpenUserDrawerSearch] = useState(false)
    const [stripeDashboardVisible, setStripeDashboardVisible] = useState(false);
    const [stripeId, setStripeId] = useState<string>();

    const [getBusiness, { error, data }] = useLazyQuery(GET_BUSINESS);


    const closeDrawerBusinessAccount = () => {
        setopenDrawerBusinessAccount(false)
    }

    useEffect(() => {
        if (user.statusAuthentication === 'logged_in' && user?.isBusiness && user?.accountId) {
            getBusiness({
                variables: {
                    id: user.accountId
                }
            }).then((value) => {
                const business: Business = value.data?.business
                console.log(business?.status);
                switch (business?.status) {
                    case 'active':
                    case 'pending':
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

    useEffect(() => {
        let counter = 0
        cartsDispatch.map((cart) => {
            cart.productVariations.map(variation => {
                counter += variation.quantity
            })
        })
        setnumberOfProductsInCarts(counter)

    }, [cartsDispatch])


    const handleAutoComplete = (text: string) => {

    }

    const handleSearchText = (question: string) => {
        let gender = getFromLocalStorage('genderSelected')
        if (gender === 'f') {
            gender = 'donna'
        }
        if (gender === 'm') {
            gender = 'uomo'
        }
        //in futuro prendiamo la user.gender dell'utente
        if (!gender) {
            gender = 'donna'
        }
        if (question.toLocaleLowerCase().includes('uomo')) {
            gender = 'uomo'
        }
        if (question.toLocaleLowerCase().includes('donna')) {
            gender = 'donna'
        }
        console.log(gender);

        router.push(`/prodotti/${gender}-abbigliamento/tutto/rilevanza/${createUrlSchema([question])}`)




    }

    return (
        <>
            <header className="inset-x-0 top-0 z-50 sticky bg-white"
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
                        {<Link
                            prefetch={false}
                            href={`${user?.isBusiness ? '/shop/home' : '/'}`}
                            className="-m-1.5 p-1.5">
                            <img
                                className="h-8 w-auto"
                                src={'/static/veplo.svg'}
                                alt='Veplo'
                            />
                        </Link>}
                    </div>

                    <div>
                        {!(user.statusAuthentication === 'logged_in' && user.isBusiness) &&
                            <CategoryNavbar showMacrocategory={showMacrocategory} />
                        }
                    </div>

                    <div className="flex lg:flex-1 lg:justify-end ">
                        {!(user.statusAuthentication === 'logged_in' && user.isBusiness) &&
                            <div className='flex gap-3'>
                                <div className='hidden lg:flex'>
                                    <Input_Search_Item
                                        handleChangeValue={(text) => handleAutoComplete(text)}
                                        placeholder='Cerca...'
                                        onConfirmText={(value) => {
                                            handleSearchText(value)
                                        }}
                                    />
                                </div>

                                <Box
                                    marginY={'auto'}
                                    height={'fit-content'}
                                    onClick={() => {
                                        setisOpenUserDrawerSearch(true)
                                    }}
                                    cursor={'pointer'}
                                    className='flex lg:hidden bg-[#F2F2F2] rounded-[10px] p-2'
                                >
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-7 h-7">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg> */}
                                    <Search
                                        strokeWidth={2}
                                        className="w-6 h-6 my-auto"
                                    />


                                </Box>
                                <Box
                                    marginY={'auto'}
                                    height={'fit-content'}
                                    onClick={() => {
                                        if (!user?.uid) {
                                            console.log(router.asPath);

                                            return router.push({
                                                pathname: '/user/login',
                                                query: {
                                                    type: 'login',
                                                    callbackUrl: router.asPath
                                                },

                                            })
                                        }
                                        setOpenDrawerCart(true)
                                    }}
                                    cursor={'pointer'}
                                    className='bg-[#F2F2F2] rounded-[10px] p-2 relative'
                                >
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-7 h-7">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg> */}
                                    <ShoppingBag
                                        strokeWidth={2}
                                        className="w-6 h-6 my-auto"
                                    />
                                    {numberOfProductsInCarts > 0 &&
                                        <Tag
                                            position={'absolute'}
                                            borderRadius={'full'}
                                            colorScheme={'orange'}
                                            className='-top-2 -right-2.5'

                                        >
                                            <Text
                                                fontSize={'sm'}
                                                mx={'auto'}
                                                fontWeight={'bold'}
                                                color={'black'}
                                            >
                                                {numberOfProductsInCarts}
                                            </Text>

                                        </Tag>}

                                </Box>
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
                            <>
                                {stripeDashboardVisible &&
                                    <form action={`/api/stripe/dashboard-link?stripeId=${stripeId}`}
                                        method="POST"
                                        target="_blank"
                                        className='hidden md:flex'
                                    >
                                        <Button

                                            bgColor={'#6772E5'}
                                            fontSize={'md'}
                                            fontWeight={'semibold'}
                                            textColor={'white'}
                                            size={'sm'}
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
                                        setopenDrawerBusinessAccount(true)
                                    }}
                                    type="button"
                                    aria-label="menu"
                                    className="inline-flex mt-0.5 rounded-md px-1  active:bg-gray-100 focus:outline-none" aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-black">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                </button>
                            </>


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