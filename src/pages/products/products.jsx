import React, { useEffect, useState } from "react";
import {
  StarFilled,
  FilterOutlined,
  CheckOutlined,
  ArrowRightOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { Menu, Select, Button, Slider, Spin, message } from "antd";
import "./products.css";
import Pagination from "@/components/pagination/pagination";
import { listProducts } from "../../graphql/queries";
import { generateClient } from "aws-amplify/api";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { useNavigate, useLocation } from "react-router-dom";
import { listProductFilters } from "../../graphql/customQueries";
import { fetchTopRatedProducts } from "../../graphql/queries";
import { deleteProduct } from "../../graphql/mutations";

const Products = () => {
  const client = generateClient();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);

  const [menuOpen, setMenuOpen] = useState(true);
  const [products, setProducts] = useState([]);

  const [minPriceFilters, setMinPriceFilters] = useState(0);
  const [maxPriceFilters, setMaxPriceFilters] = useState(1000);

  const [colorFilters, setColorFilters] = useState([]);
  const [sizeFilters, setSizeFilters] = useState([]);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const [selectedFilters, setSelectedFilters] = useState({});
  const [priceRange, setPriceRange] = useState([20, 50]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [shownProductsType, setShownProductsType] = useState("Casual");

  useEffect(() => {
    if (location.state) {
      const { key, value } = location.state;

      console.log("This is recieved here", key, value);

      switch (key) {
        case "new-arrivals":
          console.log("hello");
          break;
        case "top-rated":
          console.log("hello");
          break;
        case "category":
          console.log("hello");
          break;
        case "search":
          setShownProductsType(`${value}`);
          break;
        default:
          console.log("Unknown navigation type");
      }

      window.history.replaceState({}, document.title);
    } else {
      console.log("hello");
    }
  }, [location]);

  const handleMenuClick = (e) => {
    const { key } = e;

    console.log("keyuuuuuuuuuuuuuuu", key);

    // Parse the key into filterCategory and filterValue
    const keyParts = key.split("-");
    let filterCategory, filterValue;

    if (keyParts.length === 2) {
      [filterCategory, filterValue] = keyParts;
    } else if (keyParts.length === 3) {
      filterCategory = keyParts[0];
      filterValue = `${keyParts[1]}-${keyParts[2]}`;
    } else {
      return; // Invalid key format
    }

    setSelectedFilters((prevFilters) => {
      const updatedFilters = JSON.parse(JSON.stringify(prevFilters)); // Deep copy

      // Handle brand filters (tshirts, shorts, shirts, hoodies, jeans)
      if (
        ["tshirts", "shorts", "shirts", "hoodies", "jeans"].includes(
          filterCategory
        )
      ) {
        // Initialize the brands object if it doesn't exist
        if (!updatedFilters.brands) {
          updatedFilters.brands = {};
        }

        // Initialize the specific brand category if it doesn't exist
        if (!updatedFilters.brands[filterCategory]) {
          updatedFilters.brands[filterCategory] = [];
        }

        // Toggle the filter value in the array
        const index =
          updatedFilters.brands[filterCategory].indexOf(filterValue);
        if (index > -1) {
          // Remove the value if it already exists
          updatedFilters.brands[filterCategory].splice(index, 1);
        } else {
          // Add the value if it doesn't exist
          updatedFilters.brands[filterCategory].push(filterValue);
        }

        // Clean up empty arrays and objects
        if (updatedFilters.brands[filterCategory].length === 0) {
          delete updatedFilters.brands[filterCategory];
        }
        if (Object.keys(updatedFilters.brands).length === 0) {
          delete updatedFilters.brands;
        }
      }

      // Handle dressStyle filters
      else if (filterCategory === "dressStyle") {
        // Initialize the dressStyle object if it doesn't exist
        if (!updatedFilters.dressStyle) {
          updatedFilters.dressStyle = {};
        }

        const styleType = keyParts[1]; // Extract style type (Casual, Formal, etc.)
        if (!updatedFilters.dressStyle[styleType]) {
          updatedFilters.dressStyle[styleType] = [];
        }

        // Toggle the filter value in the array
        const index = updatedFilters.dressStyle[styleType].indexOf(keyParts[2]);
        if (index > -1) {
          // Remove the value if it already exists
          updatedFilters.dressStyle[styleType].splice(index, 1);
        } else {
          // Add the value if it doesn't exist
          updatedFilters.dressStyle[styleType].push(keyParts[2]);
        }

        // Clean up empty arrays and objects
        if (updatedFilters.dressStyle[styleType].length === 0) {
          delete updatedFilters.dressStyle[styleType];
        }
        if (Object.keys(updatedFilters.dressStyle).length === 0) {
          delete updatedFilters.dressStyle;
        }
      }

      return updatedFilters;
    });
  };

  const onChange = (value) => {
    setPriceRange(value);
  };

  const onChangeComplete = () => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      price: priceRange, // Price is handled directly (not as an array)
    }));
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      updatedFilters.color = color; // Color is handled directly (not as an array)
      return updatedFilters;
    });
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      updatedFilters.size = size; // Size is handled directly (not as an array)
      return updatedFilters;
    });
  };

  const toggleMenu = (e) => {
    console.log("clicked");

    setMenuOpen((prev) => !prev);
  };

  // const onChange = (value) => {
  //   console.log("onChange: ", value);
  // };

  // const onChangeComplete = (value) => {
  //   console.log("onChangeComplete: ", value);
  // };

  // const listAllProducts = async () => {
  //   setLoading(true);

  //   const allProducts = await client.graphql({ query: listProducts });

  //   setProducts(allProducts.data.listProducts.items);

  //   setLoading(false);
  // };

  const listAllProducts = async (page = 1) => {
    setLoading(true);
    try {
      let products = [];
      let nextToken = null;

      // Calculate the starting token for the desired page
      for (let i = 1; i < page; i++) {
        const response = await client.graphql({
          query: listProducts,
          variables: { limit: 5 },
        });
        nextToken = response.data.listProducts.nextToken;
        if (!nextToken) break; // Stop if there are no more pages
      }

      // console.log("Value",response?.data?.listProducts.items.length)
      const response = await client.graphql({
        query: listProducts,
        variables: { limit: 5, nextToken },
      });

      const lambdaResponse = await client.graphql({
        query: fetchTopRatedProducts,
      });

      const { allProducts } = lambdaResponse.data.fetchTopRatedProducts;

      if (response.data.listProducts.items.length > 0) {
        const updatedNewArrivals = response.data.listProducts.items.map(
          (product) => {
            const productRating = allProducts.find(
              (item) => item.productID === product.id
            )?.averageRating;

            return {
              ...product,
              averageRating: productRating || 0,
            };
          }
        );

        setProducts(updatedNewArrivals);
      } else {
        const updatedNewArrivals =
          newArrivalsResponse.data.listProducts.items.map((product) => {
            return {
              ...product,
              averageRating: 0,
            };
          });

        setProducts(updatedNewArrivals);
      }

      // Fetch the desired page
      const fetchAllProducts = await client.graphql({
        query: listProducts,
      });

      setTotalCount(fetchAllProducts.data.listProducts.items.length);

      // Update totalPages based on totalCount
      setTotalPages(
        Math.ceil(fetchAllProducts.data.listProducts.items.length / 5)
      );
    } catch (error) {
      console.error("Error fetching all products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(selectedFilters).length > 0) {
      // If selectedFilters are applied, fetch filtered products

      console.log("selected filter to make the requestsssss", selectedFilters);

      listFilteredProducts(selectedFilters, currentPage);
    } else {
      // Otherwise, fetch all products
      listAllProducts(currentPage);
    }
  }, [selectedFilters, currentPage]);

  useEffect(() => {
    listAllProducts();
  }, []);

  useEffect(() => {
    console.log("All products Fetched: ", products);
  }, [products]);

  const filters = [
    {
      key: "tshirts",
      label: "T Shirts",
      children: [
        { key: "tshirts-Versace", label: "Versace" },
        { key: "tshirts-Zara", label: "Zara" },
        { key: "tshirts-Gucci", label: "Gucci" },
        { key: "tshirts-Prada", label: "Prada" },
        { key: "tshirts-Calvin Klein", label: "Calvin Klein" },
      ],
    },
    {
      key: "shorts",
      label: "Shorts",
      children: [
        { key: "shorts-Versace", label: "Versace" },
        { key: "shorts-Zara", label: "Zara" },
        { key: "shorts-Gucci", label: "Gucci" },
        { key: "shorts-Prada", label: "Prada" },
        { key: "shorts-Calvin Klein", label: "Calvin Klein" },
      ],
    },
    {
      key: "shirts",
      label: "Shirts",
      children: [
        { key: "shirts-Versace", label: "Versace" },
        { key: "shirts-Zara", label: "Zara" },
        { key: "shirts-Gucci", label: "Gucci" },
        { key: "shirts-Prada", label: "Prada" },
        { key: "shirts-Calvin Klein", label: "Calvin Klein" },
      ],
    },
    {
      key: "hoodies",
      label: "Hoodies",
      children: [
        { key: "hoodies-Versace", label: "Versace" },
        { key: "hoodies-Zara", label: "Zara" },
        { key: "hoodies-Gucci", label: "Gucci" },
        { key: "hoodies-Prada", label: "Prada" },
        { key: "hoodies-Calvin Klein", label: "Calvin Klein" },
      ],
    },
    {
      key: "jeans",
      label: "Jeans",
      children: [
        { key: "jeans-Versace", label: "Versace" },
        { key: "jeans-Zara", label: "Zara" },
        { key: "jeans-Gucci", label: "Gucci" },
        { key: "jeans-Prada", label: "Prada" },
        { key: "jeans-Calvin Klein", label: "Calvin Klein" },
      ],
    },
    { type: "divider" },
    {
      key: "price",
      label: "Price",
      className: "custom-font-style",
      children: [
        {
          key: "price-range",
          className: "custom-menu-item",
          label: (
            <Slider
              range
              step={10}
              defaultValue={[20, 50]}
              onChange={onChange}
              onChangeComplete={onChangeComplete}
            />
          ),
        },
      ],
    },
    {
      key: "color",
      label: "Colors",
      className: "custom-font-style",
      children: [
        {
          key: "color-picker",
          className: "custom-menu-item",
          label: (
            <div className="flex flex-wrap gap-3">
              {colorFilters.map(
                (
                  color // Make sure colorFilters is defined in your component
                ) => (
                  <div
                    key={color}
                    className={`relative rounded-full min-h-8 min-w-8 cursor-pointer transition-all duration-300 ease-in-out flex justify-center items-center border border-black`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)} // Make sure handleColorSelect is defined
                  >
                    {selectedColor === color && (
                      <CheckOutlined className="absolute text-white text-xl" />
                    )}
                  </div>
                )
              )}
            </div>
          ),
        },
      ],
    },
    {
      key: "size",
      label: "Size",
      className: "custom-font-style",
      children: [
        {
          key: "size-selector",
          className: "custom-menu-item",
          label: (
            <div className="w-full flex flex-wrap gap-4 pb-4">
              {sizeFilters.map(
                (
                  size // Make sure sizeFilters is defined in your component
                ) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)} // Make sure handleSizeSelect is defined
                    className={`px-4 py-2 rounded-full transition-all duration-300 ease-in-out text-sm cursor-pointer ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "bg-[#f0f0f0] text-black hover:text-white hover:bg-black"
                    }`}
                  >
                    {size}
                  </button>
                )
              )}
            </div>
          ),
        },
      ],
    },
    {
      key: "dressStyle",
      label: "Dress Style",
      className: "custom-font-style",
      children: [
        {
          key: "dressStyle-Casual",
          label: "Casual",
          children: [
            { key: "dressStyle-Casual-tshirts", label: "T-shirts" },
            { key: "dressStyle-Casual-shorts", label: "Shorts" },
            { key: "dressStyle-Casual-shirts", label: "Shirts" },
            { key: "dressStyle-Casual-hoodies", label: "Hoodies" },
            { key: "dressStyle-Casual-jeans", label: "Jeans" },
          ],
        },
        {
          key: "dressStyle-Formal",
          label: "Formal",
          children: [
            { key: "dressStyle-Formal-tshirts", label: "T-shirts" },
            { key: "dressStyle-Formal-shorts", label: "Shorts" },
            { key: "dressStyle-Formal-shirts", label: "Shirts" },
            { key: "dressStyle-Formal-hoodies", label: "Hoodies" },
            { key: "dressStyle-Formal-jeans", label: "Jeans" },
          ],
        },
        {
          key: "dressStyle-Party",
          label: "Party",
          children: [
            { key: "dressStyle-Party-tshirts", label: "T-shirts" },
            { key: "dressStyle-Party-shorts", label: "Shorts" },
            { key: "dressStyle-Party-shirts", label: "Shirts" },
            { key: "dressStyle-Party-hoodies", label: "Hoodies" },
            { key: "dressStyle-Party-jeans", label: "Jeans" },
          ],
        },
        {
          key: "dressStyle-JeansStyle",
          label: "Jeans",
          children: [
            { key: "dressStyle-JeansStyle-tshirts", label: "T-shirts" },
            { key: "dressStyle-JeansStyle-shorts", label: "Shorts" },
            { key: "dressStyle-JeansStyle-shirts", label: "Shirts" },
            { key: "dressStyle-JeansStyle-hoodies", label: "Hoodies" },
            { key: "dressStyle-JeansStyle-jeans", label: "Jeans" },
          ],
        },
      ],
    },
  ];

  const itemRender = (_, type, originalElement) => {
    if (type === "prev") {
      return (
        <button className="px-4 py-2 text-white bg-black !text-white text-base rounded-xl">
          Previous
        </button>
      );
    }
    if (type === "next") {
      return (
        <button className="px-4 py-2 text-white bg-black !text-white text-base rounded-xl">
          Next
        </button>
      );
    }
    return originalElement;
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const showEvent = (e) => {
    console.log("click ", e);
  };

  function viewProduct(id) {
    navigate(`/product/${id}`);
  }

  const fetchOnlyColorsAndSizes = async () => {
    try {
      const listProductFiltersResponse = await client.graphql({
        query: listProductFilters,
      });

      console.log(
        "All Colors and All Sizes of the products",
        listProductFiltersResponse
      );

      const products =
        listProductFiltersResponse?.data?.listProducts?.items || [];

      const colors = [...new Set(products.flatMap((p) => p.colors || []))];
      const sizes = [...new Set(products.flatMap((p) => p.sizes || []))];

      setColorFilters(colors);
      setSizeFilters(sizes);
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  useEffect(() => {
    console.log("Colors Filters - Size Filters", colorFilters, sizeFilters);
  }, [colorFilters, sizeFilters]);

  useEffect(() => {
    fetchOnlyColorsAndSizes();
  }, []);

  const onClick = (e) => {
    console.log("click ", e);
  };

  useEffect(() => {
    console.log("THE SELECTED FILTERS", selectedFilters);
  }, [selectedFilters]);

  const constructFilter = (filters) => {
    const { brands, color, dressStyle, price, size } = filters;

    // Initialize the filter object with an 'and' array
    const filter = { and: [] };

    // Add brand filter
    if (brands && Object.keys(brands).length > 0) {
      const brandList = [];
      Object.values(brands).forEach((brandGroup) => {
        brandList.push(...brandGroup);
      });
      const uniqueBrands = [...new Set(brandList)]; // Remove duplicates

      if (uniqueBrands.length > 0) {
        const brandConditions = uniqueBrands.map((brand) => ({
          brand: { eq: brand },
        }));
        filter.and.push({ or: brandConditions });
      }
    }

    // Add category filter based on dress style
    if (dressStyle && Object.keys(dressStyle).length > 0) {
      const selectedCategories = [];
      Object.values(dressStyle).forEach((categories) => {
        selectedCategories.push(...categories);
      });
      const uniqueCategories = [...new Set(selectedCategories)]; // Remove duplicates

      if (uniqueCategories.length > 0) {
        const titleConditions = uniqueCategories.map((category) => ({
          title: { eq: category },
        }));
        filter.and.push({ or: titleConditions });
      }
    }

    // Add color filter
    if (color) {
      filter.and.push({ colors: { contains: color } });
    }

    // Add price range filter
    if (price && price.length === 2) {
      filter.and.push({ price: { between: price } });
    }

    // Add size filter
    if (size) {
      filter.and.push({ sizes: { contains: size } });
    }

    return filter;
  };

  const listFilteredProducts = async (
    typeSpecificFilters,
    filters,
    page = 1
  ) => {
    setLoading(true);

    try {
      console.log("beforeeee converting filterss", filters);

      let filter;

      if (filters) {
        filter = constructFilter(filters);
      }

      let allProducts = [];
      let nextToken = null;

      console.log("filterss", filter);

      for (let i = 1; i < page; i++) {
        const response = await client.graphql({
          query: listProducts,
          variables: {
            limit: 5,
            filter: typeSpecificFilters ? typeSpecificFilters : filter,
            nextToken,
          },
        });
        nextToken = response.data.listProducts.nextToken;
        if (!nextToken) break;
      }

      const response = await client.graphql({
        query: listProducts,
        variables: {
          limit: 5,
          filter: filter,
          nextToken,
        },
      });

      console.log("FILTERED PROducts fetched paginated", response);

      allProducts = response.data.listProducts.items;
      setProducts(allProducts);

      const fetchAllProducts = await client.graphql({
        query: listProducts,
      });

      setTotalCount(fetchAllProducts.data.listProducts.items.length);

      // Update totalPages based on totalCount
      setTotalPages(
        Math.ceil(fetchAllProducts.data.listProducts.items.length / 5)
      );
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    } finally {
      setLoading(false);
    }
  };

  const [isProductDeleting, setIsProductDeleting] = useState(false);
  const [productIdBeingDeleted, setProductIdBeingDeleted] = useState("");

  const handleDeleteProduct = async (productId) => {
    setProductIdBeingDeleted(`${productId}`);

    try {
      setIsProductDeleting(true);
      const deleteProductResponse = await client.graphql({
        query: deleteProduct,
        variables: {
          input: {
            id: `${productId}`,
          },
        },
      });

      console.log("deleteProductResponse", deleteProductResponse);
      message.success("Product deleted successfully.");

      listFilteredProducts(selectedFilters);
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("Failed to delete product. Please try again.");
    } finally {
      setIsProductDeleting(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-4 xl:px-10 2xl:px-16 py-10">
      <div className="grid grid-cols-12 gap-6 h-fit">
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 border rounded-2xl md:rounded-3xl overflow-hidden p-4 lg:p-2 h-fit">
          <div
            className="lg:hidden flex justify-between cursor-pointer"
            onClick={toggleMenu}
          >
            <div className="text-xl">Filters</div>
            <FilterOutlined style={{ fontSize: "25px" }} />
          </div>

          <div className="hidden lg:flex justify-between border-0 border-b py-4 px-6">
            <div className="text-xl">Filters</div>
            <FilterOutlined style={{ fontSize: "25px" }} />
          </div>

          {/* Menu */}
          <div
            className={` transition-all duration-300 ease-in-out ${
              menuOpen
                ? "border-0 border-t lg:border-t-0 mt-4 lg:mt-0 max-h-auto opacity-100"
                : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            <Menu
              onClick={handleMenuClick}
              style={{ width: "100%" }}
              mode="inline"
              items={filters}
              className="text-base font-light flex flex-col gap-2 py-4 custom-menu-wrapper h-fit"
              multiple
            />
            <div className="mt-4">
              <Button
                variant="solid"
                shape="round"
                color="default"
                iconPosition={"end"}
                className="w-full text-lg py-6 mb-2"
                onClick={() => listFilteredProducts(selectedFilters)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4 md:gap-0">
              <div className="text-2xl md:text-4xl font-bold">
                {shownProductsType}
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-base sm:text-lg text-[#7c7b7b]">
                <div>
                  Showing {currentPage}-{totalPages} of {totalCount} Products
                </div>
                <div className="flex justify-end items-center gap-4">
                  <div className="text-black">Sort By:</div>

                  <Select
                    size="large"
                    defaultValue="most-popular"
                    style={{
                      width: 120,
                    }}
                    className="!w-fit"
                    onChange={handleChange}
                    options={[
                      {
                        value: "most-popular",
                        label: "Most Popular",
                      },
                      {
                        value: "recently-added",
                        label: "Recently Added",
                      },
                      {
                        value: "best-offers",
                        label: "Best Offers",
                      },
                      {
                        value: "all",
                        label: "All Products",
                      },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-y-10 gap-x-6">
              {products.length > 0 ? (
                products.map((product, index) => {
                  const { id, title, price, discountPercentage, images } =
                    product;
                  const discountedPrice =
                    price - (price * discountPercentage) / 100;
                  const imageUrl = images?.[0] || "default-image.jpg";

                  return (
                    <div
                      key={product.id + index}
                      className="flex flex-col space-y-8 cursor-pointer"
                      onClick={() => viewProduct(product.id)}
                    >
                      <StorageImage
                        alt={`image-${index}`}
                        path={product.images?.[0]}
                        className="aspect-square object-cover rounded-3xl"
                      />
                      <div className="flex flex-col space-y-2">
                        <span className="text-xl">{product.title}</span>
                        <div className="flex items-center space-x-1">
                          {Array.from({
                            length: Math.floor(product.averageRating || 0),
                          }).map((_, index) => (
                            <StarFilled
                              key={index}
                              style={{ color: "#ffca43", fontSize: "25px" }}
                            />
                          ))}
                          {product.averageRating % 1 !== 0 && (
                            <StarFilled
                              key="half"
                              style={{ color: "#ffca43", fontSize: "25px" }}
                              className="opacity-50"
                            />
                          )}
                          {Array.from({
                            length: 5 - Math.ceil(product.averageRating || 0),
                          }).map((_, index) => (
                            <StarFilled
                              key={
                                index + Math.floor(product.averageRating || 0)
                              }
                              style={{ color: "#ccc", fontSize: "25px" }}
                            />
                          ))}
                          <div className="ps-4">
                            {product.averageRating
                              ? `${product.averageRating.toFixed(1)} / 5`
                              : ""}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="xl:text-2xl 2xl:text-3xl font-bold">
                            $
                            {Math.round(
                              product.price *
                                (1 - product.discountPercentage / 100)
                            )}
                          </div>
                          {product.discountPercentage > 0 && (
                            <div className="flex justify-between w-full">
                              <div className="flex items-center gap-4">
                                <div className="xl:text-2xl 2xl:text-3xl font-bold line-through text-[#7c7b7b]">
                                  ${product.price}
                                </div>
                                <Button
                                  size="small"
                                  color="danger"
                                  variant="filled"
                                  shape="round"
                                >
                                  -{product.discountPercentage}%
                                </Button>
                              </div>
                              <span
                                className="z-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteProduct(product.id);
                                }}
                              >
                                {isProductDeleting &&
                                product.id === productIdBeingDeleted ? (
                                  <Spin />
                                ) : (
                                  <DeleteFilled className="text-2xl lg:text-3xl text-red-500" />
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-lg w-full text-center col-span-1 sm:col-span-2 xl:col-span-3">
                  No Match Found
                </div>
              )}
            </div>

            <div className="py-6 w-full">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
