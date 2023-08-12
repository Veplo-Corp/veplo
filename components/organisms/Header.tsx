import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Firebase_User } from '../../src/interfaces/firebase_user.interface';
import User_Popover from '../molecules/User_Popover';
import CategoryNavbar from '../molecules/CategoryNavbar';
import { Box, Button, Select, Tag, Text, useBreakpointValue } from '@chakra-ui/react';
import Drawer_Menu from './Drawer_Menu';
import CartDrawer from './CartDrawer';
import DrawerSearchProducts from './DrawerSearchProducts';
import { useLazyQuery } from '@apollo/client';
import GET_BUSINESS from '../../src/lib/apollo/queries/business';
import BETTER_INPUT_GENERATOR from '../../src/lib/apollo/queries/betterInputGenerator';

import { Business } from '../../src/interfaces/business.interface';
import { Medal1St, NavArrowDown, Search, ShoppingBag, SmallShopAlt, TShirt, User } from 'iconoir-react';
import Input_Search_Item from '../atoms/Input_Search_Item';
import { useRouter } from 'next/router';
import { getFromLocalStorage } from '../utils/getFromLocalStorage';
import { Cart } from '../../src/interfaces/carts.interface';
import createUrlSchema from '../utils/create_url';
import { motion } from 'framer-motion';
import { Popover, Transition } from '@headlessui/react'
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter';
import { getUnivers } from '../utils/getUnivers';
import { InputObjectBIG, processBIGObjectForUrl } from '../utils/bigParamsForPushUrl';
import CartsPopover from '../molecules/CartsPopover';
import { getGender } from '../utils/getGender';

const Header = () => {
    const isButtonHidden = useBreakpointValue({ base: true, lg: false });
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
    const [gender, setGender] = useState<string>()

    const [getBusiness, { error, data }] = useLazyQuery(GET_BUSINESS);
    const [getBetterInputGenerator, betterInputGeneratorResult] = useLazyQuery(BETTER_INPUT_GENERATOR);
    const isSmallView = useBreakpointValue({ base: true, lg: false });


    const closeDrawerBusinessAccount = () => {
        setopenDrawerBusinessAccount(false)
    }



    useEffect(() => {
        if (!betterInputGeneratorResult.data?.betterInputGenerator) return
        const params = betterInputGeneratorResult.data?.betterInputGenerator
        const result: InputObjectBIG | boolean = processBIGObjectForUrl(params)

        if (!result) {
            router.push({
                pathname: `/cerca/${getUnivers()}/${gender}-tutto/tutto/rilevanza`,
                query: {
                    query: betterInputGeneratorResult.variables?.query
                }
            })
            return
        }
        router.push({
            pathname: `/cerca/${getUnivers()}/${gender}-${typeof result.macroCategory === 'string' ? result.macroCategory.toLowerCase() : 'tutto'}/${typeof result.microCategory === 'string' ? createUrlSchema([result.microCategory]) : 'tutto'}/rilevanza`,
            query: {
                ...result.filters,
                query: betterInputGeneratorResult.variables?.query
            }
        })
        //router.push(`/${getUnivers()}/${gender}-tutto/tutto/rilevanza/${createUrlSchema([question])}`)

    }, [betterInputGeneratorResult])



    useEffect(() => {
        if (user.statusAuthentication === 'logged_in' && user?.isBusiness && user?.accountId) {
            getBusiness({
                variables: {
                    id: user.accountId
                }
            }).then((value) => {
                const business: Business = value.data?.business
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
        const genderName = getGender()
        if (genderName) return setGender(genderName)


        return () => {

        }
    }, [user])

    useEffect(() => {
        let counter = 0
        cartsDispatch.map((cart) => {
            cart?.productVariations?.map(variation => {
                if (variation?.quantity) { counter += variation?.quantity }
            })
        })
        setnumberOfProductsInCarts(counter)

    }, [cartsDispatch])


    const handleAutoComplete = (text: string) => {

    }

    const handleSearchText = (query: string) => {

        getBetterInputGenerator({
            variables: {
                query
            }
        })
    }

    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);



    const handleScroll = () => {
        if (!isSmallView) {
            return setIsHeaderVisible(true)
        }
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && isHeaderVisible && currentScrollY > 60) {
            setIsHeaderVisible(false);
        } else if (currentScrollY < lastScrollY && !isHeaderVisible) {
            setIsHeaderVisible(true);
        }
        setLastScrollY(currentScrollY);
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY, isHeaderVisible]);

    return (

        <>
            <motion.header
                className='inset-x-0 top-0 z-40 sticky'
                initial={{ y: 0 }}
                animate={{ y: isHeaderVisible ? 0 : -100 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isHeaderVisible ? 1 : 1 }}
                    transition={{ duration: typeof window !== "undefined" ? window.scrollY < 60 ? 0 : 0.5 : 0 }}
                >
                    <header className="inset-x-0 top-0 z-50 sticky bg-white h-26"
                        onMouseLeave={() => {
                            setshowMacrocategory(false)
                        }
                        }
                        onMouseEnter={() => {
                            setshowMacrocategory(true)
                        }
                        }
                    >
                        <nav className={`flex items-center justify-between px-2 py-4 ${user.isBusiness ? '' : 'lg:px-0 lg:mx-6  xl:w-10/12 2xl:w-9/12'}  xl:mx-auto`} aria-label="Global">
                            {(user.statusAuthentication === 'logged_in' && user.isBusiness) && <div className="flex lg:flex-1">
                                <Link
                                    prefetch={false}
                                    href={`${user?.isBusiness ? '/shop/home' : '/'}`}
                                    className="-m-1.5 p-1.5">
                                    <img
                                        className="h-8 w-auto"
                                        src={'/static/veplo.svg'}
                                        alt='Veplo'
                                    />
                                </Link>
                            </div>}
                            {(!user.isBusiness && isButtonHidden && user.statusAuthentication !== 'not_yet_authenticated') &&
                                <Popover

                                    className="relative flex gap-1">
                                    {({ open }) => (
                                        <>
                                            <Popover.Button
                                                className={`
                                                    ${open ? '' : 'text-opacity-90'}
                                                    group inline-flex items-center rounded-md px-1 py-2 text-base font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                                            >
                                                <Text
                                                    fontSize={'lg'}
                                                    fontWeight={'extrabold'}
                                                    color={'secondaryBlack.text'}
                                                >
                                                    {gender ? toUpperCaseFirstLetter(gender) : 'Seleziona'}
                                                </Text>
                                                {/* <NavArrowDown
                                                    className='my-auto mb-[-1px]'
                                                    strokeWidth={2.5}
                                                    fontSize={'lg'}
                                                /> */}
                                            </Popover.Button>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-200"
                                                enterFrom="opacity-0 translate-y-1"
                                                enterTo="opacity-100 translate-y-0"
                                                leave="transition ease-in duration-150"
                                                leaveFrom="opacity-100 translate-y-0"
                                                leaveTo="opacity-0 translate-y-1"
                                            >
                                                <Popover.Panel
                                                    style={{
                                                        boxShadow: "0px 0px 20px 0px rgba(144, 144, 144, 0.25)",
                                                    }}
                                                    className="left-1 top-10 py-2 px-4 absolute grid grid-cols-1 cursor-pointer z-10 min-w-[15vh] bg-white rounded-xl">
                                                    {['Donna', 'Uomo'].map((element) => {
                                                        return (
                                                            <Link
                                                                key={element}
                                                                href={`/cerca/${getUnivers()}/${element.toLocaleLowerCase()}-tutto/tutto/rilevanza`}
                                                            >
                                                                <Popover.Button
                                                                    className='text-left font-bold text-lg py-1'

                                                                >
                                                                    {element}
                                                                </Popover.Button>
                                                            </Link>

                                                        )
                                                    })}
                                                </Popover.Panel>
                                            </Transition>
                                        </>

                                    )}
                                </Popover>
                            }

                            <div>
                                {(user.statusAuthentication !== 'not_yet_authenticated' && !user.isBusiness) &&
                                    <CategoryNavbar showMacrocategory={showMacrocategory} />
                                }
                            </div>
                            <div className="flex lg:flex-1 lg:justify-end ">
                                {!(user.statusAuthentication === 'logged_in' && user.isBusiness) &&
                                    <div className='flex gap-3'>
                                        <div className='hidden lg:flex'>
                                            <Input_Search_Item
                                                handleChangeValue={(text) => {
                                                    const regex = /[^A-Za-zÀ-ÿ0-9 -]/g;
                                                    const textfiltered = text.replace(regex, '');
                                                    handleAutoComplete(textfiltered)
                                                }
                                                }
                                                placeholder='Cerca tutto quello che ti interessa'
                                                onConfirmText={(value) => {
                                                    handleSearchText(value)
                                                }}
                                            />
                                        </div>
                                        {isButtonHidden
                                            &&
                                            <Box
                                                marginY={'auto'}
                                                height={'full'}
                                                cursor={'pointer'}
                                                className='rounded-[10px]  relative lg:hidden'
                                                background={'primary.bg'}
                                            >
                                                <Link
                                                    className='flex gap-2 p-2'
                                                    href={router.query?.prodotti ? '/profili/brand' : (gender ? `/cerca/${getUnivers()}/${gender}-tutto/tutto/rilevanza` : '/')}
                                                >
                                                    {router.query?.prodotti ?
                                                        (<SmallShopAlt
                                                            strokeWidth={2}
                                                            className="w-6 h-6 my-auto"
                                                            color='white'
                                                        />)
                                                        : (
                                                            <TShirt
                                                                strokeWidth={2}
                                                                className="w-6 h-6 my-auto"
                                                                color='white'
                                                            />
                                                        )
                                                    }
                                                </Link>

                                            </Box>
                                        }
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

                                        {!isButtonHidden &&
                                            <>


                                                <Link
                                                    href={router.query.prodotti ? '/profili/brand' : (gender ? `/cerca/${getUnivers()}/${gender}-tutto/tutto/rilevanza` : '/')}
                                                    className='flex h-full w-full'
                                                >
                                                    <Button
                                                        variant={'primary'}
                                                        marginY={'auto'}
                                                        cursor={'pointer'}
                                                        rounded={'10px'}
                                                        className='hidden lg:flex gap-2'
                                                        background={'primary.bg'}
                                                        height={'full'}
                                                        px={6}
                                                    >
                                                        <Text
                                                            color={'primary.text'}
                                                            fontWeight={'semibold'}
                                                            my={'auto'}
                                                            fontSize={'md'}

                                                        >
                                                            {router.query?.prodotti && 'Brand'}
                                                            {!router.query?.prodotti && 'Prodotti'}
                                                        </Text>

                                                        {router.query?.prodotti ?
                                                            (<SmallShopAlt
                                                                strokeWidth={2}
                                                                className="w-6 h-6 my-auto"
                                                                color='white'
                                                            />)
                                                            : (
                                                                <TShirt
                                                                    strokeWidth={2}
                                                                    className="w-6 h-6 my-auto"
                                                                    color='white'
                                                                />
                                                            )
                                                        }
                                                    </Button>
                                                </Link>

                                            </>

                                        }
                                        {false && <Box
                                            marginY={'auto'}
                                            height={'fit-content'}
                                            onClick={() => {
                                                // if (!user?.uid) {

                                                //     return router.push({
                                                //         pathname: '/user/login',
                                                //         query: {
                                                //             type: 'login',
                                                //             callbackUrl: router.asPath
                                                //         },

                                                //     })
                                                // }
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
                                                    bg={'primary.bg'}
                                                    color={'primary.text'}
                                                    className='-top-2 -right-2.5'
                                                >
                                                    <Text
                                                        fontSize={['xs', 'sm']}
                                                        mx={'auto'}
                                                        fontWeight={'bold'}
                                                    >
                                                        {numberOfProductsInCarts}
                                                    </Text>

                                                </Tag>}

                                        </Box>}
                                        <Box
                                            marginY={'auto'}
                                            height={'fit-content'}
                                        >
                                            <CartsPopover
                                                numberOfProductsInCarts={numberOfProductsInCarts}
                                            />
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
                                                    fontSize={'md'}
                                                    fontWeight={'semibold'}
                                                    textColor={'white'}
                                                    size={'sm'}
                                                    mr={'2'}
                                                    variant={'black'}
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
                </motion.div>
            </motion.header >
            {user?.isBusiness && <Drawer_Menu isOpen={openDrawerBusinessAccount} user={user} closeDrawer={closeDrawerBusinessAccount} />
            }
            <CartDrawer isOpen={openDrawerCart} closeDrawer={() => setOpenDrawerCart(false)} />
            <DrawerSearchProducts isOpen={isOpenUserDrawerSearch} closeDrawer={() => setisOpenUserDrawerSearch(false)}
                onConfirmText={(value) => {
                    handleSearchText(value)
                }}
            />
        </>

    )
}

export default Header