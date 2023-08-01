import { Box } from '@chakra-ui/react';
import React, { FC } from 'react'

const Pagination: FC<{ page: number, handlePage: (page: number) => void }> = ({ page, handlePage }) => {

    const gestFirstRange = (number: number): number[] => {
        if (number > 1) {
            return [number - 1, number, number + 1, number + 2];
        } else {
            return [number, number + 1, number + 2, number + 3];
        }
    }
    const firstRange = gestFirstRange(page)
    const secondRange = [...Array(3)].map((_, index) => page + 5 + index);

    console.log(firstRange);



    return (
        <div>
            <nav className="mb-10 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <Box
                    cursor={'pointer'}
                    onClick={() => {
                        if (page === 1) return
                        handlePage(page - 1)
                    }}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                </Box>
                {firstRange.map((pageNumber: number) => (
                    <Box
                        onClick={() => {
                            if (pageNumber === page) return
                            handlePage(pageNumber)
                        }}
                        cursor={'pointer'}
                        key={pageNumber}
                        className={` z-10  relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300  focus:z-20 focus:outline-offset-0 md:inline-flex 
                        ${pageNumber === page ? 'bg-[#F2F2F2]  focus-visible:outline-[#F2F2F2]' : 'hover:bg-gray-50'} 
                        `}>
                        {pageNumber}
                    </Box>

                ))}
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span>
                {secondRange.map((pageNumber: number) => (
                    <Box
                        onClick={() => handlePage(pageNumber)}
                        cursor={'pointer'}
                        key={pageNumber}
                        className={` z-10   hover:bg-gray-50 relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300  focus:z-20 focus:outline-offset-0 md:inline-flex `}>
                        {pageNumber}
                    </Box>

                ))}
                <Box
                    cursor={'pointer'}
                    onClick={() => handlePage(page + 1)}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                </Box>
            </nav>
        </div>
    )
}

export default Pagination