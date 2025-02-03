import React, { useState } from "react";
import { Button } from "antd";
import {
  SearchOutlined,
  TwitterCircleFilled,
  FacebookFilled,
  InstagramFilled,
  GithubFilled,
  MailOutlined,
} from "@ant-design/icons";
import Visa from "@/assets/visa.png";
import MasterCard from "@/assets/master-card.png";
import PayPal from "@/assets/paypal.png";
import ApplePay from "@/assets/apple-pay.png";
import GooglePay from "@/assets/google-pay.png";

const Footer = () => {
  return (
    <div>
      <div className="w-full border border-[#f0f0f0] text-[#7c7b7b] bg-[#f0f0f0] px-4 sm:px-8 lg:px-10 2xl:px-16 mt-24">
        <div className="flex flex-col md:flex-row justify-between gap-6 bg-black p-8 -mt-24 rounded-3xl">
          <div className="text-white text-4xl xl:text-5xl flex items-center text-center md:text-start leading-tight 2xl:leading-none">
            STAY UPTO DATE ABOUT OUR LATEST OFFERS
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex px-4 rounded-full bg-gray-100 flex items-center w-full space-x-4">
              <MailOutlined className="text-2xl -mt-0.5" />
              <input
                type="text"
                className="w-full xl:w-72 2xl:w-96 py-3 bg-transparent focus:outline-0 placeholder:text-black/50 placeholder:text-xs sm:placeholder:text-sm lg:placeholder:text-base xl:placeholder:text-lg"
                placeholder="Enter your email address"
              />
            </div>

            <Button
              variant="solid"
              shape="round"
              className="w-full border py-6 text-base xl:text-lg bg-white text-black"
            >
              Subscribe to NewsLetter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 border-b py-16 gap-6 md:gap-1 lg:gap-0">
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-6 sm:mb-6 md:mb-8 lg:mb-0">
            <div className="text-2xl 2xl:text-4xl text-black">SHOP.CO</div>
            <div className="text-sm md:text-base">
              We have clothes that suits your style and which you’re proud to
              wear. From women to men.
            </div>
            <div className="flex text-black gap-4">
              <TwitterCircleFilled style={{ fontSize: "22px" }} />
              <FacebookFilled style={{ fontSize: "22px" }} />
              <InstagramFilled style={{ fontSize: "22px" }} />
              <GithubFilled style={{ fontSize: "22px" }} />
            </div>
          </div>

          <div className="col-span-1 flex justify-end">
            <div className="text-sm md:text-base flex flex-col xl:justify-between pt-1 gap-3 w-full lg:w-fit h-full">
              <div className="text-lg tracking-widest text-black mb-2 font-light">
                COMPANY
              </div>
              <a href="#">About</a>
              <a href="#">Features</a>
              <a href="#">Works</a>
              <a href="#">Careers</a>
            </div>
          </div>

          <div className="col-span-1 flex justify-end">
            <div className="text-sm md:text-base flex flex-col xl:justify-between pt-1 gap-3 w-full lg:w-fit h-full">
              <div className="text-lg tracking-widest text-black mb-2 font-light">
                HELP
              </div>
              <a href="#">Customer Support</a>
              <a href="#">Delivery Details</a>
              <a href="#">Terms & Conditions</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>

          <div className="col-span-1 flex justify-end">
            <div className="text-sm md:text-base flex flex-col xl:justify-between pt-1 gap-3 w-full lg:w-fit h-full">
              <div className="text-lg tracking-widest text-black mb-2 font-light">
                FAQ
              </div>
              <a href="#">Account</a>
              <a href="#">Manage Deliveries</a>
              <a href="#">Orders</a>
              <a href="#">Payments</a>
            </div>
          </div>

          <div className="col-span-1 flex justify-end">
            <div className="text-sm md:text-base flex flex-col xl:justify-between pt-1 gap-3 w-full lg:w-fit h-full">
              <div className="text-lg tracking-widest text-black mb-2 font-light">
                Free eBooks
              </div>
              <a href="#">Development Tutorial</a>
              <a href="#">How to - Blog</a>
              <a href="#">Works</a>
              <a href="#">Youtube Playlist</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center md:justify-between py-4">
          <div className="flex items-center text-sm md:text-base">
            Shop.co © 2000-2025, All Rights Reserved
          </div>

          <div className="flex h-fit md:gap-1 ">
            <img src={Visa} alt="Visa" className="h-10 md:h-12" />
            <img src={MasterCard} alt="Master Card" className="h-10 md:h-12" />
            <img src={PayPal} alt="PayPal" className="h-10 md:h-12" />
            <img src={ApplePay} alt="Apple Pay" className="h-10 md:h-12" />
            <img src={GooglePay} alt="Google Pay" className="h-10 md:h-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
