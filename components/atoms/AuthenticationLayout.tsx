import { Box, Text, useBreakpointValue } from '@chakra-ui/react'
import React, { FC, ReactNode } from 'react'

const AuthenticationLayout: FC<{ children: ReactNode }> = ({ children }) => {
    const isSmallView = useBreakpointValue({ base: true, lg: false });

    return (
        <Box
            className='min-w-screen w-full h-[100vh] relative z-0'
        >


            {!isSmallView ?
                (<>
                    <svg
                        className='absolute md:-top-20'
                        width="408" height="430" viewBox="0 0 408 430" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M-39 386C417.957 128.768 387.349 23.4866 314.925 3" stroke="#FF5A78" strokeWidth="100" />
                        <path d="M140.5 139C263.383 139 363 90.8706 363 31.5C363 -27.8706 263.383 -76 140.5 -76C17.6166 -76 -82 -27.8706 -82 31.5C-82 90.8706 17.6166 139 140.5 139Z" fill="#FF5A78" />
                        <path d="M-44.5 320C78.3834 320 178 271.871 178 212.5C178 153.129 78.3834 105 -44.5 105C-167.383 105 -267 153.129 -267 212.5C-267 271.871 -167.383 320 -44.5 320Z" fill="#FF5A78" />
                        <path d="M78.5 247C201.383 247 301 198.871 301 139.5C301 80.1294 201.383 32 78.5 32C-44.3834 32 -144 80.1294 -144 139.5C-144 198.871 -44.3834 247 78.5 247Z" fill="#FF5A78" />
                    </svg>
                    <svg
                        className='absolute bottom-0 md:hidden lg:flex'
                        width="461" height="249" viewBox="0 0 461 249" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M-15 52.6599C14.322 46.8209 44.575 51.831 73.849 55.904C117.712 62.006 177.878 72.378 221.111 82.854C242.112 87.943 271.735 95.421 292.056 108.557C310.15 120.252 319.547 148.075 327.417 168.197C345.199 213.662 366.899 255.777 410 275" stroke="#FF5A78" strokeWidth="100" strokeLinecap="round" />
                        <path d="M130.5 321C261.115 321 367 264.364 367 194.5C367 124.636 261.115 68 130.5 68C-0.115005 68 -106 124.636 -106 194.5C-106 264.364 -0.115005 321 130.5 321Z" fill="#FF5A78" />
                    </svg>
                    <svg
                        className='absolute right-0 top-[10%]'
                        width="310" height="653" viewBox="0 0 310 653" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="Group 48095612">
                            <ellipse id="Ellipse 281" cx="108.5" cy="554.5" rx="88.5" ry="62.5" transform="rotate(30 108.5 554.5)" fill="#FF5A78" />
                            <g id="Group 48095610">
                                <ellipse id="Ellipse 282" cx="119" cy="230" rx="68" ry="58" fill="#FF5A78" />
                                <ellipse id="Ellipse 286" cx="237" cy="123" rx="68" ry="58" fill="#FF5A78" />
                                <ellipse id="Ellipse 283" cx="155" cy="275" rx="68" ry="58" fill="#FF5A78" />
                                <ellipse id="Ellipse 284" cx="207" cy="333" rx="68" ry="58" fill="#FF5A78" />
                                <ellipse id="Ellipse 285" cx="270" cy="362" rx="68" ry="58" fill="#FF5A78" />
                                <ellipse id="Ellipse 286_2" cx="182" cy="78" rx="88" ry="58" fill="#FF5A78" />
                                <ellipse id="Ellipse 287" cx="213.5" cy="153" rx="119.5" ry="58" fill="#FF5A78" />
                                <ellipse id="Ellipse 289" cx="213.5" cy="153" rx="119.5" ry="58" fill="#FF5A78" />
                                <ellipse id="Ellipse 288" cx="281.5" cy="293.5" rx="119.5" ry="153.5" fill="#FF5A78" />
                                <path id="Vector 759" d="M317.523 459.83C244.608 425.316 173.381 384.605 113.84 329.405C89.2385 306.598 61.5303 275.483 56.2794 241.238C53.6734 224.243 52.9348 206.36 65.3627 193.156C76.5792 181.238 92.2229 172.059 98.8326 156.526C106.29 139.002 109.687 117.975 107.027 99.0647C104.278 79.5128 95.0552 62.3458 95.377 42.3929C95.515 33.8412 107.013 29.8124 113.642 27.0895C136.9 17.5374 163.586 15.7354 188.481 15.7354C217.376 15.7354 255.892 34.9684 272.205 60.0658C278.808 70.224 283.851 81.0274 289.483 91.1662C293.135 97.7401 303.518 107.622 309.526 112.295C315.755 117.14 317.779 120.391 326.409 120.391" stroke="#FF5A78" strokeWidth="30" strokeLinecap="round" />
                            </g>
                        </g>
                    </svg>
                </>) :
                (
                    <>
                        <svg
                            className='absolute top-0 max-h-[15vh] min-380:max-h-[20vh]   -left-20 min-380:-left-7'
                            width="315" height="187" viewBox="0 0 315 187" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M-9.49027 107.995C282.127 70.7473 284.542 12.9397 249.297 -11.3081" stroke="#FF5A78" strokeWidth="100" />
                            <path d="M131.209 21.5216C197.237 45.5538 259.386 41.3455 270.022 12.1221C280.659 -17.1013 235.755 -60.2735 169.727 -84.3057C103.7 -108.338 41.5508 -104.13 30.9143 -74.9062C20.2779 -45.6828 65.1815 -2.51059 131.209 21.5216Z" fill="#FF5A78" />
                            <path d="M-0.621629 74.4332C65.4063 98.4654 127.555 94.2571 138.191 65.0337C148.828 35.8103 103.924 -7.3619 37.8964 -31.3941C-28.1315 -55.4263 -90.2803 -51.218 -100.917 -21.9946C-111.553 7.22884 -66.6495 50.401 -0.621629 74.4332Z" fill="#FF5A78" />
                            <path d="M78.5468 62.556C144.575 86.5882 206.723 82.3799 217.36 53.1565C227.996 23.9331 183.093 -19.2391 117.065 -43.2713C51.0369 -67.3035 -11.1118 -63.0952 -21.7482 -33.8718C-32.3847 -4.64836 12.5189 38.5238 78.5468 62.556Z" fill="#FF5A78" />
                        </svg>
                        <svg
                            className='absolute bottom-0  max-h-[16vh] -left-24 min-380:max-h-[20vh] min-380:-left-0  '
                            width="350" height="236" viewBox="0 0 390 236" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <ellipse cx="314.644" cy="71.7073" rx="64.5082" ry="45.5567" transform="rotate(30 314.644 71.7073)" fill="#FF5A78" />
                            <ellipse cx="27.383" cy="121.726" rx="63.7257" ry="54.3543" transform="rotate(90 27.383 121.726)" fill="#FF5A78" />
                            <ellipse cx="127.657" cy="232.308" rx="63.7257" ry="54.3543" transform="rotate(90 127.657 232.308)" fill="#FF5A78" />
                            <ellipse cx="-14.7884" cy="155.463" rx="63.7257" ry="54.3543" transform="rotate(90 -14.7884 155.463)" fill="#FF5A78" />
                            <ellipse cx="169.829" cy="180.766" rx="82.4686" ry="54.3543" transform="rotate(90 169.829 180.766)" fill="#FF5A78" />
                            <ellipse cx="99.5432" cy="210.286" rx="111.989" ry="54.3543" transform="rotate(90 99.5432 210.286)" fill="#FF5A78" />
                            <ellipse cx="99.5432" cy="210.286" rx="111.989" ry="54.3543" transform="rotate(90 99.5432 210.286)" fill="#FF5A78" />
                            <ellipse cx="-32.1254" cy="274.012" rx="111.989" ry="143.851" transform="rotate(90 -32.1254 274.012)" fill="#FF5A78" />
                            <path d="M-188 307.77C-155.656 239.438 -117.504 172.689 -65.7739 116.89C-44.4001 93.8349 -15.2414 67.8684 16.8514 62.9475C32.7783 60.5054 49.5367 59.8132 61.9113 71.4599C73.0797 81.9713 81.6818 96.6318 96.2383 102.826C112.661 109.814 132.366 112.998 150.088 110.506C168.411 107.929 184.499 99.286 203.198 99.5876C211.212 99.7169 214.987 110.492 217.539 116.705C226.491 138.5 228.18 163.509 228.18 186.839C228.18 213.918 210.156 250.013 186.636 265.301C177.116 271.489 166.992 276.214 157.49 281.493C151.33 284.915 142.069 294.645 137.69 300.275C133.149 306.113 130.103 308.01 130.103 316.097" stroke="#FF5A78" strokeWidth="30" strokeLinecap="round" />
                        </svg>
                    </>
                )
            }

            {children}
        </Box>
    )
}

export default AuthenticationLayout