import { FC, Fragment, useEffect, useRef, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { CATEGORIES, Categories, Univers } from '../mook/categories'
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter'

const SelectMacrocategory: FC<{ univers: Univers, selectedValueBefore: string | undefined, handleClick: (value: any) => void }> = ({ selectedValueBefore, handleClick, univers }) => {
    const [selected, setSelected] = useState<string>();
    const categories = useRef(CATEGORIES)

    const handleEvent = (value: any) => {
        console.log(value);
        handleClick(value)
    }


    useEffect(() => {
        if (!selectedValueBefore) return setSelected(undefined)
        setSelected(selectedValueBefore)

    }, [selectedValueBefore])


    return (
        <Listbox value={selected} onChange={(value) => handleEvent(value)}>
            <div className={`z-1 relative mt-1 border border-gray rounded-lg text-base ${true ? 'bg-white' : 'bg-gray-200'}`}>
                <Listbox.Button className="cursor-default w-full border-none py-3.5 rounded-lg pl-3 pr-10 text-base  leading-5 text-gray-900 focus:ring-0">

                    {selected ? <span className="block truncate text-start">{selected} </span> : <span className="block truncate text-start text-white">--</span>}
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

                    <Listbox.Options className="z-10 bg-white absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-whitetext-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-base">
                        {Object.keys(categories.current).map((gender: string, indexObject: number) => {
                            return (
                                <div key={indexObject}>
                                    <span
                                        key={indexObject}
                                        className="z-10  px-10 py-2 block font-extrabold text-base bg-gray-100"
                                    >
                                        {toUpperCaseFirstLetter(gender)}
                                    </span>
                                    {Object.values(categories.current)[indexObject][univers].map((value: any, valueIdx: number) => {
                                        return (
                                            <Listbox.Option
                                                key={valueIdx}
                                                className={({ active }) =>
                                                    ` z-10 relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-700 text-white' : 'text-white-900'}`
                                                }
                                                value={{
                                                    ...value,
                                                    gender
                                                }}
                                            >
                                                {({ selected }) => (
                                                    <>
                                                        <span
                                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                }`}
                                                        >
                                                            {value.name} ({toUpperCaseFirstLetter(gender)})
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
                                </div>


                            )
                        })}

                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    )
}

export default SelectMacrocategory