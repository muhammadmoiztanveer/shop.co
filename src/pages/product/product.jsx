import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  StarFilled,
  MinusOutlined,
  PlusOutlined,
  FilterOutlined,
  DownOutlined,
  CheckCircleFilled,
  EllipsisOutlined,
  CheckOutlined,
  EditFilled,
} from "@ant-design/icons";
import {
  Button,
  Menu,
  Space,
  message,
  Dropdown,
  Modal,
  Rate,
  Spin,
  Form,
  Input,
  Select,
} from "antd";
import Draggable from "react-draggable";
import "./product.css";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { generateClient } from "aws-amplify/api";
import { createReview, updateProduct } from "../../graphql/mutations";
import { getProduct, listProducts } from "../../graphql/queries";
import { getCurrentUser } from "aws-amplify/auth";
import { listReviews } from "../../graphql/queries";
import { fetchTopRatedProducts } from "../../graphql/queries";
import { cartsByUserID } from "../../graphql/queries";
import { createCart } from "../../graphql/mutations";
import { createCartItem } from "../../graphql/mutations";
import ProductCards from "../../components/productCards/productCards";
import MultiColorPicker from "../../components/multiColorPicker/multiColorPicker";
import AddReviewModal from "../../components/modals/addReviewModal/addReviewModal";
import EditProductModal from "../../components/modals/editProductModal/editProductModal";

const ProductPage = () => {
  const client = generateClient();
  const { id } = useParams();
  const navigate = useNavigate();

  const [loadingReviews, setLoadingReviews] = useState(false);
  const [userId, setUserId] = useState(null);
  const [current, setCurrent] = useState("product-details");
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [fetchedProduct, setFetchedProduct] = useState({});
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [rating, setRating] = useState({
    productID: `${id}`,
    userID: `${userId ?? ""}`,
    rating: 0,
    comment: "",
  });
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const [loading, setLoading] = useState(true);
  const [fetchedReviews, setFetchedReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [allReviewsFetched, setAllReviewsFetched] = useState(false);
  const [loadingRelatedProducts, setLoadingRelatedProducts] = useState(false);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const [messageApi, contextHolder] = message.useMessage();
  const [isReviewPosted, setIsReviewPosted] = useState(false);

  const [isEditProductModalVisible, setIsEditProductModalVisible] =
    useState(false);
  const [isProductEditingPending, setIsProductEditingPending] = useState(false);

  const productColors = useMemo(
    () => fetchedProduct.colors,
    [fetchedProduct.colors]
  );

  const [errors, setErrors] = useState({});
  const [form] = Form.useForm();

  const productSizes = [
    { value: "xx-small", label: "XX-Small" },
    { value: "x-small", label: "X-Small" },
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
    { value: "x-large", label: "X-Large" },
    { value: "xx-large", label: "XX-Large" },
    { value: "3x-large", label: "3X-Large" },
  ];

  const openEditProductModal = () => {
    setIsEditProductModalVisible(true);
    form.setFieldsValue(fetchedProduct);
  };

  const closeEditProductModal = () => {
    setIsEditProductModalVisible(false);
    form.resetFields();
    setErrors({});
  };

  const handleEditProduct = async () => {
    // setIsProductEditingPending(true);

    // try {
    //   await form.validateFields();
    //   // console.log("Updated Product Data:", fetchedProduct);
    const productUpdateDetails = {
      id: id,
      title: fetchedProduct.title,
      description: fetchedProduct.description,
      category: fetchedProduct.category,
      brand: fetchedProduct.brand,
      price: parseFloat(fetchedProduct.price),
      discountPercentage: parseFloat(fetchedProduct.discountPercentage),
      sizes: fetchedProduct.sizes,
      colors: fetchedProduct.colors,
      quantity: parseInt(fetchedProduct.quantity, 10),
    };

    console.log("edited Product Details", productUpdateDetails);

    //   const updateProductResponse = await client.graphql({
    //     query: updateProduct,
    //     variables: { input: productUpdateDetails },
    //   });
    //   // console.log(
    //   //   "update Product resposne is called here",
    //   //   updateProductResponse
    //   // );
    //   message.success("Product Data Updated successfully!");
    //   closeEditProductModal();
    // } catch (error) {
    //   message.error("Product Data failed to Update!");
    //   console.error("Validation failed:", error);
    // } finally {
    //   setIsProductEditingPending(false);
    // }
  };

  useEffect(() => {
    if (fetchedProduct.colors && fetchedProduct.colors.length > 0) {
      setSelectedColor(fetchedProduct.colors[0]);
    }
    if (fetchedProduct.sizes && fetchedProduct.sizes.length > 0) {
      setSelectedSize(fetchedProduct.sizes[0]);
    }
  }, [fetchedProduct]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const fetchProduct = async () => {
    try {
      const productResponse = await client.graphql({
        query: getProduct,
        variables: { id: `${id}` },
      });

      if (!productResponse?.data?.getProduct) return;

      const fetchedProductResponse = productResponse.data.getProduct;

      setFetchedProduct(fetchedProductResponse);

      const lambdaResponse = await client.graphql({
        query: fetchTopRatedProducts,
      });

      const { allProducts } = lambdaResponse.data.fetchTopRatedProducts;

      const productFromAll = allProducts.find(
        (product) => product.productID === fetchedProductResponse.id
      );
      // console.log("Products form alllll", allProducts);
      if (productFromAll) {
        setFetchedProduct((prev) => ({
          ...prev,
          averageRating: productFromAll.averageRating,
        }));
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchRelatedProducts = async () => {
    const productCategory = fetchedProduct?.category;
    // console.log("§Product Category", productCategory);
    // console.log("Product ID", id);

    if (!productCategory || !id) return;

    setLoadingRelatedProducts(true);

    try {
      const relatedProductsResponse = await client.graphql({
        query: listProducts,
        variables: {
          filter: {
            category: { eq: `${productCategory}` },
          },
        },
      });

      if (relatedProductsResponse?.data?.listProducts?.items) {
        const relatedProducts = relatedProductsResponse.data.listProducts.items;

        const lambdaResponse = await client.graphql({
          query: fetchTopRatedProducts,
        });

        const { allProducts } = lambdaResponse.data.fetchTopRatedProducts;

        const updatedRelatedProducts = relatedProducts.map((relatedProduct) => {
          const productFromAll = allProducts.find(
            (product) => product.productID === relatedProduct.id
          );

          if (productFromAll) {
            return {
              ...relatedProduct,
              averageRating: productFromAll.averageRating,
            };
          }
          return relatedProduct;
        });

        setRelatedProducts(updatedRelatedProducts);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    } finally {
      setLoadingRelatedProducts(false);
    }
  };

  function viewProduct(id) {
    navigate(`/product/${id}`);
    window.location.reload();
  }

  const fetchFilteredReviews = async (limit = 10) => {
    setLoadingReviews(true);

    try {
      const variables = {
        filter: {
          productID: { eq: `${id}` },
        },
      };

      const reviewsResponse = await client.graphql({
        query: listReviews,
        variables,
      });

      const allItems = reviewsResponse?.data?.listReviews?.items || [];
      const limitedItems = allItems.slice(0, 6);

      if (limitedItems) {
        setFetchedReviews(limitedItems);
      }

      setAllReviewsFetched(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleLoadMore = async () => {
    if (!allReviewsFetched) {
      setLoadingReviews(true);
      try {
        const reviewsResponse = await client.graphql({
          query: listReviews,
          variables: {
            filter: {
              productID: { eq: `${id}` },
            },
          },
        });

        if (reviewsResponse?.data?.listReviews?.items) {
          setFetchedReviews(reviewsResponse.data.listReviews.items);
        }

        setAllReviewsFetched(true);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    }
  };

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

  async function loadPageData() {
    await currentAuthenticatedUser();
    await fetchProduct();

    setLoading(false);
  }

  useEffect(() => {
    if (userId) {
      setRating((prevRating) => ({
        ...prevRating,
        userID: userId,
      }));
    }
  }, [userId]);

  useEffect(() => {
    loadPageData();
  }, []);

  useEffect(() => {
    if (
      fetchedProduct?.price &&
      fetchedProduct?.discountPercentage &&
      !isNaN(fetchedProduct.price) &&
      !isNaN(fetchedProduct.discountPercentage)
    ) {
      setDiscountedPrice(
        fetchedProduct.price -
          (fetchedProduct.price * fetchedProduct.discountPercentage) / 100
      );
    } else {
      setDiscountedPrice(fetchedProduct?.price ?? 0);
    }
  }, [fetchedProduct]);

  const handleRatingChange = (value) => {
    setRating((prev) => ({ ...prev, rating: value }));
  };

  const handleMessageChange = (e) => {
    setRating((prev) => ({ ...prev, comment: e.target.value }));
  };

  const handlePostReview = async (value) => {
    if (value.comment === "") {
      message.error("Rating cannot be posted without comment !");
      return;
    }

    setRating((prev) => ({
      ...prev,
      rating: value.rating,
      comment: value.comment,
    }));

    if (!userId) {
      console.log("User ID is not available");
      return;
    }

    setIsReviewPosted(true);

    console.log("Submitting Review:", rating);

    try {
      await client.graphql({
        query: createReview,
        variables: {
          input: rating,
        },
      });

      message.success("Review posted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      message.error("Failed to post review. Please try again.");
    } finally {
      handleCancel();
      fetchFilteredReviews(6);
      fetchProduct();
      fetchRelatedProducts();
      setIsReviewPosted(false);
    }
  };

  useEffect(() => {
    console.log("Fetched reviews", fetchedReviews);
  }, fetchedReviews);

  const draggleRef = useRef(null);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = (e) => {
    setOpen(false);
  };

  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  const switchTabs = async (e) => {
    // console.log("click ", e);
    setCurrent(e.key);

    if (e.key === "rating-reviews") {
      await fetchFilteredReviews(6);
    }
  };

  const sortButtonItems = [
    {
      label: "1st menu item",
      key: "1",
    },
    {
      label: "2nd menu item",
      key: "2",
    },
    {
      label: "3rd menu item",
      key: "3",
    },
    {
      label: "4rd menu item",
      key: "4",
    },
  ];

  const sortReviews = (e) => {
    message.info("Click on menu item.");
    // console.log("click", e);
  };

  const menuProps = {
    sortButtonItems,
    onClick: sortReviews,
  };

  const items = [
    {
      label: "Product Details",
      key: "product-details",
    },
    {
      label: "Rating & Reviews",
      key: "rating-reviews",
    },
    {
      label: "FAQs",
      key: "faqs",
    },
  ];

  useEffect(() => {
    fetchFilteredReviews(6);
  }, [id]);

  const maxQuantity = Number(fetchedProduct.quantity) || 1;
  const [count, setCount] = useState(1);

  const handleIncrement = () => {
    if (count < maxQuantity) {
      setCount(count + 1);
    }
  };

  const handleDecrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const addToCart = async () => {
    try {
      const existingCartResponse = await client.graphql({
        query: cartsByUserID,
        variables: { userID: userId },
      });
      // console.log("existing cart table rsponse", existingCartResponse);
      let cartID;

      if (existingCartResponse.data.cartsByUserID.items.length > 0) {
        cartID = existingCartResponse.data.cartsByUserID.items[0].id;
      } else {
        const newCartResponse = await client.graphql({
          query: createCart,
          variables: { input: { userID: userId, status: "active" } },
        });
        // console.log("cart response", newCartResponse);
        cartID = newCartResponse.data.createCart.id;
      }

      const addProductToCartResponse = await client.graphql({
        query: createCartItem,
        variables: {
          input: {
            cartID: cartID,
            productID: `${id}`,
            color: selectedColor,
            size: selectedSize,
            quantity: count,
            price: fetchedProduct.price,
          },
        },
      });
      // console.log("Added product to cart:", addProductToCartResponse);
      messageApi.open({
        type: "success",
        content: "Product Added to Cart !",
      });
    } catch (error) {
      console.error("Error in addToCart flow:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const handleProductDeleted = () => {
    fetchRelatedProducts();
  };

  const onSetFetchedProduct = (field, value) => {
    setFetchedProduct((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {contextHolder}

      <div className="flex flex-col gap-10 px-4 sm:px-8 lg:px-10 2xl:px-16 py-10">
        <div className="hidden 2xl:grid grid-cols-12 grid-rows-3 grid-flow-col gap-2 lg:gap-4 max-h-[750px]">
          {fetchedProduct.images?.map((image, index) => {
            const isLargeImage = index === 3;
            const spanClass = isLargeImage
              ? "col-span-4 row-span-3 "
              : "col-span-1 row-span-1";

            return (
              <div
                key={index}
                className={`w-full h-full rounded-3xl overflow-hidden hover:border hover:border-black cursor-pointer ${spanClass}`}
              >
                <StorageImage
                  alt={`image-${index}`}
                  path={image}
                  className="object-cover w-full h-full border"
                />
              </div>
            );
          })}

          <div className="col-span-7 row-span-3 px-4 xl:px-6">
            <div className="flex flex-col lg:gap-6">
              <div className="flex justify-between">
                <div className="font-semibold text-2xl sm:text-3xl xl:text-4xl 2xl:text-5xl leading-tight">
                  {fetchedProduct.title}
                </div>

                <EditFilled
                  className="text-2xl xl:text-3xl text-black"
                  onClick={openEditProductModal}
                />
              </div>

              <div className="flex items-center space-x-1">
                {/* Render filled stars */}
                {Array.from({
                  length: Math.floor(fetchedProduct.averageRating || 0),
                }).map((_, index) => (
                  <StarFilled
                    key={index}
                    style={{ color: "#ffca43", fontSize: "25px" }}
                  />
                ))}

                {/* Render half star if the rating has a decimal */}
                {fetchedProduct.averageRating % 1 !== 0 && (
                  <StarFilled
                    key="half"
                    style={{ color: "#ffca43", fontSize: "25px" }}
                    className="opacity-50"
                  />
                )}

                {/* Render empty stars if necessary */}
                {Array.from({
                  length: 5 - Math.ceil(fetchedProduct.averageRating || 0),
                }).map((_, index) => (
                  <StarFilled
                    key={index + Math.floor(fetchedProduct.averageRating || 0)}
                    style={{ color: "#d1d5db", fontSize: "25px" }}
                  />
                ))}

                {/* Display the rating */}
                <div className="text-sm text-gray-600">
                  {(fetchedProduct.averageRating || 0).toFixed(1)} / 5
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-2xl 2xl:text-3xl font-semibold">
                  ${discountedPrice}
                </div>
                <div className="text-2xl 2xl:text-3xl font-semibold line-through text-[#7c7b7b]">
                  ${fetchedProduct.price}
                </div>

                <Button
                  size="small"
                  color="danger"
                  variant="filled"
                  shape="round"
                >
                  -{fetchedProduct.discountPercentage}%
                </Button>
              </div>

              <div className="text-base sm:text-lg lg:text-base lg:text-xl text-[#7c7b7b] border-0 border-b pb-2 lg:pb-6">
                {fetchedProduct.description}
              </div>

              {/* Color Selection */}
              <div className="flex flex-col gap-3">
                <div className="text-base sm:text-lg lg:text-base lg:text-xl text-[#7c7b7b]">
                  Select Colors
                </div>
                <div className="flex border-0 border-b gap-4 pb-2 lg:pb-6">
                  {fetchedProduct.colors?.map((color, index) => (
                    <div
                      key={index}
                      className={`relative rounded-full min-h-8 min-w-8 cursor-pointer transition-all duration-300 ease-in-out flex justify-center items-center border border-black`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorSelect(color)}
                    >
                      {selectedColor === color && (
                        <CheckOutlined className="absolute text-white text-xl" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="flex flex-col gap-3">
                <div className="text-base sm:text-lg lg:text-base lg:text-xl text-[#7c7b7b]">
                  Choose Size
                </div>
                <div className="flex flex-wrap border-0 border-b gap-4 pb-2 lg:pb-6">
                  {fetchedProduct.sizes?.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => handleSizeSelect(size)}
                      className={`px-8 py-3 rounded-full transition-all duration-300 ease-in-out ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "bg-[#f0f0f0] text-black hover:text-white hover:bg-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex bg-[#f0f0f0] rounded-full">
                  <button
                    className="py-2 lg:py-2 px-4 rounded-l-full"
                    onClick={handleDecrement}
                  >
                    <MinusOutlined />
                  </button>
                  <div className="px-4 z-20 flex items-center">{count}</div>
                  <button
                    className="py-2 lg:py-2 px-4 rounded-r-full"
                    onClick={handleIncrement}
                  >
                    <PlusOutlined />
                  </button>
                </div>

                <Button
                  color="default"
                  variant="solid"
                  shape="round"
                  className="w-full py-6 text-lg"
                  onClick={addToCart}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="2xl:hidden grid grid-cols-6 lg:grid-cols-8 grid-rows-auto gap-4">
          <div className="col-span-6 lg:col-span-3 grid grid-cols-3 gap-4">
            {fetchedProduct.images?.map((image, index) => {
              const isLargeImage = index === 0;
              const spanClass = isLargeImage
                ? "col-span-3 h-fit border"
                : "col-span-1 h-fit border";

              return (
                <div
                  key={index}
                  className={`${spanClass} w-fit h-fit rounded-3xl overflow-hidden hover:border hover:border-black cursor-pointer`}
                >
                  <StorageImage
                    alt={`image-${index}`}
                    path={image}
                    className={
                      index === 0
                        ? "object-cover aspect-square h-fit"
                        : "object-cover h-fit"
                    }
                  />
                </div>
              );
            })}
          </div>

          <div className="col-span-6 lg:col-span-5">
            <div className="flex flex-col gap-4 ">
              <div className="flex justify-between">
                <div className="font-semibold text-2xl sm:text-3xl xl:text-4xl 2xl:text-5xl leading-tight">
                  {fetchedProduct.title}
                </div>

                <EditFilled
                  className="text-2xl xl:text-3xl text-black"
                  onClick={openEditProductModal}
                />
              </div>

              <div className="flex items-center space-x-1">
                {/* Render filled stars */}
                {Array.from({
                  length: Math.floor(fetchedProduct.averageRating || 0),
                }).map((_, index) => (
                  <StarFilled
                    key={index}
                    style={{ color: "#ffca43", fontSize: "25px" }}
                  />
                ))}

                {/* Render half star if the rating has a decimal */}
                {fetchedProduct.averageRating % 1 !== 0 && (
                  <StarFilled
                    key="half"
                    style={{ color: "#ffca43", fontSize: "25px" }}
                    className="opacity-50"
                  />
                )}

                {/* Render empty stars if necessary */}
                {Array.from({
                  length: 5 - Math.ceil(fetchedProduct.averageRating || 0),
                }).map((_, index) => (
                  <StarFilled
                    key={index + Math.floor(fetchedProduct.averageRating || 0)}
                    style={{ color: "#d1d5db", fontSize: "25px" }}
                  />
                ))}

                {/* Display the rating */}
                <div className="text-sm text-gray-600">
                  {(fetchedProduct.averageRating || 0).toFixed(1)} / 5
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-2xl 2xl:text-3xl font-semibold">
                  ${discountedPrice}
                </div>
                <div className="text-2xl 2xl:text-3xl font-semibold line-through text-[#7c7b7b]">
                  ${fetchedProduct.price}
                </div>

                <Button
                  size="small"
                  color="danger"
                  variant="filled"
                  shape="round"
                >
                  -{fetchedProduct.discountPercentage}%
                </Button>
              </div>

              <div className="text-base sm:text-lg lg:text-base xl:text-xl text-[#7c7b7b] border-0 border-b pb-4">
                {fetchedProduct.description}
              </div>

              {/* Color Selection */}
              <div className="flex flex-col gap-3">
                <div className="text-base sm:text-lg lg:text-base xl:text-xl text-[#7c7b7b]">
                  Select Colors
                </div>
                <div className="flex border-0 border-b gap-4 pb-4">
                  {fetchedProduct.colors?.map((color, index) => (
                    <div
                      key={index}
                      className={`relative rounded-full min-h-8 min-w-8 cursor-pointer transition-all duration-300 ease-in-out flex justify-center items-center border border-black`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorSelect(color)}
                    >
                      {selectedColor === color && (
                        <CheckOutlined className="absolute text-white text-xl" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="flex flex-col gap-3">
                <div className="text-base sm:text-lg lg:text-base xl:text-xl text-[#7c7b7b]">
                  Choose Size
                </div>
                <div className="flex flex-wrap border-0 border-b gap-4 pb-4">
                  {fetchedProduct.sizes?.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => handleSizeSelect(size)}
                      className={`px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "bg-[#f0f0f0] text-black hover:text-white hover:bg-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex bg-[#f0f0f0] rounded-full">
                  <button
                    className="px-4 py-2 rounded-l-full"
                    onClick={handleDecrement}
                  >
                    <MinusOutlined />
                  </button>
                  <div className="px-4 z-20 flex items-center">{count}</div>
                  <button
                    className="px-4 py-2 rounded-r-full"
                    onClick={handleIncrement}
                  >
                    <PlusOutlined />
                  </button>
                </div>

                <Button
                  color="default"
                  variant="solid"
                  shape="round"
                  className="w-full p-5 xl:p-6 text-lg"
                  onClick={addToCart}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Menu */}
        <div className="w-full mt-6 hidden md:block">
          <Menu
            onClick={switchTabs}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
            className="full-width-menu border text-base md:text-xl"
          />
        </div>

        <div className=" hidden md:block">
          {current === "product-details" && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl sm:text-2xl xl:text-3xl">
                Product Details
              </h2>
              <p className="text-base sm:text-lg lg:text-base xl:text-xl text-[#7c7b7b]">
                This is the content for the first section.
              </p>
            </div>
          )}

          {current === "rating-reviews" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-6 justify-between">
                <div className="text-xl sm:text-2xl xl:text-3xl flex gap-4 items-end">
                  All Reviews
                  <span className="text-base md:text-lg text-[#7c7b7b]">
                    {`(${fetchedReviews.length})`}
                  </span>
                </div>

                <div className="flex gap-1 md:gap-2">
                  <Button
                    type="default"
                    shape="circle"
                    icon={<FilterOutlined />}
                    size="large"
                    className="p-5"
                  />

                  <Dropdown menu={menuProps}>
                    <Button shape="round" className="py-5 text-lg ">
                      <Space>
                        Latest
                        <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>

                  <button
                    className="w-full px-6 py-2 !text-base md:text-lg rounded-full bg-black text-white hover:bg-gray-800 flex flex-nowrap"
                    onClick={showModal}
                  >
                    Write a Review
                  </button>
                </div>
              </div>

              {loadingReviews ? (
                <div className="flex justify-center items-center p-6">
                  <Spin />
                </div>
              ) : (
                <>
                  <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {fetchedReviews.map((review) => (
                      <div
                        key={review.id}
                        className="col-span-1 border rounded-xl flex flex-col p-6 space-y-5"
                      >
                        {/* Rating and Options */}
                        <div className="flex justify-between">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <StarFilled
                                key={i}
                                style={{
                                  color:
                                    i < Math.round(review.rating)
                                      ? "#ffca43"
                                      : "#e4e4e4",
                                  fontSize: "25px",
                                }}
                              />
                            ))}
                          </div>

                          <EllipsisOutlined
                            style={{ color: "#000000", fontSize: "25px" }}
                          />
                        </div>

                        {/* User Info */}
                        <div className="flex gap-2">
                          User {review.userID.substring(0, 6)}...
                          <CheckCircleFilled
                            style={{ color: "#42c066", fontSize: "25px" }}
                          />
                        </div>

                        {/* Comment */}
                        <div>"{review.comment}"</div>

                        {/* Created At */}
                        <div>
                          Posted on{" "}
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {!allReviewsFetched && !loadingReviews && (
                    <div className="flex justify-center p-6">
                      <Button
                        color="default"
                        variant="outlined"
                        shape="round"
                        className="py-6 text-lg border"
                        onClick={handleLoadMore}
                      >
                        Load more Reviews
                      </Button>
                    </div>
                  )}

                  {/* Disable button and show loading state if all reviews are fetched or in progress */}
                  {allReviewsFetched && (
                    <div className="flex justify-center p-6">
                      <Button
                        color="default"
                        variant="outlined"
                        shape="round"
                        className="py-6 text-lg border"
                        onClick={() => fetchFilteredReviews(6)}
                      >
                        Show Less Reviews
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {current === "faqs" && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl sm:text-2xl xl:text-3xl">
                Frequently asked questiosn
              </h2>
              <p className="text-base sm:text-lg lg:text-base xl:text-xl text-[#7c7b7b]">
                This is the content for the third section.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 md:hidden border-0 border-t py-10">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="text-xl sm:text-2xl xl:text-3xl flex gap-4 items-end">
              All Reviews
              <span className="text-base md:text-lg text-[#7c7b7b]">
                {`(${fetchedReviews.length})`}
              </span>
            </div>

            <div className="flex gap-1 md:gap-2">
              <Button
                type="default"
                shape="circle"
                icon={<FilterOutlined />}
                size="large"
                className="p-5"
              />

              <Dropdown menu={menuProps}>
                <Button shape="round" className="py-5 text-lg ">
                  <Space>
                    Latest
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>

              <button
                className="w-full lg:w-40 2xl:w-52 py-2 text-base md:text-lg rounded-full bg-black text-white hover:bg-gray-800"
                onClick={showModal}
              >
                Write a Review
              </button>
            </div>
          </div>

          {loadingReviews ? (
            <div className="flex justify-center items-center p-6">
              <Spin />
            </div>
          ) : (
            <>
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {fetchedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="col-span-1 border rounded-xl flex flex-col p-6 space-y-5"
                  >
                    <div className="flex justify-between">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <StarFilled
                            key={i}
                            style={{
                              color:
                                i < Math.round(review.rating)
                                  ? "#ffca43"
                                  : "#e4e4e4",
                              fontSize: "25px",
                            }}
                          />
                        ))}
                      </div>

                      <EllipsisOutlined
                        style={{ color: "#000000", fontSize: "25px" }}
                      />
                    </div>

                    <div className="flex gap-2">
                      User {review.userID.substring(0, 6)}...
                      <CheckCircleFilled
                        style={{ color: "#42c066", fontSize: "25px" }}
                      />
                    </div>

                    <div>"{review.comment}"</div>

                    <div>
                      Posted on{" "}
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {!allReviewsFetched && !loadingReviews && (
                <div className="flex justify-center p-6">
                  <Button
                    color="default"
                    variant="outlined"
                    shape="round"
                    className="py-6 text-lg border"
                    onClick={handleLoadMore}
                  >
                    Load more Reviews
                  </Button>
                </div>
              )}

              {allReviewsFetched && (
                <div className="flex justify-center p-6">
                  <Button
                    color="default"
                    variant="outlined"
                    shape="round"
                    className="py-6 text-lg border"
                    onClick={() => fetchFilteredReviews(6)}
                  >
                    Show Less Reviews
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <ProductCards
          loadingNewArrivals={loadingRelatedProducts}
          newArrivals={relatedProducts}
          viewProduct={viewProduct}
          title="You might also like"
          linkState={{
            from: "product",
            category: `${fetchedProduct.category}`,
          }}
          onProductDeleted={handleProductDeleted}
        />
      </div>

      <AddReviewModal
        isVisible={open}
        onCancel={handleCancel}
        onReview={handlePostReview}
        isReviewPosted={isReviewPosted}
      />

      <EditProductModal
        isVisible={isEditProductModalVisible}
        onCancel={closeEditProductModal}
        fetchedProduct={fetchedProduct}
        onSetFetchedProduct={onSetFetchedProduct}
        isProductEditingPending={isProductEditingPending}
        onSubmit={handleEditProduct}
      />

      {/* <Modal
        title="Edit Product"
        centered
        open={isEditProductModalVisible}
        onCancel={closeEditProductModal}
        footer={[
          <div className="flex justify-end gap-4">
            <Button key="cancel" onClick={closeEditProductModal}>
              Cancel
            </Button>
            <div>
              {isProductEditingPending ? (
                <Spin />
              ) : (
                <Button
                  key="submit"
                  color="default"
                  variant="solid"
                  onClick={handleEditProduct}
                >
                  Save Changes
                </Button>
              )}
            </div>
          </div>,
        ]}
        width={1200}
        className="mt-10 px-4"
      >
        <Form form={form} layout="vertical" initialValues={fetchedProduct}>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="pt-4 md:py-4 flex flex-col md:w-1/2">
              <Form.Item
                label="Product Title"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Please enter the product title!",
                  },
                ]}
              >
                <Input
                  placeholder="Product title"
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="Product Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please enter the product description!",
                  },
                ]}
              >
                <textarea
                  className="w-full !min-h-32 border rounded-md py-2 px-3"
                  placeholder="Product description"
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item
                label="Product Category"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Please select a product category!",
                  },
                ]}
              >
                <Select
                  placeholder="Select a category"
                  onChange={(value) => handleInputChange("category", value)}
                >
                  <Select.Option value="casual">Casual</Select.Option>
                  <Select.Option value="formal">Formal</Select.Option>
                  <Select.Option value="party">Party</Select.Option>
                  <Select.Option value="gym">Gym</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Brand"
                name="brand"
                rules={[
                  {
                    required: true,
                    message: "Please enter the product brand!",
                  },
                ]}
              >
                <Input
                  placeholder="Product brand"
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="Product Price"
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Please enter the product price!",
                  },
                ]}
              >
                <Input
                  addonBefore="USD"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  onChange={(e) => handleInputChange("price", e.target.value)}
                />
              </Form.Item>
            </div>
            <div className="pb-4 md:py-4 flex flex-col gap-3 md:w-1/2">
              <Form.Item label="Discount (Optional)" name="discountPercentage">
                <Input
                  addonAfter="%"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  onChange={(e) =>
                    handleInputChange("discountPercentage", e.target.value)
                  }
                />
              </Form.Item>

              <Form.Item
                label="Product Sizes"
                name="sizes"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one product size!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Please add product sizes"
                  options={productSizes}
                  onChange={(value) => handleInputChange("sizes", value)}
                />
              </Form.Item>

              <Form.Item
                label="Colors Available"
                name="colors"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one color!",
                  },
                ]}
              >
                <MultiColorPicker
                  onColorChange={(colors) => {
                    console.log("colrs changed in the compoennt", colors);
                    handleInputChange("colors", colors);
                  }}
                  getProductColors={fetchedProduct.colors}
                />
              </Form.Item>

              <Form.Item
                label="Product Quantity"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Please enter the product quantity!",
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  onChange={(e) =>
                    handleInputChange("quantity", e.target.value)
                  }
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal> */}
    </>
  );
};

export default ProductPage;
