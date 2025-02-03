/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const fetchTopRatedProducts = /* GraphQL */ `
  query FetchTopRatedProducts {
    fetchTopRatedProducts {
      topRatedProducts {
        productID
        averageRating
        __typename
      }
      allProducts {
        productID
        averageRating
        __typename
      }
      __typename
    }
  }
`;
export const getReview = /* GraphQL */ `
  query GetReview($id: ID!) {
    getReview(id: $id) {
      id
      productID
      userID
      rating
      comment
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listReviews = /* GraphQL */ `
  query ListReviews(
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        productID
        userID
        rating
        comment
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      productID
      userID
      comment
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        productID
        userID
        comment
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getProduct = /* GraphQL */ `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      title
      description
      price
      discountPercentage
      category
      brand
      images
      sizes
      colors
      quantity
      createdAt
      updatedAt
      cartItems {
        items {
          id
          cartID
          productID
          product {
            id
            title
            description
            price
            discountPercentage
            category
            brand
            images
            sizes
            colors
            quantity
            createdAt
            updatedAt
            cartItems {
              items {
                id
                cartID
                productID
                product {
                  id
                  title
                  description
                  price
                  discountPercentage
                  category
                  brand
                  images
                  sizes
                  colors
                  quantity
                  createdAt
                  updatedAt
                  cartItems {
                    items {
                      id
                      cartID
                      productID
                      product {
                        id
                        title
                        description
                        price
                        discountPercentage
                        category
                        brand
                        images
                        sizes
                        colors
                        quantity
                        createdAt
                        updatedAt
                        __typename
                      }
                      color
                      size
                      quantity
                      price
                      createdAt
                      updatedAt
                      __typename
                    }
                    nextToken
                    __typename
                  }
                  __typename
                }
                color
                size
                quantity
                price
                createdAt
                updatedAt
                __typename
              }
              nextToken
              __typename
            }
            __typename
          }
          color
          size
          quantity
          price
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const listProducts = /* GraphQL */ `
  query ListProducts(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        price
        discountPercentage
        category
        brand
        images
        sizes
        colors
        quantity
        createdAt
        updatedAt
        cartItems {
          items {
            id
            cartID
            productID
            product {
              id
              title
              description
              price
              discountPercentage
              category
              brand
              images
              sizes
              colors
              quantity
              createdAt
              updatedAt
              cartItems {
                items {
                  id
                  cartID
                  productID
                  product {
                    id
                    title
                    description
                    price
                    discountPercentage
                    category
                    brand
                    images
                    sizes
                    colors
                    quantity
                    createdAt
                    updatedAt
                    cartItems {
                      items {
                        id
                        cartID
                        productID
                        color
                        size
                        quantity
                        price
                        createdAt
                        updatedAt
                        __typename
                      }
                      nextToken
                      __typename
                    }
                    __typename
                  }
                  color
                  size
                  quantity
                  price
                  createdAt
                  updatedAt
                  __typename
                }
                nextToken
                __typename
              }
              __typename
            }
            color
            size
            quantity
            price
            createdAt
            updatedAt
            __typename
          }
          nextToken
          __typename
        }
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getCart = /* GraphQL */ `
  query GetCart($id: ID!) {
    getCart(id: $id) {
      id
      userID
      status
      cartItems {
        items {
          id
          cartID
          productID
          product {
            id
            title
            description
            price
            discountPercentage
            category
            brand
            images
            sizes
            colors
            quantity
            createdAt
            updatedAt
            cartItems {
              items {
                id
                cartID
                productID
                product {
                  id
                  title
                  description
                  price
                  discountPercentage
                  category
                  brand
                  images
                  sizes
                  colors
                  quantity
                  createdAt
                  updatedAt
                  cartItems {
                    items {
                      id
                      cartID
                      productID
                      product {
                        id
                        title
                        description
                        price
                        discountPercentage
                        category
                        brand
                        images
                        sizes
                        colors
                        quantity
                        createdAt
                        updatedAt
                        __typename
                      }
                      color
                      size
                      quantity
                      price
                      createdAt
                      updatedAt
                      __typename
                    }
                    nextToken
                    __typename
                  }
                  __typename
                }
                color
                size
                quantity
                price
                createdAt
                updatedAt
                __typename
              }
              nextToken
              __typename
            }
            __typename
          }
          color
          size
          quantity
          price
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listCarts = /* GraphQL */ `
  query ListCarts(
    $filter: ModelCartFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCarts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userID
        status
        cartItems {
          items {
            id
            cartID
            productID
            product {
              id
              title
              description
              price
              discountPercentage
              category
              brand
              images
              sizes
              colors
              quantity
              createdAt
              updatedAt
              cartItems {
                items {
                  id
                  cartID
                  productID
                  product {
                    id
                    title
                    description
                    price
                    discountPercentage
                    category
                    brand
                    images
                    sizes
                    colors
                    quantity
                    createdAt
                    updatedAt
                    cartItems {
                      items {
                        id
                        cartID
                        productID
                        color
                        size
                        quantity
                        price
                        createdAt
                        updatedAt
                        __typename
                      }
                      nextToken
                      __typename
                    }
                    __typename
                  }
                  color
                  size
                  quantity
                  price
                  createdAt
                  updatedAt
                  __typename
                }
                nextToken
                __typename
              }
              __typename
            }
            color
            size
            quantity
            price
            createdAt
            updatedAt
            __typename
          }
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getCartItem = /* GraphQL */ `
  query GetCartItem($id: ID!) {
    getCartItem(id: $id) {
      id
      cartID
      productID
      product {
        id
        title
        description
        price
        discountPercentage
        category
        brand
        images
        sizes
        colors
        quantity
        createdAt
        updatedAt
        cartItems {
          items {
            id
            cartID
            productID
            product {
              id
              title
              description
              price
              discountPercentage
              category
              brand
              images
              sizes
              colors
              quantity
              createdAt
              updatedAt
              cartItems {
                items {
                  id
                  cartID
                  productID
                  product {
                    id
                    title
                    description
                    price
                    discountPercentage
                    category
                    brand
                    images
                    sizes
                    colors
                    quantity
                    createdAt
                    updatedAt
                    cartItems {
                      items {
                        id
                        cartID
                        productID
                        color
                        size
                        quantity
                        price
                        createdAt
                        updatedAt
                        __typename
                      }
                      nextToken
                      __typename
                    }
                    __typename
                  }
                  color
                  size
                  quantity
                  price
                  createdAt
                  updatedAt
                  __typename
                }
                nextToken
                __typename
              }
              __typename
            }
            color
            size
            quantity
            price
            createdAt
            updatedAt
            __typename
          }
          nextToken
          __typename
        }
        __typename
      }
      color
      size
      quantity
      price
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listCartItems = /* GraphQL */ `
  query ListCartItems(
    $filter: ModelCartItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCartItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        cartID
        productID
        product {
          id
          title
          description
          price
          discountPercentage
          category
          brand
          images
          sizes
          colors
          quantity
          createdAt
          updatedAt
          cartItems {
            items {
              id
              cartID
              productID
              product {
                id
                title
                description
                price
                discountPercentage
                category
                brand
                images
                sizes
                colors
                quantity
                createdAt
                updatedAt
                cartItems {
                  items {
                    id
                    cartID
                    productID
                    product {
                      id
                      title
                      description
                      price
                      discountPercentage
                      category
                      brand
                      images
                      sizes
                      colors
                      quantity
                      createdAt
                      updatedAt
                      cartItems {
                        nextToken
                        __typename
                      }
                      __typename
                    }
                    color
                    size
                    quantity
                    price
                    createdAt
                    updatedAt
                    __typename
                  }
                  nextToken
                  __typename
                }
                __typename
              }
              color
              size
              quantity
              price
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
          }
          __typename
        }
        color
        size
        quantity
        price
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getOrder = /* GraphQL */ `
  query GetOrder($id: ID!) {
    getOrder(id: $id) {
      id
      userID
      totalAmount
      status
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listOrders = /* GraphQL */ `
  query ListOrders(
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userID
        totalAmount
        status
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getOrderItem = /* GraphQL */ `
  query GetOrderItem($id: ID!) {
    getOrderItem(id: $id) {
      id
      orderID
      productID
      color
      size
      quantity
      price
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listOrderItems = /* GraphQL */ `
  query ListOrderItems(
    $filter: ModelOrderItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrderItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        orderID
        productID
        color
        size
        quantity
        price
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getContactUs = /* GraphQL */ `
  query GetContactUs($id: ID!) {
    getContactUs(id: $id) {
      id
      name
      email
      phone
      message
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listContactuses = /* GraphQL */ `
  query ListContactuses(
    $filter: ModelContactUsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listContactuses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        email
        phone
        message
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const reviewsByProductID = /* GraphQL */ `
  query ReviewsByProductID(
    $productID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    reviewsByProductID(
      productID: $productID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        productID
        userID
        rating
        comment
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const reviewsByUserID = /* GraphQL */ `
  query ReviewsByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    reviewsByUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        productID
        userID
        rating
        comment
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const commentsByProductID = /* GraphQL */ `
  query CommentsByProductID(
    $productID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    commentsByProductID(
      productID: $productID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        productID
        userID
        comment
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const commentsByUserID = /* GraphQL */ `
  query CommentsByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    commentsByUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        productID
        userID
        comment
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const cartsByUserID = /* GraphQL */ `
  query CartsByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCartFilterInput
    $limit: Int
    $nextToken: String
  ) {
    cartsByUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userID
        status
        cartItems {
          items {
            id
            cartID
            productID
            product {
              id
              title
              description
              price
              discountPercentage
              category
              brand
              images
              sizes
              colors
              quantity
              createdAt
              updatedAt
              cartItems {
                items {
                  id
                  cartID
                  productID
                  product {
                    id
                    title
                    description
                    price
                    discountPercentage
                    category
                    brand
                    images
                    sizes
                    colors
                    quantity
                    createdAt
                    updatedAt
                    cartItems {
                      items {
                        id
                        cartID
                        productID
                        color
                        size
                        quantity
                        price
                        createdAt
                        updatedAt
                        __typename
                      }
                      nextToken
                      __typename
                    }
                    __typename
                  }
                  color
                  size
                  quantity
                  price
                  createdAt
                  updatedAt
                  __typename
                }
                nextToken
                __typename
              }
              __typename
            }
            color
            size
            quantity
            price
            createdAt
            updatedAt
            __typename
          }
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const cartItemsByCartID = /* GraphQL */ `
  query CartItemsByCartID(
    $cartID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCartItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    cartItemsByCartID(
      cartID: $cartID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        cartID
        productID
        product {
          id
          title
          description
          price
          discountPercentage
          category
          brand
          images
          sizes
          colors
          quantity
          createdAt
          updatedAt
          cartItems {
            items {
              id
              cartID
              productID
              product {
                id
                title
                description
                price
                discountPercentage
                category
                brand
                images
                sizes
                colors
                quantity
                createdAt
                updatedAt
                cartItems {
                  items {
                    id
                    cartID
                    productID
                    product {
                      id
                      title
                      description
                      price
                      discountPercentage
                      category
                      brand
                      images
                      sizes
                      colors
                      quantity
                      createdAt
                      updatedAt
                      cartItems {
                        nextToken
                        __typename
                      }
                      __typename
                    }
                    color
                    size
                    quantity
                    price
                    createdAt
                    updatedAt
                    __typename
                  }
                  nextToken
                  __typename
                }
                __typename
              }
              color
              size
              quantity
              price
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
          }
          __typename
        }
        color
        size
        quantity
        price
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const cartItemsByProductID = /* GraphQL */ `
  query CartItemsByProductID(
    $productID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCartItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    cartItemsByProductID(
      productID: $productID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        cartID
        productID
        product {
          id
          title
          description
          price
          discountPercentage
          category
          brand
          images
          sizes
          colors
          quantity
          createdAt
          updatedAt
          cartItems {
            items {
              id
              cartID
              productID
              product {
                id
                title
                description
                price
                discountPercentage
                category
                brand
                images
                sizes
                colors
                quantity
                createdAt
                updatedAt
                cartItems {
                  items {
                    id
                    cartID
                    productID
                    product {
                      id
                      title
                      description
                      price
                      discountPercentage
                      category
                      brand
                      images
                      sizes
                      colors
                      quantity
                      createdAt
                      updatedAt
                      cartItems {
                        nextToken
                        __typename
                      }
                      __typename
                    }
                    color
                    size
                    quantity
                    price
                    createdAt
                    updatedAt
                    __typename
                  }
                  nextToken
                  __typename
                }
                __typename
              }
              color
              size
              quantity
              price
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
          }
          __typename
        }
        color
        size
        quantity
        price
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      email
      phoneNumber
      type
      status
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        phoneNumber
        type
        status
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
