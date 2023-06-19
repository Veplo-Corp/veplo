import { FC, Fragment, useEffect, useRef, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter'
import { NavArrowDown } from 'iconoir-react'
import { Color } from '../mook/colors'

const SelectOption: FC<{ defaultValue: number | string | undefined | null, values: string[] | number[] | undefined | Color[], handleClick: (value: any) => void, placeholder?: string }> = ({ defaultValue, values, handleClick, placeholder }) => {
    const [selected, setSelected] = useState<any>();

    useEffect(() => {
        if (!defaultValue) return setSelected(undefined)
        setSelected(defaultValue)
    }, [defaultValue])

    const handleEvent = (value: any) => {
        if (value === undefined) return
        setSelected(value)
        handleClick(value)
    }

    useEffect(() => {
        if (defaultValue !== undefined) return
        setSelected(undefined)
        handleClick(undefined)
    }, [values])


    return (
        <Listbox value={selected} onChange={handleEvent}
            disabled={!values}>
            <div className={`z-1 relative  ${selected ? 'bg-black text-white' : 'bg-white text-[#3A3A3A]'} border border-gray  rounded-lg min-h-[40px]`}>
                <Listbox.Button className="md:min-w-[70px] min-h-[40px] cursor-pointer  w-fit border-none py-3.5 rounded-lg pl-3 pr-9 leading-5  focus:ring-0 text-md font-semibold">
                    {typeof selected !== 'number' && <span className="block truncate text-start">{toUpperCaseFirstLetter(selected?.name || selected)} </span>}
                    {typeof selected === 'number' && <span className="block truncate text-start">{(selected)} </span>}
                    {placeholder && !selected && <span className="block truncate text-start text-">{placeholder}</span>}
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <NavArrowDown
                            className={`h-5 w-5 ${selected ? '' : 'text-gray-400'} `}
                            aria-hidden="true"
                        />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options
                        className={`z-10 bg-white absolute mt-1 max-h-44 min-w-full w-fit overflow-auto rounded-md bg-whitetext-base shadow-lg ring-1 text-[#3A3A3A] ring-black ring-opacity-5 focus:outline-none sm:text-sm`}>
                        {values?.map((value: any, valueIdx: number) => {
                            return (
                                <Listbox.Option

                                    key={valueIdx}
                                    className={({ active }) =>
                                        `relative 
                                        cursor-default select-none py-2 pl-3 pr-6 ${active ? 'bg-[#F2F2F2] cursor-pointer' : ''}`
                                    }
                                    value={value}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={`block truncate`}
                                            >
                                                {typeof value === 'string' ? toUpperCaseFirstLetter(value) : value}
                                            </span>
                                            {/* {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null} */}
                                        </>
                                    )}
                                </Listbox.Option>
                            )
                        })}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    )
}

export default SelectOption