import Link from 'next/link'
import React, { FC } from 'react'

const To_Home_Logo: FC<{href:string}> = ({href}) => {
    return (
        <Link href={href} >
            <a className="font-black ml-1 md:ml-5 text-2xl md:text-3xl italic text-black-900  ">VEPLO</a>
        </Link>
    )
}

export default To_Home_Logo