import { Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { Search } from 'iconoir-react'
import React, { FC, useRef, useState } from 'react'

const Input_Search_Item: FC<{ placeholder: string, onConfirmText: (text: string) => void, textInput?: string, handleChangeValue: (text: string) => void }> = ({ placeholder, onConfirmText, textInput, handleChangeValue }) => {
    const [textSearched, setTextSearched] = useState('')

    const onConfirm = (e: any) => {
        if (e.key === 'Enter' || e.key === undefined) {
            onConfirmText(e.target.value)
            //setTextSearched('')
        }
    }

    const handleChangeValueInput = (e: any) => {
        //console.log(e.target.value);
        setTextSearched(e.target.value)
        handleChangeValue(e.target.value)
    }

    return (
        <div className='w-auto md:w-56 lg:w-56 xl:w-72' >
            <InputGroup>
                <Input
                    type='text'
                    value={textSearched}
                    //borderWidth={0}
                    _active={{
                        borderWidth: 0
                    }}
                    onKeyDown={onConfirm}
                    placeholder={placeholder}
                    _placeholder={{
                        color: '#A19F9F',
                        opacity: 1,
                        fontWeight: '500'
                    }}
                    borderRadius={10}
                    py={2}
                    pl={4}
                    size='md'
                    fontSize={'18px'}
                    focusBorderColor='gray.300'
                    fontWeight={'semibold'}
                    bg={'gray.100'}
                    onChange={(e) => handleChangeValueInput(e)}
                />
                <InputRightElement
                    mr={1}
                    className='cursor-pointer'
                    color={'#A19F9F'}
                    onClick={onConfirm}
                    children={

                        <Search
                            className="w-6 h-6"
                            strokeWidth={2}
                        />
                    }
                />
            </InputGroup>
        </div>
    )
}

export default Input_Search_Item