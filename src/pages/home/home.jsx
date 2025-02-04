import React, { useContext, useEffect, useState } from "react";
import HomePageImage from "@/assets/main.png";
import smallSparkle from "@/assets/small-sparkle.png";
import bigSparkle from "@/assets/big-sparkle.png";
import versace from "@/assets/versace.png";
import zara from "@/assets/zara.png";
import gucci from "@/assets/gucci.png";
import prada from "@/assets/prada.png";
import calvinKlein from "@/assets/calvin-klein.png";
import {
  StarFilled,
  SwapLeftOutlined,
  SwapRightOutlined,
  CheckCircleFilled,
  EllipsisOutlined,
} from "@ant-design/icons";
import casual from "@/assets/casual.png";
import formal from "@/assets/formal.png";
import party from "@/assets/party.png";
import gym from "@/assets/gym.png";
import { listProducts } from "@/graphql/queries";
import { Divider } from "antd";
import { generateClient } from "aws-amplify/api";
import { fetchTopRatedProducts, listReviews } from "../../graphql/queries";
import { useNavigate } from "react-router-dom";
import ProductCards from "../../components/productCards/productCards";
import { v4 as uuid } from "uuid";
import { ProductContext } from "../../context/productContext/productContext";

const HomePage = () => {
  const client = generateClient();
  const navigate = useNavigate();

  const { refreshProducts } = useContext(ProductContext);

  const [loadingNewArrivals, setLoadingNewArrivals] = useState(false);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loadingTopRated, setLoadingTopRated] = useState(false);
  const [topRated, setTopRated] = useState([]);

  const [loadingReviews, setLoadingReviews] = useState(true);
  const [fetchedReviews, setFetchedReviews] = useState([]);
  const [allReviewsFetched, setAllReviewsFetched] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalReviews = fetchedReviews.length;
  const reviewsToShow = fetchedReviews.length > 0 ? fetchedReviews : [];

  useEffect(() => {
    fetchNewArrivals();
    fetchTopRated();
  }, [refreshProducts]);

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(currentIndex === 0 ? totalReviews - 2 : currentIndex - 2);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(currentIndex === totalReviews ? 2 : currentIndex + 2);
  };

  useEffect(() => {
    setTimeout(() => setIsTransitioning(false), 200);
  }, [currentIndex]);

  const reviewsToDisplay = [
    reviewsToShow[totalReviews - 1],
    ...reviewsToShow,
    reviewsToShow[0],
  ];

  const fetchNewArrivals = async (limit = 4) => {
    setLoadingNewArrivals(true);

    try {
      const newArrivalsResponse = await client.graphql({
        query: listProducts,
        variables: {
          limit: limit,
          sortDirection: "DESC",
        },
      });

      const lambdaResponse = await client.graphql({
        query: fetchTopRatedProducts,
      });

      const { allProducts } = lambdaResponse.data.fetchTopRatedProducts;

      if (newArrivalsResponse?.data?.listProducts?.items.length > 0) {
        const updatedNewArrivals =
          newArrivalsResponse.data.listProducts.items.map((product) => {
            const productRating = allProducts.find(
              (item) => item.productID === product.id
            )?.averageRating;

            return {
              ...product,
              averageRating: productRating || null,
            };
          });

        setNewArrivals(updatedNewArrivals);
      } else {
        const updatedNewArrivals =
          newArrivalsResponse.data.listProducts.items.map((product) => {
            return {
              ...product,
              averageRating: 0,
            };
          });

        setNewArrivals(updatedNewArrivals);
      }
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
    } finally {
      setLoadingNewArrivals(false);
    }
  };

  const fetchTopRated = async () => {
    setLoadingTopRated(true);

    try {
      const lambdaResponse = await client.graphql({
        query: fetchTopRatedProducts,
      });

      const { topRatedProducts, allProducts } =
        lambdaResponse.data.fetchTopRatedProducts;

      console.log("toprated oproducts", topRatedProducts);

      if (topRatedProducts.length > 0) {
        const filter = {
          or: topRatedProducts.map((product) => ({
            id: { eq: product.productID },
          })),
        };

        console.log("filtersss", filter);

        const topRatedResponse = await client.graphql({
          query: listProducts,
          variables: {
            filter,
          },
        });

        console.log("topRated Products Resposne", topRatedResponse);

        if (topRatedResponse?.data?.listProducts?.items) {
          const updatedTopRated = topRatedResponse.data.listProducts.items.map(
            (product) => {
              const rating = topRatedProducts.find(
                (item) => item.productID === product.id
              ).averageRating;

              return {
                ...product,
                averageRating: rating,
              };
            }
          );

          console.log("updatedTopRatedProductsss", updatedTopRated);

          setTopRated(updatedTopRated);
        }
      } else {
        console.log("hello");
        const topRatedResponse = await client.graphql({
          query: listProducts,
          variables: {
            limit: 4,
          },
        });

        console.log("topRated Products Resposne", topRatedResponse);

        if (topRatedResponse?.data?.listProducts?.items) {
          const updatedTopRated = topRatedResponse.data.listProducts.items.map(
            (product) => {
              return {
                ...product,
                averageRating: 0,
              };
            }
          );

          console.log("updatedTopRatedProductsss", updatedTopRated);

          setTopRated(updatedTopRated);
        }
      }
    } catch (error) {
      console.error("Error fetching top-rated products:", error);
    } finally {
      setLoadingTopRated(false);
    }
  };

  useEffect(() => {
    console.log("topRated State chnage", topRated);
  }, [topRated]);

  const fetchTopReviews = async (limit = 20) => {
    setLoadingReviews(true);

    try {
      const reviewsResponse = await client.graphql({
        query: listReviews,
        variables: {
          filter: {
            rating: { eq: 5 },
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
  };

  const loadPageContent = async () => {
    await fetchNewArrivals();
    await fetchTopRated();
    await fetchTopReviews();
  };

  useEffect(() => {
    loadPageContent();
  }, []);

  function viewProduct(id) {
    navigate(`/product/${id}`);
  }

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row justify-between px-4 sm:px-8 lg:px-10 2xl:px-16 bg-[#f2f0f1]">
        <div className="relative flex items-center w-full lg:w-2/4 py-4 sm:py-0 xl:p-4">
          <div className="bg-transparent space-y-8">
            <div className="font-semibold text-4xl sm:text-5xl xl:text-6xl 2xl:text-7xl leading-tight">
              FIND CLOTHES THAT MATCHES YOUR STYLE
            </div>

            <div className="text-base sm:text-lg 2xl:text-xl text-[#7c7b7b]">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense
              of style.
            </div>

            <button className="w-full lg:w-40 2xl:w-52 py-2 2xl:py-4 text-base md:text-lg font-semibold rounded-full bg-black text-white hover:bg-gray-800">
              Shop Now
            </button>

            <div className="flex flex-col w-fit place-self-center sm:flex-row sm:justify-between sm:place-self-start gap-4 sm:gap-2 2xl:gap-3">
              <div className="flex flex-col items-center sm:items-start justify-center space-y-2 w-full sm:w-fit">
                <div className="text-4xl 2xl:text-5xl font-semibold">200+</div>
                <div className="text-base xl:text-lg 2xl:text-xl text-[#7c7b7b]">
                  International Brands
                </div>
              </div>

              <div className="border border-[#e6e4e5] self-stretch"></div>

              <div className="flex flex-col items-center sm:items-start justify-center space-y-2 w-full sm:w-fit">
                <div className="text-4xl 2xl:text-5xl font-semibold">
                  2,000+
                </div>
                <div className="text-base xl:text-lg 2xl:text-xl text-[#7c7b7b]">
                  High-Quality Products
                </div>
              </div>

              <div className="border border-[#e6e4e5] self-stretch"></div>

              <div className="flex flex-col items-center sm:items-start justify-center space-y-2 w-full sm:w-fit">
                <div className="text-4xl 2xl:text-5xl font-semibold">
                  30,000+
                </div>
                <div className="text-base xl:text-lg text-[#7c7b7b]">
                  Happy Customers
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-fit flex self-center relative">
          <img
            src={HomePageImage}
            alt="Home Page Images"
            className="relative object-cover h-[550px] sm:h-[600px] xl:h-[700px]"
          />

          <img
            src={smallSparkle}
            alt="Home Page Images"
            className="absolute top-32 left-0 size-14 sm:size-20 xl:size-38 sm:top-40 sm:left-2 lg:top-40
          xl:top-52 xl:left-4 2xl:top-56 2xl:left-2"
          />

          <img
            src={bigSparkle}
            alt="Home Page Images"
            className="absolute top-8 right-0 size-20 sm:size-28
          xl:size-32 sm:top-6 sm:right-2 lg:top-4 lg:-ml-24 xl:top-6
          xl:right-4 2xl:mt-2"
          />
        </div>
      </div>

      <div className="grid xl:hidden grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-y-10 bg-black py-8 px-4 sm:px-8 lg:px-10 2xl:px-16 ">
        <div className="col-span-1 flex justify-center items-center">
          <img
            src={versace}
            alt="Versace"
            className="object-contain h-[40px]"
          />
        </div>

        <div className="col-span-1 flex justify-center items-center">
          <img src={zara} alt="Zara" className="object-contain h-[40px]" />
        </div>

        <div className="col-span-1 flex justify-center items-center">
          <img src={gucci} alt="Gucci" className="object-contain h-[40px]" />
        </div>

        <div className="col-span-1 flex justify-center items-center">
          <img src={prada} alt="Prada" className="object-contain h-[40px]" />
        </div>

        <div className="hidden md:block lg:hidden w-full bg-black p-4 text-center"></div>

        <div className="col-span-1 flex justify-center items-center">
          <img
            src={calvinKlein}
            alt="Calvin Klein"
            className="object-contain h-[40px]"
          />
        </div>
      </div>

      <div className="hidden xl:flex flex-wrap justify-between items-center gap-y-6 bg-black py-8 px-4 sm:px-8 lg:px-10 2xl:px-16 ">
        <div className="flex justify-center items-center w-fit">
          <img
            src={versace}
            alt="Versace"
            className="object-contain h-[40px]"
          />
        </div>

        <div className="flex justify-center items-center w-fit">
          <img src={zara} alt="Zara" className="object-contain h-[40px]" />
        </div>

        <div className="flex justify-center items-center w-fit">
          <img src={gucci} alt="Gucci" className="object-contain h-[40px]" />
        </div>

        <div className="flex justify-center items-center w-fit">
          <img src={prada} alt="Prada" className="object-contain h-[40px]" />
        </div>

        <div className="flex justify-center items-center w-fit">
          <img
            src={calvinKlein}
            alt="Calvin Klein"
            className="object-contain h-[40px]"
          />
        </div>
      </div>

      <ProductCards
        loadingNewArrivals={loadingNewArrivals}
        newArrivals={newArrivals}
        viewProduct={viewProduct}
        title="NEW ARRIVALS"
        linkState={{ from: "new-arrivals", category: "new-arrivals" }}
      />

      <Divider />

      <ProductCards
        loadingNewArrivals={loadingTopRated}
        newArrivals={topRated}
        viewProduct={viewProduct}
        title="TOP SELLING"
        linkState={{ from: "top-selling", category: "new-arrivals" }}
      />

      <div className="bg-[#f0f0f0] rounded-3xl mx-4 md:mx-8 xl:mx-20 2xl:mx-40 px-4 py-8 sm:p-12 xl:p-20 space-y-20">
        <div className="text-center text-4xl">BROWSE BY dress STYLE</div>

        <div className="grid grid-rows-2 bg-[#f0f0f0] gap-6">
          <div className="row-span-1 grid grid-cols-5 gap-6 h-fit lg:h-[300px]">
            <div className="col-span-5 lg:col-span-2 h-[200px] sm:h-[300px] lg:h-full bg-white rounded-3xl flex justify-between overflow-hidden relative">
              <img
                src={casual}
                alt="Casual"
                className="object-contain sm:object-cover w-full h-full transform -scale-x-100 relative"
              />
              <div className="text-2xl sm:text-4xl bg-white p-4 sm:p-8 absolute top-0">
                Casual
              </div>
            </div>
            <div className="col-span-5 lg:col-span-3 h-[200px] sm:h-[300px] lg:h-full bg-white rounded-3xl flex justify-between overflow-hidden relative">
              <img
                src={formal}
                alt="Formal"
                className="object-contain sm:object-cover w-full h-full transform -scale-x-100 realtive"
              />
              <div className="text-2xl sm:text-4xl bg-white p-4 sm:p-8 absolute top-0">
                Formal
              </div>
            </div>
          </div>

          <div className="row-span-1 grid grid-cols-5 gap-6 h-fit lg:h-[300px]">
            <div className="col-span-5 lg:col-span-3 h-[200px] sm:h-[300px] lg:h-full bg-white rounded-3xl flex justify-between overflow-hidden">
              <div className="w-fit text-2xl sm:text-4xl bg-white p-4 sm:p-8">
                Party
              </div>
              <img
                src={party}
                alt="Party"
                className="object-contain sm:object-cover"
              />
            </div>
            <div className="col-span-5 lg:col-span-2 h-[200px] sm:h-[300px] lg:h-full bg-white rounded-3xl flex justify-between overflow-hidden">
              <div className="w-fit text-2xl sm:text-4xl bg-white p-4 sm:p-8">
                Gym
              </div>
              <img
                src={gym}
                alt="Gym"
                className="object-contain sm:object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-16 px-4 sm:px-8 lg:px-10 2xl:px-16 p-16">
        <div className="flex justify-between">
          <div className="text-4xl">OUR HAPPY CUSTOMERS</div>

          <div className="flex gap-4">
            <SwapLeftOutlined
              onClick={goToPrevious}
              style={{ fontSize: "25px", cursor: "pointer" }}
            />
            <SwapRightOutlined
              onClick={goToNext}
              style={{ fontSize: "25px", cursor: "pointer" }}
            />
          </div>
        </div>

        {/* Slider with Infinite Loop and Smooth Transition */}
        <div className="overflow-hidden">
          <div
            className="flex transition-all ease-in-out"
            style={{
              transform: `translateX(-${
                (currentIndex / reviewsToDisplay.length) * 100
              }%)`,
              transitionDuration: "0.5s",
            }}
          >
            {loadingReviews
              ? Array(20)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={uuid()}
                      className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 p-4 animate-pulse"
                    >
                      <div className="border rounded-xl bg-gray-100 p-6 space-y-5">
                        <div className="flex justify-between">
                          <div className="flex gap-1">
                            {Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <div
                                  key={uuid()}
                                  className="h-6 w-6 bg-gray-300 rounded-full"
                                />
                              ))}
                          </div>
                          <div className="h-6 w-6 bg-gray-300 rounded-full" />
                        </div>
                        <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
                        <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
                        <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  ))
              : reviewsToDisplay.map((review, index) => (
                  <div
                    key={uuid()}
                    className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 p-4"
                  >
                    <div className="border rounded-xl flex flex-col p-6 space-y-5">
                      <div className="flex justify-between">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <StarFilled
                              key={uuid()}
                              style={{
                                color:
                                  i < Math.round(review?.rating || 0)
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
                        User {review?.userID?.substring(0, 6)}...
                        <CheckCircleFilled
                          style={{ color: "#42c066", fontSize: "25px" }}
                        />
                      </div>
                      <div className="text-gray-700">{review?.comment}</div>
                      <div className="text-gray-500 text-sm">
                        Posted on{" "}
                        {new Date(review?.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            {allReviewsFetched &&
              !loadingReviews &&
              fetchedReviews.length === 0 && (
                <div className="text-center text-gray-500 mt-4">
                  No reviews found for this filter.
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
