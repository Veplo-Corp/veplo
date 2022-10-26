import { Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import React from 'react'

const Input_Search_Item = () => {
    return (
        <div className='w-auto md:w-72'>
            <InputGroup
            >
                <Input placeholder='Cerca negozi o vestiti'
                    _placeholder={{ color: 'gray.500', opacity: 1 }}
                    borderRadius={12}
                    py={3}
                    pl={4}
                    size='md' focusBorderColor='gray.300'
                    bg={'gray.100'} />
                <InputRightElement
                    ml={3}
                    className='mt-px cursor-pointer'
                    color={'gray.500'}
                    children={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    }
                />
            </InputGroup>
        </div>
    )
}

export default Input_Search_Item