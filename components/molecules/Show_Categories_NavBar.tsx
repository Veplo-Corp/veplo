import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Mapbox_Result } from '../../src/interfaces/mapbox_result.interface';
import { CATEGORIES, Categories } from '../mook/categories';
import createUrlSchema from '../utils/create_url';



const Show_Categories_NavBar: React.FC<{ gender: string, closeCategory: any }> = ({ gender, closeCategory }) => {
    const address_user: Mapbox_Result = useSelector((state: any) => state.address.address);
    const router = useRouter();
    const [categories] = useState(CATEGORIES);
    const [indexCategory, setindexCategory] = useState(1)

    useEffect(() => {
        setindexCategory(Object.keys(categories).indexOf(gender))
    }, [gender])


    const handleClickCategory = (categorySelected: string) => {
        let gender: string = 'donna'
        if (indexCategory === 1) {
            gender = 'uomo'
        }
        const categoryForUrl = Object.values(categories)[indexCategory].abbigliamento.find(category => category.name === categorySelected)?.url
        if (!categoryForUrl) {
            router.push(`/prodotti/${address_user.city?.toLocaleLowerCase()}-${address_user.postcode}/${gender}-abbigliamento`)
        } else {
            const categorySelectedUrl = createUrlSchema([gender, categoryForUrl])
            router.push(`/prodotti/${address_user.city?.toLocaleLowerCase()}-${address_user.postcode}/${categorySelectedUrl}`)
        }
    }
    // console.log(Object.keys(categories).indexOf(gender));
    // console.log(Object.values(categories));


    return (
        //da aggiustare
        <div className='border-b-2 border-gray-100 bg-white w-screen fixed z-50 top-30 pt-4 pb-10 px-10'>
            <h1 className='font-bold text-lg'>Abbigliamento {gender}</h1>
            <div className='grid grid-cols-2 mr-96 mt-3 lg:w-5/12'>
                <p className='text-base font-medium mb-1 w-fit cursor-pointer hover:underline underline-offset-2'
                    onClick={() => handleClickCategory('abbigliamento')}
                >
                    Tutto l'abbigliamento
                </p>
                {Object.values(categories)[indexCategory].abbigliamento.map((category) => {
                    return (
                        <p key={category.name} className='text-base font-medium mb-1 w-fit cursor-pointer hover:underline underline-offset-2'
                            onClick={() => handleClickCategory(category.name)}
                        >
                            {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                        </p>
                    )
                })
                }
            </div>
            {/* <div className='grid grid-cols-2 mr-96 mt-3 lg:w-5/12'>
                {gender === 'donna' && categories.donna.abbigliamento.map((category) => {
                    return (
                        <p key={category.name} className='text-base font-medium mb-1 w-fit cursor-pointer hover:underline underline-offset-2'
                            onClick={() => handleClickCategory(category.name)}
                        >
                            {category.name}
                        </p>
                    )
                })}
                {gender === 'uomo' && categories.uomo.abbigliamento.map((category) => {
                    return (
                        <p key={category.name} className='text-base font-medium mb-1 w-fit cursor-pointer hover:underline underline-offset-2'
                            onClick={() => handleClickCategory(category.name)}
                        >
                            {category.name}
                        </p>
                    )
                })}
            </div> */}

        </div>

    )
}

export default Show_Categories_NavBar