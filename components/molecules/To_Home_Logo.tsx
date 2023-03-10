import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import getCityAndPostcodeFromSlug from '../utils/get_City_and_Postcode_from_Slug'

const To_Home_Logo: FC<{ href: string }> = ({ href }) => {
    const router = useRouter();
    const [city, setCity] = useState('')
    useEffect(() => {
        if (typeof router.query.city_cap !== 'string') {
            return setCity('')
        }
        const elementCityCap: { city: string, postcode: string | null } = getCityAndPostcodeFromSlug(router.query.city_cap);
        setCity(elementCityCap.city)
    }, [router.query.city_cap])



    return (
        <Link href={href} >
            <div className="font-black  text-2xl md:text-3xl italic text-black-900  flex">Veplo{
                city.length > 0 &&
                <>
                    <span className='ml-1 hidden lg:flex my-auto mb-0 text-xl'>per</span>
                    <span className='ml-1 hidden lg:flex text-2xl my-auto mb-0'> {city?.charAt(0).toUpperCase() + city?.slice(1)}</span>
                </>
            }
            </div>

        </Link>
    )
}

export default To_Home_Logo