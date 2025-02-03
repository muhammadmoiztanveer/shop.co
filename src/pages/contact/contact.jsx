import React from "react";
import { Button, Divider, message } from "antd";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { post } from "aws-amplify/api";

const contactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]*$/, "Invalid phone number")
    .nullable(),
  message: Yup.string().required("Message is required"),
});

const CustomInput = ({ field, form, placeholder, required, ...props }) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    form.handleBlur(field.name);
  };

  return (
    <div
      className="border h-fit w-full px-4 bg-gray-100 flex items-center rounded-md relative cursor-text"
      onClick={() => document.getElementById(field.name)?.focus()}
    >
      <input
        {...field}
        {...props}
        id={field.name}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="peer w-full py-4 bg-transparent focus:outline-0 placeholder:text-black/50 lg:placeholder:text-sm 2xl:placeholder:text-lg"
      />
      {!field.value && !isFocused && (
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
          {placeholder}
          {required && <span className="text-red-500"> *</span>}
        </span>
      )}
    </div>
  );
};

const ContactPage = () => {
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const restOperation = post({
        apiName: "apib5d9b382",
        path: "/send-email",
        options: {
          body: {
            name: values.name,
            email: values.email,
            phone: values.phone,
            message: values.message,
          },
        },
      });
      const { body } = await restOperation.response;
      const response = await body.json();
      console.log("POST call succeeded");
      console.log(response);
      message.success("Email sent successfully!");
      resetForm();
    } catch (e) {
      console.log("POST call failed: ", JSON.parse(e.response.body));
      message.error("Failed to send email. Please try again.");
      console.error("Error details:", e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 px-4 sm:px-8 lg:px-10 2xl:px-16 py-10">
      <div className="grid grid-row-2 xl:grid-cols-3 gap-6">
        <div className="row-span-1 xl:col-span-1 flex flex-col md:flex-row justify-between xl:flex-col gap-5 border rounded-lg p-8 py-16 md:p-16 xl:p-8 2xl:p-16 shadow-md">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <PhoneOutlined className="transform -scale-x-100 bg-black text-white p-4 rounded-full text-2xl" />
              <div className="text-2xl">Call To Us</div>
            </div>
            <div className="text-lg">We are available 24/7, 7 days a week.</div>
            <div className="text-lg">Phone: +8801611112222</div>
          </div>
          <Divider className="block md:hidden xl:block" />
          <Divider
            className="hidden md:block xl:hidden h-full"
            type="vertical"
          />
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <MailOutlined className="bg-black text-white p-4 rounded-full text-2xl" />
              <div className="text-2xl">Write To Us</div>
            </div>
            <div className="text-lg">
              Fill out our form and we will contact you within 24 hours.
            </div>
            <div className="text-lg">Emails: customer@exclusive.com</div>
            <div className="text-lg">Emails: support@exclusive.com</div>
          </div>
        </div>

        <Formik
          initialValues={{ name: "", email: "", phone: "", message: "" }}
          validationSchema={contactSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="row-span-1 xl:col-span-2 grid grid-cols-3 gap-6 border rounded-lg p-8 py-16 md:p-16 xl:p-8 2xl:p-16 shadow-md h-fit">
              {/* Name Field */}
              <div className="col-span-3 md:col-span-1">
                <Field
                  name="name"
                  placeholder="Your Name"
                  component={CustomInput}
                  required
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              {/* Email Field */}
              <div className="col-span-3 md:col-span-1">
                <Field
                  name="email"
                  placeholder="Your Email"
                  component={CustomInput}
                  required
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              {/* Phone Field */}
              <div className="col-span-3 md:col-span-1">
                <Field
                  name="phone"
                  placeholder="Your Phone"
                  component={CustomInput}
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              {/* Message Field */}
              <div className="col-span-3">
                <Field
                  name="message"
                  placeholder="Your Message"
                  component={CustomInput}
                  required
                />
                <ErrorMessage
                  name="message"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              {/* Submit Button */}
              <div className="col-span-3 md:col-span-1 h-fit">
                <Button
                  htmlType="submit"
                  className="text-lg w-full py-6"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Send Message
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ContactPage;
