import Router, { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout'
import DintorniLogo_Below_Header from '../../../../../components/molecules/DintorniLogo_Below_Header'
import Box_Dress from '../../../../../components/molecules/Box_Dress'
import { Product } from '../../../../interfaces/product.interface'
import createUrlScheme from '../../../../../components/utils/create_url'
import toUpperCaseFirstLetter from '../../../../../components/utils/uppercase_First_Letter'
import user from '../../../store/reducers/user'


type Router = {
  city: string,
  // genere: 'donna' | 'uomo',
  // categoria: string
}

const dress: Product = {
  id: '635030f4692a668cf323436f',
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
  console.log(ctx);
  
  let { city, slug } = ctx.params;
  let cap = 'undefined'
  if (typeof cap === 'string') {
    
  }
  
  if (typeof city === 'string') {
    city = toUpperCaseFirstLetter(city);
    let provisional_cap: number | string = Number(city.split('-')[1])
    if(provisional_cap>0){
      provisional_cap = provisional_cap.toString();
      if(provisional_cap.length <= 4){
        let addText = ''
        for (let index = 0; index < (5-provisional_cap.length); index++) {
          addText += '0'
        }
        provisional_cap = addText + provisional_cap
      }
      console.log(provisional_cap);
      cap = provisional_cap;
      city = city.split('-')[0]
    }
  }

  let gender: undefined | string;
  let category: undefined | string;

  if (typeof slug === 'string') {
    gender = slug.split('-')[0];
    category = slug.substring(slug.indexOf("-") + 1);
  }

  return {
    props: {
        city: city || undefined,
        gender: gender || undefined,
        category: category || undefined,
        cap: cap || undefined,
    }
}
}



const genere = ({city, gender, category, cap}) => {

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