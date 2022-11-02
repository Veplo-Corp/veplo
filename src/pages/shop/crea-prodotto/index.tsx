import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import React, { useRef } from 'react'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'
import Drawer_Add_Image from '../../../../components/organisms/Drawer_Add_Image'

const index = () => {
  //* create product form
  const product_name = useRef<HTMLInputElement | null>(null)
  const product_price = useRef<HTMLInputElement | null>(null)
  return (
    <>
      <Desktop_Layout>
        <div className='flex justify-between w-full'>
          <form className="p-3 px-4 lg:px-24 w-full md:w-6/12 xl:w-5/12" onSubmit={() => { }}>
            <div className='w-full'>
              <h1 className='italic text-lg lg:text-xl font-extrabold mb-4'>Aggiungi un capo di abbigliamento</h1>
              <div className='mb-2'>
                <p className='text-xs text-gray-400 font-normal mb-px'>
                  Nome prodotto
                </p>
                <InputGroup >
                  <Input
                    rounded={10}
                    paddingY={6}
                    type="text"
                    ref={product_name}
                    isInvalid={false}
                  //onChange={()=> console.log(product_name.current.value)}
                  />
                </InputGroup>
              </div>
              <div className='mb-2'>
                <p className='text-xs text-gray-400 font-normal mb-px'>
                  Prezzo prodotto
                </p>
                <InputGroup >
                  <InputLeftAddon rounded={10} paddingY={6} children='€' paddingInline={6} />
                  <Input
                    rounded={10}
                    paddingY={6}
                    type="text"
                    ref={product_price}
                    placeholder={'34,99'}
                    textAlign={"end"}
                    isInvalid={false}
                  //onChange={()=> console.log(product_name.current.value)}
                  />
                </InputGroup>
              </div>
            </div>
          </form>
        </div>
      </Desktop_Layout>
      <Drawer_Add_Image />

    </>

  )
}

export default index