import { Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import React, { FC, useRef } from 'react'

const Input_Search_Item: FC<{ placeholder: string, onConfirmText: any, textInput?: string }> = ({ placeholder, onConfirmText, textInput }) => {
    const inputText = useRef<HTMLInputElement | null>(null)

    const onConfirm = (e:any) => {
        if (e.key === 'Enter' || e.key === undefined) {
            if (inputText.current?.value !== null && inputText.current?.value.length > 3) {
                onConfirmText(inputText?.current?.value);
                inputText.current!.value = ''
            }
        } 
    }

    return (
        <div className='w-auto md:w-56 lg:w-56 xl:w-72' >
            <InputGroup>
                <Input
                    type='text'
                    ref={inputText}
                    
                    onKeyDown={onConfirm}
                    placeholder={placeholder}
                    _placeholder={{ color: 'gray.500', opacity: 1 }}
                    borderRadius={12}
                    py={2}
                    pl={4}
                    size='md'
                    focusBorderColor='gray.300'
                    bg={'gray.100'} />
                <InputRightElement
                    mr={1}
                    className='cursor-pointer'
                    color={'gray.500'}
                    onClick={onConfirm}
                    children={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    }
                />
            </InputGroup>
        </div>
    )
}

export default Input_Search_Item