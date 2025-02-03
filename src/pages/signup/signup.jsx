import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { signUp, getCurrentUser } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

const SignupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthSession = async () => {
      try {
        await getCurrentUser();
        navigate("/home");
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    checkAuthSession();
  }, [navigate]);

  const initialValues = {
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
    phoneNumber: Yup.string()
      .matches(
        /^\+[1-9]\d{1,3}\d{4,14}$/,
        "Invalid phone number. Must be in E.164 format (e.g., +123456789)."
      )
      .required("Phone number is required"),
  });

  const onSubmit = async (values) => {
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: values.email,
        password: values.password,
        options: {
          userAttributes: {
            email: values.email,
            phone_number: values.phoneNumber,
            "custom:type": "User",
            "custom:status": "Active",
          },
          autoSignIn: true,
        },
      });

      console.log(
        "isSignUpComplete",
        isSignUpComplete,
        "userId",
        userId,
        "nextStep",
        nextStep
      );

      navigate("/verify-registration-otp", {
        state: { username: values.email },
      });
    } catch (error) {
      console.log("Error signing up:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-semibold mb-4">Local User Sign Up</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form>
            <div className="mb-4">
              <Field
                type="email"
                name="email"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="mb-4">
              <Field
                type="password"
                name="password"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="mb-4">
              <Field
                type="password"
                name="confirmPassword"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Confirm Password"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="mb-4">
              <Field
                type="text"
                name="phoneNumber"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Phone Number"
              />
              <ErrorMessage
                name="phoneNumber"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded hover:bg-black/50"
            >
              Sign Up
            </button>
          </Form>
        </Formik>
        {/* <button
          onClick={() => handleSignInClick({ customState: "example" })}
          className="mt-4 w-full bg-black text-white p-2 rounded hover:bg-black/50"
        >
          Sign In with Google
        </button> */}
      </div>
    </div>
  );
};

export default SignupPage;
