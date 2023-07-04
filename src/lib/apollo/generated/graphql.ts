/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Time: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type AddressShop = {
  __typename?: 'AddressShop';
  city?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Location>;
  postcode?: Maybe<Scalars['String']['output']>;
  street?: Maybe<Scalars['String']['output']>;
};

export type AddressShopInput = {
  city: Scalars['String']['input'];
  location: LocationInput;
  postcode: Scalars['String']['input'];
  street: Scalars['String']['input'];
};

export type AdminSeeAllOrdersFilters = {
  business?: InputMaybe<AdminSeeAllOrdersFiltersBusiness>;
  code?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  shop?: InputMaybe<AdminSeeAllOrdersFiltersShop>;
  status?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<AdminSeeAllOrdersFiltersUser>;
};

export type AdminSeeAllOrdersFiltersBusiness = {
  firebaseId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type AdminSeeAllOrdersFiltersShop = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type AdminSeeAllOrdersFiltersUser = {
  email?: InputMaybe<Scalars['String']['input']>;
  firebaseId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type Business = {
  __typename?: 'Business';
  businessName?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Time']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firebaseId?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  shops?: Maybe<Array<Shop>>;
  status?: Maybe<Scalars['String']['output']>;
  stripe?: Maybe<Stripe>;
  vatNumber?: Maybe<Scalars['String']['output']>;
};

export type Cart = {
  __typename?: 'Cart';
  createdAt?: Maybe<Scalars['Time']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  productVariations?: Maybe<Array<CartProductVariation>>;
  shopInfo?: Maybe<CartShopInfo>;
  status?: Maybe<Scalars['String']['output']>;
  total?: Maybe<Scalars['Int']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
};

export type CartProductVariation = {
  __typename?: 'CartProductVariation';
  brand?: Maybe<Scalars['String']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  photo?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Price>;
  productId?: Maybe<Scalars['ID']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  size?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  variationId?: Maybe<Scalars['ID']['output']>;
};

export type CartShopInfo = {
  __typename?: 'CartShopInfo';
  city?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type CartWarning = {
  __typename?: 'CartWarning';
  color?: Maybe<Scalars['String']['output']>;
  isProductNonExisting?: Maybe<Scalars['Boolean']['output']>;
  isQuantityTooMuch?: Maybe<Scalars['Boolean']['output']>;
  isSizeNonExisting?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  size?: Maybe<Scalars['String']['output']>;
  variationId?: Maybe<Scalars['ID']['output']>;
};

export type EditAddressShopInput = {
  city: Scalars['String']['input'];
  location: LocationInput;
  street: Scalars['String']['input'];
};

export type EditLotsInput = {
  quantity: Scalars['Int']['input'];
  size: Scalars['String']['input'];
};

export type EditOrderInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  courier?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type EditPriceInput = {
  v1: Scalars['Int']['input'];
  v2?: InputMaybe<Scalars['Int']['input']>;
};

export type EditProductInfo = {
  brand?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  fit?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  length?: InputMaybe<Scalars['String']['input']>;
  macroCategory?: InputMaybe<Scalars['String']['input']>;
  materials?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  microCategory?: InputMaybe<Scalars['String']['input']>;
  traits?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type EditProductInput = {
  canBuy?: InputMaybe<Scalars['Boolean']['input']>;
  info?: InputMaybe<EditProductInfo>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<PriceInput>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type EditShopInput = {
  address?: InputMaybe<EditAddressShopInput>;
  categories?: InputMaybe<Array<Scalars['String']['input']>>;
  info?: InputMaybe<EditShopInputInfo>;
  isDigitalOnly?: InputMaybe<Scalars['Boolean']['input']>;
  minimumAmountForFreeShipping?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  profileCover?: InputMaybe<Scalars['String']['input']>;
  profilePhoto?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type EditShopInputInfo = {
  description?: InputMaybe<Scalars['String']['input']>;
  opening?: InputMaybe<OpeningInput>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type EditUserInput = {
  gender?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<LocationInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  surname?: InputMaybe<Scalars['String']['input']>;
};

export type EditVariationInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  lots: Array<EditLotsInput>;
  photos: Array<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type HistoryOrder = {
  __typename?: 'HistoryOrder';
  date?: Maybe<Scalars['Time']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type InformationInput = {
  businessName: Scalars['String']['input'];
  email: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  userName: Scalars['String']['input'];
};

export type Location = {
  __typename?: 'Location';
  coordinates?: Maybe<Array<Scalars['Float']['output']>>;
  type?: Maybe<Scalars['String']['output']>;
};

export type LocationInput = {
  coordinates: Array<Scalars['Float']['input']>;
  type: Scalars['String']['input'];
};

export type Lot = {
  __typename?: 'Lot';
  quantity?: Maybe<Scalars['Int']['output']>;
  size?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** add products to the cart */
  addToCart?: Maybe<Scalars['Boolean']['output']>;
  adminCreateAdmin?: Maybe<Scalars['Boolean']['output']>;
  adminCreateProduct?: Maybe<Scalars['ID']['output']>;
  adminDeleteProduct: Scalars['ID']['output'];
  adminEditProduct: Scalars['ID']['output'];
  /** tells that a package was lost */
  adminLostPackage?: Maybe<Scalars['Boolean']['output']>;
  /** tells that an order has arrived */
  adminOrderHasArrived?: Maybe<Scalars['Boolean']['output']>;
  /** shop refunds an order because the products are not available */
  cancelOrder?: Maybe<Scalars['Boolean']['output']>;
  /** change the status of a product */
  changeProductStatus?: Maybe<Scalars['Boolean']['output']>;
  /** change the status of a shop */
  changeShopStatus?: Maybe<Scalars['Boolean']['output']>;
  /** get a checkout url of a cart by providing the shopId, the userId is inside the jwt */
  checkout?: Maybe<Scalars['String']['output']>;
  /** the first step of creating a business */
  createBusinessStep1?: Maybe<Scalars['ID']['output']>;
  /** create information */
  createInformation?: Maybe<Scalars['Boolean']['output']>;
  /** create a single product */
  createProduct?: Maybe<Scalars['ID']['output']>;
  /** create a shop */
  createShop?: Maybe<Scalars['ID']['output']>;
  /** create an account on stripe */
  createStripeAccount?: Maybe<Scalars['String']['output']>;
  /** create a user in mongodb */
  createUser?: Maybe<Scalars['ID']['output']>;
  /** create a variation */
  createVariation?: Maybe<Scalars['Boolean']['output']>;
  /** delete a cart */
  deleteCart?: Maybe<Scalars['Boolean']['output']>;
  /** delete a product */
  deleteProduct: Scalars['ID']['output'];
  /** delete a variation */
  deleteVariation?: Maybe<Scalars['Boolean']['output']>;
  /** shop deny the refund requested by the user */
  denyReturn?: Maybe<Scalars['Boolean']['output']>;
  /** edit a cart (you can add or remove) */
  editCart?: Maybe<Scalars['Boolean']['output']>;
  /** edit an order */
  editOrder?: Maybe<Scalars['Boolean']['output']>;
  /** edit a product */
  editProduct?: Maybe<Scalars['Boolean']['output']>;
  /** change the status of a shop */
  editShop?: Maybe<Scalars['Boolean']['output']>;
  /** edit a user */
  editUser?: Maybe<Scalars['Boolean']['output']>;
  /** edit a single variation */
  editVariation?: Maybe<Scalars['Boolean']['output']>;
  /** refund an order */
  refund?: Maybe<Scalars['Boolean']['output']>;
  /** remove product form cart */
  removeFromCart?: Maybe<Scalars['Boolean']['output']>;
  /** user returns an order */
  returnOrder?: Maybe<Scalars['Boolean']['output']>;
  /** shop tells that a return order has arrived */
  returnedOrderHasArrived?: Maybe<Scalars['Boolean']['output']>;
  /** change the isBusiness account field */
  setIsBusiness: Scalars['Boolean']['output'];
};


export type MutationAddToCartArgs = {
  productVariationId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  size: Scalars['String']['input'];
};


export type MutationAdminCreateProductArgs = {
  options: ProductInput;
  shopId: Scalars['ID']['input'];
};


export type MutationAdminDeleteProductArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAdminEditProductArgs = {
  id: Scalars['ID']['input'];
  options: EditProductInput;
};


export type MutationAdminLostPackageArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationAdminOrderHasArrivedArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelOrderArgs = {
  orderId: Scalars['ID']['input'];
  productsNotAvailable?: InputMaybe<Array<ProductsNotAvailableInput>>;
};


export type MutationChangeProductStatusArgs = {
  id: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type MutationChangeShopStatusArgs = {
  id: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type MutationCheckoutArgs = {
  shopId: Scalars['ID']['input'];
};


export type MutationCreateInformationArgs = {
  options: InformationInput;
};


export type MutationCreateProductArgs = {
  options: ProductInput;
  shopId: Scalars['ID']['input'];
};


export type MutationCreateShopArgs = {
  options: ShopInput;
};


export type MutationCreateStripeAccountArgs = {
  businessName: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  vatNumber: Scalars['String']['input'];
};


export type MutationCreateUserArgs = {
  options: UserInput;
};


export type MutationCreateVariationArgs = {
  options: ProductVariationInput;
  productId: Scalars['ID']['input'];
};


export type MutationDeleteCartArgs = {
  shopId: Scalars['ID']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVariationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDenyReturnArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationEditCartArgs = {
  productVariationId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  size: Scalars['String']['input'];
};


export type MutationEditOrderArgs = {
  id: Scalars['ID']['input'];
  options: EditOrderInput;
};


export type MutationEditProductArgs = {
  id: Scalars['ID']['input'];
  options: EditProductInput;
};


export type MutationEditShopArgs = {
  id: Scalars['ID']['input'];
  options: EditShopInput;
};


export type MutationEditUserArgs = {
  options: EditUserInput;
};


export type MutationEditVariationArgs = {
  id: Scalars['ID']['input'];
  options: EditVariationInput;
};


export type MutationRefundArgs = {
  checkoutSessionId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRemoveFromCartArgs = {
  productVariationId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  size: Scalars['String']['input'];
};


export type MutationReturnOrderArgs = {
  id: Scalars['ID']['input'];
  why?: InputMaybe<Scalars['String']['input']>;
};


export type MutationReturnedOrderHasArrivedArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSetIsBusinessArgs = {
  isBusiness: Scalars['Boolean']['input'];
};

export type Opening = {
  __typename?: 'Opening';
  days?: Maybe<Array<Scalars['Int']['output']>>;
  hours?: Maybe<Array<Scalars['String']['output']>>;
};

export type OpeningInput = {
  days: Array<Scalars['Int']['input']>;
  hours: Array<Scalars['String']['input']>;
};

export type Order = {
  __typename?: 'Order';
  cartId?: Maybe<Scalars['ID']['output']>;
  chargeId?: Maybe<Scalars['String']['output']>;
  checkoutSessionId?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Time']['output']>;
  history?: Maybe<Array<HistoryOrder>>;
  id?: Maybe<Scalars['ID']['output']>;
  paymentIntentId?: Maybe<Scalars['String']['output']>;
  productVariations?: Maybe<Array<ProductVariationsOrder>>;
  recipient?: Maybe<RecipientOrder>;
  shipping?: Maybe<ShippingOrder>;
  shop?: Maybe<ShopOrder>;
  status?: Maybe<Scalars['String']['output']>;
  totalDetails?: Maybe<TotalDetailsOrder>;
  user?: Maybe<UserOrder>;
};

export type Price = {
  __typename?: 'Price';
  discountPercentage?: Maybe<Scalars['Float']['output']>;
  v1?: Maybe<Scalars['Int']['output']>;
  v2?: Maybe<Scalars['Int']['output']>;
};

export type PriceInput = {
  discountPercentage?: InputMaybe<Scalars['Float']['input']>;
  v1: Scalars['Int']['input'];
  v2?: InputMaybe<Scalars['Int']['input']>;
};

export type Product = {
  __typename?: 'Product';
  canBuy?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['Time']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  info?: Maybe<ProductInfo>;
  location?: Maybe<Location>;
  name?: Maybe<Scalars['String']['output']>;
  orderCounter?: Maybe<Scalars['Int']['output']>;
  price?: Maybe<Price>;
  productsLikeThis?: Maybe<Array<Product>>;
  score?: Maybe<Scalars['Float']['output']>;
  shopInfo?: Maybe<ShopInfo>;
  status?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Time']['output']>;
  variations?: Maybe<Array<ProductVariation>>;
};


export type ProductProductsLikeThisArgs = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  shopId?: InputMaybe<Scalars['ID']['input']>;
};

export type ProductFilters = {
  brand?: InputMaybe<Scalars['String']['input']>;
  collar?: InputMaybe<Scalars['String']['input']>;
  colors?: InputMaybe<Array<Scalars['String']['input']>>;
  fit?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  length?: InputMaybe<Scalars['String']['input']>;
  macroCategory?: InputMaybe<Scalars['String']['input']>;
  maxPrice?: InputMaybe<Scalars['Int']['input']>;
  microCategory?: InputMaybe<Scalars['String']['input']>;
  minPrice?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  sizes?: InputMaybe<Array<Scalars['String']['input']>>;
  traits?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ProductFiltersResponse = {
  __typename?: 'ProductFiltersResponse';
  brand?: Maybe<Scalars['String']['output']>;
  collar?: Maybe<Scalars['String']['output']>;
  colors?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  fit?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  length?: Maybe<Scalars['String']['output']>;
  macroCategory?: Maybe<Scalars['String']['output']>;
  maxPrice?: Maybe<Scalars['Int']['output']>;
  microCategory?: Maybe<Scalars['String']['output']>;
  minPrice?: Maybe<Scalars['Int']['output']>;
  query?: Maybe<Scalars['String']['output']>;
  sizes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  traits?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type ProductInfo = {
  __typename?: 'ProductInfo';
  brand?: Maybe<Scalars['String']['output']>;
  collar?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  fit?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  keywords?: Maybe<Array<Scalars['String']['output']>>;
  length?: Maybe<Scalars['String']['output']>;
  macroCategory?: Maybe<Scalars['String']['output']>;
  making?: Maybe<Scalars['String']['output']>;
  materials?: Maybe<Array<Scalars['String']['output']>>;
  microCategory?: Maybe<Scalars['String']['output']>;
  traits?: Maybe<Array<Scalars['String']['output']>>;
};

export type ProductInfoInput = {
  brand: Scalars['String']['input'];
  collar?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  fit?: InputMaybe<Scalars['String']['input']>;
  gender: Scalars['String']['input'];
  keywords?: InputMaybe<Array<Scalars['String']['input']>>;
  length?: InputMaybe<Scalars['String']['input']>;
  macroCategory: Scalars['String']['input'];
  making?: InputMaybe<Scalars['String']['input']>;
  materials?: InputMaybe<Array<Scalars['String']['input']>>;
  microCategory: Scalars['String']['input'];
  traits: Array<InputMaybe<Scalars['String']['input']>>;
};

export type ProductInput = {
  canBuy: Scalars['Boolean']['input'];
  info: ProductInfoInput;
  name: Scalars['String']['input'];
  price: PriceInput;
  status: Scalars['String']['input'];
  variations: Array<ProductVariationInput>;
};

export type ProductLotInput = {
  quantity: Scalars['Int']['input'];
  size: Scalars['String']['input'];
};

export type ProductSort = {
  ascending: Scalars['Boolean']['input'];
  for: Scalars['String']['input'];
};

export type ProductVariation = {
  __typename?: 'ProductVariation';
  color?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  lots?: Maybe<Array<Lot>>;
  photos?: Maybe<Array<Scalars['String']['output']>>;
  status?: Maybe<Scalars['String']['output']>;
};

export type ProductVariationInput = {
  color: Scalars['String']['input'];
  lots: Array<ProductLotInput>;
  photos: Array<Scalars['String']['input']>;
  status: Scalars['String']['input'];
};

export type ProductVariationsOrder = {
  __typename?: 'ProductVariationsOrder';
  brand?: Maybe<Scalars['String']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  photo?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Price>;
  productId?: Maybe<Scalars['ID']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  size?: Maybe<Scalars['String']['output']>;
  variationId?: Maybe<Scalars['ID']['output']>;
};

export type ProductsQueryResponse = {
  __typename?: 'ProductsQueryResponse';
  filters: ProductFiltersResponse;
  products: Array<Product>;
};

export type Query = {
  __typename?: 'Query';
  /** admin - get a list of all the orders */
  adminSeeAllOrders?: Maybe<Array<Order>>;
  /** get list of available brands */
  brands?: Maybe<Array<Scalars['String']['output']>>;
  /** get a single business */
  business?: Maybe<Business>;
  /** get a single cart */
  cart: Cart;
  /** check if the account is a business */
  isBusiness: Scalars['Boolean']['output'];
  /** get a single order */
  order?: Maybe<Order>;
  /** get a single product */
  product?: Maybe<Product>;
  /** get a list of products, you can use the filters and sort */
  products: ProductsQueryResponse;
  /** get a list of products with an autocomplete engine under the hood */
  productsAutoComplete: Array<Product>;
  prova: Scalars['String']['output'];
  /** get a single shop */
  shop?: Maybe<Shop>;
  /** get a single shop searching by firebaseId */
  shopByFirebaseId?: Maybe<Shop>;
  /** get a list of shops, you can use the filters */
  shops: Array<Shop>;
  shopsAutoComplete: Array<Shop>;
  /** get a single user - id provided by the jwt */
  user?: Maybe<User>;
};


export type QueryAdminSeeAllOrdersArgs = {
  filters?: InputMaybe<AdminSeeAllOrdersFilters>;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};


export type QueryBusinessArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCartArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOrderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductsArgs = {
  filters: ProductFilters;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  sort?: InputMaybe<ProductSort>;
};


export type QueryProductsAutoCompleteArgs = {
  query: Scalars['String']['input'];
};


export type QueryShopArgs = {
  id: Scalars['ID']['input'];
};


export type QueryShopByFirebaseIdArgs = {
  firebaseId: Scalars['String']['input'];
};


export type QueryShopsArgs = {
  filters: ShopFilters;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};


export type QueryShopsAutoCompleteArgs = {
  query: Scalars['String']['input'];
};

export type RecipientOrder = {
  __typename?: 'RecipientOrder';
  address?: Maybe<UserOrderAddress>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
};

export type ShippingOrder = {
  __typename?: 'ShippingOrder';
  code?: Maybe<Scalars['String']['output']>;
  courier?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type Shop = {
  __typename?: 'Shop';
  address?: Maybe<AddressShop>;
  businessId?: Maybe<Scalars['ID']['output']>;
  businessStatus?: Maybe<Scalars['String']['output']>;
  categories?: Maybe<Array<Scalars['String']['output']>>;
  createdAt?: Maybe<Scalars['Time']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  info?: Maybe<ShopInformations>;
  isDigitalOnly?: Maybe<Scalars['Boolean']['output']>;
  minimumAmountForFreeShipping?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  orders?: Maybe<Array<Order>>;
  products: ProductsQueryResponse;
  profileCover?: Maybe<Scalars['String']['output']>;
  profilePhoto?: Maybe<Scalars['String']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
  shopsLikeThis?: Maybe<Array<Shop>>;
  status?: Maybe<Scalars['String']['output']>;
};


export type ShopOrdersArgs = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  statuses?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type ShopProductsArgs = {
  filters: ProductFilters;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  sort?: InputMaybe<ProductSort>;
  statuses?: InputMaybe<Array<ShopProductsStatusesEnum>>;
};


export type ShopShopsLikeThisArgs = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

export type ShopFilters = {
  categories?: InputMaybe<Array<Scalars['String']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ShopInfo = {
  __typename?: 'ShopInfo';
  businessId?: Maybe<Scalars['ID']['output']>;
  businessStatus?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  profilePhoto?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type ShopInformations = {
  __typename?: 'ShopInformations';
  description?: Maybe<Scalars['String']['output']>;
  opening?: Maybe<Opening>;
  phone?: Maybe<Scalars['String']['output']>;
};

export type ShopInput = {
  address: AddressShopInput;
  categories: Array<InputMaybe<Scalars['String']['input']>>;
  info: ShopInputInfo;
  isDigitalOnly: Scalars['Boolean']['input'];
  minimumAmountForFreeShipping?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  profileCover?: InputMaybe<Scalars['String']['input']>;
  profilePhoto?: InputMaybe<Scalars['String']['input']>;
};

export type ShopInputInfo = {
  description?: InputMaybe<Scalars['String']['input']>;
  opening: OpeningInput;
  phone: Scalars['String']['input'];
};

export type ShopOrder = {
  __typename?: 'ShopOrder';
  businessId?: Maybe<Scalars['ID']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  stripeId?: Maybe<Scalars['String']['output']>;
};

export enum ShopProductsStatusesEnum {
  Active = 'active',
  NotActive = 'not_active'
}

export type Stripe = {
  __typename?: 'Stripe';
  id?: Maybe<Scalars['String']['output']>;
};

export type TotalDetailsOrder = {
  __typename?: 'TotalDetailsOrder';
  amountDiscount?: Maybe<Scalars['Int']['output']>;
  amountShipping?: Maybe<Scalars['Int']['output']>;
  amountTax?: Maybe<Scalars['Int']['output']>;
  subTotal?: Maybe<Scalars['Int']['output']>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type User = {
  __typename?: 'User';
  age?: Maybe<Scalars['String']['output']>;
  carts?: Maybe<UserCarts>;
  createdAt?: Maybe<Scalars['Time']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firebaseId?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  location?: Maybe<Location>;
  name?: Maybe<Scalars['String']['output']>;
  orders?: Maybe<Array<Order>>;
  phone?: Maybe<Scalars['String']['output']>;
  stripeId?: Maybe<Scalars['String']['output']>;
  surname?: Maybe<Scalars['String']['output']>;
};


export type UserOrdersArgs = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  statuses?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UserCarts = {
  __typename?: 'UserCarts';
  carts?: Maybe<Array<Cart>>;
  warnings: Array<CartWarning>;
};

export type UserInput = {
  dateOfBirth?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<LocationInput>;
  name: Scalars['String']['input'];
  surname: Scalars['String']['input'];
};

export type UserOrder = {
  __typename?: 'UserOrder';
  email?: Maybe<Scalars['String']['output']>;
  firebaseId?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  stripeId?: Maybe<Scalars['String']['output']>;
  surname?: Maybe<Scalars['String']['output']>;
};

export type UserOrderAddress = {
  __typename?: 'UserOrderAddress';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  line1?: Maybe<Scalars['String']['output']>;
  line2?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
};

export type VariationProductInfo = {
  __typename?: 'VariationProductInfo';
  canBuy?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  info?: Maybe<VariationProductInfoInfo>;
  status?: Maybe<Scalars['String']['output']>;
};

export type VariationProductInfoInfo = {
  __typename?: 'VariationProductInfoInfo';
  brand?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  macroCategory?: Maybe<Scalars['String']['output']>;
  microCategory?: Maybe<Scalars['String']['output']>;
};

export enum ImageProportionsEnum {
  Product = 'product',
  ShopCover = 'shopCover',
  ShopPhoto = 'shopPhoto'
}

export type ProductsNotAvailableInput = {
  productId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  size: Scalars['String']['input'];
  variationId: Scalars['ID']['input'];
};

export type EditOrderMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  options: EditOrderInput;
}>;


export type EditOrderMutation = { __typename?: 'Mutation', editOrder?: boolean | null };

export type CheckoutMutationVariables = Exact<{
  shopId: Scalars['ID']['input'];
}>;


export type CheckoutMutation = { __typename?: 'Mutation', checkout?: string | null };

export type CreateBusinessStep1MutationVariables = Exact<{ [key: string]: never; }>;


export type CreateBusinessStep1Mutation = { __typename?: 'Mutation', createBusinessStep1?: string | null };

export type CreateInformationMutationVariables = Exact<{
  options: InformationInput;
}>;


export type CreateInformationMutation = { __typename?: 'Mutation', createInformation?: boolean | null };

export type CreateProductMutationVariables = Exact<{
  shopId: Scalars['ID']['input'];
  options: ProductInput;
}>;


export type CreateProductMutation = { __typename?: 'Mutation', createProduct?: string | null };

export type CreateShopMutationVariables = Exact<{
  options: ShopInput;
}>;


export type CreateShopMutation = { __typename?: 'Mutation', createShop?: string | null };

export type CreateStripeAccountMutationVariables = Exact<{
  businessName: Scalars['String']['input'];
  vatNumber: Scalars['String']['input'];
  phone: Scalars['String']['input'];
}>;


export type CreateStripeAccountMutation = { __typename?: 'Mutation', createStripeAccount?: string | null };

export type CreateUserMutationVariables = Exact<{
  options: UserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser?: string | null };

export type CreateVariationMutationVariables = Exact<{
  productId: Scalars['ID']['input'];
  options: ProductVariationInput;
}>;


export type CreateVariationMutation = { __typename?: 'Mutation', createVariation?: boolean | null };

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteProductMutation = { __typename?: 'Mutation', deleteProduct: string };

export type DeleteVariationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteVariationMutation = { __typename?: 'Mutation', deleteVariation?: boolean | null };

export type MutationMutationVariables = Exact<{
  orderId: Scalars['ID']['input'];
}>;


export type MutationMutation = { __typename?: 'Mutation', denyReturn?: boolean | null };

export type EditCartMutationVariables = Exact<{
  productVariationId: Scalars['ID']['input'];
  size: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
}>;


export type EditCartMutation = { __typename?: 'Mutation', editCart?: boolean | null };

export type EditProductMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  options: EditProductInput;
}>;


export type EditProductMutation = { __typename?: 'Mutation', editProduct?: boolean | null };

export type ChangeProductStatusMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  status: Scalars['String']['input'];
}>;


export type ChangeProductStatusMutation = { __typename?: 'Mutation', changeProductStatus?: boolean | null };

export type EditUserMutationVariables = Exact<{
  options: EditUserInput;
}>;


export type EditUserMutation = { __typename?: 'Mutation', editUser?: boolean | null };

export type EditVariationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  options: EditVariationInput;
}>;


export type EditVariationMutation = { __typename?: 'Mutation', editVariation?: boolean | null };

export type ReturnOrderMutationVariables = Exact<{
  returnOrderId: Scalars['ID']['input'];
}>;


export type ReturnOrderMutation = { __typename?: 'Mutation', returnOrder?: boolean | null };

export type ReturnedOrderHasArrivedMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ReturnedOrderHasArrivedMutation = { __typename?: 'Mutation', returnedOrderHasArrived?: boolean | null };

export type BusinessQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BusinessQuery = { __typename?: 'Query', business?: { __typename?: 'Business', firebaseId?: string | null, vatNumber?: string | null, email?: string | null, businessName?: string | null, phone?: string | null, status?: string | null, createdAt?: any | null, stripe?: { __typename?: 'Stripe', id?: string | null } | null, shops?: Array<{ __typename?: 'Shop', id?: string | null, businessId?: string | null, categories?: Array<string> | null, name?: string | null, createdAt?: any | null, status?: string | null, profilePhoto?: string | null, minimumAmountForFreeShipping?: number | null, profileCover?: string | null, isDigitalOnly?: boolean | null, info?: { __typename?: 'ShopInformations', phone?: string | null, description?: string | null, opening?: { __typename?: 'Opening', days?: Array<number> | null, hours?: Array<string> | null } | null } | null, address?: { __typename?: 'AddressShop', postcode?: string | null, city?: string | null, street?: string | null, location?: { __typename?: 'Location', type?: string | null, coordinates?: Array<number> | null } | null } | null }> | null } | null };

export type GetProductsFromSingleShopQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  filters: ProductFilters;
}>;


export type GetProductsFromSingleShopQuery = { __typename?: 'Query', shop?: { __typename?: 'Shop', id?: string | null, products: { __typename?: 'ProductsQueryResponse', products: Array<{ __typename?: 'Product', id?: string | null, name?: string | null, status?: string | null, canBuy?: boolean | null, info?: { __typename?: 'ProductInfo', gender?: string | null, macroCategory?: string | null, microCategory?: string | null, brand?: string | null, fit?: string | null } | null, variations?: Array<{ __typename?: 'ProductVariation', id?: string | null, color?: string | null, status?: string | null, photos?: Array<string> | null, lots?: Array<{ __typename?: 'Lot', size?: string | null, quantity?: number | null }> | null }> | null, price?: { __typename?: 'Price', v1?: number | null, discountPercentage?: number | null, v2?: number | null } | null, shopInfo?: { __typename?: 'ShopInfo', id?: string | null, businessId?: string | null, name?: string | null, city?: string | null, status?: string | null, profilePhoto?: string | null } | null }> } } | null };

export type OrderQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type OrderQuery = { __typename?: 'Query', order?: { __typename?: 'Order', id?: string | null, code?: string | null, cartId?: string | null, createdAt?: any | null, status?: string | null, totalDetails?: { __typename?: 'TotalDetailsOrder', amountDiscount?: number | null, amountShipping?: number | null, subTotal?: number | null, total?: number | null } | null, shop?: { __typename?: 'ShopOrder', businessId?: string | null, stripeId?: string | null, id?: string | null, name?: string | null } | null, shipping?: { __typename?: 'ShippingOrder', url?: string | null, courier?: string | null, code?: string | null } | null, productVariations?: Array<{ __typename?: 'ProductVariationsOrder', productId?: string | null, variationId?: string | null, photo?: string | null, name?: string | null, brand?: string | null, quantity?: number | null, color?: string | null, size?: string | null, price?: { __typename?: 'Price', v1?: number | null, v2?: number | null, discountPercentage?: number | null } | null }> | null, user?: { __typename?: 'UserOrder', stripeId?: string | null, id?: string | null, email?: string | null, name?: string | null, surname?: string | null } | null, recipient?: { __typename?: 'RecipientOrder', name?: string | null, phone?: string | null, address?: { __typename?: 'UserOrderAddress', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postalCode?: string | null, state?: string | null } | null } | null, history?: Array<{ __typename?: 'HistoryOrder', date?: any | null, status?: string | null }> | null } | null };

export type ProductsQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  filters: ProductFilters;
}>;


export type ProductsQuery = { __typename?: 'Query', products: { __typename?: 'ProductsQueryResponse', products: Array<{ __typename?: 'Product', id?: string | null, name?: string | null, status?: string | null, canBuy?: boolean | null, info?: { __typename?: 'ProductInfo', gender?: string | null, macroCategory?: string | null, microCategory?: string | null, brand?: string | null, fit?: string | null } | null, variations?: Array<{ __typename?: 'ProductVariation', id?: string | null, color?: string | null, status?: string | null, photos?: Array<string> | null, lots?: Array<{ __typename?: 'Lot', size?: string | null, quantity?: number | null }> | null }> | null, price?: { __typename?: 'Price', v1?: number | null, discountPercentage?: number | null, v2?: number | null } | null, shopInfo?: { __typename?: 'ShopInfo', id?: string | null, businessId?: string | null, name?: string | null, city?: string | null, status?: string | null, profilePhoto?: string | null } | null }> } };

export type GetSingleShopQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetSingleShopQuery = { __typename?: 'Query', shop?: { __typename?: 'Shop', id?: string | null, businessId?: string | null, name?: string | null, categories?: Array<string> | null, createdAt?: any | null, status?: string | null, profilePhoto?: string | null, profileCover?: string | null, isDigitalOnly?: boolean | null, minimumAmountForFreeShipping?: number | null, info?: { __typename?: 'ShopInformations', phone?: string | null, description?: string | null, opening?: { __typename?: 'Opening', days?: Array<number> | null, hours?: Array<string> | null } | null } | null, address?: { __typename?: 'AddressShop', postcode?: string | null, city?: string | null, street?: string | null, location?: { __typename?: 'Location', type?: string | null, coordinates?: Array<number> | null } | null } | null } | null };

export type ShopsQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  filters: ShopFilters;
}>;


export type ShopsQuery = { __typename?: 'Query', shops: Array<{ __typename?: 'Shop', categories?: Array<string> | null, id?: string | null, businessId?: string | null, businessStatus?: string | null, name?: string | null, createdAt?: any | null, status?: string | null, profileCover?: string | null, profilePhoto?: string | null, isDigitalOnly?: boolean | null, minimumAmountForFreeShipping?: number | null, info?: { __typename?: 'ShopInformations', phone?: string | null, description?: string | null, opening?: { __typename?: 'Opening', days?: Array<number> | null, hours?: Array<string> | null } | null } | null, address?: { __typename?: 'AddressShop', postcode?: string | null, city?: string | null, street?: string | null, location?: { __typename?: 'Location', type?: string | null, coordinates?: Array<number> | null } | null } | null }> };

export type GetSimilarProductsQueryVariables = Exact<{
  productId: Scalars['ID']['input'];
  offset: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
  shopId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetSimilarProductsQuery = { __typename?: 'Query', product?: { __typename?: 'Product', id?: string | null, productsLikeThis?: Array<{ __typename?: 'Product', id?: string | null, name?: string | null, status?: string | null, canBuy?: boolean | null, info?: { __typename?: 'ProductInfo', gender?: string | null, macroCategory?: string | null, microCategory?: string | null, brand?: string | null, fit?: string | null, traits?: Array<string> | null, length?: string | null, materials?: Array<string> | null, description?: string | null } | null, variations?: Array<{ __typename?: 'ProductVariation', id?: string | null, color?: string | null, status?: string | null, photos?: Array<string> | null, lots?: Array<{ __typename?: 'Lot', size?: string | null, quantity?: number | null }> | null }> | null, price?: { __typename?: 'Price', v1?: number | null, discountPercentage?: number | null, v2?: number | null } | null, shopInfo?: { __typename?: 'ShopInfo', id?: string | null, businessId?: string | null, name?: string | null, city?: string | null, status?: string | null } | null }> | null } | null };

export type GetProductQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProductQuery = { __typename?: 'Query', product?: { __typename?: 'Product', id?: string | null, name?: string | null, status?: string | null, canBuy?: boolean | null, info?: { __typename?: 'ProductInfo', gender?: string | null, macroCategory?: string | null, microCategory?: string | null, brand?: string | null, fit?: string | null, traits?: Array<string> | null, length?: string | null, materials?: Array<string> | null, description?: string | null } | null, variations?: Array<{ __typename?: 'ProductVariation', id?: string | null, color?: string | null, status?: string | null, photos?: Array<string> | null, lots?: Array<{ __typename?: 'Lot', size?: string | null, quantity?: number | null }> | null }> | null, price?: { __typename?: 'Price', v1?: number | null, discountPercentage?: number | null, v2?: number | null } | null, shopInfo?: { __typename?: 'ShopInfo', id?: string | null, businessId?: string | null, name?: string | null, city?: string | null, status?: string | null } | null } | null };

export type GetShopQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  filters: ProductFilters;
}>;


export type GetShopQuery = { __typename?: 'Query', shop?: { __typename?: 'Shop', id?: string | null, businessId?: string | null, name?: string | null, createdAt?: any | null, status?: string | null, profilePhoto?: string | null, profileCover?: string | null, isDigitalOnly?: boolean | null, minimumAmountForFreeShipping?: number | null, info?: { __typename?: 'ShopInformations', phone?: string | null, description?: string | null, opening?: { __typename?: 'Opening', days?: Array<number> | null, hours?: Array<string> | null } | null } | null, address?: { __typename?: 'AddressShop', postcode?: string | null, city?: string | null, street?: string | null, location?: { __typename?: 'Location', type?: string | null, coordinates?: Array<number> | null } | null } | null, products: { __typename?: 'ProductsQueryResponse', products: Array<{ __typename?: 'Product', id?: string | null, name?: string | null, status?: string | null, canBuy?: boolean | null, info?: { __typename?: 'ProductInfo', gender?: string | null, macroCategory?: string | null, microCategory?: string | null, brand?: string | null, fit?: string | null } | null, variations?: Array<{ __typename?: 'ProductVariation', id?: string | null, color?: string | null, status?: string | null, photos?: Array<string> | null, lots?: Array<{ __typename?: 'Lot', size?: string | null, quantity?: number | null }> | null }> | null, price?: { __typename?: 'Price', v1?: number | null, discountPercentage?: number | null, v2?: number | null } | null, shopInfo?: { __typename?: 'ShopInfo', id?: string | null, businessId?: string | null, name?: string | null, city?: string | null, status?: string | null, profilePhoto?: string | null } | null }> } } | null };

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id?: string | null, name?: string | null, surname?: string | null, stripeId?: string | null, firebaseId?: string | null, email?: string | null, phone?: string | null, gender?: string | null, createdAt?: any | null, carts?: { __typename?: 'UserCarts', carts?: Array<{ __typename?: 'Cart', id?: string | null, userId?: string | null, total?: number | null, shopInfo?: { __typename?: 'CartShopInfo', id?: string | null, name?: string | null, city?: string | null, status?: string | null } | null, productVariations?: Array<{ __typename?: 'CartProductVariation', productId?: string | null, id?: string | null, variationId?: string | null, photo?: string | null, name?: string | null, quantity?: number | null, color?: string | null, size?: string | null, brand?: string | null, price?: { __typename?: 'Price', v1?: number | null, v2?: number | null, discountPercentage?: number | null } | null }> | null }> | null, warnings: Array<{ __typename?: 'CartWarning', variationId?: string | null }> } | null, orders?: Array<{ __typename?: 'Order', id?: string | null, code?: string | null, cartId?: string | null, createdAt?: any | null, status?: string | null, totalDetails?: { __typename?: 'TotalDetailsOrder', amountDiscount?: number | null, amountShipping?: number | null, subTotal?: number | null, total?: number | null } | null, shop?: { __typename?: 'ShopOrder', businessId?: string | null, stripeId?: string | null, id?: string | null, name?: string | null } | null, shipping?: { __typename?: 'ShippingOrder', url?: string | null, courier?: string | null, code?: string | null } | null, productVariations?: Array<{ __typename?: 'ProductVariationsOrder', productId?: string | null, variationId?: string | null, photo?: string | null, name?: string | null, brand?: string | null, quantity?: number | null, color?: string | null, size?: string | null, price?: { __typename?: 'Price', v1?: number | null, v2?: number | null, discountPercentage?: number | null } | null }> | null, user?: { __typename?: 'UserOrder', stripeId?: string | null, id?: string | null, email?: string | null, name?: string | null, surname?: string | null } | null, recipient?: { __typename?: 'RecipientOrder', name?: string | null, phone?: string | null, address?: { __typename?: 'UserOrderAddress', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postalCode?: string | null, state?: string | null } | null } | null, history?: Array<{ __typename?: 'HistoryOrder', date?: any | null, status?: string | null }> | null }> | null } | null };

export type ShopQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  statuses?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type ShopQuery = { __typename?: 'Query', shop?: { __typename?: 'Shop', id?: string | null, status?: string | null, name?: string | null, address?: { __typename?: 'AddressShop', postcode?: string | null, city?: string | null, street?: string | null, location?: { __typename?: 'Location', type?: string | null, coordinates?: Array<number> | null } | null } | null, orders?: Array<{ __typename?: 'Order', id?: string | null, code?: string | null, cartId?: string | null, createdAt?: any | null, status?: string | null, totalDetails?: { __typename?: 'TotalDetailsOrder', amountDiscount?: number | null, amountShipping?: number | null, subTotal?: number | null, total?: number | null } | null, shop?: { __typename?: 'ShopOrder', businessId?: string | null, stripeId?: string | null, id?: string | null, name?: string | null } | null, shipping?: { __typename?: 'ShippingOrder', url?: string | null, courier?: string | null, code?: string | null } | null, productVariations?: Array<{ __typename?: 'ProductVariationsOrder', productId?: string | null, variationId?: string | null, photo?: string | null, name?: string | null, brand?: string | null, quantity?: number | null, color?: string | null, size?: string | null, price?: { __typename?: 'Price', v1?: number | null, v2?: number | null, discountPercentage?: number | null } | null }> | null, user?: { __typename?: 'UserOrder', stripeId?: string | null, id?: string | null, email?: string | null, name?: string | null, surname?: string | null } | null, recipient?: { __typename?: 'RecipientOrder', name?: string | null, phone?: string | null, address?: { __typename?: 'UserOrderAddress', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postalCode?: string | null, state?: string | null } | null } | null }> | null } | null };


export const EditOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EditOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}]}]}}]} as unknown as DocumentNode<EditOrderMutation, EditOrderMutationVariables>;
export const CheckoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"checkout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shopId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shopId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shopId"}}}]}]}}]} as unknown as DocumentNode<CheckoutMutation, CheckoutMutationVariables>;
export const CreateBusinessStep1Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createBusinessStep1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBusinessStep1"}}]}}]} as unknown as DocumentNode<CreateBusinessStep1Mutation, CreateBusinessStep1MutationVariables>;
export const CreateInformationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createInformation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InformationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInformation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}]}]}}]} as unknown as DocumentNode<CreateInformationMutation, CreateInformationMutationVariables>;
export const CreateProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shopId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shopId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shopId"}}},{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}]}]}}]} as unknown as DocumentNode<CreateProductMutation, CreateProductMutationVariables>;
export const CreateShopDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createShop"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShopInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createShop"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}]}]}}]} as unknown as DocumentNode<CreateShopMutation, CreateShopMutationVariables>;
export const CreateStripeAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createStripeAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"businessName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"vatNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phone"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createStripeAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"businessName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"businessName"}}},{"kind":"Argument","name":{"kind":"Name","value":"vatNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"vatNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"phone"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phone"}}}]}]}}]} as unknown as DocumentNode<CreateStripeAccountMutation, CreateStripeAccountMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}]}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const CreateVariationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createVariation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVariation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}},{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}]}]}}]} as unknown as DocumentNode<CreateVariationMutation, CreateVariationMutationVariables>;
export const DeleteProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteProductMutation, DeleteProductMutationVariables>;
export const DeleteVariationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteVariation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteVariation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteVariationMutation, DeleteVariationMutationVariables>;
export const MutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Mutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"denyReturn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}}]}]}}]} as unknown as DocumentNode<MutationMutation, MutationMutationVariables>;
export const EditCartDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editCart"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productVariationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"quantity"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editCart"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"productVariationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productVariationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}},{"kind":"Argument","name":{"kind":"Name","value":"quantity"},"value":{"kind":"Variable","name":{"kind":"Name","value":"quantity"}}}]}]}}]} as unknown as DocumentNode<EditCartMutation, EditCartMutationVariables>;
export const EditProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EditProductInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}]}]}}]} as unknown as DocumentNode<EditProductMutation, EditProductMutationVariables>;
export const ChangeProductStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"changeProductStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeProductStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}]}]}}]} as unknown as DocumentNode<ChangeProductStatusMutation, ChangeProductStatusMutationVariables>;
export const EditUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EditUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}]}]}}]} as unknown as DocumentNode<EditUserMutation, EditUserMutationVariables>;
export const EditVariationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editVariation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EditVariationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editVariation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}]}]}}]} as unknown as DocumentNode<EditVariationMutation, EditVariationMutationVariables>;
export const ReturnOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"returnOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"returnOrderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returnOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"returnOrderId"}}}]}]}}]} as unknown as DocumentNode<ReturnOrderMutation, ReturnOrderMutationVariables>;
export const ReturnedOrderHasArrivedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"returnedOrderHasArrived"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returnedOrderHasArrived"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<ReturnedOrderHasArrivedMutation, ReturnedOrderHasArrivedMutationVariables>;
export const BusinessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"business"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"business"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firebaseId"}},{"kind":"Field","name":{"kind":"Name","value":"vatNumber"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"stripe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shops"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessId"}},{"kind":"Field","name":{"kind":"Name","value":"categories"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhoto"}},{"kind":"Field","name":{"kind":"Name","value":"minimumAmountForFreeShipping"}},{"kind":"Field","name":{"kind":"Name","value":"profileCover"}},{"kind":"Field","name":{"kind":"Name","value":"isDigitalOnly"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"opening"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"days"}},{"kind":"Field","name":{"kind":"Name","value":"hours"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<BusinessQuery, BusinessQueryVariables>;
export const GetProductsFromSingleShopDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductsFromSingleShop"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductFilters"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shop"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"canBuy"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"macroCategory"}},{"kind":"Field","name":{"kind":"Name","value":"microCategory"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"photos"}},{"kind":"Field","name":{"kind":"Name","value":"lots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"v1"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"v2"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shopInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhoto"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetProductsFromSingleShopQuery, GetProductsFromSingleShopQueryVariables>;
export const OrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"order"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"cartId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"totalDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amountDiscount"}},{"kind":"Field","name":{"kind":"Name","value":"amountShipping"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"shop"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessId"}},{"kind":"Field","name":{"kind":"Name","value":"stripeId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shipping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"courier"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variationId"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"v1"}},{"kind":"Field","name":{"kind":"Name","value":"v2"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripeId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"surname"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<OrderQuery, OrderQueryVariables>;
export const ProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"products"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductFilters"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"canBuy"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"macroCategory"}},{"kind":"Field","name":{"kind":"Name","value":"microCategory"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"photos"}},{"kind":"Field","name":{"kind":"Name","value":"lots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"v1"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"v2"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shopInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhoto"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ProductsQuery, ProductsQueryVariables>;
export const GetSingleShopDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSingleShop"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shop"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"categories"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhoto"}},{"kind":"Field","name":{"kind":"Name","value":"profileCover"}},{"kind":"Field","name":{"kind":"Name","value":"isDigitalOnly"}},{"kind":"Field","name":{"kind":"Name","value":"minimumAmountForFreeShipping"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"opening"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"days"}},{"kind":"Field","name":{"kind":"Name","value":"hours"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetSingleShopQuery, GetSingleShopQueryVariables>;
export const ShopsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"shops"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShopFilters"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shops"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessId"}},{"kind":"Field","name":{"kind":"Name","value":"businessStatus"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"profileCover"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhoto"}},{"kind":"Field","name":{"kind":"Name","value":"isDigitalOnly"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"opening"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"days"}},{"kind":"Field","name":{"kind":"Name","value":"hours"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"minimumAmountForFreeShipping"}}]}}]}}]} as unknown as DocumentNode<ShopsQuery, ShopsQueryVariables>;
export const GetSimilarProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSimilarProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shopId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productsLikeThis"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"shopId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shopId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"canBuy"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"macroCategory"}},{"kind":"Field","name":{"kind":"Name","value":"microCategory"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"traits"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"materials"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"photos"}},{"kind":"Field","name":{"kind":"Name","value":"lots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"v1"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"v2"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shopInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetSimilarProductsQuery, GetSimilarProductsQueryVariables>;
export const GetProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"canBuy"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"macroCategory"}},{"kind":"Field","name":{"kind":"Name","value":"microCategory"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"traits"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"materials"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"photos"}},{"kind":"Field","name":{"kind":"Name","value":"lots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"v1"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"v2"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shopInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetProductQuery, GetProductQueryVariables>;
export const GetShopDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getShop"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductFilters"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shop"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhoto"}},{"kind":"Field","name":{"kind":"Name","value":"profileCover"}},{"kind":"Field","name":{"kind":"Name","value":"isDigitalOnly"}},{"kind":"Field","name":{"kind":"Name","value":"minimumAmountForFreeShipping"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"opening"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"days"}},{"kind":"Field","name":{"kind":"Name","value":"hours"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"canBuy"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"macroCategory"}},{"kind":"Field","name":{"kind":"Name","value":"microCategory"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"photos"}},{"kind":"Field","name":{"kind":"Name","value":"lots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"v1"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"v2"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shopInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhoto"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetShopQuery, GetShopQueryVariables>;
export const UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"surname"}},{"kind":"Field","name":{"kind":"Name","value":"stripeId"}},{"kind":"Field","name":{"kind":"Name","value":"firebaseId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"carts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"carts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"shopInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"productVariations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"variationId"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"v1"}},{"kind":"Field","name":{"kind":"Name","value":"v2"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"warnings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"variationId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"orders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"cartId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"totalDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amountDiscount"}},{"kind":"Field","name":{"kind":"Name","value":"amountShipping"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"shop"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessId"}},{"kind":"Field","name":{"kind":"Name","value":"stripeId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shipping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"courier"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variationId"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"v1"}},{"kind":"Field","name":{"kind":"Name","value":"v2"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripeId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"surname"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const ShopDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"shop"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"statuses"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shop"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"orders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"statuses"},"value":{"kind":"Variable","name":{"kind":"Name","value":"statuses"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"cartId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"totalDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amountDiscount"}},{"kind":"Field","name":{"kind":"Name","value":"amountShipping"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"shop"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessId"}},{"kind":"Field","name":{"kind":"Name","value":"stripeId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shipping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"courier"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"variationId"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"v1"}},{"kind":"Field","name":{"kind":"Name","value":"v2"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripeId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"surname"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ShopQuery, ShopQueryVariables>;