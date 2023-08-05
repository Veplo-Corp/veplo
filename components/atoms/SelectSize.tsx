import { FC, Fragment, useEffect, useRef, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter'
import { VariationCard } from '../../src/interfaces/variationCard.interface'

const SelectSize: FC<{ defaultValue?: any, values: string[] | number[], handleClick: (value: any) => void, disabledSizes: any[] }> = ({ defaultValue, values, handleClick, disabledSizes }) => {
    const [selected, setSelected] = useState<any>();

    useEffect(() => {
        setSelected(defaultValue)
    }, [defaultValue])

    const handleEvent = (value: any) => {
        if (value === undefined) return
        setSelected(value)
        handleClick(value)
    }

    useEffect(() => {
        if (defaultValue) return

        setSelected(undefined)
        handleClick(undefined)
    }, [values])










    return (
        <Listbox value={selected} onChange={handleEvent}
            disabled={values?.length < 0}
        >
            <div className={`z-1 relative mt-1 border border-gray rounded-lg ${values?.length > 0 ? 'bg-white' : 'bg-gray-100'}`}>
                <Listbox.Button className="cursor-default min-w-[100px] md:min-w-[140px] w-full border-none py-3.5 rounded-lg pl-3 pr-10 text-sm  leading-5 text-gray-900 focus:ring-0">

                    {selected ? <span className="block truncate text-start">{selected} </span> : <span className="block truncate text-start text-white">---</span>}
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
                    <Listbox.Options className="z-10 bg-white absolute mt-1 max-h-60 w-fit overflow-auto rounded-md bg-whitetext-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">

                        {values?.map((value: any, valueIdx: number) => {
                            return (
                                <Listbox.Option
                                    disabled={disabledSizes.map(element => element.size).find(element => element === value)}
                                    key={valueIdx}
                                    className={({ active }) =>
                                        ` relative cursor-default select-none py-2 pl-10 pr-4  ${active ? 'bg-blue-700 text-white' : 'text-white-900'}
                                        ${disabledSizes.map(element => element.size).find(element => element === value) ? 'bg-gray-100 text-black' : ''}
                                        `
                                    }
                                    value={value}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={` block truncate ${selected ? 'font-medium' : 'font-normal'
                                                    }`}
                                            >
                                                {value}
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

export default SelectSize