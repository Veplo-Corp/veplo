import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import createUrlSchema from '../utils/create_url';
import getGenderandMacrocategory from '../utils/get_Gender_and_Macrocategory';

type Props = {
    showCategory: boolean,
    onShowCategory: (value?: boolean | '', gender?: string) => void
}




const navbar: React.FC<Props> = ({ showCategory, onShowCategory }) => {
    const pushToStores = () => {
        onShowCategory(false)
        if (address_user) {
            if (address_user.city && address_user.city !== 'undefined') {
                if (address_user.postcode.length === 5) {
                    const uri = createUrlSchema([address_user.city, address_user.postcode])
                    return router.push(`/negozi/${uri}`)
                } else {
                    const uri = createUrlSchema([address_user.city])
                    return router.push(`/negozi/${uri}`)
                }
            }
        }
        return
    }

    // const types = [
    //     {
    //         name: 'Donna',
    //         action: onShowCategory('', 'donna'),
    //     },
    //     {
    //         name: 'Uomo',
    //         action: onShowCategory('', 'uomo'),
    //     },
    //     {
    //         name: 'Negozi',
    //         action: pushToStores(),
    //     },
    // ]
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


    const address_user = useSelector((state: any) => state.address.address);
    // console.log(address_user);





    return (

        <nav className="fixed justify-center w-full hidden md:flex pr-20 lg:pr-0 gap-4">  {/* z-10 */}

            <div className={` ${gender === 'donna' && !showCategory ? "relative" : ""} cursor-pointer text-sm lg:text-base font-medium text-gray-900 hover:text-gray-900 mr-4 py-0.5 `}>
                <a
                    className={` 
                    ${gender === 'donna' && !showCategory ? "relative z-50" : ""}
                    `}
                    onMouseOver={() => onShowCategory('', 'donna')}>
                    <div className='z-[100]'>
                        Donna
                    </div>
                </a>
                {gender === 'donna' && !showCategory && <div className={` absolute w-full h-[8px] bottom-[3px] bg-red-500 z-0`}>
                </div>}
            </div>
            <div className={` ${gender === 'uomo' && !showCategory ? "relative" : ""} cursor-pointer text-sm lg:text-base font-medium text-gray-900 hover:text-gray-900 mr-4 py-0.5 `}>
                <a
                    className={` ${gender === 'uomo' && !showCategory ? "relative z-50" : ""}`}
                    onMouseOver={() => onShowCategory('', 'uomo')}>
                    <div className='z-[100]'>
                        Uomo
                    </div>
                </a>
                {gender === 'uomo' && !showCategory && <div className={` absolute w-full h-[8px] bottom-[3px] bg-red-500 z-0`}>
                </div>}
            </div>
            
            <div className={` ${gender === 'negozi' && !showCategory ? "relative" : ""} cursor-pointer text-sm lg:text-base font-medium text-gray-900 hover:text-gray-900 mr-4 py-0.5 
            
            `}>
                <a
                    className={` ${gender === 'negozi' && !showCategory ? "relative z-50" : ""}
                    
                    `}
                    onClick={pushToStores}
                    onMouseOver={() => onShowCategory(false)}
                    >
                    <div className='z-[100]'>
                        Negozi
                    </div>
                </a>
                {gender === 'negozi' && !showCategory && <div className={` absolute w-full h-[8px] bottom-[3px] bg-red-500 z-0`}>
                </div>}
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