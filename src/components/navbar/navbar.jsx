import React, { useEffect, useState, useRef } from "react";
import {
  DownOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  MenuOutlined,
  UploadOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Space,
  Menu,
  Modal,
  Upload,
  Select,
  Image,
  Spin,
  message,
} from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { signOut } from "aws-amplify/auth";
import MultiColorPicker from "@/components/multiColorPicker/multiColorPicker";
import { generateClient } from "aws-amplify/api";
import { createProduct } from "@/graphql/mutations";
import { useFormik } from "formik";
import * as Yup from "yup";
import { uploadData, getProperties, list } from "aws-amplify/storage";
import { StorageImage, FileUploader } from "@aws-amplify/ui-react-storage";
import { v4 as uuid } from "uuid";

const Navbar = () => {
  const client = generateClient();
  const navigate = useNavigate();

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
  const [isSignOutModalVisible, setIsSignOutModalVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddProductModalVisible, setIsAddProductModalVisible] =
    useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [errors, setErrors] = useState({}); // State to store validation errors
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: 0,
    discountPercentage: 0,
    category: "",
    brand: "",
    images: [],
    sizes: [],
    colors: [],
    quantity: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState("Shoes");
  const [searchParams, setSearchParams] = useSearchParams();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState({}); // Track upload progress and status for each file
  const [showGlobalSpinner, setShowGlobalSpinner] = useState(false); // Global spinner state
  const [selectedColors, setSelectedColors] = useState([]);

  const dropdownRef = useRef(null);

  // Options for the dropdown
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
          onClick={handleSignOutModal}
        >
          Sign Out
        </button>
      ),
    },
  ];

  // Toggle dropdown visibility
  const toggleAccountDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown on Escape key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const handleSelect = (key) => {
    const selectedLabel = items.find((item) => item.key === key)?.label;
    setSelectedCategory(selectedLabel);
    setSearchParams({ category: selectedLabel });
  };

  const handleTopSalesClick = () => {
    setSearchParams({ state: "top-sales" });
  };

  const handleNewArrivalsClick = () => {
    setSearchParams({ state: "new-arrivals" });
  };

  const listAllFiles = async () => {
    try {
      const response = await list({
        path: "public/uploads/product_images/",
        // Alternatively, path: ({identityId}) => `protected/${identityId}/photos/`
        options: {
          listAll: true,
        },
      });

      console.log("all files present in the s3", response);
    } catch (error) {
      console.log("Error ", error);
    }
  };

  useEffect(() => {
    listAllFiles();
  }, []);

  useEffect(() => {
    console.log("Product Data", product);
  }, [product]);

  // Function to handle form submission
  const addProduct = async () => {
    try {
      // Validate the product data
      await validationSchema.validate(product, { abortEarly: false });

      // Ensure at least 4 images are uploaded
      if (product.images.length < 4) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          images: "At least 4 images must be selected",
        }));
        return;
      }

      // Clear any existing errors
      setErrors({});

      // Call the API to add the product
      await client.graphql({
        query: createProduct,
        variables: {
          input: product,
        },
      });

      // Show success message
      message.success("Product added successfully!");

      // Reset all inputs
      setProduct({
        title: "",
        description: "",
        price: 0,
        discountPercentage: 0,
        category: "",
        brand: "",
        images: [],
        sizes: [],
        colors: [],
        quantity: 0,
      });
      setUploadingFiles({});
      setFileList([]);
      setSelectedColors([]);
    } catch (errors) {
      if (errors instanceof Yup.ValidationError) {
        // Collect all validation errors
        const errorMessages = {};
        errors.inner.forEach((error) => {
          errorMessages[error.path] = error.message;
        });
        setErrors(errorMessages); // Update the errors state
      } else {
        message.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Handle input changes and clear errors in real-time
  const handleInputChange = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));

    // Clear the error for the modified field if it's valid
    if (errors[field]) {
      try {
        validationSchema.validateAt(field, { [field]: value });
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: undefined, // Clear the error for this field
        }));
      } catch (error) {
        // If the field is still invalid, keep the error
      }
    }
  };

  const productSizes = [
    {
      label: "XX Small",
      value: "xx-small",
    },
    {
      label: "X Small",
      value: "x-small",
    },
    {
      label: "Small",
      value: "small",
    },
    {
      label: "Medium",
      value: "medium",
    },
    {
      label: "Large",
      value: "large",
    },
    {
      label: "X Large",
      value: "x-large",
    },
    {
      label: "XX Large",
      value: "xx-large",
    },
    {
      label: "3X Large",
      value: "3x-large",
    },
    {
      label: "4X Large",
      value: "4x-large",
    },
  ];

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const toggleMenu = () => {
    setIsSearchInputVisible(false);
    setIsMenuVisible(!isMenuVisible);
  };

  const toggleSearchInput = () => {
    setIsMenuVisible(false);
    setIsSearchInputVisible(!isSearchInputVisible);
  };

  function handleSignOutModal() {
    setIsSignOutModalVisible(true);
  }

  function handleSignOutCancel() {
    setIsSignOutModalVisible(false);
  }

  async function handleSignOut() {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  const items = [
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
  ];

  const menuItems = [
    {
      key: "sub1",
      label: "Shop",
      children: [
        {
          key: "1",
          label: "Option 3",
        },
        {
          key: "2",
          label: "Option 4",
        },
        {
          key: "sub1-2",
          label: "Submenu",
          children: [
            {
              key: "3",
              label: "Option 5",
            },
            {
              key: "4",
              label: "Option 6",
            },
          ],
        },
      ],
    },
    {
      key: "5",
      label: "On Sale",
    },
    {
      key: "6",
      label: "New Arrivals",
    },
    {
      key: "7",
      label: "Brands",
    },
    {
      key: "8",
      label: "Contact Us",
    },
    {
      key: "9",
      label: "About Us",
    },
  ];

  function handleAddProductModal() {
    setIsAddProductModalVisible(!isAddProductModalVisible);
  }

  // Utility to convert file to Base64
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Handle preview of the uploaded file
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // Handle file upload state updates
  const handleFileUploadStateUpdate = async ({ fileList: newFileList }) => {
    const uploadedFilePaths = [...product.images]; // Preserve existing paths
    const updatedFileList = [...fileList]; // Preserve existing files

    // Enforce exactly 4 images constraint
    if (newFileList.length > 4) {
      message.error("You can only upload up to 4 images.");
      return;
    }

    for (const file of newFileList) {
      if (!file.url && !file.preview) {
        try {
          // Show global spinner when upload starts
          setShowGlobalSpinner(true);

          // Start tracking upload progress immediately
          setUploadingFiles((prev) => ({
            ...prev,
            [file.uid]: { status: "uploading", progress: 0 },
          }));

          console.log("File requested to send to S3:", file);

          // Simulate upload process
          const uploadResult = uploadData({
            path: `public/uploads/product_images/${file.name}`,
            data: file.originFileObj,
            options: {
              onProgress: ({ transferredBytes, totalBytes }) => {
                const progress = Math.round(
                  (transferredBytes / totalBytes) * 100
                );
                setUploadingFiles((prev) => ({
                  ...prev,
                  [file.uid]: { ...prev[file.uid], progress },
                }));
              },
            },
          });

          console.log("Upload initiated:", uploadResult);

          // Poll to ensure file is available before fetching properties
          let fileProperties = null;
          for (let attempts = 0; attempts < 5; attempts++) {
            try {
              fileProperties = await getProperties({
                path: `public/uploads/product_images/${file.name}`,
              });
              if (fileProperties) {
                console.log("File properties fetched:", fileProperties);
                break; // Exit loop if successful
              }
            } catch (error) {
              console.log(
                `Attempt ${attempts + 1}: File not available yet. Retrying...`
              );
              await new Promise((resolve) => setTimeout(resolve, 6000)); // Wait 6 seconds before retrying
            }
          }

          if (!fileProperties) {
            throw new Error("Failed to fetch file properties after upload.");
          }

          // Extract S3 path and update state
          const s3Path = fileProperties.path;
          uploadedFilePaths.push(s3Path);
          updatedFileList.push({ ...file, url: s3Path });

          // Mark file as successfully uploaded
          setUploadingFiles((prev) => ({
            ...prev,
            [file.uid]: { status: "success" },
          }));

          // Clear the images error if at least 4 images are selected
          if (newFileList.length >= 4) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              images: undefined, // Clear the error for images
            }));
          }
        } catch (error) {
          console.error("Error uploading or fetching file:", error);
          message.error("Image failed to upload. Please retry.");

          // Mark file as failed
          setUploadingFiles((prev) => ({
            ...prev,
            [file.uid]: { status: "error" },
          }));
        } finally {
          // Hide global spinner when upload completes (success or failure)
          setShowGlobalSpinner(false);
        }
      }
    }

    // Update state with all uploaded paths and file list
    setProduct((prev) => ({ ...prev, images: uploadedFilePaths }));
    setFileList(updatedFileList);
    console.log("Uploaded files:", uploadedFilePaths);
  };

  // Upload button
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  // useEffect(() => {
  //   console.log("product changed", product);
  // }, [product]);

  // useEffect(() => {
  //   console.log("fileList changed", fileList);
  // }, [fileList]);

  async function handleProductTitle(title) {
    setProductData((prev) => ({ ...prev, title: title }));
  }

  useEffect(() => {
    setProduct((prev) => ({ ...prev, colors: selectedColors }));
  }, [selectedColors]);

  const handleColorChange = (colors) => {
    setSelectedColors(colors);
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    title: Yup.string().required("Product title is required"),
    description: Yup.string().required("Product description is required"),
    category: Yup.string().required("Product category is required"),
    brand: Yup.string().required("Brand is required"),
    price: Yup.number()
      .required("Product price is required")
      .positive("Price must be greater than zero"),
    images: Yup.array().min(4, "At least 4 images must be selected"),
    colors: Yup.array().min(1, "At least one color must be selected"),
    sizes: Yup.array().min(1, "At least one size must be selected"),
    quantity: Yup.number()
      .required("Product quantity is required")
      .min(1, "Quantity must be at least 1"),
    discountPercentage: Yup.number().nullable(),
  });

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
              }}
              placement="bottom"
              className="flex lg:text-sm xl:text-base 2xl:text-lg self-center"
              onSelect={handleSelect}
            >
              <Space>
                <Link
                  to={{
                    pathname: "/products",
                  }}
                  className="text-inherit"
                >
                  Shop
                </Link>
                <DownOutlined />
              </Space>
            </Dropdown>

            <Link
              to={{
                pathname: "/products",
              }}
              onClick={handleTopSalesClick}
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
              onClick={handleNewArrivalsClick}
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
            <SearchOutlined className="text-2xl" />
            <input
              type="text"
              className="block w-58 xl:w-72 2xl:w-96 py-1.5 2xl:py-2 bg-transparent focus:outline-0 placeholder:text-black/50 lg:placeholder:text-sm 2xl:placeholder:text-lg"
              placeholder="Search for products..."
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

              {/* Dropdown menu */}
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
        {/* Sliding Manu */}
        {/* <Menu
          style={{
            width: "100%",
          }}
          className={`
          lg:hidden
          shadow-0
          relative
          w-full
          overflow-y-auto
          bg-white
          transition-all
          duration-900
          ease-in-out
          ${isMenuVisible ? "translate-y-0" : "-translate-y-full"}
        `}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode={"inline"}
          items={menuItems}
        /> */}

        <div
          className={`lg:hidden w-full overflow-y-auto bg-white transition-all ease-in-out ${
            isMenuVisible ? "h-fit" : "h-0"
          }`}
          style={{
            width: "100%",
            transform: isMenuVisible ? "translateY(0)" : "translateY(-100%)", // Sliding animation
            opacity: isMenuVisible ? 1 : 0, // Fade-in/fade-out effect
            maxHeight: isMenuVisible ? "none" : 0, // Smooth height transition
            transition: "all 0.6s ease-in-out", // Longer duration for smoother animation
          }}
        >
          <Menu
            style={{
              width: "100%",
              height: "100%",
              transition: "all 0.6s ease-in-out", // Ensure Menu content animates smoothly
            }}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            items={menuItems}
          />
        </div>

        {/* Search Input Component */}
        {isSearchInputVisible && ( // Conditionally render the search input
          <div
            className={`flex lg:hidden justify-between items-center gap-4 p-4 w-full bg-white transition-all duration-600 ease-in-out translate-y-0 opacity-100`}
            style={{
              maxHeight: "80px", // Fixed height when open
              overflow: "hidden", // Prevent content overflow
              zIndex: 10, // Ensure proper stacking context
            }}
          >
            <div className="flex items-center w-full space-x-4 px-4 rounded-lg bg-gray-100">
              <input
                type="text"
                className="w-full py-1 bg-transparent focus:outline-0 placeholder:text-black/50 placeholder:text-sm"
                placeholder="Search for products..."
              />
            </div>
            <Button
              color="default"
              variant="solid"
              className="rounded-md"
              onClick={() => alert("Search button clicked!")}
            >
              Search
            </Button>
          </div>
        )}
      </div>

      <Modal
        title="Add a New Product"
        centered
        open={isAddProductModalVisible}
        onCancel={() => setIsAddProductModalVisible(false)}
        footer={[
          <button
            className="bg-white border border-black px-3 py-2 rounded-md text-black font-semibold mr-3"
            onClick={() => setIsAddProductModalVisible(false)}
          >
            Cancel
          </button>,

          <button
            className="bg-black border border-black px-3 py-2 rounded-md text-white font-semibold"
            onClick={addProduct}
          >
            Add Product
          </button>,
        ]}
        width={1200}
        className="mt-10 px-4"
      >
        <div className="grid grid-rows-2 md:grid-rows-1 md:grid-flow-row md:grid-cols-2 gap-6">
          <div className="row-span-1 md:col-span-1 py-4 flex flex-col gap-3">
            <div className="flex flex-col gap-4">
              <div className="rounded-md flex flex-col gap-3">
                <label htmlFor="upload-product-images">
                  Upload product images
                </label>

                {/* Global Spinner */}
                {showGlobalSpinner && (
                  <div
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 9999,
                      textAlign: "center",
                    }}
                  >
                    <Spin size="large" tip="Uploading..." />
                  </div>
                )}

                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleFileUploadStateUpdate}
                  beforeUpload={() => false} // Prevent automatic upload
                >
                  {fileList.length >= 8 ? null : uploadButton}
                </Upload>

                {/* Preview Modal */}
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />
                )}

                {errors.images && (
                  <span style={{ color: "red", fontSize: "0.875rem" }}>
                    {errors.images}
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-2">
              <label htmlFor="product-title">Product title</label>
              <input
                type="text"
                className="border rounded-md py-2 px-3"
                id="product-title"
                placeholder="Product title"
                value={product.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
              {errors.title && (
                <span style={{ color: "red", fontSize: "0.875rem" }}>
                  {errors.title}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label htmlFor="product-description">Product description</label>
              <textarea
                name="product-description"
                id="product-description"
                placeholder="Product description"
                className="border rounded-md py-2 px-3"
                value={product.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              ></textarea>
              {errors.description && (
                <span style={{ color: "red", fontSize: "0.875rem" }}>
                  {errors.description}
                </span>
              )}
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label htmlFor="product-category">Product category</label>
              <select
                name="product-category"
                id="product-category"
                className="border rounded-md py-2 px-3 bg-transparent"
                value={product.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
              >
                <option value="" disabled>
                  Select a category
                </option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
                <option value="party">Party</option>
                <option value="gym">Gym</option>
              </select>
              {errors.category && (
                <span style={{ color: "red", fontSize: "0.875rem" }}>
                  {errors.category}
                </span>
              )}
            </div>

            {/* Brand */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="brand"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Brand
              </label>
              <input
                type="text"
                id="brand"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Product brand"
                value={product.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
              />
              {errors.brand && (
                <span style={{ color: "red", fontSize: "0.875rem" }}>
                  {errors.brand}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="w-full flex flex-col gap-2">
              <label
                htmlFor="priceInput"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product price
              </label>
              <div className="flex border rounded-md">
                <div className="rounded-s-md bg-slate-100 flex items-center justify-center px-2">
                  <span>PKR</span>
                </div>
                <input
                  type="number"
                  id="priceInput"
                  className="w-full px-3 py-2 rounded-e-md"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={product.price}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value))
                  }
                />
              </div>
              {errors.price && (
                <span style={{ color: "red", fontSize: "0.875rem" }}>
                  {errors.price}
                </span>
              )}
            </div>
          </div>

          <div className="row-span-1 md:col-span-1 py-4 flex flex-col gap-3">
            {/* Discount */}
            <div className="w-full flex flex-col gap-2">
              <label
                htmlFor="discount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Discount (Optional)
              </label>
              <div className="flex border rounded-md">
                <div className="rounded-s-md bg-slate-100 flex items-center justify-center px-2">
                  <span>PKR</span>
                </div>
                <input
                  type="number"
                  id="discountInput"
                  className="w-full px-3 py-2 rounded-e-md"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={product.discountPercentage}
                  onChange={(e) =>
                    handleInputChange(
                      "discountPercentage",
                      parseFloat(e.target.value)
                    )
                  }
                />
                <div className="rounded-e-md bg-slate-100 flex items-center justify-center px-2">
                  <span>%</span>
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="product-size"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Size
              </label>
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="Please add product sizes"
                value={product.sizes}
                onChange={(sizes) => handleInputChange("sizes", sizes)}
                options={productSizes}
              />
              {errors.sizes && (
                <span style={{ color: "red", fontSize: "0.875rem" }}>
                  {errors.sizes}
                </span>
              )}
            </div>

            {/* Colors */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="colors"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Colors Available
              </label>
              <MultiColorPicker
                onColorChange={(colors) => handleInputChange("colors", colors)}
              />
              {errors.colors && (
                <span style={{ color: "red", fontSize: "0.875rem" }}>
                  {errors.colors}
                </span>
              )}
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="product-quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Quantity
              </label>
              <input
                type="number"
                id="product-quantity"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="0"
                value={product.quantity}
                onChange={(e) =>
                  handleInputChange("quantity", parseInt(e.target.value))
                }
              />
              {errors.quantity && (
                <span style={{ color: "red", fontSize: "0.875rem" }}>
                  {errors.quantity}
                </span>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Sign Out Modal */}
      <Modal
        title="Sign Out"
        open={isSignOutModalVisible}
        onCancel={handleSignOutCancel}
        footer={[
          <Button key="signOut" type="primary" danger onClick={handleSignOut}>
            Sign Out
          </Button>,
          <Button key="cancel" onClick={handleSignOutCancel}>
            Cancel
          </Button>,
        ]}
      >
        <p>Are you sure you want to dismiss this session ?</p>
      </Modal>
    </>
  );
};

export default Navbar;
