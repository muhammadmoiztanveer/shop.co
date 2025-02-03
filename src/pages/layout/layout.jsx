import { useEffect, useState } from "react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Breadcrumb, Spin } from "antd";
import { getCurrentUser } from "aws-amplify/auth";
import { v4 as uuid } from "uuid";

const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  async function currentAuthenticatedUser() {
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      console.log(`The username: ${username}`);
      console.log(`The userId: ${userId}`);
      console.log(`The signInDetails: ${signInDetails}`);

      setLoading(false);
    } catch (err) {
      console.log(err);
      navigate("/signin");
    }
  }

  useEffect(() => {
    currentAuthenticatedUser();
    // navigate("/home")
  }, []);

  const isHomePage = location.pathname === "/home";
  const pathArray = location.pathname.split("/").filter((part) => part);

  const breadcrumbItems = [
    {
      title: <Link to="/home">Home</Link>,
    },
    ...pathArray.map((part, index) => ({
      title: (
        <Link to={`/${pathArray.slice(0, index + 1).join("/")}`} key={uuid()}>
          {capitalize(part)}
        </Link>
      ),
    })),
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {!isHomePage && (
        <Breadcrumb
          items={breadcrumbItems}
          className="px-4 sm:px-8 lg:px-10 2xl:px-16 mt-10"
        />
      )}
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
