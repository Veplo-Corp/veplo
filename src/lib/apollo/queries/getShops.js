import { gql } from '@apollo/client'
import { graphql } from '../generated/gql'

const GET_SHOPS_BY_LOCATION = graphql(`
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
      stats{
        followers
        averagePrice
        productsQuantity
      }
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
`)

export default GET_SHOPS_BY_LOCATION;