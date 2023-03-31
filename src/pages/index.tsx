import type { NextPage } from 'next'
import { Button, Box, Stack, Text, InputGroup, Input, VStack, Icon } from '@chakra-ui/react'
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
import Link from 'next/link'
import ModalForm from '../../components/organisms/ModalForm'
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import CREATE_FORM_INFO_BUSINESS from '../lib/apollo/mutations/createFormInfoBusiness'

type InputForm = {
  email: string,
  userName: string,
  businessName: string,
  phone: string,
}



const Home: NextPage = () => {
  // const dispatch = useDispatch();

  // let filterTimeout: any;
  /* drawer */
  const [openDrawer, setopenDrawer] = useState(1)
  const router = useRouter()
  const address_user = useSelector((state: any) => state.address.address);
  const [showHome, setshowHome] = useState<boolean>(false);
  const [modalForm, setModalForm] = useState(false)
  const [modalConfirmSubmit, setModalConfirmSubmit] = useState(false)
  const { register, handleSubmit, reset, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<InputForm>({
    mode: "all",
  });
  const [createForm] = useMutation(CREATE_FORM_INFO_BUSINESS);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let currentText = '';
    let currentIndex = 0;
    const text = "tutti i negozi di abbigliamento, in un unico sito"
    const intervalId = setInterval(() => {
      currentText += text[currentIndex];
      setDisplayText(currentText);
      currentIndex++;
      if (currentIndex === text.length) {
        clearInterval(intervalId);
      }
    }, 50);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // const genderSelected = getFromLocalStorage('genderSelected')
    // if (!genderSelected) {
    //   return setshowHome(true)
    // }


    // if (genderSelected === 'f') {

    //   router.push('/prodotti/donna-abbigliamento')
    // }
    // if (genderSelected === 'm') {
    //   router.push('/prodotti/uomo-abbigliamento')
    // }
  }, [])

  const onSubmitForm = async (value: InputForm) => {
    console.log(value);
    setModalForm(false)
    setTimeout(async () => {

      await createForm({
        variables: {
          options: {
            userName: value.userName,
            businessName: value.businessName,
            email: value.email,
            phone: value.phone,
          }
        }
      })
      setModalConfirmSubmit(true)
    }, 1000);
    reset()

  }

  return (
    <div className='min-h-screen '>

      <Shop_not_Allowed>
        <PostMeta
          canonicalUrl='https://www.veplo.it'
          title={'Veplo | Abbigliamento & Moda '}
          subtitle={"tutti i migliori negozi di abbigliamento in un unico sito. Cerca tra l'abbigliamento in vendita su Veplo e approfitta delle offerte in corso"}
          image={''}
          description={"tutti i migliori negozi di abbigliamento in un unico sito. Cerca tra l'abbigliamento in vendita su Veplo e approfitta delle offerte in corso"}

        />
        <div className='w-full '>

          <Gradient_Component_home>
            <Text
              fontWeight={'extrabold'}
              color={'white'}
              fontSize={['3xl', '5xl']}
              py={[8]}
              px={[2, 12]}
            >
              Veplo
            </Text>
            <Box
              pl={2}
              mt={[10, 8, '-14']}
              display={'flex'}
              justifyContent={'space-between'}
              className='w-full md:w-10/12 xl:w-8/12 mx-auto lg:gap-40 m-auto'
            >
              <Box
                my={'auto'}
                className='md:mr-5 lg:mr-0'
              >
                <h1 className='text-[42px] italic h-36 lg:h-56 leading-[40px] lg:text-6xl lg:leading-[70px] font-extrabold text-black'>
                  {/*  tutti i negozi di<br />
                  abbigliamento,<br />
                  in un unico sito */}
                  {displayText}
                </h1>
                <h3
                  className='lg:mt-2 text-lg leading-5 lg:text-xl font-normal'
                >
                  il modo <strong>innovativo</strong> di vendere abbigliamento online
                </h3>
              </Box>
              <img className='hidden md:flex'
                src="/home_svg/iphoneMockup.svg"
                alt="home image" />

            </Box>
            <Section>
              <Box
                className='h-fit mb-40 lg:mb-20 mt-24 lg:mt-18 '
                textAlign={'center'}
              >
                <div
                  className='flex w-full justify-center'
                >
                  <Box
                    display={'flex'}
                    fontSize={['28px', '3xl', '6xl']}
                    fontWeight={'black'}
                    width={'fit-content'}
                    position={'relative'}
                    mr={[2]}
                  >
                    <Text zIndex={10}>
                      Veplo
                    </Text>

                    <div className='absolute w-full h-2 lg:h-4 bottom-2 lg:bottom-4 bg-[#BB3838]'>
                    </div>
                  </Box>
                  <Text

                    fontSize={['28px', '3xl', '6xl']}
                    fontWeight={'black'}
                  >
                    sta per arrivare!
                  </Text>
                </div>


                <Text
                  as={'h2'}
                  fontSize={['sm', 'medium']}
                  fontWeight={['mediusemiboldm', 'medium']}
                  color={'gray.600'}
                  mt={2.5}
                  className='w-11/12 md:w-3/4 lg:w-1/2 mx-auto'
                >
                  <span className='hidden md:table mx-auto'>
                    non importa se sei un piccolo negozio di abbigliamento o un brand emergente,
                    <br className='hidden lg:flex' /> con Veplo vendere
                    <strong> senza costi fissi o canoni mensili</strong>
                  </span>
                  <span className=' md:hidden'>
                    sei un negozio di abbigliamento? Vendi con Veplo
                    <strong> senza costi fissi o canoni mensili</strong>
                  </span>

                </Text>
                <Button
                  mt={8}
                  size={'lg'}

                  fontSize={['lg', '28px']}
                  fontWeight={['bold', 'semibold']}
                  px={[0, 24]}
                  py={[8, 10]}
                  width={['full', 'fit-content']}
                  //className='w-11/12 lg:w-fit'
                  borderRadius={'10px'}
                  color={'white'}
                  background={'linear-gradient(180deg, rgba(255,129,129,1) 0%, rgba(204,0,196,1) 100%)'}
                  _hover={{
                    bg: 'linear-gradient(180deg, rgba(255,129,129,1) 0%, rgba(204,0,196,1) 100%)'
                  }}
                  _focus={{
                    bg: 'linear-gradient(180deg, rgba(255,129,129,1) 0%, rgba(204,0,196,1) 100%)'
                  }}
                  _active={{
                    transform: 'scale(0.98)',
                  }}
                  onClick={() => { setModalForm(true) }}
                >
                  voglio saperne di più
                </Button>
              </Box>
            </Section>
            <Box
              textAlign={'center'}
              color={'#666666'}
              mb={10}
              display={'grid'}
              justifyContent={'center'}

            >
              <Text
                fontSize={'md'}
                fontWeight={'semibold'}
              >
                Social
              </Text>
              <Link href="https://www.instagram.com/veplo_clothes/" target='_blank' className="text-[#666666] m-auto">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                <span className="sr-only">Instagram page</span>
              </Link>
            </Box>
          </Gradient_Component_home>








        </div>

        <Drawer_Address openDrawerMath={openDrawer} />
      </Shop_not_Allowed >
      <ModalForm closeModal={() => setModalForm(false)} isOpen={modalForm}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Text
            fontSize={'3xl'}
            fontWeight={'black'}
            mb={3}
            lineHeight={'9'}
          >
            rispondiamo a ogni<br />
            dubbio o domanda
          </Text>
          <Text
            fontSize={'sm'}
            fontWeight={'medium'}
            color={'gray.500'}
            lineHeight={'short'}
            mb={5}
          >
            non ti preoccupare, compilando questo form verrai contattato direttamente da noi!
          </Text>
          <VStack
            gap={3}
          >
            <Input
              placeholder='email'
              id='email'
              type='email'
              py={5}
              rounded={'10px'}
              _placeholder={{
                //color: 'gray.200',
                fontWeight: '600'
              }}
              variant='filled'
              {...register("email", {
                required: true,
                pattern: /\S+@\S+\.\S+/
              })}
            >
            </Input>
            <Input
              placeholder='nome e cognome'
              id='userName'
              type='text'
              py={5}
              rounded={'10px'}
              _placeholder={{
                //color: 'gray.200',
                fontWeight: '600'
              }}
              variant='filled'
              {...register("userName", {
                required: true,
              })}
            >
            </Input>
            <Input
              placeholder='nome del tuo shop'
              id='businessName'
              type='text'
              py={5}
              rounded={'10px'}
              _placeholder={{
                //color: 'gray.200',
                fontWeight: '600'
              }}
              variant='filled'
              {...register("businessName", {
                required: true,
                minLength: 2
              })}
            >
            </Input>
            <Input
              placeholder='numero di telefono'
              id='phone'
              type='tel'
              py={5}
              rounded={'10px'}
              _placeholder={{
                //color: 'gray.200',
                fontWeight: '600'
              }}
              variant='filled'
              {...register("phone",
                { required: true, minLength: 7 }
                ,)}

            >
            </Input>


          </VStack>
          <Button
            mt={8}
            size={'lg'}
            fontSize={['lg', 'xl']}
            fontWeight={'bold'}
            type={'submit'}
            py={'28px'}
            width={'full'}
            borderRadius={'10px'}
            color={'white'}
            background={'linear-gradient(180deg, rgba(255,129,129,1) 0%, rgba(204,0,196,1) 100%)'}
            _hover={{
              bg: 'linear-gradient(180deg, rgba(255,129,129,1) 0%, rgba(204,0,196,1) 100%)'
            }}
            _focus={{
              bg: 'linear-gradient(180deg, rgba(255,129,129,1) 0%, rgba(204,0,196,1) 100%)'
            }}
            _active={{
              transform: 'scale(0.98)',
            }}
          >
            invia richiesta
          </Button>
        </form>

      </ModalForm>
      <ModalForm closeModal={() => setModalConfirmSubmit(false)} isOpen={modalConfirmSubmit}>
        <Box
          textAlign={'center'}
          display={'grid'}
        >

          <VStack
            gap={5}
          >
            <img className='m-auto'
              src="/home_svg/sendmail.svg"
              alt="home image" />

            <Text
              fontSize={'4xl'}
              fontWeight={'extrabold'}

              lineHeight={'9'}
            >
              Grazie
            </Text>
            <Text
              fontSize={'md'}
              fontWeight={'medium'}
              color={'gray.500'}
              lineHeight={'short'}

            >
              La tua richiesta e’ stata inviata con successo. In questi giorni sarai contattato, tramite cellulare o tramite email, dal nostro team di ricerca.
            </Text>

            <Button

              size={'lg'}
              fontSize={['lg', 'xl']}
              fontWeight={'bold'}
              onClick={() => setModalConfirmSubmit(false)}
              py={'28px'}
              width={'full'}
              borderRadius={'10px'}
              color={'white'}
              background={'linear-gradient(180deg, rgba(255,129,129,1) 0%, rgba(204,0,196,1) 100%)'}
              _hover={{
                bg: 'linear-gradient(180deg, rgba(255,129,129,1) 0%, rgba(204,0,196,1) 100%)'
              }}
              _focus={{
                bg: 'linear-gradient(180deg, rgba(255,129,129,1) 0%, rgba(204,0,196,1) 100%)'
              }}
              _active={{
                transform: 'scale(0.98)',
              }}
            >
              affare fatto!
            </Button>
          </VStack>

        </Box>



      </ModalForm>
    </div >
  )


}




export default Home
