import React, { useState } from "react";
import { Modal, Button, Form, Input, Select } from "antd";
import MultiColorPicker from "../../multiColorPicker/multiColorPicker";

const editProductModal = ({
  isVisible,
  onCancel,
  isProductEditingPending,
  fetchedProduct,
}) => {
  const [errors, setErrors] = useState({});
  const [form] = Form.useForm();

  const handleInputChange = (field, value) => {
    setFetchedProduct((prev) => ({ ...prev, [field]: value }));
  };

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

  async function handleEditProduct() {
    console.log("form is submitted");
  }

  const openEditProductModal = () => {
    setIsEditProductModalVisible(true);
    form.setFieldsValue(fetchedProduct);
  };

  const closeEditProductModal = () => {
    setIsEditProductModalVisible(false);
    form.resetFields();
    setErrors({});
  };

  return (
    <Modal
      title="Edit Product"
      centered
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <div className="flex justify-end gap-4">
          <Button key="cancel" onClick={onCancel}>
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
          {/* Left Column */}
          <div className="pt-4 md:py-4 flex flex-col md:w-1/2">
            {/* Title */}
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
            {/* Description */}
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
            {/* Category */}
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
            {/* Brand */}
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
            {/* Price */}
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
          {/* Right Column */}
          <div className="pb-4 md:py-4 flex flex-col gap-3 md:w-1/2">
            {/* Discount */}
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

            {/* Sizes */}
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

            {/* Colors */}
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

            {/* Quantity */}
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
                onChange={(e) => handleInputChange("quantity", e.target.value)}
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default editProductModal;
