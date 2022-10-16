import Router, { useRouter } from 'next/router'
import React from 'react'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'
import { Box, Image } from '@chakra-ui/react'

type Router = {
  genere: 'donna' | 'uomo',
  categoria: string
  citta?: string 
}

const dress = {
  name: 'LOGO LONG SLEEVE TEE - Maglietta a manica lunga',
  company: 'Sartoria Rizzo Merlini',
  brand: 'Tommy Hilfiger',
  formattedPrice: '24,99€',
  imageUrl: 'https://img01.ztat.net/article/spp-media-p1/0a53a253d16a366cb8752f4ef4c76f37/24afae32e49b473db7b2502bef83e4ea.jpg?imwidth=1800',
  imageAlt: 'Rear view of modern dress',
  color: ['blackAlpha.900', 'gray.300', 'red.700', 'white'],
  id: 'ABC1234'
}
let clothes:any[] = [];

for (let i = 0; i < 20; i++) {
  clothes.push(dress)
}



const genere = () => {

 

  const router = useRouter();

  const query = router.query;

  const toProductPage = (product:any)  => {
    router.push({
      pathname: `${query.genere}/${product.id}`,
      query: { 
        productId: product.id,
        nome: encodeURIComponent(product.name),
        marca: encodeURIComponent(product.brand),
        company: encodeURIComponent(product.company)
       },
    })
  }
  return (
    <Desktop_Layout>
      <div className='flex justify-between mb-5'>
        <h1 className="font-black text-xl md:text-5xl italic text-black-900  ">Dintorni {query.citta && <span className='text-base md:text-2xl'>per {query.citta?.charAt(0).toUpperCase() + query.citta?.slice(1)}</span>}</h1>
        <p className='m-auto mr-0 mb-0'>{query.genere?.charAt(0).toUpperCase() + query.genere?.slice(1)} | {query.categoria?.charAt(0).toUpperCase() + query.categoria?.slice(1)}</p>
      </div>
      <div>
        <div className="min-h-screen flex items-center justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
            {clothes.map((dress) => {
              return (
                <Box onClick={() =>toProductPage(dress)} key={Math.random()} minW='20' maxW='350'  mb={'5'} borderRadius='lg' overflow='hidden' className='cursor-pointer'
                  _active={{
                    transform: 'scale(0.99)',
                  }}>
                  <Image src={dress.imageUrl} alt={dress.imageAlt} />
                  <Box py='1' px={'0'}>
                    <Box
                      mt='1'
                      fontWeight='bold'
                      as='h2'
                      lineHeight='tight'
                      noOfLines={1}
                      fontSize='sm'
                    >
                      {dress.company}
                    </Box>
                    <Box
                      fontWeight='normal'
                      as='h2'
                      noOfLines={1}
                      lineHeight='tight'
                      fontSize='sm'
                      className='italic'
                    >
                      {dress.brand}
                    </Box>
                    <Box
                      fontWeight='normal'
                      as='h3'
                      fontSize='sm'
                      lineHeight='none'
                      noOfLines={1}
                    >
                      {dress.name}
                    </Box>
                    <div className='flex justify-between mt-2'>
                      <Box
                        fontWeight='bold'
                        as='h4'
                        fontSize='xs'
                        color='green.600'
                        lineHeight='none'
                        noOfLines={1}
                        mt={'1'}
                      >
                        {dress.formattedPrice}
                      </Box>
                      <div className='flex space-x-1'>
                        {dress.color.map((color) => {
                          return (
                            <Box key={color} h={'4'} w={'4'} borderRadius={'100%'} bg={color} borderWidth={1} borderColor={'gray.200'}>
                            </Box>
                          )
                        })}
                      </div>
                    </div>
                  </Box>
                </Box>
              )
            })}
          </div>
        </div>



      </div>
    </Desktop_Layout>
  )
}

export default genere