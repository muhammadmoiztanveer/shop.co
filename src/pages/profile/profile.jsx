import React, { useEffect, useState } from "react";
import { Button, message, Input } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  getCurrentUser,
  updateUserAttributes,
  updatePassword,
  confirmUserAttribute,
} from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";

const CustomInput = ({ field, form, placeholder, required, ...props }) => {
  return (
    <div className="border h-fit w-full px-4 bg-gray-100 flex items-center rounded-md relative">
      <input
        {...field}
        {...props}
        className="peer w-full py-4 bg-transparent focus:outline-0 placeholder:text-black/50 lg:placeholder:text-sm 2xl:placeholder:text-lg"
      />
      {!field.value && (
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
          {placeholder}
          {required && <span className="text-red-500"> *</span>}
        </span>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const [userAttributes, setUserAttributes] = useState(null);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { attributes } = await getCurrentUser();
        setUserAttributes({
          email: attributes?.email || "",
          email_verified: attributes?.email_verified || false,
        });
      } catch (error) {
        message.error("Error fetching user data");
      }
    };
    fetchUserData();
  }, []);

  const profileSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const passwordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Current Password is required"),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must include uppercase, lowercase, number, and special character"
      )
      .required("New Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleProfileSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await updateUserAttributes({
        userAttributes: {
          email: values.email,
        },
      });

      message.info("Verification code sent to your new email address");
      setVerifyingEmail(true);

      setSubmitting(false);
    } catch (error) {
      message.error(`Error updating profile: ${error.message}`);
      console.error("ERROR updating email", error);
      setSubmitting(false);
    }
  };

  const handleVerifyEmail = async () => {
    setVerifyingEmail(true);
    try {
      console.log("verifgicaiton code", verificationCode);

      await confirmUserAttribute({
        userAttributeKey: "email",
        confirmationCode: verificationCode,
      });

      message.success("Email verified successfully!");
      setVerifyingEmail(false);
      const { attributes } = await getCurrentUser();

      setUserAttributes({
        email: attributes?.email || "",
        email_verified: attributes?.email_verified || false,
      });
      setVerificationCode("");
      navigate("/profile");
    } catch (error) {
      message.error(`Error verifying email: ${error.message}`);
      setVerifyingEmail(false);
    }
  };

  const handlePasswordSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("password values", values);

    try {
      await updatePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      message.success("Password changed successfully!");
      resetForm();
      setSubmitting(false);
    } catch (error) {
      message.error(`Error changing password: ${error.message}`);
      setSubmitting(false);
    }
  };

  if (!userAttributes) return <div>Loading user data...</div>;

  return (
    <div className="flex flex-col gap-10 w-full px-4 xl:px-10 2xl:px-16 py-10">
      <div className="grid grid-cols-2 gap-10">
        {/* Email Update Form */}
        {/* <Formik
          initialValues={{ email: userAttributes.email }}
          validationSchema={profileSchema}
          onSubmit={handleProfileSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="col-span-2 xl:col-span-1 flex flex-col gap-5 border rounded-lg p-16 shadow-md">
              <h1 className="text-2xl font-bold mb-4">Update Email</h1>
              <div className="mb-4">
                <Field
                  name="email"
                  placeholder="Email"
                  required
                  component={CustomInput}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <Button
                htmlType="submit"
                className="w-fit p-6 text-base flex self-end"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                Update Email
              </Button>
            </Form>
          )}
        </Formik> */}
        <Formik
          initialValues={{ email: userAttributes.email }}
          validationSchema={profileSchema}
          onSubmit={handleProfileSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="col-span-2 xl:col-span-1 flex flex-col gap-5 border rounded-lg p-16 shadow-md">
              <h1 className="text-2xl font-bold mb-4">Update Email</h1>
              <div className="mb-4">
                <Field
                  name="email"
                  placeholder="Email"
                  required
                  component={CustomInput}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {verifyingEmail && (
                <div className="flex flex-col items-center justify-center h-screen">
                  <h2 className="text-2xl font-bold mb-4">Verify Email</h2>
                  <Input
                    placeholder="Verification Code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full mb-4"
                  />
                  <Button
                    type="primary"
                    onClick={handleVerifyEmail}
                    // loading={verifyingEmail}
                    disabled={!verificationCode}
                  >
                    Verify
                  </Button>
                </div>
              )}

              {/* {userAttributes && !userAttributes.email_verified && (
                <div>
                  <Input
                    placeholder="Verification Code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="mb-4"
                  />
                  <Button
                    type="primary"
                    onClick={handleVerifyEmail}
                    // loading={verifyingEmail}
                    // disabled={!verificationCode}
                  >
                    Verify
                  </Button>
                </div>
              )} */}

              <Button
                htmlType="submit"
                className="w-fit p-6 text-base flex self-end"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                Update Email
              </Button>
            </Form>
          )}
        </Formik>

        {/* Password Update Form */}
        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={passwordSchema}
          onSubmit={handlePasswordSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="col-span-2 xl:col-span-1 flex flex-col gap-5 border rounded-lg p-16 shadow-md">
              <h1 className="text-2xl font-bold mb-4">Update Password</h1>
              <div className="mb-4">
                <Field
                  name="oldPassword"
                  type="password"
                  placeholder="Current Password"
                  required
                  component={CustomInput}
                />
                <ErrorMessage
                  name="oldPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <Field
                  name="newPassword"
                  type="password"
                  placeholder="New Password"
                  required
                  component={CustomInput}
                />
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  required
                  component={CustomInput}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <Button
                htmlType="submit"
                className="w-fit p-6 text-base flex self-end"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                Update Password
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProfilePage;
