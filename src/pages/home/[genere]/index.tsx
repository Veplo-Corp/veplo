import Router, { useRouter } from 'next/router'
import React from 'react'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'
import DintorniLogo_Below_Header from '../../../../components/molecules/DintorniLogo_Below_Header'
import Box_Dress from '../../../../components/molecules/Box_Dress'

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
  id: '635030f4692a668cf323436f'
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
      <DintorniLogo_Below_Header genere={query.genere} citta={query.citta} categoria={query.categoria}></DintorniLogo_Below_Header>
      <div>
        <div className="min-h-screen flex items-center justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
            {clothes.map((dress) => {
              return (
                <Box_Dress eventHandler={toProductPage} key={Math.random()} dress={dress}></Box_Dress>
              )
            })}
          </div>
        </div>
      </div>
    </Desktop_Layout>
  )
}

export default genere