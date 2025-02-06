import React, { useState, useEffect, useContext } from "react";
import { Modal, Upload, Select, message, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import MultiColorPicker from "../../multiColorPicker/multiColorPicker";
import { uploadData, getProperties, list } from "aws-amplify/storage";
import { createProduct } from "../../../graphql/mutations";
import { generateClient } from "aws-amplify/api";
import { ProductContext } from "../../../context/productContext/productContext";
import * as Yup from "yup";

const AddProductModal = ({ visible, onClose }) => {
  const { setRefreshProducts } = useContext(ProductContext);
  const client = generateClient();

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
  const [errors, setErrors] = useState({});
  const [fileList, setFileList] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [showGlobalSpinner, setShowGlobalSpinner] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [resetColorPicker, setResetColorPicker] = useState(false);

  const productSizes = [
    { label: "XX Small", value: "xx-small" },
    { label: "X Small", value: "x-small" },
    { label: "Small", value: "small" },
    { label: "Medium", value: "medium" },
    { label: "Large", value: "large" },
    { label: "X Large", value: "x-large" },
    { label: "XX Large", value: "xx-large" },
    { label: "3X Large", value: "3x-large" },
    { label: "4X Large", value: "4x-large" },
  ];

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

  const handleInputChange = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      try {
        validationSchema.validateAt(field, { [field]: value });
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: undefined,
        }));
      } catch (error) {
        console.error(
          `Error Handling ${field} input in Add Product Modal`,
          error
        );
      }
    }
  };

  const handleColorChange = (colors) => {
    setSelectedColors(colors);
  };

  useEffect(() => {
    setProduct((prev) => ({ ...prev, colors: selectedColors }));
  }, [selectedColors]);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleFileUploadStateUpdate = async ({ fileList: newFileList }) => {
    const uploadedFilePaths = [...product.images];
    const updatedFileList = [...fileList];

    if (newFileList.length > 4) {
      message.error("You can only upload up to 4 images.");
      return;
    }

    for (const file of newFileList) {
      if (!file.url && !file.preview) {
        try {
          setShowGlobalSpinner(true);

          setUploadingFiles((prev) => ({
            ...prev,
            [file.uid]: { status: "uploading", progress: 0 },
          }));

          console.log("File requested to send to S3:", file);

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

          let fileProperties = null;
          for (let attempts = 0; attempts < 5; attempts++) {
            try {
              fileProperties = await getProperties({
                path: `public/uploads/product_images/${file.name}`,
              });
              if (fileProperties) {
                console.log("File properties fetched:", fileProperties);
                break;
              }
            } catch (error) {
              console.log(
                `Attempt ${attempts + 1}: File not available yet. Retrying...`
              );
              await new Promise((resolve) => setTimeout(resolve, 6000));
            }
          }

          if (!fileProperties) {
            throw new Error("Failed to fetch file properties after upload.");
          }

          const s3Path = fileProperties.path;
          uploadedFilePaths.push(s3Path);
          updatedFileList.push({ ...file, url: s3Path });

          setUploadingFiles((prev) => ({
            ...prev,
            [file.uid]: { status: "success" },
          }));

          if (newFileList.length >= 4) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              images: undefined,
            }));
          }
        } catch (error) {
          console.error("Error uploading or fetching file:", error);
          message.error("Image failed to upload. Please retry.");

          setUploadingFiles((prev) => ({
            ...prev,
            [file.uid]: { status: "error" },
          }));
        } finally {
          setShowGlobalSpinner(false);
        }
      }
    }

    setProduct((prev) => ({ ...prev, images: uploadedFilePaths }));
    setFileList(updatedFileList);
    console.log("Uploaded files:", uploadedFilePaths);
  };

  const addProduct = async () => {
    try {
      await validationSchema.validate(product, { abortEarly: false });

      if (product.images.length < 4) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          images: "At least 4 images must be selected",
        }));
        return;
      }

      setErrors({});

      await client.graphql({
        query: createProduct,
        variables: {
          input: product,
        },
      });

      message.success("Product added successfully!");

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
      setResetColorPicker(true);
      setRefreshProducts((prev) => !prev);
    } catch (errors) {
      if (errors instanceof Yup.ValidationError) {
        const errorMessages = {};
        errors.inner.forEach((error) => {
          errorMessages[error.path] = error.message;
        });
        setErrors(errorMessages);
      } else {
        message.error("An unexpected error occurred. Please try again.");
        console.error("Error creating a product", errors);
      }
    }
  };

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

  return (
    <Modal
      title="Add a New Product"
      centered
      open={visible}
      onCancel={onClose}
      footer={[
        <button
          className="bg-white border border-black px-3 py-2 rounded-md text-black font-semibold mr-3"
          onClick={onClose}
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
                  <Spin size="large" />
                </div>
              )}

              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleFileUploadStateUpdate}
                beforeUpload={() => false}
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
              onChange={(e) => handleInputChange("description", e.target.value)}
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
                <span>USD</span>
              </div>
              <input
                type="number"
                id="priceInput"
                className="w-full px-3 py-2 rounded-e-md"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={product.price}
                onChange={(e) => {
                  if (isNumber(e.target.value)) {
                    handleInputChange("price", parseFloat(e.target.value));
                  }
                }}
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
              <input
                type="number"
                id="discountInput"
                className="w-full px-3 py-2 rounded-e-md"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={product.discountPercentage}
                onChange={(e) => {
                  if (isNumber(e.target.value)) {
                    handleInputChange(
                      "discountPercentage",
                      parseFloat(e.target.value)
                    );
                  }
                }}
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
              reset={resetColorPicker}
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
  );
};

export default AddProductModal;
