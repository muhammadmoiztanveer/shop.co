import React, { useEffect, useState } from "react";
import { Breadcrumb } from "antd";
import {
  StarFilled,
  MinusOutlined,
  PlusOutlined,
  FilterOutlined,
  DownOutlined,
  CheckCircleFilled,
  EllipsisOutlined,
  DownloadOutlined,
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { Menu, Select, Button, Slider } from "antd";
import "./products.css";
import cloth1 from "@/assets/cloth-1.png";
import Pagination from "@/components/pagination/pagination";
import { listProducts } from "../../graphql/queries";
import { generateClient } from "aws-amplify/api";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { useNavigate } from "react-router-dom";
import { listProductFilters } from "../../graphql/customQueries";

const Products = () => {
  const client = generateClient();
  const navigate = useNavigate();
  const section = location.state?.from;

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

  const handleMenuClick = (e) => {
    const { key } = e;
    const keyParts = key.split("-");
    let filterCategory, filterValue;

    if (keyParts.length === 2) {
      [filterCategory, filterValue] = keyParts;
    } else if (keyParts.length === 3) {
      filterCategory = keyParts[0];
      filterValue = `${keyParts[1]}-${keyParts[2]}`;
    } else {
      return;
    }

    setSelectedFilters((prevFilters) => {
      const updatedFilters = JSON.parse(JSON.stringify(prevFilters)); // Deep copy

      if (
        filterCategory === "brands-tshirts" ||
        filterCategory === "brands-shorts" ||
        filterCategory === "brands-shirts" ||
        filterCategory === "brands-hoodies" ||
        filterCategory === "brands-jeans"
      ) {
        if (!updatedFilters.brands) {
          updatedFilters.brands = {};
        }
        if (!updatedFilters.brands[filterCategory]) {
          updatedFilters.brands[filterCategory] = [];
        }

        if (updatedFilters.brands[filterCategory].includes(filterValue)) {
          updatedFilters.brands[filterCategory] = updatedFilters.brands[
            filterCategory
          ].filter((value) => value !== filterValue);
          if (updatedFilters.brands[filterCategory].length === 0) {
            delete updatedFilters.brands[filterCategory];
            if (Object.keys(updatedFilters.brands).length === 0)
              delete updatedFilters.brands;
          }
        } else {
          updatedFilters.brands[filterCategory].push(filterValue);
        }
      } else if (filterCategory === "dressStyle") {
        if (!updatedFilters[filterCategory]) {
          updatedFilters[filterCategory] = {};
        }
        const styleType = keyParts[1]; // Extract style type (Casual, Formal, etc.)

        if (!updatedFilters[filterCategory][styleType]) {
          updatedFilters[filterCategory][styleType] = [];
        }

        if (updatedFilters[filterCategory][styleType].includes(keyParts[2])) {
          updatedFilters[filterCategory][styleType] = updatedFilters[
            filterCategory
          ][styleType].filter((value) => value !== keyParts[2]);
          if (updatedFilters[filterCategory][styleType].length === 0) {
            delete updatedFilters[filterCategory][styleType];
            if (Object.keys(updatedFilters[filterCategory]).length === 0)
              delete updatedFilters[filterCategory];
          }
        } else {
          updatedFilters[filterCategory][styleType].push(keyParts[2]);
        }
      } else {
        updatedFilters[filterCategory] = filterValue;
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

  const currentPage = 50; // Example current page
  const totalPages = 100; // Example total pages
  const pageNumbers = [1, 2, "...", currentPage, totalPages];

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

  const listAllProducts = async () => {
    const allProducts = await client.graphql({ query: listProducts });

    setProducts(allProducts.data.listProducts.items);
  };

  useEffect(() => {
    console.log("All products Fetched: ", products);
  }, [products]);

  useEffect(() => {
    listAllProducts();
  }, []);

  const filters = [
    {
      key: "brands-tshirts",
      label: "T Shirts",
      children: [
        { key: "brands-tshirts-Versace", label: "Versace" },
        { key: "brands-tshirts-Zara", label: "Zara" },
        { key: "brands-tshirts-Gucci", label: "Gucci" },
        { key: "brands-tshirts-Prada", label: "Prada" },
        { key: "brands-tshirts-Calvin Klein", label: "Calvin Klein" },
      ],
    },
    {
      key: "brands-shorts",
      label: "Shorts",
      children: [
        { key: "brands-shorts-Versace", label: "Versace" },
        { key: "brands-shorts-Zara", label: "Zara" },
        { key: "brands-shorts-Gucci", label: "Gucci" },
        { key: "brands-shorts-Prada", label: "Prada" },
        { key: "brands-shorts-Calvin Klein", label: "Calvin Klein" },
      ],
    },
    {
      key: "brands-shirts",
      label: "Shirts",
      children: [
        { key: "brands-shirts-Versace", label: "Versace" },
        { key: "brands-shirts-Zara", label: "Zara" },
        { key: "brands-shirts-Gucci", label: "Gucci" },
        { key: "brands-shirts-Prada", label: "Prada" },
        { key: "brands-shirts-Calvin Klein", label: "Calvin Klein" },
      ],
    },
    {
      key: "brands-hoodies",
      label: "Hoodies",
      children: [
        { key: "brands-hoodies-Versace", label: "Versace" },
        { key: "brands-hoodies-Zara", label: "Zara" },
        { key: "brands-hoodies-Gucci", label: "Gucci" },
        { key: "brands-hoodies-Prada", label: "Prada" },
        { key: "brands-hoodies-Calvin Klein", label: "Calvin Klein" },
      ],
    },
    {
      key: "brands-jeans",
      label: "Jeans",
      children: [
        { key: "brands-jeans-Versace", label: "Versace" },
        { key: "brands-jeans-Zara", label: "Zara" },
        { key: "brands-jeans-Gucci", label: "Gucci" },
        { key: "brands-jeans-Prada", label: "Prada" },
        { key: "brands-jeans-Calvin Klein", label: "Calvin Klein" },
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
              onChange={onChange} // Make sure onChange is defined in your component
              onChangeComplete={onChangeComplete} // Make sure onChangeComplete is defined
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

  return (
    <div className="w-full px-4 sm:px-8 lg:px-4 xl:px-10 2xl:px-16 py-10">
      <div className="grid grid-cols-12 gap-6 h-fit">
        <div className="col-span-4 lg:col-span-2 border rounded-3xl overflow-hidden p-2">
          <div
            className="flex md:hidden justify-between border-0 border-b cursor-pointer"
            onClick={toggleMenu}
          >
            <div className="text-xl">Filters</div>
            <FilterOutlined style={{ fontSize: "25px" }} />
          </div>

          <div className="hidden md:flex justify-between border-0 border-b py-4 px-6">
            <div className="text-xl">Filters</div>
            <FilterOutlined style={{ fontSize: "25px" }} />
          </div>

          {/* Menu */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              menuOpen ? "max-h-auto opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            {/* <Menu
              onClick={handleMenuClick}
              style={{
                width: "100%",
              }}
              mode="inline"
              items={filters}
              className="text-base font-light flex flex-col gap-2 py-4"
            /> */}

            <Menu
              onClick={handleMenuClick}
              style={{ width: "100%" }}
              mode="inline"
              items={filters}
              className="text-base font-light flex flex-col gap-2 py-4 custom-menu-wrapper"
              multiple
            />
            <div className="mt-4">
              Selected Filters: {JSON.stringify(selectedFilters)}
            </div>
          </div>
        </div>

        <div className="col-span-4 lg:col-span-10 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4 md:gap-0">
            <div className="text-4xl font-bold">Casual</div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-base sm:text-lg">
              <div>Showing 1-10 of 100 Products</div>
              <div className="flex justify-end items-center gap-4">
                <div>Sort By:</div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-y-10 gap-x-6">
            {/* <div className="flex flex-col space-y-8">
              <img src={cloth1} alt="cloth-01" className="aspect-square" />

              <div className="flex flex-col space-y-2">
                <span className="text-xl">T-SHIRT WITH TAPE DETAILS</span>

                <div className="flex space-x-1">
                  <StarFilled style={{ color: "#ffca43", fontSize: "25px" }} />
                  <StarFilled style={{ color: "#ffca43", fontSize: "25px" }} />
                  <StarFilled style={{ color: "#ffca43", fontSize: "25px" }} />
                  <StarFilled style={{ color: "#ffca43", fontSize: "25px" }} />
                  <StarFilled style={{ color: "#ffca43", fontSize: "25px" }} />

                  <div>3.5 / 5</div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="xl:text-2xl 2xl:text-3xl font-bold">$120</div>
                  <div className="xl:text-2xl 2xl:text-3xl font-bold line-through text-[#7c7b7b]">
                    $180
                  </div>

                  <Button
                    size="small"
                    color="danger"
                    variant="filled"
                    shape="round"
                  >
                    -30%
                  </Button>
                </div>
              </div>
            </div> */}

            {products.map((product) => {
              const { id, title, price, discountPercentage, images } = product;
              const discountedPrice =
                price - (price * discountPercentage) / 100;
              const imageUrl = images?.[0] || "default-image.jpg";

              return (
                <div
                  key={id}
                  className="flex flex-col space-y-8 cursor-pointer"
                  onClick={() => viewProduct(id)}
                >
                  <StorageImage
                    alt="sleepy-cat"
                    path={imageUrl}
                    className="aspect-square object-cover w-full h-full"
                  />

                  <div className="flex flex-col space-y-2">
                    <span className="text-xl">{title}</span>

                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, index) => (
                        <StarFilled
                          key={index}
                          style={{
                            color: index < 3 ? "#ffca43" : "#d1d5db",
                            fontSize: "25px",
                          }}
                        />
                      ))}
                      <div>3.5 / 5</div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="xl:text-2xl 2xl:text-3xl font-bold">
                        ${discountedPrice.toFixed(2)}
                      </div>
                      <div className="xl:text-2xl 2xl:text-3xl font-bold line-through text-[#7c7b7b]">
                        ${price}
                      </div>

                      <Button
                        size="small"
                        color="danger"
                        variant="filled"
                        shape="round"
                      >
                        -{discountPercentage}%
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="py-6 w-full">
            <Pagination totalPages={100} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
