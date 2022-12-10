import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import React, { FC } from 'react'

const Input_Drawer: FC<{title: string, onChangeText:any}> = ({title, onChangeText}) => {
    return (
        <InputGroup>
            <InputLeftElement
                height={14}
                color={'gray.400'}
                pointerEvents='none'
                children={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                }
            />
            <Input
                focusBorderColor='none'
                height={14} borderRadius={0} borderWidth={0} borderBottomWidth={1} type='text' placeholder={title}
                onChange={(e) => {onChangeText(e.target.value)}}
                />
        </InputGroup>
    )
}

export default Input_Drawer