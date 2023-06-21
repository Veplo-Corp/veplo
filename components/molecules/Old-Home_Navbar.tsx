import { Box } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import createUrlSchema from '../utils/create_url';
import getGenderandMacrocategory from '../utils/get_Gender_and_Macrocategory';

type Props = {
    showCategory: boolean,
    onShowCategory: (value?: boolean | '', gender?: string) => void,
    openAddressModal: () => void
}

const types = [
    {
        title: 'Donna',
        url: 'donna'
    },
    {
        title: 'Uomo',
        url: 'uomo'
    }
]


const navbar: React.FC<Props> = ({ showCategory, onShowCategory, openAddressModal }) => {

    const address_user = useSelector((state: any) => state.address.address);


    const router = useRouter()
    const [gender, setGender] = useState('')
    useEffect(() => {
        setGender('')
        const pathname = router.pathname;
        if (pathname.includes('negozi')) {
            return setGender('negozi')
        }

        const slug = router.query.slug;
        if (typeof slug !== 'string') return
        const elementGenderMacrocategory: { gender: string | null, macrocategory: string | null } = getGenderandMacrocategory(slug);
        if (!elementGenderMacrocategory?.gender) { return }
        setGender(elementGenderMacrocategory.gender)
        return () => {
        }

    }, [router])








    return (

        <nav className="fixed justify-center w-full hidden md:flex pr-20 lg:pr-0 gap-10">  {/* z-10 */}
            {types.map(type => {
                return (
                    <div
                        key={type.url}
                        className={` ${gender === type.url && !showCategory ? "relative" : ""} cursor-pointer text-sm lg:text-base font-medium text-gray-900 hover:text-gray-900 mr-4 py-0.5 `}>
                        <div

                            className={` 
                    ${gender === type.url && !showCategory ? "relative" : ""}
                    my-auto
                    `}
                            onMouseOver={() => onShowCategory('', type.url)}
                            onClick={() => {
                                onShowCategory(false)
                            }}
                        >
                            <Box
                                zIndex={'modal'}
                                fontWeight={'semibold'}
                                fontSize={'xl'}
                            >
                                {address_user ? (<Link
                                    prefetch={false}
                                    href={`${address_user ? `/abbigliamento/${address_user.postcode.length === 5 ? createUrlSchema([address_user.city, address_user.postcode]) : createUrlSchema([address_user.city])}/${type.url}-abbigliamento` : '/'}`}
                                >
                                    {type.title}
                                </Link>) :
                                    (
                                        <Box
                                            onClick={
                                                openAddressModal
                                            }
                                        >
                                            {type.title}
                                        </Box>
                                    )
                                }
                            </Box>
                            {gender === type.url && !showCategory && <Box
                                zIndex={'hide'}
                                className={` absolute w-full h-[8px] bottom-[3px] bg-red-500 z-0`}>
                            </Box>}
                        </div>
                    </div>
                )
            })}

            <div
                className={` ${gender === 'negozi' && !showCategory ? "relative" : ""} cursor-pointer text-sm lg:text-base font-medium text-gray-900 hover:text-gray-900 mr-4 py-0.5 
            
            `}>
                <div
                    className={` ${gender === 'negozi' && !showCategory ? "relative z-50" : ""}
                    
                    `}
                    onMouseOver={() => onShowCategory(false)}

                >
                    <Box
                        zIndex={'modal'}
                        fontWeight={'semibold'}
                        fontSize={'xl'}
                    >
                        {address_user ? (<Link
                            prefetch={false}
                            href={`${address_user ? `/negozi/${address_user.postcode.length === 5 ? createUrlSchema([address_user.city, address_user.postcode]) : createUrlSchema([address_user.city])}` : '/'}`}
                        >
                            Negozi
                        </Link>) :
                            (
                                <Box
                                    onClick={
                                        openAddressModal
                                    }
                                >
                                    Negozi
                                </Box>
                            )
                        }

                    </Box>
                    {gender === 'negozi' && !showCategory && <Box
                        zIndex={'hide'}
                        className={` absolute w-full h-[8px] bottom-[3px] bg-red-500 z-0`}>
                    </Box>}
                </div>

            </div>

        </nav>

        /* types.map(((type: { name: string, action: any }) => {
                    <div key={type.name} className={` ${gender === 'donna' && !showCategory ? "relative" : ""} cursor-pointer text-sm lg:text-base font-medium text-gray-900 hover:text-gray-900 mr-4 py-0.5 `}>
                        <a
                            className={` ${gender === 'donna' && !showCategory ? "relative z-50" : ""}`}
                            onClick={() => onShowCategory('', 'donna')}>
                            <div className='z-[100]'>
                                Donna
                            </div>
                        </a>
                        <div className='absolute w-full h-[8px] bottom-[3px] bg-red-500 z-0'>
                        </div>
                    </div>
                }))
            } */

    )
}

export default navbar