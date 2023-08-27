import React, { useEffect, useRef, useState } from 'react'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button,
    Image,
    Box,
    TagLabel,
    Tag,
    Tooltip,
    InputGroup,
    Input,
    InputRightElement,
} from '@chakra-ui/react'
import GET_PRODUCTS_FROM_SHOP from '../../src/lib/apollo/queries/geetProductsShop';
import { ApolloClient, useMutation, useQuery } from '@apollo/client';
import { Product, Variation } from '../../src/interfaces/product.interface';
import { initApollo } from '../../src/lib/apollo';
import EDIT_PRODUCT from '../../src/lib/apollo/mutations/editProduct';
import { useRouter } from 'next/router';
import Link from 'next/link'
import Loading from '../molecules/Loading';
import addAWSPath from '../utils/add_path_aws';
import { imageKitUrl } from '../utils/imageKitUrl';
import Input_Search_Item from '../atoms/Input_Search_Item'
import Product_Status_Popover from '../molecules/Product_Status_Popover';
import EDIT_STATUS_PRODUCT from '../../src/lib/apollo/mutations/editStatusProduct';
import { ToastOpen } from '../utils/Toast';
import { formatNumberWithTwoDecimalsInString } from '../utils/formatNumberWithTwoDecimalsInString';
import { Search } from 'iconoir-react';


interface Props {
    shop: {
        firebaseId: string,

        products: {
            products: Product[]
        }
    }

}
// const Table_Products_Shop: React.FC<{ idShop: string, deleteProduct: any }> = ({ idShop, deleteProduct }) => {

const Table_Products_Shop: React.FC<{ idShop: any, deleteProduct: any, }> = ({ idShop, deleteProduct }) => {
    const { addToast } = ToastOpen();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const router = useRouter()
    //const [products, SetProducts] = useState<Product[] | []>([])
    const [productsOnTextSearched, setProductsOnTextSearched] = useState<{ inputText: string, products: Product[] }>({
        inputText: '',
        products: []
    })

    const [editStatus, editStatusResponse] = useMutation(EDIT_STATUS_PRODUCT, {
        update(cache, el, query) {

            const deleteId = el.data
            const { shop } = cache.readQuery<any>({
                query: GET_PRODUCTS_FROM_SHOP,
                variables: {
                    id: idShop, limit: 100, offset: 0,
                    filters: {}
                },
            });
            const ProductCacheId = cache.identify({ id: query.variables?.id, __typename: 'Product' })
            cache.modify({
                id: ProductCacheId, //productId
                fields: {
                    status(/* cachedvalue */) {
                        return query.variables?.status //newStatus
                    }
                },
                broadcast: false // Include this to prevent automatic query refresh
            });

        }
    })


    const { loading, error, data, fetchMore } = useQuery<Props>(GET_PRODUCTS_FROM_SHOP, {
        variables: { id: idShop, limit: 100, offset: 0, filters: {} },
    });




    //redirect to createShop,whether there is not a Shop
    // if (error) {
    //     router.push('/shop/crea-shop')
    // }



    const handleChangeStatus = async (DBstatus: string, productId: string) => {
        try {
            await editStatus({ variables: { id: productId, status: DBstatus } })
        } catch (e) {
            addToast({
                position: 'top',
                title: 'Errore durante cambio status',
                description: 'Ci dispiace, riprova più tardi',
                status: 'error',
                duration: 5000,
                isClosable: true
            })
        }
    }


    const handleButtonDelete = async (productId: string, name: string, photos: string[]) => {
        //! remove data?.shop.products
        await deleteProduct(productId, name, photos,/* data?.shop.products */)
    }

    const handleButtonEdit = async (productId: string) => {
        router.push(`/shop/home/${idShop}/gestisci-prodotto/${productId}`)
    }

    const handleButtonEditDiscount = async (productId: string) => {
        router.push(`/shop/prodotti/modifica/${productId}?editDiscount=true`)
    }

    const textSearchProducts = (inputSearch: string) => {

        const productsFiltered = data?.shop.products?.products
            .filter((product: Product) =>
                product.name
                    .toLowerCase()
                    .replace(/\s+/g, '').includes(inputSearch.toLowerCase()
                        .replace(/\s+/g, ''))
                ||
                product.info.brand
                    .toLowerCase()
                    .replace(/\s+/g, '').includes(inputSearch.toLowerCase()
                        .replace(/\s+/g, ''))
            )

        if (!productsFiltered) return
        setProductsOnTextSearched({
            inputText: inputSearch,
            products: productsFiltered
        })
    }

    const resetSerachInput = () => {
        setProductsOnTextSearched({
            inputText: '',
            products: []
        })
    }

    const onChangeStatus = (DBstatus: string, productId: string) => {
        handleChangeStatus(DBstatus, productId)
    }





    if (loading) return (
        <Box
            mt={'30vh'}
        >
            <Loading />
        </Box>
    )
    if (error) return (
        <div>
            {`Error!${error.message}`}
        </div>
    );



    return (
        <div
            className='mt-2'
        >

            <div className='md:flex md:justify-between'>
                <Button
                    mb={[3, 4]}
                    fontSize={['xs', 'md']}
                    onClick={() => {
                        router.push('/shop/home/' + idShop + '/crea-prodotto')
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    NUOVO PRODOTTO
                </Button>
                <div className='mb-2 w-3/4 md:mb-0 md:w-fit'>
                    <InputGroup
                        className='relative w-full'
                    >
                        <Input
                            type='text'
                            maxLength={50}
                            borderWidth={1.5}
                            borderColor={'white'}
                            ref={inputRef}
                            placeholder={'cerca prodotto'}
                            _placeholder={{
                                color: '#A19F9F',
                                opacity: 1,
                                fontWeight: '500'
                            }}
                            borderRadius={10}
                            py={2}
                            pl={4}
                            size='md'
                            fontSize={'md'}
                            focusBorderColor='#F2F2F2'
                            _focus={{
                                background: 'white',
                            }}
                            fontWeight={'semibold'}
                            bg={'#F2F2F2'}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === undefined) {
                                    if (inputRef?.current?.value) {
                                        textSearchProducts(inputRef.current.value)
                                        inputRef.current.value = ''
                                    }

                                }

                            }
                            }
                        />
                        <InputRightElement
                            mr={1}
                            className='cursor-pointer'
                            color={'#A19F9F'}
                            onClick={() => {

                            }}
                            children={
                                <Search
                                    className="w-6 h-6"
                                    strokeWidth={2}
                                />


                            }
                        />
                    </InputGroup>
                </div>

            </div>
            {productsOnTextSearched.inputText.length > 0 && <Box
                marginBottom={'2'}
            >
                Risultati per: <span className='font-semibold'>
                    {productsOnTextSearched.inputText}</span> <span
                        className='underline text-blue-600 ml-1 cursor-pointer'
                        onClick={resetSerachInput}
                    >resetta ricerca</span>
            </Box>}
            <TableContainer className='flex m-auto w-full '>

                <Table variant='simple'>
                    <TableCaption
                        marginBottom={10}
                    >i tuoi prodotti in Veplo</TableCaption>
                    <Thead
                        bg={'gray.100'}
                    >
                        <Tr>
                            <Th
                                paddingY={5}
                                className='hidden md:table-cell'
                                minW={[10]}
                                paddingRight={0}
                                fontSize={'sm'}
                            >
                                Immagine
                            </Th>
                            <Th p={[2, 4]}
                                fontSize={'sm'}
                                minW={[30]}>Nome</Th>
                            <Th p={[2, 4]}
                                fontSize={'sm'}
                                className='hidden lg:table-cell' >
                                Genere
                            </Th>
                            <Th p={[2, 4]}
                                fontSize={'sm'}
                                className='hidden lg:table-cell' >
                                Brand
                            </Th>
                            <Th p={[2, 4]}
                                fontSize={'sm'}
                            >
                                <div
                                    className='flex'
                                >
                                    Prezzo
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                    </svg> */}

                                </div>
                            </Th>
                            <Th p={[2, 4]} className='hidden md:table-cell'
                                fontSize={'sm'}
                            >
                                Categoria
                            </Th>
                            <Th p={[2, 4]} className='hidden md:table-cell'
                                fontSize={'sm'}
                            >
                                <div
                                    className='flex'
                                >
                                    Varianti
                                    <Tooltip label="tipologie di prodotti disponibili">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                        </svg>
                                    </Tooltip>
                                </div>
                            </Th>
                            <Th p={[2, 4]}
                                fontSize={'sm'}
                            >Gestisci
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody >
                        {data?.shop.products && (productsOnTextSearched.inputText.length > 0 ? productsOnTextSearched.products : data?.shop.products?.products).map((product: Product | any) => {
                            //const categoryAndmicrocategory = (`${product.info.macroCategory} - ${product.info.microCategory}`).length > 25 ? (`${product.info.macroCategory} - ${product.info.microCategory}`).substring(0, 25) + '...' : (`${product.info.macroCategory} - ${product.info.microCategory}`)
                            return (
                                <Tr key={product.id} fontSize={['xs', 'medium']}
                                    _hover={{
                                        background: 'gray.50'
                                    }}
                                >
                                    <Td
                                        paddingY={2}
                                        paddingRight={0}
                                        className='hidden md:table-cell '
                                    >
                                        {product.variations[0]?.photos[0]?.src ?
                                            (<img
                                                className='h-15 rounded-md'
                                                src={
                                                    product.variations[0].photos[0]?.src
                                                }>
                                            </img>) :
                                            (<img
                                                className='h-16 rounded-md'
                                                src={
                                                    imageKitUrl(product.variations[0]?.photos[0], 80, 115)
                                                    //addAWSPath(product.photos[0])
                                                }>
                                            </img>)}
                                    </Td>

                                    <Td paddingRight={0}
                                        paddingY={6}
                                        paddingLeft={[2, 4]}
                                    >
                                        <span className='flex md:hidden'>
                                            <Tooltip label={product.name}>
                                                {product.name.length < 25 ?
                                                    product.name.toUpperCase()
                                                    :
                                                    product.name.toUpperCase().substring(0, 25) + '...'
                                                }
                                            </Tooltip>
                                        </span>
                                        <span className='hidden md:flex'>
                                            {product.name.toUpperCase()}
                                        </span>

                                    </Td>
                                    <Td paddingRight={0}
                                        paddingY={0}
                                        paddingLeft={[2, 4]}
                                        className='hidden lg:table-cell'>
                                        <span>
                                            {product.info.gender === 'f' ? 'donna' : product.info.gender === 'u' ? 'unisex' : product.info.gender === 'm' ? 'uomo' : 'non trovato'}
                                        </span>
                                    </Td>
                                    <Td paddingRight={0}
                                        paddingY={0}
                                        paddingLeft={[2, 4]}
                                        className='hidden lg:table-cell'>
                                        <span>
                                            {product.info.brand}
                                        </span>
                                    </Td>
                                    {/* <Td paddingRight={0}
                                        paddingY={0}
                                        paddingLeft={[2, 4]}
                                    >
                                        <Tag size={['sm', 'md']} variant='subtle'
                                            borderRadius='full'
                                            colorScheme={`${product.status === 'active' ? 'green' : 'red'}`}>
                                            <Product_Status_Popover status={product.status} onChangeStatus={(DBStatus: string) => onChangeStatus(DBStatus, product.id)} />
                                        </Tag>

                                    </Td> */}
                                    <Td paddingRight={0}
                                        paddingY={0}
                                        paddingLeft={[2, 4]}
                                    >
                                        <span
                                            className={`${product.price?.v2 < product.price?.v1 ? 'line-through text-gray-500' : ''}`}
                                        >
                                            {formatNumberWithTwoDecimalsInString(product.price.v1)}€
                                        </span>
                                        {product.price?.v2 < product.price?.v1 && <span
                                        > {formatNumberWithTwoDecimalsInString(product.price.v2)}€
                                        </span>}
                                    </Td>

                                    <Td paddingRight={0}
                                        paddingY={0}
                                        paddingLeft={[2, 4]}
                                        className='hidden md:table-cell'>
                                        <span>
                                            {product.info.macroCategory} - {product.info.microCategory}
                                        </span>
                                    </Td>
                                    <Td paddingRight={0}
                                        paddingY={0}
                                        paddingLeft={[2, 4]}
                                        className='hidden md:table-cell' >
                                        <span>
                                            {product.variations.length} variant{product.variations.length === 1 ? 'e' : 'i'}
                                        </span>
                                    </Td>
                                    {/* <Td className='hidden md:table-cell'>
                                        <Button colorScheme={'blue'}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                            <span className='hidden lg:flex ml-1'>modifica</span>
    
                                        </Button>
    
                                    </Td  >
                                    <Td className='hidden md:table-cell'>
                                        <Button colorScheme={'red'}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                            <span className='hidden lg:flex ml-1'>elimina</span>
                                        </Button>
                                    </Td> */}
                                    <Td
                                        paddingRight={0}
                                        paddingY={0}
                                        paddingLeft={[2, 4]}
                                        className='w-fit' >
                                        <div >
                                            {/* //!gestione sconto  */}
                                            {/* <Button
                                                className='invisible xl:visible'
                                                onClick={() =>
                                                    handleButtonEditDiscount(product.id)
                                                }
                                                colorScheme={'yellow'} size={['xs', 'md']} variant={['ghost', 'outline']}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                                                </svg>

                                                <span className='hidden xl:flex ml-1'>Sconto</span>

                                            </Button> */}
                                            <Button
                                                onClick={() =>
                                                    handleButtonEdit(product.id)
                                                }
                                                colorScheme={'blue'} mr={[2, 3]} variant={['ghost', 'outline']}
                                                borderRadius={'full'}
                                                height={[8, 10]}
                                                width={[8, 10]}
                                                padding={0}

                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-5 md:h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                            </Button>
                                            <Button onClick={() => handleButtonDelete(product.id, product.name, []/* product.variations[0].photos[0] */)
                                            }
                                                borderRadius={'full'}
                                                height={[8, 10]}
                                                width={[8, 10]}
                                                padding={0}
                                                colorScheme={'red'} variant={['ghost', 'solid']}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-5 md:h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </Button>
                                        </div>
                                        {/* //! arrow button to show more content in mobile */}
                                        {/* <div className='flex lg:hidden'>
                                            <Button onClick={() =>
                                                handleButtonDelete(product.id, product.name)
                                            }
                                                colorScheme={'black'} size={['xs', 'md']} m={[0, 3]} variant={['ghost', 'outline']}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                </svg>
                                            </Button>
                                        </div> */}
                                    </Td>
                                </Tr>
                            )

                        })}

                    </Tbody>

                </Table>

            </TableContainer >
        </div >

    )
}

export default Table_Products_Shop