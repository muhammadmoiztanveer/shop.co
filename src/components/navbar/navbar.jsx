import React, { useEffect, useState, useRef } from "react";
import {
  DownOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Space, Menu, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { list } from "aws-amplify/storage";
import { v4 as uuid } from "uuid";
import AddProductModal from "../modals/addNewProductModal/addNewProductModal";
import SignOutModal from "../modals/signOutModal/signOutModal";

const Navbar = () => {
  const navigate = useNavigate();

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
  const [isSignOutModalVisible, setIsSignOutModalVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddProductModalVisible, setIsAddProductModalVisible] =
    useState(false);
  const [searchInputText, setSearchInputText] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    listAllFiles();
  }, []);

  // Start Shop Dropdown
  const items = [
    {
      key: "1",
      label: "T-Shirts",
    },
    {
      key: "2",
      label: "Shirts",
    },
    {
      key: "3",
      label: "Jeans",
    },
    {
      key: "4",
      label: "Hoodies",
    },
  ];

  const handleSelect = (key) => {
    const selectedLabel = items.find((item) => item.key === key)?.label;
    navigate({ key: "search", value: selectedLabel });
  };
  // END Shop Dropdown

  function handleAddProductModal() {
    setIsAddProductModalVisible(!isAddProductModalVisible);
  }

  function handleSearch() {
    if (searchInputText !== "") {
      const searchText = searchInputText;
      setSearchInputText("");
      navigate("/products", {
        state: { key: "search", value: `${searchText}` },
      });
    }
  }

  const toggleSearchInput = () => {
    setIsMenuVisible(false);
    setIsSearchInputVisible(!isSearchInputVisible);
  };

  const accountsOptions = [
    {
      key: "1",
      label: (
        <Link
          to="/profile"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
        >
          Profile
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <button
          type="button"
          className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
          onClick={showSignOutModal}
        >
          Sign Out
        </button>
      ),
    },
  ];

  const toggleAccountDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Start Menu Dropdown
  const menuItems = [
    {
      key: "shop",
      label: "Shop",
      children: [
        {
          key: "1",
          label: "T-Shirts",
        },
        {
          key: "2",
          label: "Trousers",
        },
        {
          key: "3",
          label: "Shoes",
        },
      ],
    },
    {
      key: "top-sales",
      label: "Top Sales",
    },
    {
      key: "new-arrivals",
      label: "New Arrivals",
    },
    {
      key: "brands",
      label: "Brands",
    },
    {
      key: "contact-us",
      label: "Contact Us",
    },
    {
      key: "add-product",
      label: "Add Product",
    },
  ];

  const toggleMenu = () => {
    setIsSearchInputVisible(false);
    setIsMenuVisible(!isMenuVisible);
  };

  const handleMenuNaviagtionClick = (key) => {
    const selectedLabel = menuItems.find((item) => item.key === key)?.label;
    if (key === "contact-us") {
      navigate("/contact");
    } else if (key === "add-product") {
      handleAddProductModal();
    } else {
      navigate("/products", { state: { key: key, value: selectedLabel } });
    }
  };
  // End Menu Dropdown

  async function listAllFiles() {
    try {
      const response = await list({
        path: "public/uploads/product_images/",

        options: {
          listAll: true,
        },
      });

      console.log("all files present in the s3", response);
    } catch (error) {
      console.log("Error ", error);
    }
  }

  function showSignOutModal() {
    setIsSignOutModalVisible(true);
  }

  function hideSignOutModal() {
    setIsSignOutModalVisible(false);
  }

  return (
    <>
      <div className="relative w-full bg-white px-4 sm:px-8 lg:px-4 xl:px-10 2xl:px-16 py-6 flex justify-between items-center lg:gap-6 xl:gap-0 z-50 border-0 border-b">
        <div className="flex items-center gap-4">
          <MenuOutlined
            className="block lg:hidden text-2xl"
            onClick={toggleMenu}
          />

          <Link to="/home">
            <div className="text-2xl 2xl:text-4xl">SHOP.CO</div>
          </Link>
        </div>

        <div className="flex gap-4 ">
          <div className="hidden lg:flex 2xl:gap-2 place-items-center">
            <Dropdown
              menu={{
                items,
                selectable: true,
                defaultSelectedKeys: ["3"],
                onClick: ({ key }) => {
                  handleSelect(key);
                },
              }}
              placement="bottom"
              className="flex lg:text-sm xl:text-base 2xl:text-lg self-center"
            >
              <Space>
                Shop
                <DownOutlined />
              </Space>
            </Dropdown>

            <Link
              to={{
                pathname: "/products",
              }}
              state={{ key: "top-rated", value: "top-rated" }}
            >
              <Button
                color="default"
                variant="text"
                className="lg:text-sm xl:text-base 2xl:text-lg"
              >
                Top Sales
              </Button>
            </Link>

            <Link
              to={{
                pathname: "/products",
              }}
              state={{ key: "new-arrivals", value: "new-arrivals" }}
            >
              <Button
                color="default"
                variant="text"
                className="lg:text-sm xl:text-base 2xl:text-lg"
              >
                New Arrivals
              </Button>
            </Link>

            <Link to="/products">
              <Button
                color="default"
                variant="text"
                className="lg:text-sm xl:text-base 2xl:text-lg"
              >
                Brands
              </Button>
            </Link>

            <Link to="/contact">
              <Button
                color="default"
                variant="text"
                className="lg:text-sm xl:text-base 2xl:text-lg"
              >
                Contact Us
              </Button>
            </Link>

            <Button
              color="default"
              variant="text"
              className="lg:text-sm xl:text-base 2xl:text-lg"
              onClick={handleAddProductModal}
            >
              Add Product
            </Button>
          </div>

          <div className="hidden lg:flex px-4 rounded-full bg-gray-100 flex items-center w-fit space-x-4">
            <SearchOutlined className="text-2xl" onClick={handleSearch} />
            <input
              type="text"
              className="block w-58 xl:w-72 2xl:w-96 py-1.5 2xl:py-2 bg-transparent focus:outline-0 placeholder:text-black/50 lg:placeholder:text-sm 2xl:placeholder:text-lg"
              placeholder="Search for products..."
              onChange={(e) => setSearchInputText(e.target.value)}
            />
          </div>

          <div className="flex  gap-4 2xl:gap-6">
            <SearchOutlined
              onClick={toggleSearchInput}
              className="lg:hidden text-2xl"
            />

            <Link to="/cart" className="flex self-center">
              <ShoppingCartOutlined className="text-2xl" />
            </Link>

            <div className="relative" ref={dropdownRef}>
              {/* Dropdown trigger button */}
              <button
                onClick={toggleAccountDropdown}
                className="text-2xl p-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-controls="accounts-dropdown"
              >
                <UserOutlined className="text-2xl" />
              </button>

              {/* Profile Dropdown menu */}
              {isOpen && (
                <div
                  id="accounts-dropdown"
                  className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-48 z-10 overflow-hidden transition-all duration-300 ease-in-out transform origin-top-right"
                >
                  <ul
                    className="py-2"
                    role="menu"
                    aria-labelledby="accounts-dropdown"
                  >
                    {accountsOptions.map((option) => (
                      <li
                        key={uuid()}
                        className="cursor-pointer"
                        role="menuitem"
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          className={`lg:hidden w-full overflow-y-auto bg-white transition-all ease-in-out border border-b ${
            isMenuVisible ? "h-fit" : "h-0"
          }`}
          style={{
            width: "100%",
            transform: isMenuVisible ? "translateY(0)" : "translateY(-100%)",
            opacity: isMenuVisible ? 1 : 0,
            maxHeight: isMenuVisible ? "none" : 0,
            transition: "all 0.6s ease-in-out",
          }}
        >
          <Menu
            style={{
              width: "100%",
              height: "100%",
              transition: "all 0.6s ease-in-out",
            }}
            defaultSelectedKeys={["shop"]}
            defaultOpenKeys={["shop"]}
            mode="inline"
            items={menuItems}
            onClick={({ key }) => {
              console.log("Clicked menu item:", key);

              if (key !== "") {
                handleMenuNaviagtionClick(key);
              }
            }}
          />
        </div>

        {/* Search Input Component */}
        {isSearchInputVisible && (
          <div
            className={`flex lg:hidden justify-between items-center gap-4 p-4 w-full bg-white transition-all duration-600 ease-in-out translate-y-0 opacity-100 border-0 border-b`}
            style={{
              maxHeight: "80px",
              overflow: "hidden",
              zIndex: 10,
            }}
          >
            <div className="flex items-center w-full space-x-4 px-4 rounded-lg bg-gray-100">
              <input
                type="text"
                className="w-full py-1 bg-transparent focus:outline-0 placeholder:text-black/50 placeholder:text-sm"
                placeholder="Search for products..."
                onChange={(e) => setSearchInputText(e.target.value)}
              />
            </div>
            <Button
              color="default"
              variant="solid"
              className="rounded-md"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        )}
      </div>

      <AddProductModal
        visible={isAddProductModalVisible}
        onClose={() => setIsAddProductModalVisible(false)}
      />

      <SignOutModal
        isVisible={isSignOutModalVisible}
        onCancel={hideSignOutModal}
      />
    </>
  );
};

export default Navbar;
