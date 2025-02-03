/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const deleteCartItemByProductID = /* GraphQL */ `
  mutation DeleteCartItemByProductID($productID: ID!) {
    deleteCartItemByProductID(productID: $productID) {
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
export const createReview = /* GraphQL */ `
  mutation CreateReview(
    $input: CreateReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    createReview(input: $input, condition: $condition) {
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
export const updateReview = /* GraphQL */ `
  mutation UpdateReview(
    $input: UpdateReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    updateReview(input: $input, condition: $condition) {
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
export const deleteReview = /* GraphQL */ `
  mutation DeleteReview(
    $input: DeleteReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    deleteReview(input: $input, condition: $condition) {
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
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
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
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
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
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
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
export const createProduct = /* GraphQL */ `
  mutation CreateProduct(
    $input: CreateProductInput!
    $condition: ModelProductConditionInput
  ) {
    createProduct(input: $input, condition: $condition) {
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
export const updateProduct = /* GraphQL */ `
  mutation UpdateProduct(
    $input: UpdateProductInput!
    $condition: ModelProductConditionInput
  ) {
    updateProduct(input: $input, condition: $condition) {
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
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct(
    $input: DeleteProductInput!
    $condition: ModelProductConditionInput
  ) {
    deleteProduct(input: $input, condition: $condition) {
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
export const createCart = /* GraphQL */ `
  mutation CreateCart(
    $input: CreateCartInput!
    $condition: ModelCartConditionInput
  ) {
    createCart(input: $input, condition: $condition) {
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
export const updateCart = /* GraphQL */ `
  mutation UpdateCart(
    $input: UpdateCartInput!
    $condition: ModelCartConditionInput
  ) {
    updateCart(input: $input, condition: $condition) {
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
export const deleteCart = /* GraphQL */ `
  mutation DeleteCart(
    $input: DeleteCartInput!
    $condition: ModelCartConditionInput
  ) {
    deleteCart(input: $input, condition: $condition) {
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
export const createCartItem = /* GraphQL */ `
  mutation CreateCartItem(
    $input: CreateCartItemInput!
    $condition: ModelCartItemConditionInput
  ) {
    createCartItem(input: $input, condition: $condition) {
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
export const updateCartItem = /* GraphQL */ `
  mutation UpdateCartItem(
    $input: UpdateCartItemInput!
    $condition: ModelCartItemConditionInput
  ) {
    updateCartItem(input: $input, condition: $condition) {
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
export const deleteCartItem = /* GraphQL */ `
  mutation DeleteCartItem(
    $input: DeleteCartItemInput!
    $condition: ModelCartItemConditionInput
  ) {
    deleteCartItem(input: $input, condition: $condition) {
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
export const createOrder = /* GraphQL */ `
  mutation CreateOrder(
    $input: CreateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    createOrder(input: $input, condition: $condition) {
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
export const updateOrder = /* GraphQL */ `
  mutation UpdateOrder(
    $input: UpdateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    updateOrder(input: $input, condition: $condition) {
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
export const deleteOrder = /* GraphQL */ `
  mutation DeleteOrder(
    $input: DeleteOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    deleteOrder(input: $input, condition: $condition) {
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
export const createOrderItem = /* GraphQL */ `
  mutation CreateOrderItem(
    $input: CreateOrderItemInput!
    $condition: ModelOrderItemConditionInput
  ) {
    createOrderItem(input: $input, condition: $condition) {
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
export const updateOrderItem = /* GraphQL */ `
  mutation UpdateOrderItem(
    $input: UpdateOrderItemInput!
    $condition: ModelOrderItemConditionInput
  ) {
    updateOrderItem(input: $input, condition: $condition) {
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
export const deleteOrderItem = /* GraphQL */ `
  mutation DeleteOrderItem(
    $input: DeleteOrderItemInput!
    $condition: ModelOrderItemConditionInput
  ) {
    deleteOrderItem(input: $input, condition: $condition) {
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
export const createContactUs = /* GraphQL */ `
  mutation CreateContactUs(
    $input: CreateContactUsInput!
    $condition: ModelContactUsConditionInput
  ) {
    createContactUs(input: $input, condition: $condition) {
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
export const updateContactUs = /* GraphQL */ `
  mutation UpdateContactUs(
    $input: UpdateContactUsInput!
    $condition: ModelContactUsConditionInput
  ) {
    updateContactUs(input: $input, condition: $condition) {
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
export const deleteContactUs = /* GraphQL */ `
  mutation DeleteContactUs(
    $input: DeleteContactUsInput!
    $condition: ModelContactUsConditionInput
  ) {
    deleteContactUs(input: $input, condition: $condition) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
