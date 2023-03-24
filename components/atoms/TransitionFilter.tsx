import { Transition } from '@headlessui/react'
import React, { FC, ReactNode } from 'react'

const TransitionFilter: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            {children}
        </Transition>
    )
}

export default TransitionFilter