import type { NextPage } from 'next'
import { Button, Box, Stack, Text } from '@chakra-ui/react'
import BlackButton from '../../components/atoms/BlackButton'
import { useEffect, useRef, useState } from 'react'
import Drawer_Address from '../../components/organisms/Drawer_Address'
import Image from 'next/image'
import Shop_not_Allowed from '../../components/utils/Shop_not_Allowed'
import Desktop_Layout from '../../components/atoms/Desktop_Layout'
import Gradient_Component_home from '../../components/molecules/Gradient_Component_home'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import createUrlSchema from '../../components/utils/create_url'
import PostMeta from '../../components/organisms/PostMeta'
import Section from '../../components/atoms/Section'
import { getFromLocalStorage } from '../../components/utils/getFromLocalStorage'
import { setInLocalStorage } from '../../components/utils/setInLocalStorage'





const Home: NextPage = () => {
  // const dispatch = useDispatch();

  // let filterTimeout: any;
  /* drawer */
  const [openDrawer, setopenDrawer] = useState(1)
  console.log(process.env);
  const router = useRouter()
  const address_user = useSelector((state: any) => state.address.address);
  const [showHome, setshowHome] = useState<boolean>(false)

  useEffect(() => {
    const genderSelected = getFromLocalStorage('genderSelected')
    if (!genderSelected) {
      return setshowHome(true)
    }


    if (genderSelected === 'f') {

      router.push('/prodotti/donna-abbigliamento')
    }
    if (genderSelected === 'm') {
      router.push('/prodotti/uomo-abbigliamento')
    }
  }, [])

  return (
    <div className='min-h-screen'>
      {
        showHome ? (
          <Shop_not_Allowed>
            <PostMeta
              canonicalUrl='https://www.veplo.it'
              title={'Veplo | Abbigliamento & Moda '}
              subtitle={"Scopri i negozi di vestiti per uomo e donna della tua città su Veplo. Cerca tra tutto l'abbigliamento in vendita vicino a te e approfitta delle offerte"}
              image={''}
              description={"Scopri i negozi di vestiti per uomo e donna della tua città su Veplo. Cerca tra tutto l'abbigliamento in vendita vicino a te e approfitta delle offerte"}
            />
            <div className='w-full justify-between'>

              <Gradient_Component_home display='flex'>
                <h1 className='text-6xl md:text-7xl lg:text-8xl font-black text-white md:w-7/12 my-auto '>
                  SCOPRI <br />I TUOI<br /> DINTORNI
                </h1>
                <div
                  className='mt-8 md:m-auto'
                >
                  {!address_user && <p
                    className='font-bold text-md text-white ml-1'
                  >Inizia la ricerca</p>}
                  <Button
                    rightIcon={
                      <>
                        {
                          !address_user ? (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                          )
                        }
                      </>
                    }
                    border='2px'
                    borderColor='gray.900'
                    rounded={'xl'}
                    colorScheme='white'
                    textColor={'gray.900'}
                    width={['full', '80']}
                    height={'16'}
                    display='flex'
                    justifyContent={'space-between'}
                    backgroundColor={'white'}
                    onClick={() => {
                      if (!address_user) {
                        setopenDrawer(Math.random())
                      } else {
                        const url = createUrlSchema([address_user.city, address_user.postcode])
                        router.push(`/negozi/${url}`)
                      }
                    }}
                  >
                    {address_user ? 'I negozi della tua città' : 'Inserisci città o indirizzo'}

                  </Button>
                </div>
              </Gradient_Component_home>

              <Section>
                <div
                  className='md:flex md:justify-between px-5 py-20 md:px-20 md:gap-20 md:my-20'>
                  <img className='md:w-1/2 md:h-96 object-contain my-auto'
                    src="/home_svg/home_first.svg"
                    alt="home image" />
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
              </Section>




              <div
                className='min-h-[60vh md:min-h-[80vh] py-5 bg-slate-100  grid content-center  align-middle
              px-5
             '
              >
                <h3 className='text-4xl md:text-5xl lg:text-6xl font-black my-auto md:leading-[90px] lg:leading-[110px] text-center mb-5 md:mb-0'>
                  ESSERE VEPLO
                </h3>
                <h2 className='text-xl md:text-3xl px-4 md:px-36 text-center font-medium md:font-bold md:mt-2'>
                  Veplo è la community che permette a tutti i negozi di vestiti
                  di mostrare online i propri prodotti.
                </h2>
                <div
                  className='grid md:flex gap-5 xl:gap-10 md:justify-between md:w-6/12 lg:w-4/12 mt-10 m-auto justify-center'>
                  <Button
                    border='2px'
                    borderColor='gray.900'
                    rounded={'2xl'}
                    colorScheme='white'
                    textColor={'gray.100'}
                    height={'16'}
                    width={'full'}
                    backgroundColor={'gray.900'}
                    marginX={'auto'}
                    onClick={() => {
                      router.push('/shop/login?type=registration')
                    }}
                  >
                    Crea un negozio senza costi
                  </Button>
                  {/* <Button
                  border='2px'
                  borderColor='gray.900'
                  rounded={'2xl'}
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
    
                </Button> */}

                </div>
                <h3 className='text-md  md:text-xl xl:px-96 text-center font-base mt-4 md:mt-12'>
                  Crea il tuo negozio gratuitamente e inizia a mostrare
                  a tutti i tuoi vestiti!
                </h3>
              </div>
              <Section>
                <div
                  className='md:flex md:justify-between pt-20 pb-10 px-5 md:px-20 md:gap-20 md:my-20'>

                  <div className='m-5 md:m-auto lg:w-4/12 '>
                    <h1
                      className='text-4xl xl:text-5xl font-black mb-3'
                    >Migliora il tuo acquisto in negozio...</h1>
                    <h2 className='text-lg font-medium'>
                      con Veplo puoi visitare tutti i negozi della tua città e scegliere in anticipo quali andrai a trovare di persona            </h2>
                  </div>
                  <img className='md:w-1/2 h-96 object-contain my-auto  mt-8 md:mt-'
                    src="/home_svg/home_second.svg"
                    alt="home image" />
                </div>
              </Section>
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
          </Shop_not_Allowed >

        )
          : (
            <>
            </>
          )

      }
    </div>
  )


}




export default Home
