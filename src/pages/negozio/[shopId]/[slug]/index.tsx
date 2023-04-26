import React, { useEffect, useRef, useState } from 'react'
import Box_Shop from '../../../../../components/molecules/Box_Shop'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout'
import { Box, Button, defineStyle, Divider, Flex, Spacer, Text } from '@chakra-ui/react'
import Box_Dress from '../../../../../components/molecules/Box_Dress'
import { useRouter } from 'next/router'
import Horizontal_Line from '../../../../../components/atoms/Horizontal_Line'
import { Product } from '../../../../interfaces/product.interface'
import { Shop, ShopAndProducts } from '../../../../interfaces/shop.interface'
import createUrlSchema from '../../../../../components/utils/create_url'
import { initApollo } from '../../../../lib/apollo'
import GET_PRODUCTS_FROM_SHOP from '../../../../lib/apollo/queries/geetProductsShop'
import { toProductPage } from '../../../../../components/utils/toProductPage'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Link from 'next/link'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@chakra-ui/icons'
import toUpperCaseFirstLetter from '../../../../../components/utils/uppercase_First_Letter'
import { imageKitUrl } from '../../../../../components/utils/imageKitUrl'
import PostMeta from '../../../../../components/organisms/PostMeta'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLazyQuery, useQuery } from '@apollo/client'
import Modal_Info_Store from '../../../../../components/organisms/Modal_Info_Store'
import isShopOpen from '../../../../../components/utils/isShopOpen'
import GET_SHOP_AND_PRODUCTS from '../../../../lib/apollo/queries/getSingleShop'
import GET_SINGLE_PRODUCT from '../../../../lib/apollo/queries/getSingleProduct'
import { MoreHoriz, MoreHorizCircle, Phone, PinAlt } from 'iconoir-react'
import PopoverComponent from '../../../../../components/molecules/PopoverComponent'
import { numberOfLineText } from '../../../../../components/utils/numberOfLineText'

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking', // can also be true or false
    }
}

export async function getStaticProps(ctx: any) {
    let { shopId } = ctx.params;
    const apolloClient = initApollo()

    const { data } = await apolloClient.query({
        query: GET_SHOP_AND_PRODUCTS,
        variables: { id: shopId, limit: 50, offset: 0 },
    })
    console.log(data);

    return {
        props: {
            shop: data.shop,
        },
        revalidate: 60, // In seconds
    }
}





const index: React.FC<{ shop: ShopAndProducts }> = ({ shop }) => {
    console.log(shop);
    //TODO lazyload scroll products



    const router = useRouter();
    const [addressForMaps, setaddressForMaps] = useState('')
    const [productsFounded, setproductsFounded] = useState<Product[]>([])
    const [hasMoreData, setHasMoreData] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [showAllDescriptionShop, setshowAllDescriptionShop] = useState(false)
    const [descriptionRefTextLenght, setDescriptionRefTextLenght] = useState(0)
    const descriptionRefText = useRef<any>(null)

    useEffect(() => {
        if (descriptionRefText.current) {
            const numberOfLine = numberOfLineText(descriptionRefText.current);
            setDescriptionRefTextLenght(numberOfLine);
        }
    }, [descriptionRefText]);

    const [getMoreProducts, { loading, error, data, fetchMore }] = useLazyQuery(GET_PRODUCTS_FROM_SHOP);

    console.log(data);


    const createAddressForMAps = () => {
        setaddressForMaps(shop.address.street.replaceAll(' ', '+') + ', ' + shop.address.city.replaceAll(' ', '+'))
    }

    useEffect(() => {
        createAddressForMAps()
        setproductsFounded(shop.products.products)
    }, [shop])



    return (
        <Desktop_Layout
            noPaddingXMobile={true}
        >
            <PostMeta
                canonicalUrl={'https://www.veplo.it' + router.asPath}
                title={`${toUpperCaseFirstLetter(shop.name)} a ${shop.address.city}, ${shop.address.street} - CAP ${shop.address.postcode} - Veplo.it`}
                subtitle={`Visita il negozio di abbigliamento ${shop.name} a ${shop.address.city}, ${shop.address.street} - CAP ${shop.address.postcode} | Abbigliamento · Scarpe · Vestiti | scopri le offerte | vivi Veplo`}
                image={shop.profileCover}
                description={`Visita il negozio di abbigliamento ${shop.name} a ${shop.address.city}, ${shop.address.street} - CAP ${shop.address.postcode} | Abbigliamento · Scarpe · Vestiti | scopri le offerte | vivi Veplo`}
            />

            <Box
                className='lg:w-8/12 m-auto -p-10 mb-2 lg:mb-5'
                paddingBottom={10}
            >
                <LazyLoadImage src={
                    imageKitUrl(shop.profileCover)
                }
                    //PlaceholderSrc={PlaceholderImage}
                    alt={shop.name}

                    className='w-full object-cover aspect-[2.3/1] lg:rounded-[10px]'
                />
                <Box
                    marginBottom={1}
                    width={['28', '40']}
                    height={['28', '40']}
                    mt={[-14, -20]}
                    zIndex={50}
                    borderWidth={1}
                    borderColor={'white'}
                    background={'white'}
                    borderRadius={'full'}
                    color={'gray.400'}
                    fontSize={['xs', 'sm']}
                    className='cursor-pointer ml-5 md:ml-8'
                    display={'flex'}
                >
                    <Box
                        borderRadius={'full'}
                        width={'full'}
                        height={'full'}
                        background={'white'}
                        textAlign={'center'}
                        display={'flex'}
                    >

                        <LazyLoadImage src={
                            imageKitUrl(shop.profilePhoto)
                        }
                            //PlaceholderSrc={PlaceholderImage}
                            alt={shop.name}
                            className='m-auto h-full w-full p-[4px] lg:p-[5px] rounded-full'
                        />
                    </Box>
                </Box>
                <Box
                    mt={[4, 6]}
                    className='px-5 lg:p-0'
                >
                    <Box
                        display={'flex'}
                        justifyContent={'space-between'}
                    >
                        <Text
                            className='font-bold text-2xl lg:text-4xl my-auto'
                        >
                            {shop.name}
                        </Text>


                        <PopoverComponent
                            actionsPopover={
                                [
                                    {
                                        title: 'Contatta',
                                        icon: <Phone
                                            className='w-4 h-4 my-auto'
                                            strokeWidth={2.5}
                                        />,
                                        handleClick: () => {
                                            console.log('merlo');
                                            if (typeof window !== 'undefined') {
                                                window.location.href = 'tel:+39' + shop.info.phone;

                                            }
                                        }
                                    },
                                    {
                                        title: 'Indicazioni',
                                        icon: <PinAlt
                                            className='w-4 h-4 my-auto'
                                            strokeWidth={2.5}
                                        />,
                                        handleClick: () => {
                                            console.log('merlo');
                                            if (typeof window !== 'undefined') {
                                                window.open(
                                                    'https://www.google.it/maps/search/' + shop.address.city + ' ' + shop.address.postcode + ' ' + shop.address.street,
                                                    '_blank' // <- This is what makes it open in a new window.
                                                );
                                            }

                                        }
                                    },

                                ]
                            }
                            icon={
                                <MoreHoriz

                                    className='m-auto'
                                    height={'full'}
                                    width={'full'}
                                    strokeWidth={2}

                                />
                            } />

                    </Box>

                    {shop.info.description &&
                        <>
                            <Text
                                noOfLines={!showAllDescriptionShop || descriptionRefTextLenght <= 3 ? 3 : 100}
                                color={'#909090'}
                                className='font-medium text-sm mt-2 lg:text-md'
                                ref={descriptionRefText}
                            >
                                {shop.info.description}
                            </Text>
                            {descriptionRefTextLenght > 3 && <Text
                                onClick={() => setshowAllDescriptionShop(!showAllDescriptionShop)}
                                color={'#909090'}
                                cursor={'pointer'}
                                className='font-semibold underline text-sm lg:text-md'
                            >
                                {!showAllDescriptionShop ? 'mostra altro' : 'mostra meno'}
                            </Text>}
                        </>
                    }
                </Box>

            </Box>

            {productsFounded &&
                <div className="grid grid-cols-1 px-3 lg:px-0 md:grid-cols-3 gap-5 w-full lg:w-8/12 mx-auto">
                    {productsFounded.map((product) => {
                        return (
                            <div
                                key={product.id}
                            >
                                <Box_Dress product={product}
                                ></Box_Dress>
                            </div>
                        )
                    })}
                </div>}

            <Modal_Info_Store isOpen={isOpen} onClose={() => setIsOpen(false)} shop={shop} />

        </Desktop_Layout>

    )
}

export default index