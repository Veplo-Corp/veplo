import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import createUrlSchema from '../utils/create_url';

type Props = {
    genere?: 'uomo' | 'donna' | undefined | String[],
    showCategory: boolean,
    onShowCategory: (value?:boolean | '', gender?: string) => void
}

const navbar: React.FC<Props> = ({ genere, showCategory, onShowCategory }) => {
    const router = useRouter();
    const address_user = useSelector((state) => state.address.address);
    // console.log(address_user);
    


    const pushToStores = () => {
        onShowCategory(false)
        if(address_user){
            if(address_user.city && address_user.city !== 'undefined'){
                if(address_user.postcode.length === 5){
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

    return (

        <nav className="fixed justify-center w-full hidden md:flex pr-20 lg:pr-0 z-10 "> {/* pr-80 */}
            <a className={` ${genere == "uomo" && !showCategory ? "underline underline-offset-4" : ""} cursor-pointer text-sm lg:text-base font-medium text-gray-900 hover:text-gray-900 mr-8 py-0.5`} onClick={() => onShowCategory('' , 'uomo')} >Uomo</a>
            <a className={` ${genere == "donna" && !showCategory ? "underline underline-offset-4" : ""} cursor-pointer text-sm lg:text-base font-medium text-gray-900 hover:text-gray-900 mr-8 py-0.5`} onClick={() => onShowCategory('', 'donna')}>Donna</a>
            <a className="cursor-pointer text-sm lg:text-base font-medium text-white hover:text-white-900 rounded-2xl bg-rose-800 py-px px-4"
            onClick={pushToStores}
            >Negozi</a>
        </nav>

    )
}

export default navbar