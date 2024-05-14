import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import languageModel from "../../../../utils/languageModel";
import Layout from "../../Partials/Layout";
import SignupWidget from "./SignupWidget";
import VerifyWidget from "./VerifyWidget";

export default function Signup() {
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const [verify, setVerify] = useState(false);
  const [signupView, setSignupView] = useState(false);
  const [imgThumb, setImgThumb] = useState(null);
  const [langCntnt, setLangCntnt] = useState(null);
  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);
  useEffect(() => {
    if (websiteSetup) {
      setImgThumb(websiteSetup.payload.login_page_image);
    }
  }, [websiteSetup]);

  const location = useRouter();
  useEffect(() => {
    if (location.route === "/verify-you") {
      setVerify(true);
    } else {
      setSignupView(true);
    }
  }, [location]);

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="login-page-wrapper w-full h-[1055px] lg:h-[895px] sm:h-[896px] relative">
        <div className="w-full h-full absolute left-0 top-0">
          <div className="w-full h-full relative z-10">
            {imgThumb && (
              <Image
                layout="fill"
                src={`${process.env.NEXT_PUBLIC_BASE_URL + imgThumb.image}`}
                alt="login"
              />
            )}
            <div className="bg-[#232532] bg-opacity-50 relative w-full h-full absolute left-0 top-0"></div>
          </div>
        </div>
        <div className="container-x mx-auto">
          <div className="lg:flex justify-center items-center relative w-full lg:min-h-[700px]  py-[60px]">
            {verify ? (
              <div className="lg:w-[572px] w-full lg:h-[700px] bg-white flex flex-col justify-center sm:p-10 p-5 border border-qpurplelow/10 rounded-lg relative z-20">
                <VerifyWidget />
              </div>
            ) : signupView ? (
              <div className="lg:w-[572px] w-full lg:h-auto bg-white flex flex-col justify-center sm:p-10 p-5 border border-qpurplelow/10 rounded-lg relative z-20">
                <SignupWidget />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
