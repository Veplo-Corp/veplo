import { useMutation } from '@apollo/client'
import { CheckIcon, DownloadIcon } from '@chakra-ui/icons'
import { Box, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import Autocomplete from '../../../../components/atoms/Autocomplete_Headless'
import BlackButton from '../../../../components/atoms/BlackButton'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'
import Div_input_creation from '../../../../components/atoms/Div_input_creation'
import Select_multiple_options from '../../../../components/atoms/Select_multiple_options'
import Select_options from '../../../../components/atoms/Select_options'
import { Brand, BRANDS } from '../../../../components/mook/brands'
import { Color, COLORS } from '../../../../components/mook/colors'
import { MACROCATEGORY, Macrocategory } from '../../../../components/mook/macrocategories'
import { MICROCATEGORY, Microcategory } from '../../../../components/mook/microcategories'
import { SIZES, Sizes } from '../../../../components/mook/sizes'
import Drawer_Add_Image from '../../../../components/organisms/Drawer_Add_Image'
import Modal_Error_Shop from '../../../../components/organisms/Modal_Error_Shop'
import CREATE_PRODUCT from '../../../lib/apollo/mutations/createProduct'


interface IFormInput {
  name: string;
  price: string;
  brands: Brand;
  colors: Color[];
  macrocategory: Macrocategory;
  microcategory: Macrocategory;
  sizes: Macrocategory[];
  photos: any[];
}

const index = () => {

  //* graphQL
  const [createProduct, Element] = useMutation(CREATE_PRODUCT);


  //*UseForm
  const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<IFormInput>({
    mode: "all",
    defaultValues: {
      photos: []
    }
  });
  const [openModalMath, setOpenModalMath] = useState(1);


  //console.log(errors);




  //* create product form
  const [microcategorySelected, setMicrocategorySelected] = useState<Microcategory>();
  const [sizeSelected, setSizeSelected] = useState<Sizes>();

  //openDraw
  const [openDrawNumber, setOpenDrawNumber] = useState()
  const brands = useRef<Brand[]>(BRANDS)
  const colors = useRef<Color[]>(COLORS)
  const macrocategories = useRef<Macrocategory[]>(MACROCATEGORY)
  const microcategories = useRef<Microcategory[]>(MICROCATEGORY)
  const sizes = useRef<Sizes[]>(SIZES)

  useEffect(() => {
    const product_macrocategory = watch('macrocategory')
    const microcategorySelected = microcategories.current.filter(category => category.id === product_macrocategory?.id);
    if (microcategorySelected.length > 0) {

      setMicrocategorySelected(microcategorySelected[0])
    } else {
      setMicrocategorySelected(undefined);
    }
    if (product_macrocategory && product_macrocategory.id === 'uomo_scarpe') {
      const sizeTypeSelected = sizes.current.filter(size => size.id === 'scarpe');
      //console.log(sizeTypeSelected);
      setSizeSelected(sizeTypeSelected[0])
    } else {
      const sizeTypeSelected = sizes.current.filter(size => size.id === 'vestiti');
      // console.log(sizeTypeSelected);
      setSizeSelected(sizeTypeSelected[0])
    }
  }, [watch('macrocategory')])


  const onChangePrice = (e) => {
    let inputValue: string = e.target.value.replace(',', '.');
    inputValue = inputValue.replace(/[^0-9\.|]/g, '')
    if (inputValue === '.') {
      return setValue('price', '');
    }
    if (inputValue.split('.')[1]) {
      if (inputValue.split('.')[1].length > 2) {
        const value = Number(Number(inputValue)).toFixed(1)
        const lastChart = Number(inputValue.charAt(inputValue.length - 1))
        inputValue = (value + lastChart).toString();
        inputValue = inputValue.replace('.', ',')
        return setValue('price', inputValue);
      }
    }
    inputValue = inputValue.replace('.', ',')
    inputValue = inputValue.replace('.', '')
    return setValue('price', inputValue);

  }





  const submitData = ({ name, price, brands, colors, macrocategory, microcategory, sizes, photos }: IFormInput) => {

    console.log(name, price, brands, colors, macrocategory, microcategory, sizes, photos);


    if (!brands || !colors || !macrocategory || !microcategory || !sizes || photos[2]) {
      return setOpenModalMath(Math.random())
    }

    const colorsToDB = colors.map((color) => {
      return color.DB_name
    })


    const sizesToDB = sizes.map((size) => {
      return size.DB_Category
    })
    
    console.log(colorsToDB,sizesToDB );

    const priceToDB = Number(price.replace(',', '.'))
    const Product = {
      name,
      price: priceToDB,
      colors: colorsToDB,
      sizes: sizesToDB,
      macroCategory: macrocategory.DB_Category,
      microCategory: microcategory.DB_Category,
      gender: macrocategory.gender === 'donna' ? 'F' : 'M',
      brand: brands.DB_name,
      photos: ['https://img01.ztat.net/article/spp-media-p1/9ef0d4c555c14dd7b07a638a8f203f95/a5c4db103222485daa2ebf4dbbbeff44.jpg?imwidth=1800&filter=packshot'],
    }
    try{
      createProduct({ variables: {shopId: '635905bdadc75fa62375263f', options: Product} })
      console.log(Element.data);
      
    } catch (e){
      console.log('error');
    }
   


  }
  

  return (
    <>
      <Desktop_Layout>
        <div className='flex justify-between w-full mb-96'>
          <form className="p-3 px-4 lg:px-16 xl:px-24 w-full md:w-6/12 xl:w-5/12" onSubmit={handleSubmit(submitData)}>
            <div className='w-full'>
              <h1 className='italic text-lg lg:text-xl font-extrabold mb-4'>Aggiungi un capo di abbigliamento</h1>
              <Div_input_creation text='Nome del prodotto'>
                <InputGroup >
                  <Input
                    maxLength={35}
                    rounded={10}
                    paddingY={6}
                    type="text"
                    {...register("name", { required: false, maxLength: 30 })}
                    isInvalid={false}
                  />
                </InputGroup>
              </Div_input_creation>
              <Div_input_creation text='Prezzo'>
                <InputGroup >
                  <InputLeftAddon rounded={10} paddingY={6} children='€' paddingInline={6} />
                  <Input
                    rounded={10}
                    paddingY={6}
                    type="string"
                    {...register("price", {
                      required: false,
                    })}
                    onWheel={(e) => e.target.blur()}
                    placeholder={'34,99'}
                    textAlign={"end"}
                    isInvalid={false}
                    onChange={onChangePrice}
                  />
                </InputGroup>
              </Div_input_creation>
              <Div_input_creation text='Brand'
              >
                <Controller
                  control={control}
                  name="brands"
                  rules={{ required: false }}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Autocomplete values={brands.current}
                      handleChangeValues={(brands) => {
                        setValue('brands', brands);
                      }} />
                  )}
                />

              </Div_input_creation>
              <Div_input_creation text='Colori disponibili'>
                <Controller
                  control={control}
                  name="colors"
                  rules={{ required: false }}
                  render={() => (
                    <Select_multiple_options values={colors.current} type={'color'} handleChangeState={(colors) => {
                      setValue('colors', colors);
                    }} />
                  )}
                />
              </Div_input_creation>
              <Div_input_creation text='Categoria'>
                <Controller
                  control={control}
                  name="macrocategory"
                  rules={{ required: false }}
                  render={() => (
                    <Select_options values={macrocategories.current} type={'macrocategory'}
                      handleClick={(macrocategory) => {
                        setValue('macrocategory', macrocategory);
                      }}
                    />
                  )}
                />
              </Div_input_creation>
              <Div_input_creation text='Microcategoria collegata'>
                <Controller
                  control={control}
                  name="macrocategory"
                  rules={{ required: false }}
                  render={() => (
                    <Select_options values={microcategorySelected?.microcategories} type={'microcategory'}
                      handleClick={(microCategory) => {
                        setValue('microcategory', microCategory);
                      }}
                    />
                  )}
                />
              </Div_input_creation>

              <Div_input_creation text='Taglie disponibili'>
                <Controller
                  control={control}
                  name="sizes"
                  rules={{ required: false }}
                  render={() => (
                    <Select_multiple_options values={sizeSelected?.microcategories} type={'size'}
                      handleChangeState={(sizes) => {
                        setValue('sizes', sizes);
                      }}
                    />
                  )}
                />
              </Div_input_creation>
              <Div_input_creation text='Carica immagini'>

                <Box
                  rounded={10}
                  padding={3.5}
                  mt={1}
                  backgroundColor={`${watch('photos').length < 3 ? 'white' : 'gray.200'}`}
                  borderWidth={1}
                  borderColor={'gray.200'}
                  lineHeight='tight'
                  noOfLines={1}
                  fontSize='sm'
                  className='cursor-pointer'
                  onClick={() => {
                    setOpenDrawNumber(Math.random())
                  }}
                >
                  <div
                    className={`w-full flex justify-between ${watch('photos').length < 3 ? 'text-gray-500' : 'text-gray-900'}  `}
                  >
                    <span>
                      {watch('photos').length < 3 ? 'carica immagini del prodotto' : 'immagini caricate correttamente'}
                    </span>
                    {watch('photos').length < 3 ?
                      (<DownloadIcon
                        className="h-5 w-5 text-gray-400 my-auto"
                        aria-hidden="true"
                      />) : (
                        <CheckIcon
                          className="h-5 w-5 text-gray-400 my-auto"
                          aria-hidden="true"
                        />
                      )
                    }
                  </div>
                </Box>
              </Div_input_creation>
              <div className='flex justify-end mt-3'>
                <BlackButton
                  typeButton='submit'
                  element='aggiungi'
                  borderRadius={10}
                  size={'sm'}
                  width={200}
                  heigth={12}
                  //disabled={!isDirty || !isValid}
                  disabled={false}
                />
              </div>

            </div>
          </form>
        </div>
      </Desktop_Layout>
      <Controller
        control={control}
        name="photos"
        rules={{ required: false }}
        render={() => (
          <Drawer_Add_Image openDraw={openDrawNumber} confirmPhotos={(images) => {
            setValue('photos', images);
          }} />
        )}
      />
      <Modal_Error_Shop openModalMath={openModalMath} title='Manca qualcosa' description='Impossibile creare il prodotto.
      Controlla di aver inserito tutti dati in maniera corretta' closeText='chiudi' />
      


    </>

  )
}

export default index