/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateReview = /* GraphQL */ `
  subscription OnCreateReview($filter: ModelSubscriptionReviewFilterInput) {
    onCreateReview(filter: $filter) {
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
export const onUpdateReview = /* GraphQL */ `
  subscription OnUpdateReview($filter: ModelSubscriptionReviewFilterInput) {
    onUpdateReview(filter: $filter) {
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
export const onDeleteReview = /* GraphQL */ `
  subscription OnDeleteReview($filter: ModelSubscriptionReviewFilterInput) {
    onDeleteReview(filter: $filter) {
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment($filter: ModelSubscriptionCommentFilterInput) {
    onCreateComment(filter: $filter) {
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
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment($filter: ModelSubscriptionCommentFilterInput) {
    onUpdateComment(filter: $filter) {
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
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment($filter: ModelSubscriptionCommentFilterInput) {
    onDeleteComment(filter: $filter) {
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
export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct($filter: ModelSubscriptionProductFilterInput) {
    onCreateProduct(filter: $filter) {
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
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct($filter: ModelSubscriptionProductFilterInput) {
    onUpdateProduct(filter: $filter) {
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
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct($filter: ModelSubscriptionProductFilterInput) {
    onDeleteProduct(filter: $filter) {
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
export const onCreateCart = /* GraphQL */ `
  subscription OnCreateCart($filter: ModelSubscriptionCartFilterInput) {
    onCreateCart(filter: $filter) {
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
export const onUpdateCart = /* GraphQL */ `
  subscription OnUpdateCart($filter: ModelSubscriptionCartFilterInput) {
    onUpdateCart(filter: $filter) {
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
export const onDeleteCart = /* GraphQL */ `
  subscription OnDeleteCart($filter: ModelSubscriptionCartFilterInput) {
    onDeleteCart(filter: $filter) {
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
export const onCreateCartItem = /* GraphQL */ `
  subscription OnCreateCartItem($filter: ModelSubscriptionCartItemFilterInput) {
    onCreateCartItem(filter: $filter) {
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
export const onUpdateCartItem = /* GraphQL */ `
  subscription OnUpdateCartItem($filter: ModelSubscriptionCartItemFilterInput) {
    onUpdateCartItem(filter: $filter) {
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
export const onDeleteCartItem = /* GraphQL */ `
  subscription OnDeleteCartItem($filter: ModelSubscriptionCartItemFilterInput) {
    onDeleteCartItem(filter: $filter) {
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
export const onCreateOrder = /* GraphQL */ `
  subscription OnCreateOrder($filter: ModelSubscriptionOrderFilterInput) {
    onCreateOrder(filter: $filter) {
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
export const onUpdateOrder = /* GraphQL */ `
  subscription OnUpdateOrder($filter: ModelSubscriptionOrderFilterInput) {
    onUpdateOrder(filter: $filter) {
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
export const onDeleteOrder = /* GraphQL */ `
  subscription OnDeleteOrder($filter: ModelSubscriptionOrderFilterInput) {
    onDeleteOrder(filter: $filter) {
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
export const onCreateOrderItem = /* GraphQL */ `
  subscription OnCreateOrderItem(
    $filter: ModelSubscriptionOrderItemFilterInput
  ) {
    onCreateOrderItem(filter: $filter) {
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
export const onUpdateOrderItem = /* GraphQL */ `
  subscription OnUpdateOrderItem(
    $filter: ModelSubscriptionOrderItemFilterInput
  ) {
    onUpdateOrderItem(filter: $filter) {
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
export const onDeleteOrderItem = /* GraphQL */ `
  subscription OnDeleteOrderItem(
    $filter: ModelSubscriptionOrderItemFilterInput
  ) {
    onDeleteOrderItem(filter: $filter) {
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
export const onCreateContactUs = /* GraphQL */ `
  subscription OnCreateContactUs(
    $filter: ModelSubscriptionContactUsFilterInput
  ) {
    onCreateContactUs(filter: $filter) {
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
export const onUpdateContactUs = /* GraphQL */ `
  subscription OnUpdateContactUs(
    $filter: ModelSubscriptionContactUsFilterInput
  ) {
    onUpdateContactUs(filter: $filter) {
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
export const onDeleteContactUs = /* GraphQL */ `
  subscription OnDeleteContactUs(
    $filter: ModelSubscriptionContactUsFilterInput
  ) {
    onDeleteContactUs(filter: $filter) {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
