import { Fragment, useEffect, useRef, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useSelector } from 'react-redux'

const Autocomplete: React.FC<{ handleChangeValues?: any, selectedValue?: string, placeholder?: string }> = ({ handleChangeValues, selectedValue, placeholder }) => {
    const [selected, setSelected] = useState(selectedValue || '')
    const [query, setQuery] = useState('')
    const [filteredValues, setFilteredValues] = useState<any>([])
    const brandsRedux: string[] = useSelector((state: any) => state.brands.brands)
    const [brands, setBrands] = useState([''])

    useEffect(() => {
        if (brandsRedux && brandsRedux.length > 0) {
            setBrands(brandsRedux)
            setFilteredValues(brandsRedux)
        }
    }, [brandsRedux])

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
        <div className="w-full">
            <Combobox value={selected} onChange={(value) => {
                setSelected(value)
                handleChangeValues(value)
            }}>
                <div className="relative mt-1">
                    <div className="border border-gray rounded-lg">
                        {brands && <Combobox.Input
                            autoComplete='off'
                            placeholder=''
                            className="w-full border-none py-3.5 rounded-lg pl-3 pr-10 text-sm  leading-5 text-gray-900 focus:ring-0"
                            //displayValue={(value) => value}
                            onChange={(event) => setQuery(event.target.value)}
                        />}
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
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
                        <Combobox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filteredValues.length === 0 && query !== '' ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                    Nessun brand trovato.
                                </div>

                            ) : (

                                filteredValues.map((value: any, valueId: any) => (
                                    <Combobox.Option
                                        key={valueId}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-700 text-white' : 'text-gray-900'
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
                                                {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
                                                            }`}
                                                    >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
        </div>
    )
}


export default Autocomplete;