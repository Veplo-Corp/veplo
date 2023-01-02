import type { NextPage } from 'next'
import { Button, Box, Stack, Text } from '@chakra-ui/react'
import BlackButton from '../../components/atoms/BlackButton'
import { useState } from 'react'
import Drawer_Address from '../../components/organisms/Drawer_Address'
import Image from 'next/image'
import Shop_not_Allowed from '../../components/utils/Shop_not_Allowed'
import Desktop_Layout from '../../components/atoms/Desktop_Layout'
import Gradient_Component_home from '../../components/molecules/Gradient_Component_home'
import { useRouter } from 'next/router'


const Home: NextPage = () => {
  // const dispatch = useDispatch();

  // let filterTimeout: any;
  const ARRAY_CITY = ['Terni', 'Rieti', 'Perugia'];
  /* drawer */
  const [openDrawer, setopenDrawer] = useState(1)
  console.log(process.env);
  const router = useRouter()


  return (
    <Shop_not_Allowed>
      <div className='w-full justify-between px-1 md:px-4 lg:px-8 mt-16 md:mt-24'>
        <Gradient_Component_home display='flex'>
          <h1 className='text-6xl md:text-7xl lg:text-8xl font-black text-white md:w-7/12 my-auto md:leading-[90px] lg:leading-[110px] '>
            SCOPRI I<br></br> TUOI<br></br> DINTORNI
          </h1>
          <div
            className='mt-8 md:m-auto'
          >
            <p
              className='font-bold text-md text-white ml-1'
            >Inizia la ricerca</p>
            <Button
              rightIcon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              }
              border='2px'
              borderColor='gray.900'
              rounded={'xl'}
              colorScheme='white'
              textColor={'gray.900'}
              width={'80'}
              height={'16'}
              display='flex'
              justifyContent={'space-between'}
              backgroundColor={'white'}
              onClick={() => {
                setopenDrawer(Math.random())
              }}
            >
              Inserisci città o indirizzo
            </Button>
          </div>
        </Gradient_Component_home>
        <div className='md:flex md:justify-between px-5 md:px-20 md:gap-20 md:my-20'>
          <img className='md:w-1/2 object-cover mt-8 md:mt-'
            src="/home_svg/home_first.svg"
            alt="non trovata" />
          <div className='my-5 md:m-auto lg:w-4/12 '>
            <h1
              className='text-4xl xl:text-5xl font-black mb-3'
            >Cerca tra i negozi
              della tua città..</h1>
            <h2 className='text-lg font-medium'>
              Seleziona già online i prodotti che proverai in negozio. Ogni negozio possiede una pagina dedicata con tutti i prodotti in vetrina
            </h2>
          </div>
        </div>
        <Gradient_Component_home display=''>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-black my-auto md:leading-[90px] lg:leading-[110px] text-center mt-5 mb-5 md:mb-0'>
            ESSERE VEPLO
          </h1>
          <h2 className='text-xl md:text-3xl px-4 md:px-36 text-center font-medium md:font-bold md:mt-2'>
            Veplo è la community che permette a tutti i negozi di vestiti
            di mostrare online i propri prodotti.
          </h2>
          <div
            className='grid md:flex gap-5 md:justify-between md:8/12  xl:w-6/12 mt-10 m-auto justify-center'>
            <Button
              border='2px'
              borderColor='gray.900'
              rounded={'3xl'}
              colorScheme='white'
              textColor={'gray.100'}
              height={'16'}
              paddingX={'20'}
              backgroundColor={'gray.900'}
              onClick={() => {
                router.push('/shop/login?type=registration')
              }}
            >
              Crea un negozio senza costi
            </Button>
            <Button
              border='2px'
              borderColor='gray.900'
              rounded={'3xl'}
              colorScheme='white'
              textColor={'gray.900'}
              height={'16'}
              paddingX={'20'}
              backgroundColor={'white'}
              onClick={() => {
                setopenDrawer(Math.random())
              }}
            >
              cerca i vestiti nella tua zona
              
            </Button>

          </div>
          <h2 className='text-md  md:text-xl xl:px-96 text-center font-base mt-6 md:mt-12 mb-6'>
            Crea il tuo negozio gratuitamente e inizia a mostrare
            a tutti i tuoi vestiti!
          </h2>
        </Gradient_Component_home>
      </div>

      {/* <img className='w-full object-cover h-full md:h-full mt-12' 
      src="/static/homeImg.png" 
      alt="non trovata" />
      <div className='w-full p-4 md:p-6  md:flex justify-between'>
        <div className='mb-0 md:mb-0'>
          <h1 className='font-extrabold cursor-pointer italic text-xl text-black-900'>Alcune città che utilizzano Veplo</h1>
          <Stack direction='row' spacing={4} align='center' className='mt-2'>
            {ARRAY_CITY.map((city: string) => {
              return (
                <BlackButton disabled={false} key={city} element={city} borderRadius={50} size={'lg'} typeButton='button'></BlackButton>
              )
            })}
          </Stack>
        </div>
      </div>
      <img className='w-full  object-cover h-full md:h-full' 
      src="https://img01.ztat.net/outfit/d2bbc3015626416fa0f33450b7295d97/9586c74af338488da7215817f83e1bb6.jpg?imwidth=1800" 
      alt="" /> */}
      <Drawer_Address openDrawerMath={openDrawer} />
    </Shop_not_Allowed>
  )
}

export default Home
