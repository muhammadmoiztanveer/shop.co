// import React from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { Button, message } from "antd";
// import {
//   verifyUserAttribute,
//   sendUserAttributeVerificationCode,
// } from "aws-amplify/auth";

// const verificationSchema = Yup.object().shape({
//   code: Yup.string()
//     .length(6, "Verification code must be 6 digits")
//     .required("Verification code is required"),
// });

const CustomInput = ({ field, form, placeholder, required, ...props }) => {
  return (
    <div className="border h-fit w-full px-4 bg-gray-100 flex items-center rounded-md relative">
      {/* <input
        {...field}
        {...props}
        className="peer w-full py-4 bg-transparent focus:outline-0 placeholder:text-black/50 lg:placeholder:text-sm 2xl:placeholder:text-lg"
      />
      {!field.value && (
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
          {placeholder}
          {required && <span className="text-red-500"> *</span>}
        </span>
      )} */}
    </div>
  );
};

const EmailVerificationPage = () => {
  //   const location = useLocation();
  //   const navigate = useNavigate();
  //   const { email } = location.state || {};

  //   const handleVerification = async (values, { setSubmitting }) => {
  //     try {
  //       await verifyUserAttribute({
  //         userAttribute: {
  //           attributeKey: "email",
  //           value: email,
  //         },
  //         confirmationCode: values.code,
  //       });

  //       message.success("Email verified successfully!");
  //       navigate("/profile");
  //       setSubmitting(false);
  //     } catch (error) {
  //       message.error(`Verification failed: ${error.message}`);
  //       setSubmitting(false);
  //     }
  //   };

  //   const handleResendCode = async () => {
  //     try {
  //       await sendUserAttributeVerificationCode({
  //         userAttribute: {
  //           attributeKey: "email",
  //           value: email,
  //         },
  //       });
  //       message.info("New verification code sent to your email");
  //     } catch (error) {
  //       message.error(`Error resending code: ${error.message}`);
  //     }
  //   };

  //   if (!email) {
  //     navigate("/profile");
  //     return null;
  //   }

  return (
    <div className="flex justify-center items-center h-screen">
      {/* <div className="border rounded-lg p-8 shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Verify Email Address</h1>
        <p className="mb-4">We sent a verification code to {email}</p>

        <Formik
          initialValues={{ code: "" }}
          validationSchema={verificationSchema}
          onSubmit={handleVerification}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <Field
                  name="code"
                  placeholder="Enter 6-digit code"
                  component={CustomInput}
                />
                <ErrorMessage
                  name="code"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex justify-between items-center">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  className="w-fit"
                >
                  Verify Email
                </Button>
                <Button type="link" onClick={handleResendCode}>
                  Resend Code
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div> */}
    </div>
  );
};

export default EmailVerificationPage;
