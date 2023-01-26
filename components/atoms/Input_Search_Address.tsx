import React from 'react'
import {
    InputGroup,
    Input,
    InputLeftElement,
    InputRightElement,
    Center,
    CircularProgress
} from '@chakra-ui/react'



const Input_Search_Address: React.FC<{ handleEvent: any, gpsPositionAddress: any, loading: boolean }> = ({ handleEvent, gpsPositionAddress, loading }) => {

    const mapboxSearchHandle = async (event: any) => {
        handleEvent(event.target.value)
    }

    return (
        <div className='w-auto  md:w-96 px-3'>
            <InputGroup
            >

                <Input placeholder='Inserisci città o indirizzo'
                    _placeholder={{ color: 'black.900', opacity: 1 }}
                    borderRadius={30}
                    py={6}
                    pl={/* 12 */ 6}
                    onChange={mapboxSearchHandle}
                    size='md' focusBorderColor='gray.400'
                    bg={'gray.100'} />
                <InputRightElement
                    //pointerEvents='visiblePainted'
                    mr={3}
                    mt={1}
                    _active={{
                        transform: 'scale(0.95)',
                    }}
                    onClick={() => {
                        if (loading) return
                        gpsPositionAddress()
                    }
                    }
                    children={
                        !loading ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>) : (
                            <Center color='white'>
                                <CircularProgress
                                    size='25px'
                                    isIndeterminate color='gray.500' />
                            </Center>
                        )

                    }
                />
            </InputGroup>
        </div>

    )
}

export default Input_Search_Address