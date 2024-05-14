import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import isMultivendor from "../../../Middleware/isMultivendor";
import auth from "../../../utils/auth";
import InputCom from "../Helpers/InputCom";
import PageTitle from "../Helpers/PageTitle";
import languageModel from "../../../utils/languageModel";
import { useSelector } from "react-redux";
function BecomeSaller() {
  const router = useRouter();
  const [logoImg, setLogoImg] = useState(null);
  const [coverImg, setCoverImg] = useState(null);
  const [checked, setCheck] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shopName, setName] = useState("");
  const [shopAddress, setAddress] = useState("");
  const [errors, setErrors] = useState(null);
  let [uploadProgress, setProgress] = useState(0);
  const [uploadLogo, setUploadLogo] = useState(null);
  const [uploadCoverImg, setUploadCoverImg] = useState(null);
  const [langCntnt, setLangCntnt] = useState(null);
  const [defaultCover, setDefaultCover] = useState(null);
  const [defaultLogo, setLogo] = useState(null);
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  useEffect(() => {
    if (!defaultCover || !defaultLogo) {
      if (websiteSetup) {
        setDefaultCover(
          websiteSetup.payload?.image_content.become_seller_banner
        );
        setLogo(websiteSetup.payload?.image_content.become_seller_avatar);
      }
    }
  }, [defaultCover, defaultLogo, websiteSetup]);
  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);
  // logo img
  const logoImgInput = useRef(null);
  const browseLogoImg = () => {
    logoImgInput.current.click();
  };
  const logoImgChangHandler = (e) => {
    if (e.target.value !== "") {
      const imgReader = new FileReader();
      imgReader.onload = (event) => {
        setLogoImg(event.target.result);
      };
      imgReader.readAsDataURL(e.target.files[0]);
      setUploadLogo(e.target.files[0]);
    }
  };
  const coverImgInput = useRef(null);
  const browseCoverImg = () => {
    coverImgInput.current.click();
  };
  const coverImgChangHandler = (e) => {
    if (e.target.value !== "") {
      const imgReader = new FileReader();
      imgReader.onload = (event) => {
        setCoverImg(event.target.result);
      };
      imgReader.readAsDataURL(e.target.files[0]);
      setUploadCoverImg(e.target.files[0]);
    }
  };
  const rememberMe = () => {
    setCheck(!checked);
  };
  const sellerReq = async () => {
    if (auth()) {
      const formData = new FormData();
      formData.append("banner_image", uploadCoverImg);
      formData.append("shop_name", shopName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("address", shopAddress);
      formData.append("open_at", "10.00AM");
      formData.append("closed_at", "10.00PM");
      formData.append("agree_terms_condition", checked);
      formData.append("logo", uploadLogo);
      const options = {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percent = Math.floor((loaded * 100) / total);
          setProgress(percent);
        },
      };
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/seller-request?token=${
            auth().access_token
          }`,
          formData,
          options
        )
        .then((res) => {
          toast.success(
            langCntnt &&
              langCntnt.Congratulation_Your_seller_request_successfully_delivered
          );
          router.push("/");
        })
        .catch((err) => {
          setErrors(err.response && err.response.data.errors);
        });
    } else {
      router.push("/login");
      toast.warn("Please Login First");
    }
  };
  return (
    <div className="become-saller-wrapper w-full bg-white">
      <div className="title mb-10">
        <PageTitle
          title="Seller Application"
          breadcrumb={[
            { name: "home", path: "/" },
            { name: "Become Seller", path: "/become-seller" },
          ]}
        />
      </div>
      <div className="content-wrapper w-full pb-[120px]">
        <div className="container-x mx-auto">
          <div
            className="w-full bg-white sm:p-[30px] p-3"
            style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 15px 64px" }}
          >
            <div className="flex xl:flex-row flex-col-reverse xl:space-x-11">
              <div className="xl:w-[824px]">
                <div className="title w-full mb-5">
                  <h1 className="text-[22px] font-semibold text-qblack mb-1">
                    {langCntnt && langCntnt.Seller_Information}
                  </h1>
                  <p className="text-[15px] text-qgray">
                    {langCntnt &&
                      langCntnt.Fill_the_form_below_or_write_us_We_will_help_you_as_soon_as_possible}
                  </p>
                </div>
                <div className="input-area mb-10">
                  <div className="mb-5">
                    <InputCom
                      placeholder={langCntnt && langCntnt.Email}
                      label={langCntnt && langCntnt.Email_Address + "*"}
                      name="email"
                      type="email"
                      inputClasses="h-[50px]"
                      value={email}
                      inputHandler={(e) => setEmail(e.target.value)}
                      error={!!(errors && Object.hasOwn(errors, "email"))}
                    />
                    {errors && Object.hasOwn(errors, "email") ? (
                      <span className="text-sm mt-1 text-qred">
                        {errors.email[0]}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="mb-5">
                    <InputCom
                      placeholder={langCntnt && langCntnt.phone}
                      label={langCntnt && langCntnt.phone}
                      name="phone"
                      type="text"
                      inputClasses="h-[50px]"
                      value={phone}
                      inputHandler={(e) => setPhone(e.target.value)}
                      error={!!(errors && Object.hasOwn(errors, "phone"))}
                    />
                    {errors && Object.hasOwn(errors, "phone") ? (
                      <span className="text-sm mt-1 text-qred">
                        {errors.phone[0]}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="title w-full mb-5">
                  <h1 className="text-[22px] font-semibold text-qblack mb-1">
                    {langCntnt && langCntnt.Shop_Information}
                  </h1>
                  <p className="text-[15px] text-qgray">
                    {langCntnt &&
                      langCntnt.Fill_the_form_below_or_write_us_We_will_help_you_as_soon_as_possible}
                  </p>
                </div>
                <div className="input-area">
                  <div className="mb-5">
                    <InputCom
                      placeholder={langCntnt && langCntnt.Name}
                      label={langCntnt && langCntnt.Shop_Name + "*"}
                      name="shopname"
                      type="text"
                      inputClasses="h-[50px]"
                      value={shopName}
                      inputHandler={(e) => setName(e.target.value)}
                      error={!!(errors && Object.hasOwn(errors, "shop_name"))}
                    />
                    {errors && Object.hasOwn(errors, "shop_name") ? (
                      <span className="text-sm mt-1 text-qred">
                        {errors.shop_name[0]}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="mb-5">
                    <InputCom
                      placeholder={langCntnt && langCntnt.Your_address_Here}
                      label={langCntnt && langCntnt.Address + "*"}
                      name="shopaddress"
                      type="text"
                      inputClasses="h-[50px]"
                      value={shopAddress}
                      inputHandler={(e) => setAddress(e.target.value)}
                      error={!!(errors && Object.hasOwn(errors, "address"))}
                    />
                    {errors && Object.hasOwn(errors, "address") ? (
                      <span className="text-sm mt-1 text-qred">
                        {errors.address[0]}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="remember-checkbox flex items-center space-x-2.5 mb-10">
                    <button
                      onClick={rememberMe}
                      type="button"
                      className="w-5 h-5 text-qblack flex justify-center items-center border border-light-gray"
                    >
                      {checked && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                    <Link href="/seller-terms-condition" legacyBehavior>
                      <span className="text-base text-qblack cursor-pointer">
                        {langCntnt &&
                          langCntnt.I_agree_all_terms_and_condition_in_ecoShop}
                      </span>
                    </Link>
                  </div>

                  <div className="signin-area mb-3">
                    <div className="flex justify-start">
                      <button
                        onClick={sellerReq}
                        disabled={
                          email &&
                          checked &&
                          coverImg &&
                          logoImg &&
                          phone &&
                          shopName &&
                          shopAddress &&
                          logoImg &&
                          coverImg
                            ? false
                            : true
                        }
                        type="button"
                        className="rounded-full disabled:bg-opacity-60 disabled:cursor-not-allowed  text-base text-white w-[490px] h-[50px] font-semibold flex justify-center bg-qpurple items-center"
                      >
                        <span>
                          {langCntnt && langCntnt.Create_Seller_Account}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="signup-area flex justify-start">
                    <p className="text-base text-qgray font-normal">
                      {langCntnt && langCntnt.Already_have_an_Account}?
                      <Link href="/login" legacyBehavior>
                        <span className="ml-2 text-qblack cursor-pointer">
                          {langCntnt && langCntnt.Log_In}
                        </span>
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 mb-10 xl:mb-0">
                <div className="update-logo w-full mb-9">
                  <h1 className="text-xl tracking-wide font-bold text-qblack flex items-center mb-2">
                    {langCntnt && langCntnt.Update_Logo}
                  </h1>
                  <p className="text-sm text-qgray mb-5">
                    {langCntnt && langCntnt.Profile_of_at_least_Size}
                    <span className="ml-1 text-qblack">300x300</span>.{" "}
                    {langCntnt && langCntnt.Gifs_work_too}.
                    <span className="ml-1 text-qblack">
                      {langCntnt && langCntnt.Max_5mb}
                    </span>
                    .
                  </p>
                  <div className="flex xl:justify-center justify-start">
                    <div className="relative">
                      <div className="sm:w-[198px] sm:h-[198px] w-[199px] h-[199px] rounded-full overflow-hidden relative">
                        {defaultLogo && (
                          <Image
                            objectFit="cover"
                            layout="fill"
                            src={
                              logoImg
                                ? logoImg
                                : defaultLogo &&
                                  process.env.NEXT_PUBLIC_BASE_URL + defaultLogo
                            }
                            alt=""
                          />
                        )}
                      </div>
                      <input
                        ref={logoImgInput}
                        onChange={(e) => logoImgChangHandler(e)}
                        type="file"
                        className="hidden"
                      />
                      <div
                        onClick={browseLogoImg}
                        className="w-[32px] h-[32px] absolute bottom-7 sm:right-0 right-[105px] bg-qpurple rounded-full cursor-pointer"
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.5147 11.5C17.7284 12.7137 18.9234 13.9087 20.1296 15.115C19.9798 15.2611 19.8187 15.4109 19.6651 15.5683C17.4699 17.7635 15.271 19.9587 13.0758 22.1539C12.9334 22.2962 12.7948 22.4386 12.6524 22.5735C12.6187 22.6034 12.5663 22.6296 12.5213 22.6296C11.3788 22.6334 10.2362 22.6297 9.09365 22.6334C9.01498 22.6334 9 22.6034 9 22.536C9 21.4009 9 20.2621 9.00375 19.1271C9.00375 19.0746 9.02997 19.0109 9.06368 18.9772C10.4123 17.6249 11.7609 16.2763 13.1095 14.9277C14.2295 13.8076 15.3459 12.6913 16.466 11.5712C16.4884 11.5487 16.4997 11.5187 16.5147 11.5Z"
                            fill="white"
                          />
                          <path
                            d="M20.9499 14.2904C19.7436 13.0842 18.5449 11.8854 17.3499 10.6904C17.5634 10.4694 17.7844 10.2446 18.0054 10.0199C18.2639 9.76139 18.5261 9.50291 18.7884 9.24443C19.118 8.91852 19.5713 8.91852 19.8972 9.24443C20.7251 10.0611 21.5492 10.8815 22.3771 11.6981C22.6993 12.0165 22.7105 12.4698 22.3996 12.792C21.9238 13.2865 21.4443 13.7772 20.9686 14.2717C20.9648 14.2792 20.9536 14.2867 20.9499 14.2904Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="update-cover w-full">
                  <h1 className="text-xl tracking-wide font-bold text-qblack flex items-center mb-2">
                    {langCntnt && langCntnt.Update_Cover}
                  </h1>
                  <p className="text-sm text-qgray mb-5">
                    {langCntnt && langCntnt.Cover_of_at_least_Size}
                    <span className="ml-1 text-qblack">1170x920</span>.
                  </p>
                  <div className="flex justify-center">
                    <div className="w-full relative">
                      <div className="w-full h-[120px] object-cover">
                        <div className="w-full h-full rounded-lg overflow-hidden relative">
                          {defaultCover && (
                            <Image
                              layout="fill"
                              src={
                                coverImg
                                  ? coverImg
                                  : defaultCover &&
                                    process.env.NEXT_PUBLIC_BASE_URL +
                                      defaultCover
                              }
                              alt=""
                            />
                          )}
                        </div>
                      </div>

                      <input
                        ref={coverImgInput}
                        onChange={(e) => coverImgChangHandler(e)}
                        type="file"
                        className="hidden"
                      />
                      <div
                        onClick={browseCoverImg}
                        className="w-[32px] h-[32px] absolute -bottom-4 right-4 bg-qpurple rounded-full cursor-pointer"
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.5147 11.5C17.7284 12.7137 18.9234 13.9087 20.1296 15.115C19.9798 15.2611 19.8187 15.4109 19.6651 15.5683C17.4699 17.7635 15.271 19.9587 13.0758 22.1539C12.9334 22.2962 12.7948 22.4386 12.6524 22.5735C12.6187 22.6034 12.5663 22.6296 12.5213 22.6296C11.3788 22.6334 10.2362 22.6297 9.09365 22.6334C9.01498 22.6334 9 22.6034 9 22.536C9 21.4009 9 20.2621 9.00375 19.1271C9.00375 19.0746 9.02997 19.0109 9.06368 18.9772C10.4123 17.6249 11.7609 16.2763 13.1095 14.9277C14.2295 13.8076 15.3459 12.6913 16.466 11.5712C16.4884 11.5487 16.4997 11.5187 16.5147 11.5Z"
                            fill="white"
                          />
                          <path
                            d="M20.9499 14.2904C19.7436 13.0842 18.5449 11.8854 17.3499 10.6904C17.5634 10.4694 17.7844 10.2446 18.0054 10.0199C18.2639 9.76139 18.5261 9.50291 18.7884 9.24443C19.118 8.91852 19.5713 8.91852 19.8972 9.24443C20.7251 10.0611 21.5492 10.8815 22.3771 11.6981C22.6993 12.0165 22.7105 12.4698 22.3996 12.792C21.9238 13.2865 21.4443 13.7772 20.9686 14.2717C20.9648 14.2792 20.9536 14.2867 20.9499 14.2904Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="bg-qpurple"
            style={{ width: `${uploadProgress}%`, height: "2px" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
export default isMultivendor(BecomeSaller);
