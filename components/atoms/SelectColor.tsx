import { FC, Fragment, useEffect, useRef, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter'
import { Color, COLORS } from '../mook/colors'
import Circle_Color from './Circle_Color'

const SelectColor: FC<{ defaultValue?: string, handleClick: (value: any) => void, colors: Color[], }> = ({ defaultValue, handleClick, colors }) => {
    const [selected, setSelected] = useState<any>(null);

    const handleEvent = (value: any) => {
        setSelected(value)
        handleClick(value)
    }

    // useEffect(() => {
    //     setSelected(undefined)
    //     handleClick(undefined)
    // }, [])

    useEffect(() => {
        if (typeof defaultValue === 'string')
            setSelected(defaultValue)
    }, [defaultValue])



    return (
        <Listbox value={selected} onChange={handleEvent}
        >
            <div className={`z-1 relative mt-1 border border-gray rounded-lg `}>
                <Listbox.Button className="cursor-default w-full border-none py-3.5 rounded-lg pl-3 pr-10 text-sm  leading-5 text-gray-900 focus:ring-0">

                    {selected ? <span className="block truncate text-start">{selected.name || selected} </span> : <span className="block truncate text-start text-white">--</span>}
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
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
                    <Listbox.Options className="z-10 bg-white absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-whitetext-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {colors.map((color, valueIdx: number) => {
                            return (
                                <Listbox.Option
                                    key={valueIdx}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-700 text-white' : 'text-white-900'
                                        }`
                                    }
                                    value={color.name}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 ">
                                                <Circle_Color colors={[color.cssColor]} dimension={5} space={0} />
                                            </span>
                                            <span
                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                    }`}
                                            >
                                                {color.name}
                                            </span>

                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
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

export default SelectColor