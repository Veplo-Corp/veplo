import { useMutation } from '@apollo/client'
import { CheckIcon, DownloadIcon } from '@chakra-ui/icons'
import { Box, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import Autocomplete from '../../../../components/atoms/Autocomplete_Headless'
import BlackButton from '../../../../components/atoms/BlackButton'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'
import Div_input_creation from '../../../../components/atoms/Div_input_creation'
import Select_multiple_options from '../../../../components/atoms/Select_multiple_options'
import Select_options from '../../../../components/atoms/Select_options'
import { BRANDS } from '../../../../components/mook/brands'
import { CATEGORIES, Categories, Category } from '../../../../components/mook/categories'
import { Color, COLORS } from '../../../../components/mook/colors'
import { MACROCATEGORY, Macrocategory } from '../../../../components/mook/macrocategories'
import { MICROCATEGORY, Microcategory } from '../../../../components/mook/microcategories'
import { man_bottom_clothes_sizes, man_top_clothes_sizes, SIZES, Sizes, woman_clothes_sizes } from '../../../../components/mook/sizes'
import Drawer_Add_Image from '../../../../components/organisms/Drawer_Add_Image'
import Modal_Error_Shop from '../../../../components/organisms/Modal_Error_Shop'
import Product_Form from '../../../../components/organisms/Product_Form'
import { ToastOpen } from '../../../../components/utils/Toast'
import uploadPhotoFirebase from '../../../../components/utils/uploadPhotoFirebase'
import CREATE_PRODUCT from '../../../lib/apollo/mutations/createProduct'
import EDIT_PRODUCT from '../../../lib/apollo/mutations/editProduct'


export interface IFormInput {
  name: string;
  price: string;
  brand: string;
  colors: Color[];
  macrocategory: Category;
  microcategory: string;
  sizes: Macrocategory[];
  photos: any[];
  gender: 'M' | 'F' | undefined
}

const index = () => {
  const user = useSelector((state) => state.user.user);
  const { addToast } = ToastOpen();
  //* graphQL
  const [createProduct, Element] = useMutation(CREATE_PRODUCT);
  const [editProduct, editProductResult] = useMutation(EDIT_PRODUCT);


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
  const [sizesSelected, setSizesSelected] = useState<Sizes>();

  //openDraw
  const [openDrawNumber, setOpenDrawNumber] = useState()
  const brands = useRef<Brand[]>(BRANDS)
  const colors = useRef<Color[]>(COLORS)
  const macrocategories = useRef<Macrocategory[]>(MACROCATEGORY)
  const microcategories = useRef<Microcategory[]>(MICROCATEGORY)
  const categories = useRef<Categories>(CATEGORIES)
  const ARRAY_woman_clothes_sizes = useRef<string[]>(woman_clothes_sizes)
  const ARRAY_man_top_clothes_sizes = useRef<string[]>(man_top_clothes_sizes)
  const ARRAY_man_bottom_clothes_sizes = useRef<string[]>(man_bottom_clothes_sizes)



  useEffect(() => {
    const product_macrocategory = watch('macrocategory')
    console.log(product_macrocategory);

    if (!product_macrocategory) {

      setMicrocategorySelected(undefined);
      setSizesSelected(undefined)
      return
    }

    if (product_macrocategory.sizes.split('_')[0] === 'man') {
      console.log('eccolo cazzo');
      setValue('gender', 'M');
    } else if (product_macrocategory.sizes.split('_')[0] === 'woman') {
      setValue('gender', 'F');
    }
    setMicrocategorySelected(watch('macrocategory').types)

    //* da migliorare logica
    if (watch('macrocategory').sizes === 'woman_clothes_sizes') {
      setSizesSelected(ARRAY_woman_clothes_sizes.current)
    }
    else if (watch('macrocategory').sizes === 'man_top_clothes_sizes') {
      setSizesSelected(ARRAY_man_top_clothes_sizes.current)
      console.log('passa qui 1');

    }
    else if (watch('macrocategory').sizes === 'man_bottom_clothes_sizes') {
      setSizesSelected(ARRAY_man_bottom_clothes_sizes.current)
      console.log('passa qui 1');
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





  const submitData = async ({ name, price, brand, colors, macrocategory, microcategory, sizes, photos, gender }: IFormInput) => {

    // console.log(name, price, brand, colors, macrocategory, microcategory, sizes, photos);


    // if (!brand || !colors || !macrocategory || !microcategory || !sizes || !photos[2] || !gender) {
    //   return setOpenModalMath(Math.random())
    // }

    try {
      if(photos.length < 2){
        throw new Error('poche immagini')
      }

      const colorsToDB = colors.map((color) => {
        return color.name
      })
  
  
      const priceToDB = Number(price.replace(',', '.'))
  
      if (!priceToDB || priceToDB <= 0.01) {
        return setOpenModalMath(Math.random())
      }
  
      const Product = {
        name,
        price: priceToDB,
        colors: colorsToDB,
        sizes: sizes,
        macroCategory: macrocategory.name,
        microCategory: microcategory,
        gender: gender,
        brand: brand,
        photos: [''],
      }
  
      console.log(Product);

      const isCreatedProduct = await createProduct({ variables: { shopId: '6373bb3c0742ade8758b1a97', options: Product } })
      //* alert to show product creation process OK!
      //upload Images to database
      console.log(isCreatedProduct);
      const productId =isCreatedProduct.data.createProduct;
      let photoURLForDB = [];
      let i = 1;
      console.log(photos);

      

      for await (let photo of photos) {
        try {
          const url = await uploadPhotoFirebase('photo' + i, photo.blob, productId, user.uid)
          photoURLForDB.push(url)
          i++
        } catch {
          addToast({ position: 'top', title: 'Errore upload immagine', description: "errore durante l'upload dell'immagini", status: 'error', duration: 5000, isClosable: false })
          break;
        }
      }

      const areImagesAdded = await editProduct({ variables: { id: productId, options: {
        photos: photoURLForDB
      } } })

      if (isCreatedProduct.data.createProduct && areImagesAdded.data.editProduct === true) {
        return addToast({ position: 'top', title: 'Prodotto creato con successo', description: 'controlla il tuo nuovo prodotto nella sezione dedicata', status: 'success', duration: 5000, isClosable: true })
      }
      else {
        return addToast({ position: 'top', title: 'Impossibile creare il prodotto', description: "c'è stato un errore durante la creazione del prodotto, riprova più tardi", status: 'error', duration: 5000, isClosable: true })
      }

    } catch (e) {
      console.log(e);
      console.log(e.code);
      console.log(e.message);
      addToast({ position: 'top', title: 'Impossibile creare il prodotto', description: "c'è stato un errore durante la creazione del prodotto, riprova più tardi", status: 'error', duration: 5000, isClosable: true })
    }



  }


  return (
    <>
      <Desktop_Layout>
        {/* <div className='flex justify-between w-full mb-96'>
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
                    {...register("name", { required: true, maxLength: 30 })}
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
                      required: true,
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
                  name="brand"
                  rules={{ required: false }}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Autocomplete values={brands.current}
                      handleChangeValues={(brand) => {
                        setValue('brand', brand);
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
                    <Select_options values={categories.current} type={'macrocategory'}
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
                    <Select_options values={microcategorySelected} type={'microcategory'}
                      handleClick={(microCategory) => {
                        console.log(microCategory);

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
                    <Select_multiple_options values={sizesSelected} type={'size'}
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
                    className={`w-full flex justify-between ${watch('photos').length < 2 ? 'text-gray-500' : 'text-gray-900'}  `}
                  >
                    <span>
                      {watch('photos').length < 2 ? 'carica immagini del prodotto' : 'immagini caricate correttamente'}
                    </span>
                    {watch('photos').length < 2 ?
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
                  //disabled={false}
                  disabled={!isDirty || !isValid || !watch('brand') || !watch('colors') || !watch('colors')[0] || !watch('macrocategory') || !watch('microcategory') || !watch('sizes') || !watch('sizes')[0] || !watch('photos')[1]}
                />
              </div>

            </div>
          </form>
        </div> */}
        <Product_Form handleSubmitEvent={submitData}/>
      </Desktop_Layout>
      <Controller
        control={control}
        name="photos"
        rules={{ required: false }}
        render={() => (
          <Drawer_Add_Image openDraw={openDrawNumber} confirmPhotos={(images: string[]) => {
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