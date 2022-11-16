import React, { useEffect, useState } from 'react'
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
} from '@chakra-ui/react'
import GET_PRODUCTS_FROM_SHOP from '../../src/lib/apollo/queries/geetProductsShop';
import { useQuery } from '@apollo/client';
import { Product } from '../../src/interfaces/product.interface';

const Table_Products_Shop: React.FC<{ idShop: string, deleteProduct: any }> = ({ idShop, deleteProduct }) => {

    const [products, SetProducts] = useState<Product[] | []>([])

    const { loading, error, data } = useQuery(GET_PRODUCTS_FROM_SHOP, {
        variables: { id: idShop }
    });

    useEffect(() => {
        if (!data) return
        console.log(data.shop.products);
        
        SetProducts(data.shop.products)

        

    }, [data])




    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
        <TableContainer className='flex m-auto w-full sm:w-fit'>
            <Table variant='simple'>
                <TableCaption>i tuoi prodotti in dintorni</TableCaption>
                <Thead
                    bg={'gray.100'}
                >
                    <Tr>
                        <Th className='hidden lg:table-cell'></Th>
                        <Th p={[2, 4]}>Nome</Th>
                        <Th p={[2, 4]} className='hidden md:table-cell'>Categoria</Th>
                        <Th px={[0.5, 4]} isNumeric>Prezzo</Th>
                        <Th p={[3, 4]} px={[0.5, 4]}   className='flex '>
                            <span className='m-auto'>
                                Azioni
                            </span>
                        </Th>
                    </Tr>
                </Thead>
                <Tbody >
                    {products.length > 0 && products.map((product) => {                        
                        return (
                            <Tr key={product.id} fontSize={['xs', 'medium']} >
                                <Td className='hidden lg:table-cell'>
                                    <Image
                                        className='w-20'
                                        src={product.photos[0]}></Image>
                                </Td>

                                <Td px={[0.5, 4]} >
                                    <span >
                                        {product.name}
                                    </span>
                                </Td>
                                <Td p={[2, 4]} className='hidden md:table-cell'>
                                    <span>
                                        {product.macroCategory} - {product.microCategory}
                                    </span>
                                </Td>
                                <Td px={[0.5, 4]} isNumeric>
                                    {product.price} €

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
                                <Td  px={[0.5, 4]} className='flex md:table-cell'>
                                    <div className='m-auto'>
                                        <Button colorScheme={'blue'} size={['xs', 'md']} m={[0, 3]} variant={['ghost', 'outline']}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                            <span className='hidden lg:flex ml-1'>modifica</span>

                                        </Button>
                                        <Button onClick={() => deleteProduct(product.id, product.name)}
                                        colorScheme={'red'} size={['xs', 'md']} variant={['ghost', 'outline']}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                            <span className='hidden lg:flex ml-1'>elimina</span>

                                        </Button>
                                    </div>

                                </Td>
                            </Tr>
                        )
                    })}

                </Tbody>

            </Table>

        </TableContainer>
    )
}

export default Table_Products_Shop