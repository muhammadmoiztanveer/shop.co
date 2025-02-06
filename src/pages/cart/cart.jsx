import React, { useEffect, useState } from "react";
import { Button, Divider, Spin, message } from "antd";
import {
  DeleteFilled,
  MinusOutlined,
  PlusOutlined,
  TagOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { generateClient } from "aws-amplify/api";
import { listCarts } from "@/graphql/queries";
import { getCurrentUser } from "aws-amplify/auth";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { listCartItems } from "@/graphql/queries";
import { deleteCartItem } from "@/graphql/mutations";

const Cart = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productsInCart, setProductsInCart] = useState([]);

  const client = generateClient();

  const [messageApi, contextHolder] = message.useMessage();
  const [productLoading, setProductLoading] = useState({});

  async function currentAuthenticatedUser() {
    setLoading(true);

    try {
      const {
        username,
        userId: fetchedUserId,
        signInDetails,
      } = await getCurrentUser();
      // console.log(`The username: ${username}`);
      // console.log(`The userId: ${fetchedUserId}`);
      // console.log(`The signInDetails: ${signInDetails}`);

      if (fetchedUserId) {
        setUserId(fetchedUserId);
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  }

  const fetchCart = async (id) => {
    if (!id) return;
    try {
      const cartDataResponse = await client.graphql({
        query: listCarts,
        variables: {
          filter: {
            userID: { eq: `${id}` },
          },
        },
      });
      // console.log("Response:", cartDataResponse);
      const carts = cartDataResponse.data.listCarts.items;

      if (carts && carts.length > 0) {
        const cart = carts[0];
        // console.log("Cart:", cart);
        const uniqueProducts = {};

        cart.cartItems.items.forEach((cartItem) => {
          if (cartItem.product && !uniqueProducts[cartItem.product.id]) {
            uniqueProducts[cartItem.product.id] = cartItem.product;
          }
        });

        const uniqueProductArray = Object.values(uniqueProducts);
        // console.log("Unique Products:", uniqueProductArray);
        setProductsInCart(uniqueProductArray);
      } else {
        console.log("No cart found for this user.");
        return [];
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPageContent = async () => {
      await currentAuthenticatedUser();

      if (userId) {
        await fetchCart(userId);
      }
    };

    loadPageContent();
  }, [userId]);

  async function deleteProductFromCart(productId) {
    setProductLoading({ ...productLoading, [productId]: true });
    try {
      const cartItemResponse = await client.graphql({
        query: listCartItems,

        variables: {
          filter: {
            productID: { eq: `${productId}` },
          },
        },
      });

      // console.log(
      //   "idddddddddddd",
      //   cartItemResponse.data.listCartItems.items[0].id
      // );

      if (cartItemResponse.data.listCartItems.items.length > 0) {
        const cartItemId = cartItemResponse.data.listCartItems.items[0].id;

        try {
          await client.graphql({
            query: deleteCartItem,

            variables: {
              input: {
                id: cartItemId,
              },
            },
          });
        } catch (error) {
          console.error("Error deleting the product", error);
        }

        await fetchCart();

        messageApi.open({
          type: "success",
          content: "Product Removed from Cart !",
        });
        // console.log("Product Delete Response", deleteCartItemResponse);
        const updatedProducts = productsInCart.filter(
          (product) => product.id !== productId
        );
        setProductsInCart(updatedProducts);
      } else {
        messageApi.open({
          type: "info",
          content: "No such product found in the cart",
        });
      }
    } catch (err) {
      console.error("Error: ", err);
      messageApi.open({
        type: "error",
        content: "Error removing the product from the cart",
      });
    } finally {
      setProductLoading({ ...productLoading, [productId]: false });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      {contextHolder}

      <div className="flex flex-col gap-10 px-4 sm:px-8 lg:px-10 2xl:px-16 py-10">
        <div className="text-4xl">Your Cart</div>

        <div className="w-full grid grid-cols-5 gap-6">
          <div className="col-span-5 lg:col-span-3 border rounded-3xl p-6 h-fit">
            {productsInCart.length > 0 ? (
              productsInCart.map((product, index) => {
                const imageUrl = product.images[0];
                const color = product.cartItems.items[0].color;

                return (
                  <div key={product.id}>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <StorageImage
                        alt={product.title}
                        path={imageUrl}
                        className="sm:h-36 object-cover aspect-square rounded-xl"
                      />

                      <div className="flex flex-col justify-between gap-6 sm:gap-0 w-full">
                        <div>
                          <div className="flex items-start sm:items-center justify-between">
                            <div className="text-2xl">{product.title}</div>
                            <div className="flex items-center">
                              {productLoading[product.id] ? (
                                <Spin size="small" className="mr-2" />
                              ) : (
                                <DeleteFilled
                                  style={{ color: "red", fontSize: "25px" }}
                                  onClick={() =>
                                    deleteProductFromCart(product.id)
                                  }
                                />
                              )}
                            </div>
                          </div>
                          {product.cartItems &&
                            product.cartItems.items &&
                            product.cartItems.items.length > 0 && (
                              <>
                                <div className="lg:text-sm xl:text-base 2xl:text-lg text-[#7c7b7b]">
                                  <span className="text-black">Size: </span>
                                  {product.cartItems.items[0].size}{" "}
                                </div>

                                <div className="lg:text-sm xl:text-base 2xl:text-lg text-[#7c7b7b] flex gap-2 items-center">
                                  <span className="text-black">Color: </span>
                                  <div
                                    className={`rounded-xl h-8 w-8 flex justify-center items-center`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleColorSelect(color)}
                                  ></div>
                                </div>
                              </>
                            )}
                        </div>
                        <div className="flex justify-between">
                          <div className="font-bold text-3xl">
                            ${product.price}
                          </div>
                          <div className="flex bg-[#f0f0f0] rounded-full">
                            <button className="py-2 px-4 rounded-l-full">
                              <MinusOutlined />
                            </button>
                            <div className="px-4 z-20 flex items-center">1</div>{" "}
                            <button className="py-2 px-4 rounded-r-full">
                              <PlusOutlined />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Divider
                      className={
                        productsInCart.length === 1 ||
                        index === productsInCart.length - 1
                          ? "hidden"
                          : "block"
                      }
                    />
                  </div>
                );
              })
            ) : (
              <div className="text-lg text-[#7c7b7b] text-center">
                No Products added to Cart Yet
              </div>
            )}
          </div>

          <div className="col-span-5 lg:col-span-2 border rounded-3xl h-fit p-6 flex flex-col gap-4">
            <div className="text-2xl">Order Summary</div>

            <div className="flex justify-between lg:text-sm xl:text-base 2xl:text-xl">
              <div className="text-[#7c7b7b]">Subtotal</div>
              <div>$565</div>
            </div>

            <div className="flex justify-between lg:text-sm xl:text-base 2xl:text-xl">
              <div className="text-[#7c7b7b]">Discount (-20%)</div>
              <div className="text-red-500">-$113</div>
            </div>

            <div className="flex justify-between lg:text-sm xl:text-base 2xl:text-xl">
              <div className="text-[#7c7b7b]">Delivery Fee</div>
              <div>$15</div>
            </div>

            <Divider />

            <div className="flex justify-between lg:text-sm xl:text-base 2xl:text-xl">
              <div>Total</div>
              <div className="text-2xl">$467</div>
            </div>

            <div className="flex flex-col xl:flex-row gap-6">
              <div className="flex items-center px-4 rounded-full bg-gray-100 w-full space-x-4">
                <TagOutlined
                  style={{ fontSize: "22px" }}
                  className="transform -scale-x-100"
                />
                <input
                  type="text"
                  className="w-full py-4 bg-transparent focus:outline-0 placeholder:text-black/50 lg:placeholder:text-sm 2xl:placeholder:text-lg"
                  placeholder="Add promo code"
                />
              </div>

              <Button
                variant="solid"
                shape="round"
                color="default"
                className="text-lg w-full xl:w-fit !px-8 py-6"
              >
                Apply
              </Button>
            </div>

            <Button
              variant="solid"
              shape="round"
              color="default"
              icon={<ArrowRightOutlined />}
              iconPosition={"end"}
              className="w-full text-lg py-6"
            >
              Go to Checkout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
