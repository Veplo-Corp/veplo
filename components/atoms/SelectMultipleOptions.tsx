import React, { FC, Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { CheckIcon } from '@chakra-ui/icons'



const SelectMultipleOptions: FC<{ limitNumber: number, handleValue: (selectedValue: (string[] | [])) => void, values: string[] | undefined, defaultValue?: string[] | undefined }> = ({ limitNumber, handleValue, values, defaultValue }) => {
    const [selected, setSelected] = useState<string[]>([])


    const handleSelectedValue = (value: string[]) => {
        if (value?.length > limitNumber) return

        handleValue(value)
    }

    useEffect(() => {
        if (defaultValue) {
            setSelected(defaultValue)
        }
        else {
            setSelected([])
        }
    }, [defaultValue])

    useEffect(() => {
        console.log(values);

    }, [values])



    return (
        <Listbox value={selected} onChange={(value) => { handleSelectedValue(value) }} multiple >
            <div className={`z-1 relative mt-1 border border-gray rounded-lg`}>
                <Listbox.Button className="cursor-default min-w-[100px] md:min-w-[140px] w-full border-none py-3.5 rounded-lg pl-3 pr-10 text-sm  leading-5 text-gray-900 focus:ring-0">
                    {selected.length > 0 ? <span className="block truncate text-start">{selected.map((person) => person).join(', ')} </span> : <span className="block truncate text-start text-white">---</span>}
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
                        {values && values.map((value) => (
                            <Listbox.Option key={value} value={value}
                                className={({ active }) =>
                                    ` relative cursor-default select-none py-2 pl-10 pr-4  ${active ? 'bg-blue-700 text-white' : 'text-white-900'} `
                                }
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
                        ))}
                    </Listbox.Options>
                </Transition>

            </div>
        </Listbox>
    )
}

export default SelectMultipleOptions