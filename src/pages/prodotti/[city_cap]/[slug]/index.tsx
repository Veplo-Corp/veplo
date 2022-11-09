import Router, { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout'
import DintorniLogo_Below_Header from '../../../../../components/molecules/DintorniLogo_Below_Header'
import Box_Dress from '../../../../../components/molecules/Box_Dress'
import { Product } from '../../../../interfaces/product.interface'
import createUrlScheme from '../../../../../components/utils/create_url'


import user from '../../../store/reducers/user'
import getCityAndPostcodeFromSlug from '../../../../../components/utils/get_City_and_Postcode_from_Slug'


type Router = {
  city: string,
  // genere: 'donna' | 'uomo',
  // categoria: string
}

const dress: Product = {
  id: '636ab27e97bfedfee8f96f8f',
  name: 'logo long sleeve tee',
  photos: ['https://img01.ztat.net/article/spp-media-p1/0a53a253d16a366cb8752f4ef4c76f37/24afae32e49b473db7b2502bef83e4ea.jpg?imwidth=1800', 'https://img01.ztat.net/article/spp-media-p1/92ec5b9defd53c6095411644ba6df0a3/b55be231798048b1a53c715a5285e32f.jpg?imwidth=1800', 'https://img01.ztat.net/article/spp-media-p1/d975829dee9936ac91401531ffc18747/bb1c440521394dc088318d777a8c4280.jpg?imwidth=1800&filter=packshot'],
  price: 24.99,
  colors: ['blackAlpha.900', 'gray.300', 'red.700', 'white'],
  sizes: ['S 36', 'M 40'],
  macroCategory: 't-shirt',
  microCategory: 'maglietta a manica lunga',
  gender: 'M',
  brand: 'Tommy Hilfiger',
  location: {
    type: 'Point',
    coordinates: [42.562309, 12.64576]
  },
  shopId: '63459223b728b4f0b7d88a6f',
  description: 'negozio nel centro di terni',
  address: 'da inserire', //!TODO
  updateTime: '', //!TODO
  shopName: 'Sartoria Rizzo Merlini',
}

let clothes: any[] = [];

for (let i = 0; i < 20; i++) {
  clothes.push(dress)
}


export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // can also be true or false
  }
}

export async function getStaticProps(ctx) {

  let { city_cap, slug } = ctx.params;
  const element: {city: string, postcode: string | null} = getCityAndPostcodeFromSlug(city_cap);
  let gender: null | string = null;
  let category: null | string = null;
  return {
    props: {
      city: element.city,
      gender: gender ,
      category: category ,
      postcode: element.postcode,
    }
  }
}



const genere = ({ city, gender, category, postcode }) => {
  console.log(postcode,city );
  
  const router = useRouter()

  const toProductPage = (product: Product) => {
    const newUrl = createUrlScheme([product.brand, product.name, product.microCategory])
    if (newUrl) {
      router.push(`/prodotto/${product.id}/${newUrl}`)
    }
  }




  return (
    <Desktop_Layout>
      <DintorniLogo_Below_Header city={city} gender={gender} category={category}></DintorniLogo_Below_Header>
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