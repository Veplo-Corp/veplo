import React, { FC } from 'react'

const Error_page: FC<{ errorMessage: string }> = ({errorMessage}) => {
    if (errorMessage === 'cap-does-not-exist') {
        return (
            <div>
                Cap inesistene
            </div>
        )
    }
    return (
        <div>Error_page</div>
      )

}

export default Error_page