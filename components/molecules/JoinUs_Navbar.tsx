import React from 'react'
import Link from 'next/link'


const JoinUs_Navbar = () => {
    return (
        /* Join us section upper navbar for Companies */
        <div className='w-full fixed top-0 hidden md:flex justify-end bg-gray-100 pt-1 pb-2 ' >
            <Link href="/impresa/login">
                <a className=" text-xs pr-8">
                    <span className='underline underline-offset-2 pr-1'>
                        Unisciti a noi
                    </span>
                    |
                    <span className='underline underline-offset-2 pl-1'>
                        Iscrivi gratis il tuo negozio
                    </span>
                </a>
            </Link>
        </div >
    )
}

export default JoinUs_Navbar