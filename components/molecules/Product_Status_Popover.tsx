import { Box, TagLabel } from '@chakra-ui/react'
import { Popover } from '@headlessui/react'
import React, { FC } from 'react'

const Product_Status_Popover: FC<{ status: string, onChangeStatus: any }> = ({ status, onChangeStatus }) => {

    const actionsNotLogged = [
        {
            name: 'Attivo',
            DB_name: 'active',
        },
        {
            name: 'Terminato',
            DB_name: 'not_active',
        }
    ]

    return (
        <Popover className="relative ">
            <Popover.Button
                type='button'
                aria-label="user"
            >
                <TagLabel>
                    <span className='hidden md:flex'>
                        {status === 'active' ? 'Attivo' : 'Terminato'}
                    </span>
                    <span className='flex md:hidden'>
                        {status === 'active' ? 'OK' : 'TE'}
                    </span>
                </TagLabel>
            </Popover.Button>
            <Popover.Panel
                className="absolute grid grid-cols-1 gap-3 cursor-pointer z-10 w-40 left-0 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                {actionsNotLogged.map((action, id) => {
                    return (<Popover.Button key={id} className='text-left hover:scale-95'>
                        <Box
                            fontSize={'md'}
                            fontWeight={'medium'}
                            lineHeight={'none'}
                            mb={'0.5'}
                            display={'flex'}
                            justifyContent={'space-between'}
                            onClick={()=> {
                                if(status === action.DB_name)return
                                onChangeStatus(action.DB_name)
                                
                            }}
                        >

                            <span className='my-auto'>
                                {action.name}
                            </span>
                            {action.DB_name === status && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 my-auto mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>}

                        </Box>

                    </Popover.Button>)
                })}
            </Popover.Panel>
        </Popover >
    )
}

export default Product_Status_Popover