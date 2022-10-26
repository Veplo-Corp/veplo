import React from 'react'

interface Props {
    city: string | undefined,
    gender?: string | undefined,
    category?: string | undefined
}

const DintorniLogo_Below_Header: React.FC<Props>= ({city, category, gender}) => {
    return (
        <div className='flex justify-between mb-5'>
            <h1 className="font-black text-xl md:text-5xl italic text-black-900  ">Dintorni {city && <span className='text-base md:text-2xl'>per {city?.charAt(0).toUpperCase() + city?.slice(1)}</span>}</h1>
            {gender && category && <p className='m-auto mr-0 mb-0'>{gender?.charAt(0).toUpperCase() + gender?.slice(1)} | {category?.charAt(0).toUpperCase() + category?.slice(1)}</p>}
        </div>
    )
}

export default DintorniLogo_Below_Header