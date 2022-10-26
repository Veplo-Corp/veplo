import React from 'react'

interface Props {
    city: string | undefined,
    genere?: string | undefined,
    categoria?: string | undefined
}

const DintorniLogo_Below_Header: React.FC<Props>= ({city, categoria, genere}) => {
    return (
        <div className='flex justify-between mb-5'>
            <h1 className="font-black text-xl md:text-5xl italic text-black-900  ">Dintorni {city && <span className='text-base md:text-2xl'>per {city?.charAt(0).toUpperCase() + city?.slice(1)}</span>}</h1>
            {genere && categoria && <p className='m-auto mr-0 mb-0'>{genere?.charAt(0).toUpperCase() + genere?.slice(1)} | {categoria?.charAt(0).toUpperCase() + categoria?.slice(1)}</p>}
        </div>
    )
}

export default DintorniLogo_Below_Header