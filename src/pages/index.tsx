import type { GetStaticProps, NextPage } from 'next'
import { Button, Box, Stack, Text, InputGroup, Input, VStack, Icon, Highlight, Heading, ButtonGroup } from '@chakra-ui/react'
import BlackButton from '../../components/atoms/BlackButton'
import { FC, useEffect, useRef, useState } from 'react'
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
import { initApollo } from '../lib/apollo'
import GET_COMPONENTS_HOME_LIST from '../lib/apollo/dato_CMS/queries/getComponentsHomeList'
import { Instagram, SendMail } from 'iconoir-react'
import { LazyLoadImage } from 'react-lazy-load-image-component'

type InputForm = {
  email: string,
  userName: string,
  businessName: string,
  phone: string,
}



export const getStaticProps: GetStaticProps<{}> = async () => {

  const apolloClient = initApollo()

  try {
    const { data } = await apolloClient.query({
      query: GET_COMPONENTS_HOME_LIST,
      context: {
        clientName: 'DATO_CMS_LINK',
      }
    })

    if (data?.allListComponentWithImages) {
      return {
        props: { data },
        revalidate: 10000
      }
    }

    return {
      props: {},
      revalidate: 1
    }
  } catch (e) {
    console.log(e);

    return {
      props: {},
      revalidate: 1
    }
  }




}

interface ListComponents {
  allListComponentWithImages: AllListComponentWithImages[]
}

interface AllListComponentWithImages {
  title: string,
  imageAndText: {
    titolo: string,
    immagine: {
      url: string
    }
  }[]
}


const Home: FC<{ data: ListComponents }> = ({ data }) => {
  console.log(data);

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





  const onSubmitForm = async (value: InputForm) => {
    console.log(value);
    setModalForm(false)
    setTimeout(async () => {
      setModalConfirmSubmit(true)

      await createForm({
        variables: {
          options: {
            userName: value.userName,
            businessName: value?.businessName,
            email: value.email,
            phone: value.phone,
          }
        }
      })
    }, 1000);
    reset()

  }

  const ButtonGroupGender = () => {
    return (
      <>
        {router.query.gatto === 'berry' ? (
          <ButtonGroup
            gap={[2, 5, 5, 3]}
            mb={[1, 0]}

            width={'full'}
          >
            <Link
              href={'/abbigliamento/donna-abbigliamento/tutto/rilevanza'}
              className='w-full'
            >
              <Button
                width={'full'}
                variant={'whiteButton'}
                borderWidth={0}
                padding={6}
                paddingY={7}
                fontSize={'xl'}
                borderRadius={'30px'}
                style={{
                  boxShadow: '0px 0px 20px 0px rgba(173, 173, 173, 0.25)'
                }}

              >
                Donna
              </Button>
            </Link>

            <Link
              href={'/abbigliamento/uomo-abbigliamento/tutto/rilevanza'}
              className='w-full'
            >
              <Button
                width={'full'}
                variant={'whiteButton'}
                borderWidth={0}
                padding={6}
                paddingY={7}
                fontSize={'xl'}
                borderRadius={'30px'}
                style={{
                  boxShadow: '0px 0px 20px 0px rgba(173, 173, 173, 0.25)'
                }}

              >
                Uomo
              </Button>
            </Link>
          </ButtonGroup>)
          : (
            <></>
            // {/* <Button
            //               mt={2}
            //               width={'full'}
            //               variant={'whiteButton'}
            //               borderWidth={0}
            //               padding={6}
            //               paddingY={7}
            //               fontSize={'xl'}
            //               borderRadius={'30px'}
            //               style={{
            //                 boxShadow: '0px 0px 20px 0px rgba(173, 173, 173, 0.25)'
            //               }}

            //             >
            //               entra nella Waitlist
            //             </Button> */}

          )
        }
      </>
    )
  }

  return (
    <>
      <PostMeta
        canonicalUrl='https://www.veplo.it'
        title={"Veplo"}
        subtitle={"Veplo è lo spazio dove trovare i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile."}
        image={"android-chrome-512x512.png"}
        description={"Veplo è lo spazio dove trovare i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile."}
      />



      <Shop_not_Allowed>
        <Box
          bgColor={'primary.bg'}
          className='hidden lg:block p-10 pt-0 h-[100vh] lg:h-[98vh] rounded-b-[7vh]'
        >
          <Box
            height={'12vh'}
            display={'flex'}
            justifyContent={'space-between'}
          >
            <Box
              width={'42vh'}
              my={'auto'}
            >
              <ButtonGroupGender />
            </Box>
            <Button
              my={'auto'}
              width={'30vh'}
              variant={'whiteButton'}
              borderWidth={0}
              fontSize={'xl'}
              borderRadius={'30px'}
              padding={6}
              paddingY={7}
              style={{
                boxShadow: '0px 0px 20px 0px rgba(173, 173, 173, 0.25)'
              }}
              onClick={() => { setModalForm(true) }}
            >
              Sono un Brand
            </Button>
          </Box>
          <Box
            bgColor={'primary.text'}
            borderRadius={'30px'}
            className='hidden lg:grid p-8 h-[82vh] lg:h-[80vh] rounded-b-[7vh]'
            style={{
              boxShadow: '0px 4px 20px 20px rgba(255, 255, 255, 0.25)'
            }}
            display={'flex'}
            gap={10}
          >
            <Box
              className='lg:ml-8 xl:ml-24 mt-10 '
            >
              <Box>
                <img loading='lazy'
                  className='lg:w-[95%] h-[20vh]'
                  src='https://www.datocms-assets.com/102220/1688458870-veplo_graffiti_web.png'
                />

              </Box>
              <Text
                className='lg:text-[9.5vh] xl:text-[13vh] mt-16 xl:mt-5'
                fontWeight={'black'}
                lineHeight={['', '', '', '12vh', '14vh', '13vh']}
                color={'primaryBlack.text'}
              >
                Lo spazio dei <br />
                <span
                  className='text-[#FF5A78]'
                >
                  brand
                </span> made in <br />Italy
              </Text>
            </Box>
            {/* mook phone solo per web */}
            <LazyLoadImage
              src={'https://www.datocms-assets.com/102220/1690476458-vectary-texture.png'}
              alt={''}
              //effect="blur"
              className="object-cover h-[100%] m-auto"
            />
          </Box>
        </Box>
        <Box
          bgColor={'primary.bg'}
          className='w-full rounded-b-[4vh] h-fit pb-1 lg:hidden'
        >
          <img loading='lazy'
            className='m-auto pt-4 px-10 pb-3 h-[23vh] sm:h-[32vh]  md:h-[30vh] w-full min-380:h-[28vh]  sm:w-9/12  md:w-7/12 '
            src='https://www.datocms-assets.com/102220/1688456383-veplo_graffiti_mobile.png'
          />

          <Box
            bgColor={'primary.text'}
            borderRadius={'30px'}
            marginTop={0}
            padding={[6, 6, 10]}
            paddingY={[8, 8, 12]}
            style={{
              boxShadow: '0px 4px 20px 20px rgba(255, 255, 255, 0.25)'
            }}
            className='m-5 md:mx-auto sm:w-10/12 sm:mx-auto md:w-7/12 sm:mb-10 md:mb-8 mt-0'

          >
            <Text
              fontSize={['5vh', '7vh']}
              fontWeight={'black'}
              lineHeight={['48px', '60px']}
              color={'primaryBlack.text'}
            >
              Lo spazio dei <br />
              <span
                className='text-[#FF5A78]'
              >
                brand
              </span><br />made in Italy
            </Text>
            <Text
              my={[3, 6]}
              color={'#909090'}
              fontWeight={'regular'}
              fontSize={'18px'}
              lineHeight={'22px'}
              mb={7}
            >
              connettiamo i migliori brand di abbigliamento made in Italy in un unico negozio online
            </Text>
            <Box
              mb={3}
            >
              <ButtonGroupGender />

            </Box>
            <Button
              marginTop={[1, 1, 3]}
              width={'full'}
              variant={'primary'}
              padding={6}
              paddingY={7}
              fontSize={'xl'}
              borderRadius={'30px'}
              style={{
                boxShadow: '0px 4px 20px 0px rgba(255, 90, 120, 0.75)'
              }}
              onClick={() => { setModalForm(true) }}

            >
              Sono un brand
            </Button>
          </Box>
        </Box>
        <Box
          className='lg:flex sm:w-10/12 md:w-9/12 lg:w-11/12 xl:w-10/12 mx-auto lg:my-7 lg:gap-12 xl:gap-20 justify-between'
        >
          <Box
            marginY={10}
            width={['', '', '', '50%', '40%']}
          >
            <Text
              fontSize={'4.3vh'}
              fontWeight={'black'}
              textAlign={'center'}
              color={'primaryBlack.text'}
              mb={[5, 5, 5, 8]}
            >
              {data?.allListComponentWithImages[1].title}
            </Text>
            <VStack gap={[5, 5, 5, 8]}
              mb={8}

              align='stretch'
              textAlign={'left'}
            >
              {data?.allListComponentWithImages[1].imageAndText.map((value, index) => (
                <Box
                  marginX={7}
                  key={index}
                  display={'flex'}
                  gap={5}
                >
                  <img loading='lazy'
                    className='w-6 h-6 my-auto'
                    src={value.immagine.url}
                  />
                  <Text
                    textAlign={'left'}
                    fontSize={'18px'}
                    fontWeight={'normal'}
                    color={'#909090'}
                  >
                    {value.titolo}
                  </Text>
                </Box>
              ))}

              <Link
                href={'https://www.datocms-assets.com/102220/1690279179-veplo_brand.pdf'}
                target='_blank'
                className='flex'
              >
                <Button
                  mx={'auto'}
                  variant={'primary'}
                  className='w-[92%] sm:w-[70%] md:w-[70%] xl:w-[80%] mx-auto md:mt-2'
                  borderWidth={0}
                  padding={8}
                  paddingY={7}
                  fontSize={'xl'}
                  borderRadius={'30px'}
                  style={{
                    boxShadow: '0px 4px 20px 0px rgba(255, 90, 120, 0.75)'
                  }}

                >
                  Scarica il PDF di presentazione
                </Button>
              </Link>

            </VStack>


          </Box>
          <Box
            marginY={10}
            marginX={7}
          >
            <Text
              fontSize={'4.3vh'}
              fontWeight={'black'}
              textAlign={'center'}
              color={'primaryBlack.text'}
              mb={[5, 5, 5, 8]}

            >
              {data?.allListComponentWithImages?.[0]?.title}
            </Text>
            <VStack
              gap={[5, 5, 5, 8]}
              mb={[7, 7, 12, 7]}
              align='stretch'
              textAlign={'left'}
            >
              {data?.allListComponentWithImages?.[0].imageAndText.map((value, index) => (
                <Box
                  key={index}
                  display={'flex'}
                  gap={5}
                >
                  <img loading='lazy'
                    className='w-6 h-6 my-auto'
                    src={value.immagine.url}
                  />
                  <Text
                    textAlign={'left'}
                    fontSize={'18px'}
                    fontWeight={'normal'}
                    color={'#909090'}
                  >
                    {value.titolo}
                  </Text>
                </Box>
              ))}
            </VStack>

          </Box>
        </Box>

        <Box
          bgColor={'primary.bg'}
          className='w-full rounded-t-[4vh] lg:rounded-none rou h-fit pt-6 pb-1'
        >
          <Box
            className='m-5 sm:mx-auto sm:w-3/4 md:w-1/2 lg:w-5/12 xl:w-1/3 md:mb-8 mt-0 md:mt-5 lg:mt-7'
            bgColor={'primary.text'}
            borderRadius={'30px'}
            marginBottom={0}
            padding={[8, 8, 8, 10]}
            paddingBottom={10}
            style={{
              boxShadow: '0px 4px 20px 20px rgba(255, 255, 255, 0.25)'
            }}
          >
            <Text
              fontSize={['4.4vh', '5vh', '5vh', '5.5vh']}
              fontWeight={'black'}
              //lineHeight={'48px'}
              className='lg:leading-[7.5vh] leading-[6vh] sm:leading-[7vh]'
              color={'primaryBlack.text'}
              mb={[5, 5, 5, 7]}
            >
              Allora, da dove<br />
              iniziamo <span
                className='text-[#FF5A78]'
              >
                oggi?
              </span>
            </Text>

            <ButtonGroupGender />
            <Button
              marginTop={[4, 6]}
              width={'full'}
              variant={'primary'}
              padding={6}
              paddingY={7}
              fontSize={'xl'}
              borderRadius={'30px'}
              style={{
                boxShadow: '0px 4px 20px 0px rgba(255, 90, 120, 0.75)'
              }}
              onClick={() => { setModalForm(true) }}
            >
              Sono un brand
            </Button>
          </Box>
          <Link
            href={'https://www.instagram.com/veplo_it/'}
            target='_blank'
          >
            <Instagram
              cursor={'pointer'}
              className='m-auto my-12'
              strokeWidth={1.5}
              color='white'
              width={'40px'}
              height={'40px'}
            />
          </Link>

        </Box>











      </Shop_not_Allowed >
      <ModalForm closeModal={() => setModalForm(false)} isOpen={modalForm}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Text
            fontSize={'3xl'}
            fontWeight={'black'}
            mb={2}
            mt={1}
            lineHeight={'9'}
            color={'primaryBlack.text'}
          >
            Richiesta contatto
          </Text>
          <Text
            fontSize={'sm'}
            fontWeight={'medium'}
            color={'#909090'}
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
                required: false,
              })}
            >
            </Input>
            <Input
              placeholder='nome del tuo brand (opzionale)'
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
                required: false,
                minLength: 2
              })}
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
            borderRadius={'30px'}
            variant={'primary'}

          >
            conferma
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
            <SendMail
              className='h-16 w-16 mt-1'
              color='#FF5A78'
            />
            <Text
              fontSize={'4xl'}
              fontWeight={'black'}
              color={'primaryBlack.bg'}
              lineHeight={'6'}
            >
              Grazie!
            </Text>
            <Text
              fontSize={'16px'}
              fontWeight={'regular'}
              color={'#909090'}
              lineHeight={'short'}

            >
              La tua richiesta e’ stata inviata con successo. In questi giorni verrai contattato tramite cellulare o email.
            </Text>

            <Button

              size={'lg'}
              fontSize={['lg', 'xl']}
              fontWeight={'bold'}
              onClick={() => setModalConfirmSubmit(false)}
              py={'28px'}
              width={'full'}
              borderRadius={'30px'}
              variant={'primary'}
            >
              affare fatto!
            </Button>
          </VStack>

        </Box>



      </ModalForm>
    </>

  )


}




export default Home
