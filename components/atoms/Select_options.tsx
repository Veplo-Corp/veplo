

import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Macrocategory } from '../mook/macrocategories'



const Select_options: React.FC<{ values: Macrocategory[] | undefined, handleClick?: any, type: string}> = ({ values, handleClick, type }) => {
    const [selected, setSelected] = useState<Macrocategory>();
    const [isListboxDisabled, setIsListboxDisabled] = useState(false)
    
    const handleEvent = (value) => {
        setSelected(value)
        handleClick(value)
    }

    useEffect(() => {        
        if(values === undefined){
            setIsListboxDisabled(true)
        } else if(values){
            setIsListboxDisabled(false)
        }

        if(type === 'microcategory'){
            setSelected(undefined)
        }
    }, [values])
    
    

    return (
        <Listbox disabled={isListboxDisabled} value={selected} onChange={handleEvent}>
            <div className={`z-1 relative mt-1 border border-gray rounded-lg ${!isListboxDisabled ? 'bg-white' : 'bg-gray-200' }`}>
                <Listbox.Button className="cursor-default w-full border-none py-3.5 rounded-lg pl-3 pr-10 text-sm  leading-5 text-gray-900 focus:ring-0">
                    {selected ? <span className="block truncate text-start">{selected.name}</span> : <span className="block truncate text-start text-white">--</span>}

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
                        {type === 'macrocategory' && <span
                            className="z-10  px-10 py-2 block font-extrabold text-base bg-gray-100"
                        >
                            Uomo
                        </span>}
                        {values && values.map((value, valueIdx) => {
                            return value.gender === 'uomo' && (
                                <Listbox.Option
                                    key={valueIdx}
                                    className={({ active }) =>
                                        ` z-10 relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-700 text-white' : 'text-white-900'}`
                                    }
                                    value={value}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                    }`}
                                            >
                                                {value.name}
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
                        } )}
                        {type === 'macrocategory' && <span
                            className="px-10 py-2 block font-extrabold text-base bg-gray-100"
                        >
                            Donna
                        </span>}
                        {values && values.map((value, valueIdx) => {
                            return value.gender === 'donna' && (
                                <Listbox.Option
                                    key={valueIdx}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-700 text-white' : 'text-white-900'
                                        }`
                                    }
                                    value={value}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                    }`}
                                            >
                                                {value.name}
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
                        } )}
                        {type === 'microcategory' && values && values.map((value, valueIdx) => {  
                            return(
                                <Listbox.Option
                                    key={valueIdx}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-700 text-white' : 'text-white-900'
                                        }`
                                    }
                                    value={value}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                    }`}
                                            >
                                                {value.name}
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
                        } )}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    )
}

export default Select_options
