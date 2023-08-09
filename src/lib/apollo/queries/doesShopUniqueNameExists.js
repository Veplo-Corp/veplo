import { graphql } from '../generated/gql'

const DOES_SHOP_UNIQUE_NAME_EXISTS = graphql(`
query doesShopUniqueNameExists($name: String!) {
  doesShopUniqueNameExists(name: $name)
}
`
)

export default DOES_SHOP_UNIQUE_NAME_EXISTS;