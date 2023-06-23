import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Firebase_User } from '../../src/interfaces/firebase_user.interface';
import { Mapbox_Result } from '../../src/interfaces/mapbox_result.interface';
import { CATEGORIES, Categories } from '../mook/categories';
import createUrlSchema from '../utils/create_url';
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter';
import Link from 'next/link';
import { Transition } from '@headlessui/react'



const Show_Categories_NavBar: React.FC<{ gender: string, closeCategory: () => void }> = ({ gender, closeCategory }) => {
    const router = useRouter();
    const [categories] = useState(CATEGORIES);
    const [indexCategory, setindexCategory] = useState(1)

    useEffect(() => {
        setindexCategory(Object.keys(categories).indexOf(gender))
    }, [gender])


    const [show, setshow] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            setshow(true)
        }, 0);
    }, [])



    return (
        <Transition
            show={show}
            as={Fragment}
            enter="transition ease-out duration-450"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-10000"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <div
                className=' bg-white border-2 mt-2 border-gray-100 w-1/2 left-1/4 xl:w-4/12 xl:left-1/3 fixed z-50 top-12 pt-4 pb-10 px-10 rounded-2xl'

            >
                <h1 className='font-bold text-lg'>Abbigliamento {toUpperCaseFirstLetter(gender)}</h1>
                <div className='grid grid-cols-2 mt-3 gap-x-2.5 '>
                    <Link
                        onClick={closeCategory}
                        prefetch={false}
                        className='text-base font-medium mb-1 w-fit cursor-pointer hover:underline underline-offset-2'
                        href={indexCategory === 1 ? `/abbigliamento/uomo-abbigliamento/tutto/rilevanza` : `/abbigliamento/donna-abbigliamento/tutto/rilevanza`}
                    >
                        Tutto l'abbigliamento
                    </Link>
                    {Object.values(categories)[indexCategory]?.abbigliamento.map((category: any) => {
                        const gender = indexCategory === 1 ? 'uomo' : 'donna'
                        const categoryForUrl = Object.values(categories)[indexCategory]?.abbigliamento.find((element: any) => element.name === category.name)?.url
                        let categorySelectedUrl;

                        if (categoryForUrl) {
                            categorySelectedUrl = createUrlSchema([gender, categoryForUrl])
                        }

                        return (
                            <Link
                                prefetch={false}
                                href={!categorySelectedUrl ? `/ prodotti / ${gender}-abbigliamento/tutto/rilevanza` : `/abbigliamento/${categorySelectedUrl}/tutto/rilevanza`}
                                key={category.name} className='text-base font-medium mb-1 w-fit cursor-pointer hover:underline underline-offset-2'
                                onClick={closeCategory}
                            >
                                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                            </Link>
                        )
                    })
                    }
                </div>
            </div >
        </Transition>




    )
}

export default Show_Categories_NavBar


