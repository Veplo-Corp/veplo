import React from 'react'

interface Props {
    city: string | undefined,
    gender?: string | undefined,
    category?: string | undefined | null
}

const DintorniLogo_Below_Header: React.FC<Props> = ({ city, category, gender }) => {
    return (
        <div className='md:flex justify-between mb-5 mt-2 md:mt-0'>
            <h1 className="hidden md:flex font-black text-xl md:text-5xl italic text-black-900 ">Dintorni {
                city &&
                <>
                    <span className='ml-1 hidden md:flex my-auto mb-0 text-base md:text-2xl'>per</span>
                    <span className='ml-1 text-base md:text-2xl my-auto mb-0'> {city?.charAt(0).toUpperCase() + city?.slice(1)}</span>
                </>
            }</h1>
                    {city && <h1 className="flex md:hidden font-black text-xl md:text-5xl italic text-black-900 leading-5">{city?.charAt(0).toUpperCase() + city?.slice(1)}</h1>}
                    
                    {gender && category && <p className='flex leading-4 text-xs md:text-base md:font-medium my-auto mb-1 ' >{gender}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 my-auto mb-[3px]">
                            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                        </svg>
                        {category}</p>}

        </div>
    )
}

export default DintorniLogo_Below_Header