import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Circle_Color from './Circle_Color'
import { Color, COLORS } from '../mook/colors'
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


const Select_multiple_options: React.FC<{ values: any, type: string, handleChangeState?: any, selectedValueBefore?: any }> = ({ values, type, handleChangeState, selectedValueBefore }) => {
    const [selectedValue, setSelectedValue] = useState<Color[]>([])
    const [isListboxDisabled, setIsListboxDisabled] = useState(false)

    



    useEffect(() => {

        if (values === undefined) {
            setIsListboxDisabled(true)
        } else if (values) {
            setIsListboxDisabled(false)
            
        }
        if (type === 'size' && !selectedValueBefore) {
            console.log(values);
            
            setSelectedValue([])
        }

        if(selectedValueBefore){
            if (type == 'color') {
                let productColors = [];
                for (let i = 0; i < selectedValueBefore.length; i++) {
                    const index = COLORS.findIndex(color => color.name === selectedValueBefore[i]);
                    productColors.push(values[index])
                }
                setSelectedValue(productColors)
            } if (type == 'size'){
                setSelectedValue(selectedValueBefore)                
            }
        }

        


    }, [values])

    const onChangeSelectedValue = (e: any[]) => {

        if (type === 'day') {
            const selectedValues = e.sort((a, b) => a.dayPosition - b.dayPosition)
            setSelectedValue(selectedValues)
            handleChangeState(selectedValues, 'days_open')
        } if (type === 'color') {
            handleChangeState(e)
        } if (type === 'size'){
            let sizesWithOrder = [];
            for (let i = 0; i < e.length; i++) {
                const position = values?.indexOf(e[i]);
                sizesWithOrder.push({
                    size: e[i],
                    position: position
                })
            }
            sizesWithOrder = sizesWithOrder.sort((a, b) => a.position-b.position)
            sizesWithOrder = sizesWithOrder.map(function (obj) {
                return obj.size;
              });
            
            handleChangeState(sizesWithOrder)
            return setSelectedValue(sizesWithOrder)
        }
        return setSelectedValue(e)
    }

    return (
        <Listbox
        onChange={onChangeSelectedValue}
        
        value={selectedValue} disabled={isListboxDisabled}  multiple>
            <div className={`relative mt-1 border border-gray rounded-lg ${!isListboxDisabled ? 'bg-white' : 'bg-gray-200'}`}>
                <Listbox.Button className="cursor-default w-full border-none py-3.5 rounded-lg pl-3 pr-10 text-sm  leading-5 text-gray-900 focus:ring-0">
                    <span className="block truncate text-start">{selectedValue.map((value) => { return (value.name || value) }).join(', ')}</span>
                    {!selectedValue[0] && <span className="block truncate text-start text-white">--</span>}
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
                    <Listbox.Options
                   
                    className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {values && values.map((value:any, valueIdx:any) =>

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
                                            {value.name || value}
                                        </span>
                                        {value.cssColor ? (
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 ">
                                                <Circle_Color colors={[value.cssColor]} dimension={5} space={0} />
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
