import React from 'react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useSelector } from 'react-redux'
import { NavArrowDown } from 'iconoir-react'

const BrandsFilter: React.FC<{ handleChangeValues: any, selectedValue?: string | undefined, placeholder?: string }> = ({ handleChangeValues, selectedValue, placeholder }) => {
    const [selected, setSelected] = useState('')
    const [query, setQuery] = useState('')
    const [filteredValues, setFilteredValues] = useState<any>([])
    const brandsRedux: string[] = useSelector((state: any) => state.brands.brands)
    const [brands, setBrands] = useState([''])

    useEffect(() => {
        if (brandsRedux && brandsRedux.length > 0) {
            setBrands(brandsRedux)
            return setFilteredValues(brandsRedux)
        }
    }, [brandsRedux])

    useEffect(() => {
        if (!selectedValue) return setSelected('')
        return setSelected(selectedValue)
    }, [selectedValue])


    useEffect(() => {
        if (query === '') return setFilteredValues(brandsRedux)
        setFilteredValues((prevstate: any) => {
            if (!brands) return
            const results = query === '' || query.length < 3
                ? brands.filter((value) =>
                    value
                        .toLowerCase()
                        .replace(/\s+/g, '')
                        .startsWith(query.toLowerCase().replace(/\s+/g, ''))
                ).slice(0, 700) : brands.filter((value) =>
                    value
                        .toLowerCase()
                        .replace(/\s+/g, '')
                        .includes(query.toLowerCase().replace(/\s+/g, ''))
                )
            if (results) return results
            return brandsRedux
        })

    }, [query])


    return (
        <Combobox
            value={selected} onChange={(value) => {
                if (!value) return
                setSelected(value)
                handleChangeValues(value)
            }}>
            <div className="relative">
                <div className="border  w-fit border-gray rounded-lg h-12 font-semibold ">
                    {brands && <Combobox.Input
                        autoComplete='off'
                        placeholder={placeholder ? placeholder : ''}

                        className={`${selected ? 'bg-black text-white placeholder:white' : 'text-[#3A3A3A] placeholder:text-[#3A3A3A]'} text-[16px]  w-fit max-w-[130px] md:max-w-[150px] pr-7 border-none rounded-lg h-full pl-3 focus:outline-none`}
                        //displayValue={(value) => value}
                        onChange={(event) => setQuery(event.target.value)}
                    />}
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <NavArrowDown
                            className={`h-5 w-5 ${selected ? 'text-white' : 'text-gray-400'} `}
                            aria-hidden="true"
                        />
                    </Combobox.Button>
                </div>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery('')}
                >
                    <Combobox.Options className="z-10 mt-1 w-fit absolute max-h-40 lg:max-h-60  min-w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredValues.length === 0 && query !== '' ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-[#3A3A3A]">
                                Nessun brand trovato.
                            </div>

                        ) : (

                            filteredValues.map((value: any, valueId: any) => (
                                <Combobox.Option
                                    key={valueId}
                                    className={({ active }) =>
                                        `relative cursor-pointer select-none py-2 md:py-3 h-full px-4 ${active ? 'bg-[#F2F2F2] text-black' : 'text-gray-900'
                                        }`
                                    }

                                    value={value}
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span
                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                    }`}
                                            >
                                                {value}
                                            </span>
                                            {/* {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
                                                            }`}
                                                    >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null} */}
                                        </>
                                    )}
                                </Combobox.Option>
                            ))
                        )}
                    </Combobox.Options>
                </Transition>
            </div>
        </Combobox>
    )
}

export default BrandsFilter