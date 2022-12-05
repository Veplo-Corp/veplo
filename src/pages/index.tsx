import type { NextPage } from 'next'
import { Button, Box, Stack, Text } from '@chakra-ui/react'
import BlackButton from '../../components/atoms/BlackButton'
import { useState } from 'react'
import Drawer_Address from '../../components/organisms/Drawer_Address'
import Image from 'next/image'


const Home: NextPage = () => {
  // const dispatch = useDispatch();

  // let filterTimeout: any;
  const ARRAY_CITY = ['Terni', 'Rieti', 'Perugia'];
  /* drawer */
  const [openDrawer, setopenDrawer] = useState(1)
  


  return (
    <>
      <img className='w-full object-cover h-full md:h-full mt-12' 
      src="/static/homeImg.png" 
      alt="non trovata" />
      <div className='w-full p-4 md:p-6  md:flex justify-between'>
        <div className='mb-0 md:mb-0'>
          <h1 className='font-extrabold cursor-pointer italic text-xl text-black-900'>Alcune città che utilizzano Dintorni</h1>
          <Stack direction='row' spacing={4} align='center' className='mt-2'>
            {ARRAY_CITY.map((city: string) => {
              return (
                <BlackButton disabled={false} key={city} element={city} borderRadius={50} size={'lg'} typeButton='button'></BlackButton>
              )
            })}
          </Stack>
        </div>
        {/* <div>
          <h1 className='font-extrabold italic text-xl text-black-900 text-end'>oppure inserisci la tua posizione</h1>
          <Box borderRadius={12} className='w-full mt-2 h-12 flex justify-between items-center px-4 cursor-pointer'
            onClick={() => setopenDrawer(Math.random())}
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
        </div> */}
      </div>
      <img className='w-full  object-cover h-full md:h-full' 
      src="https://img01.ztat.net/outfit/d2bbc3015626416fa0f33450b7295d97/9586c74af338488da7215817f83e1bb6.jpg?imwidth=1800" 
      alt="" />
      <Drawer_Address openDrawerMath={openDrawer}/>
    </>
  )
}

export default Home
