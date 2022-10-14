import React from 'react';

type Props = {
    genere?: 'uomo' | 'donna' | undefined | String[],
    showCategory: boolean,
    onShowCategory: () => void
}

const navbar: React.FC<Props> = ({genere, showCategory, onShowCategory}) => {      


    return (
        
        <nav className=" justify-center w-full hidden md:flex  "> {/* pr-80 */}
            <a className={` ${genere == "uomo" && !showCategory ? "underline underline-offset-4" : ""} cursor-pointer text-base font-medium text-gray-900 hover:text-gray-900 mr-8 py-0.5`} onClick={onShowCategory} >Uomo</a> 
            <a className={` ${genere == "donna" && !showCategory ? "underline underline-offset-4" : ""} cursor-pointer text-base font-medium text-gray-900 hover:text-gray-900 mr-8 py-0.5`} onClick={onShowCategory}>Donna</a>
            <a className="cursor-pointer text-base font-medium text-white hover:text-white-900 rounded-2xl bg-rose-800 py-px px-4">Negozi</a>
        </nav>
        
    )
}

export default navbar