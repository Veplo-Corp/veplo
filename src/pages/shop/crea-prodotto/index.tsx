import { CheckIcon, DownloadIcon } from '@chakra-ui/icons'
import { Box, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
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

const index = () => {
  //* create product form
  const product_name = useRef<HTMLInputElement>(null)
  //const product_price = useRef<HTMLInputElement>(null)
  const [product_price, setProduct_Price] = useState<string>('');
  const [product_macrocategory, setMacrocategory] = useState<Macrocategory>();
  const [product_microcategory, setMicrocategory] = useState<string[]>([]);
  const [microcategorySelected, setMicrocategorySelected] = useState<Microcategory>();
  const [sizeSelected, setSizeSelected] = useState<Sizes>();
  const [photos, setPhotos] = useState<[]>([])

  //openDraw
  const [openDrawNumber, setOpenDrawNumber] = useState()

  const brands = useRef<Brand[]>(BRANDS)
  const colors = useRef<Color[]>(COLORS)
  const macrocategories = useRef<Macrocategory[]>(MACROCATEGORY)
  const microcategories = useRef<Microcategory[]>(MICROCATEGORY)
  const sizes = useRef<Sizes[]>(SIZES)

  useEffect(() => {
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
  }, [product_macrocategory])


  const onChangePrice = (e) => {
    let inputValue: string = e.target.value
    if (inputValue.split('.')[1]) {
      if (inputValue.split('.')[1].length > 2) {
        const lastChart = inputValue.charAt(inputValue.length - 1)
        inputValue = Number(inputValue).toFixed(1) + lastChart;
        return setProduct_Price(inputValue)
      }
    }
    return setProduct_Price(inputValue)


  }


  const setPhotosHandler = (photos) => {
    setPhotos(photos)
  }

  const submitData = (e) => {
    e.preventDefault()
    console.log(e);
  }

  return (
    <>
      <Desktop_Layout>
        <div className='flex justify-between w-full mb-96'>
          <form className="p-3 px-4 lg:px-16 xl:px-24 w-full md:w-6/12 xl:w-5/12" onSubmit={submitData}>
            <div className='w-full'>
              <h1 className='italic text-lg lg:text-xl font-extrabold mb-4'>Aggiungi un capo di abbigliamento</h1>
              <Div_input_creation text='Nome del prodotto'>
                <InputGroup >
                  <Input
                    maxLength={35}
                    rounded={10}
                    paddingY={6}
                    type="text"
                    ref={product_name}
                    isInvalid={false}
                  //onChange={()=> console.log(product_name.current.value)}
                  />
                </InputGroup>
              </Div_input_creation>
              <Div_input_creation text='Prezzo'>
                <InputGroup >
                  <InputLeftAddon rounded={10} paddingY={6} children='€' paddingInline={6} />
                  <Input
                    rounded={10}
                    paddingY={6}
                    type="number"
                    // ref={product_price}
                    value={product_price}
                    placeholder={'34,99'}
                    textAlign={"end"}
                    isInvalid={false}
                    onChange={onChangePrice}
                  />
                </InputGroup>
              </Div_input_creation>
              <Div_input_creation text='Brand'>
                <Autocomplete values={brands.current} />
              </Div_input_creation>
              <Div_input_creation text='Colori disponibili'>
                <Select_multiple_options values={colors.current} type={'color'} />
              </Div_input_creation>
              <Div_input_creation text='Categoria'>
                <Select_options values={macrocategories.current} handleClick={setMacrocategory} type={'macrocategory'} />
              </Div_input_creation>
              <Div_input_creation text='Microcategoria collegata'>
                <Select_options values={microcategorySelected?.microcategories} handleClick={() => { }} type={'microcategory'} />
              </Div_input_creation>
              <Div_input_creation text='Taglie disponibili'>
                <Select_multiple_options values={sizeSelected?.microcategories} type={'size'} />
              </Div_input_creation>
              <Div_input_creation text='Carica immagini'>
                <Box
                  rounded={10}
                  padding={3.5}
                  mt={1}
                  backgroundColor={`${photos.length < 3 ? 'white' : 'gray.200'}`}
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
                    className={`w-full flex justify-between ${photos.length < 3 ? 'text-gray-500' : 'text-gray-900'}  `}
                  >
                    <span>
                      {photos.length < 3 ? 'carica immagini del prodotto' : 'immagini caricate correttamente'}
                    </span>
                    {photos.length < 3 ?
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
                  disabled={false}
                  width={200}
                  heigth={12}
                />
              </div>

            </div>
          </form>
        </div>
      </Desktop_Layout>
      <Drawer_Add_Image openDraw={openDrawNumber} confirmPhotos={setPhotosHandler} />

    </>

  )
}

export default index