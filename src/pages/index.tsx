import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../../components/organisms/Header'
import styles from '../styles/Home.module.css'
import { Button, Box, Stack, Text } from '@chakra-ui/react'
import BlackButton from '../../components/atoms/BlackButton'

import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Divider,
  DrawerFooter

} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import Input_Search_Address from '../../components/atoms/Input_Search_Address'



const Home: NextPage = () => {

  let filterTimeout: any;
  const ARRAY_CITY = ['Terni', 'Rieti', 'Perugia'];
  const [address, setAddress] = useState([])

  const onChangeAddress = (address_searched) => {


    clearTimeout(filterTimeout)

    filterTimeout = setTimeout(async() => {

      // Send the data to the server in JSON format.

      // API endpoint where we send form data.
      const endpoint = `/api/mapbox/autocomplete-address?search_text=${address_searched}`

      // Send the form data to our forms API on Vercel and get a response.
      const response = await fetch(endpoint)

      // Get the response data from server as JSON.
      // If server returns the name submitted, that means the form works.
      const result = await response.json()
      setAddress(result.data)
      console.log(result.data);
    }, 1000)

  }


  const btnRef = useRef()

  /* drawer */
  const [isOpen, setisOpen] = useState(false)

  return (
    <>
      <div className='w-full h-96 bg-cyan-900 pt-10 md:mt-20' onClick={() => setisOpen(false)}>
        <div className='hidden md:flex justify-end p-6 z-0'>
          <Button zIndex={0} borderRadius={50} size={'md'} padding={4}>Iscrivi il tuo negozio</Button>
        </div>
      </div>
      <div className='w-full p-4 md:p-6 py-8 md:flex justify-between'>
        <div className='mb-4 md:mb-0'>
          <h1 className='font-extrabold cursor-pointer italic text-xl text-black-900'>Alcune città che utilizzano Dintorni</h1>
          <Stack direction='row' spacing={4} align='center' className='mt-2'>
            {ARRAY_CITY.map((city: string) => {
              return (
                <BlackButton disabled={false} key={city} element={city} borderRadius={50} size={'lg'} typeButton='button'></BlackButton>
              )
            })}
          </Stack>
        </div>
        <div>
          <h1 className='font-extrabold italic text-xl text-black-900 text-end'>oppure inserisci la tua posizione</h1>
          <Box borderRadius={12} className='w-full mt-2 h-12 flex justify-between items-center px-4 cursor-pointer'
            onClick={() => setisOpen(true)}
            bg={'black.900'}
            color={'white'}
            _hover={{ bg: 'black.900' }}
            _focus={{
              bg: 'black.900'
            }}
            _active={{
              transform: 'scale(0.99)',
            }}
          >
            <Text fontSize='lg' className='font-bold ' color={'white'} >Inserisci città o indirizzo</Text>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </Box>
        </div>
      </div>
      <div className='w-full h-96 bg-gray-100'>

      </div>


      <Drawer
        placement='top'
        isOpen={isOpen}
        onClose={() => setisOpen(false)}>
        <DrawerOverlay />
        <DrawerContent className='h-80'  >
          <DrawerHeader borderBottomWidth='1px' border={'none'} className='flex justify-between '>
            <h1 className="font-black text-xl md:text-3xl italic text-black-900  ">DINTORNI</h1>
            <svg onClick={() => setisOpen(false)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 cursor-pointer">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </DrawerHeader>
          <DrawerBody className='md:m-auto '>
            <Input_Search_Address handleEvent={onChangeAddress} />
            <div className='my-3 pl-8'>
              {address[0] && <h2 className='text-md font-bold text-gray-500 mb-2'>risultati</h2>}
              {address.map((value) => {
                return (
                  <div key={value.id} onClick={() => setisOpen(false)} className=' pt-2 -ml-2  cursor-pointer hover:bg-gray-100 rounded-sm	'>
                    <p className='pl-2  text-md font-medium text-gray-800'>{value.place_name}</p>
                    <Divider p={1} orientation='horizontal' />
                  </div>
                )
              })}


            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer >

    </>
  )
}

export default Home
