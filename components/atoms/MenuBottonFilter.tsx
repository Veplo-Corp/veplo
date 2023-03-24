import { Menu } from '@headlessui/react'
import React, { FC, ReactNode } from 'react'

const MenuBottonFilter: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <Menu.Button className="z-0 inline-flex w-full justify-center rounded-[10px] bg-white border-[1px] px-4 py-3 text-md text-black font-black border-gray-300 ">
            {children}

        </Menu.Button>
    )
}

export default MenuBottonFilter