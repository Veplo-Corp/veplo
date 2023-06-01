import { gql } from '@apollo/client'

const GET_SHOPS_BY_LOCATION = gql`
    query shops($limit: Int!, $offset: Int!, $filters: ShopFilters!) {
    shops(limit: $limit, offset: $offset, filters: $filters) {
      categories
      id
      businessId
      businessStatus
      name
      createdAt
      status
      profileCover
      profilePhoto
      isDigitalOnly
      info {
        phone
        description
        opening {
          days
          hours
        }
      }
      address {
        postcode
        city
        street
        location {
          type
          coordinates
        }
      }
      minimumAmountForFreeShipping
    }
  }
`

export default GET_SHOPS_BY_LOCATION;