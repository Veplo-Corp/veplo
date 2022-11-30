import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Mapbox_Result } from '../../src/interfaces/mapbox_result.interface';
import { CATEGORIES, Categories } from '../mook/categories';
import createUrlSchema from '../utils/create_url';



const Show_Categories_NavBar: React.FC<{ gender: string, closeCategory: any }> = ({ gender, closeCategory }) => {
    const address_user:Mapbox_Result = useSelector((state:any) => state.address.address);
    const router = useRouter();
    const categories = useRef<Categories>(CATEGORIES)

    const handleClickCategory = (categorySelected:any) => {
        const categorySelectedUrl = createUrlSchema([categorySelected])
        router.push(`/prodotti/${address_user.city?.toLocaleLowerCase()}-${address_user.postcode}/${gender}-${categorySelectedUrl}`)
        closeCategory(false)
    }

    return (
        <div className='border-b-2 border-gray-100 bg-white w-screen fixed z-50 top-30 pt-4 pb-10 px-10'>
            <h1 className='font-bold text-lg'>Abbigliamento {gender}</h1>
            <div className='grid grid-cols-2 mr-96 mt-3 lg:w-5/12'>
                {gender === 'donna' && categories.current.donna.abbigliamento.map((category) => {
                    return (
                        <p key={category.name} className='text-base font-medium mb-1 w-fit cursor-pointer hover:underline underline-offset-2'
                        onClick={() => handleClickCategory(category.name)}
                        >
                            {category.name}
                        </p>
                    )
                })}
                {gender === 'uomo' && categories.current.uomo.abbigliamento.map((category) => {
                    return (
                        <p key={category.name} className='text-base font-medium mb-1 w-fit cursor-pointer hover:underline underline-offset-2'
                        onClick={() => handleClickCategory(category.name)}
                        >
                            {category.name}
                        </p>
                    )
                })}
            </div>

        </div>

    )
}

export default Show_Categories_NavBar