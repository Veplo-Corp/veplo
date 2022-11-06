import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Circle_Color from './Circle_Color'
import { Color } from '../mook/colors'
import { Macrocategory } from '../mook/macrocategories'
import { Day } from '../mook/days'

// const value = [
//     { name: 'Wade Cooper' },
//     { name: 'Arlene Mccoy' },
//     { name: 'Devon Webb' },
//     { name: 'Tom Cook' },
//     { name: 'Tanya Fox' },
//     { name: 'Hellen Schmidt' },
// ]

// type Value = {
//     name: string, 
//     DB_name: string , 
//     color?: string,
// }


const Select_multiple_options: React.FC<{values:Color[] | undefined | Macrocategory[] | Day[] ,  type:string, handleChangeState?: any}> = ({values, type, handleChangeState}) => {
    const [selectedValue, setSelectedValue] = useState<Color[]>([])
    const [isListboxDisabled, setIsListboxDisabled] = useState(false)




    useEffect(() => {   
        if(values === undefined){
            setIsListboxDisabled(true)
        } else if(values){
            setIsListboxDisabled(false)
        }
        if(type === 'size'){
            setSelectedValue([])
        }
    }, [values])

    const onChangeSelectedValue = (e: any[]) => {
        if(type === 'day'){
            const selectedValues = e.sort((a, b) => a.dayPosition - b.dayPosition)
            setSelectedValue(selectedValues)
            handleChangeState(selectedValues, 'days_open')            
        }
        return setSelectedValue(e)
    }
    
    return (
        <Listbox value={selectedValue} disabled={isListboxDisabled} onChange={onChangeSelectedValue} multiple>
            <div className="relative mt-1 border border-gray rounded-lg">
                <Listbox.Button className="cursor-default w-full border-none py-3.5 rounded-lg pl-3 pr-10 text-sm  leading-5 text-gray-900 focus:ring-0">
                    <span className="block truncate text-start">{selectedValue.map((value) => value.name).join(', ')}</span>
                    {!selectedValue[0] && <span className="block truncate text-start text-white">---</span>}
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
                    <Listbox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {values &&  values.map((value, valueIdx) => 
                        (
                            <Listbox.Option
                                key={valueIdx}
                                className={({ active, selected }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 
                                    ${selected ? 'bg-blue-700 text-white' : ''}`
                                    /* ${active ? 'bg-blue-700 text-white' : 'text-white-900'} */
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
                                        {value.color ? (
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 ">
                                                <Circle_Color colors={[value.color]} dimension={5} space={0} />
                                            </span>) : null
                                        }
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

export default Select_multiple_options
