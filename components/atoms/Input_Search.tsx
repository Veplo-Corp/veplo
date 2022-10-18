import React from 'react'
import {
    InputGroup,
    Input,
    InputLeftElement
} from '@chakra-ui/react'



const Input_Search = ({onChangeAddress}) => {

    const  mapboxSearchHandle = async(event) => {
        const address_searched = event.target.value

        // Send the data to the server in JSON format.

        // API endpoint where we send form data.
        const endpoint = `/api/mapbox/autocomplete-address?search_text=${address_searched}`

        // Send the form data to our forms API on Vercel and get a response.
        const response = await fetch(endpoint)

        // Get the response data from server as JSON.
        // If server returns the name submitted, that means the form works.
        const result = await response.json()
        onChangeAddress(result)
    }

    return (
        <div className='w-auto  md:w-96 px-3'>
            <InputGroup
            >
                <InputLeftElement
                    pointerEvents='none'
                    ml={3}
                    mt={1}
                    children={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                    }
                />
                <Input placeholder='Inserisci città o indirizzo'
                    _placeholder={{ color: 'black.900', opacity: 1 }}
                    borderRadius={30}
                    py={6}
                    pl={12}
                    onChange={mapboxSearchHandle}
                    size='md' focusBorderColor='gray.400'
                    bg={'gray.100'} />
            </InputGroup>
        </div>

    )
}

export default Input_Search