import { useRouter } from 'next/router'
import React, { FC } from 'react'

const index: FC<{}> = () => {
    const router = useRouter()
    console.log(router);

    return (
        <div>index</div>
    )
}

export default index