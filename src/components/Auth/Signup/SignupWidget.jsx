import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiRequest from "../../../../utils/apiRequest";
import languageModel from "../../../../utils/languageModel";
import settings from "../../../../utils/settings";
import countries from "../../../data/CountryCodes.json";
import InputCom from "../../Helpers/InputCom";
import LoaderStyleOne from "../../Helpers/Loaders/LoaderStyleOne";

function SignupWidget({ redirect = true, signupActionPopup, changeContent }) {
  const router = useRouter();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+880");
  const [getCountries, setGetCountries] = useState(null);
  const [countryDropToggle, setCountryDropToggle] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("BD");
  const selectCountryhandler = (value) => {
    setSelectedCountry(value.code);
    setPhone(value.dial_code);
    setCountryDropToggle(false);
  };
  useEffect(() => {
    if (!getCountries) {
      setGetCountries(countries && countries.countries);
    }
  }, [getCountries]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checked, setCheck] = useState(false);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [langCntnt, setLangCntnt] = useState(null);
  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);
  const rememberMe = () => {
    setCheck(!checked);
  };
  const doSignup = async () => {
    setLoading(true);
    await apiRequest
      .signup({
        name: fname + " " + lname,
        email: email,
        password: password,
        password_confirmation: confirmPassword,
        agree: checked ? 1 : "",
        phone: phone ? phone : "",
      })
      .then((res) => {
        setLoading(false);
        toast.success(res.data.notification);
        if (redirect) {
          router.push(`/verify-you?email=${email}`);
        } else {
          changeContent();
        }
        setFname("");
        setLname("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setCheck(false);
      })
      .catch((err) => {
        setLoading(false);
        setErrors(err.response && err.response.data.errors);
        if(err.response.status===403){
          toast.error( err.response.data.message);
        }
      });
  };
  const { phone_number_required, default_phone_code } = settings();
  useEffect(() => {
    if (default_phone_code) {
      let defaultCountry =
        getCountries &&
        getCountries.length > 0 &&
        getCountries.find((item) => item.code === default_phone_code);
      if (defaultCountry) {
        setPhone(defaultCountry.dial_code);
        setSelectedCountry(defaultCountry.code);
      }
    }
  }, [default_phone_code, getCountries]);
  return (
    <div className="w-full lg:h-auto h-full overflow-y-scroll overflow-style-none">
      <div className="title-area flex flex-col justify-center items-center relative text-center mb-7">
        <h1 className="text-[34px] font-bold text-qblack">
          {langCntnt && langCntnt.Create_Account}
        </h1>
      </div>
      <div className="input-area">
        <div className="flex sm:flex-row flex-col space-y-5 sm:space-y-0 sm:space-x-5 mb-5">
          <div className="h-full">
            <InputCom
              placeholder={langCntnt && langCntnt.First_Name}
              label={langCntnt && langCntnt.First_Name + "*"}
              name="fname"
              type="text"
              inputClasses="h-[50px]"
              value={fname}
              inputHandler={(e) => setFname(e.target.value)}
            />
            {errors && Object.hasOwn(errors, "name") ? (
              <span className="text-sm mt-1 text-qred">{errors.name[0]}</span>
            ) : (
              ""
            )}
          </div>
          <div className="h-full">
            <InputCom
              placeholder={langCntnt && langCntnt.Last_Name}
              label={langCntnt && langCntnt.Last_Name + "*"}
              name="lname"
              type="text"
              inputClasses="h-[50px]"
              value={lname}
              inputHandler={(e) => setLname(e.target.value)}
            />
            {errors && Object.hasOwn(errors, "name") ? (
              <span className="text-sm mt-1 text-qred">{errors.name[0]}</span>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="input-item mb-5">
          <InputCom
            placeholder={langCntnt && langCntnt.Email}
            label={langCntnt && langCntnt.Email_Address + "*"}
            name="email"
            type="email"
            inputClasses="h-[50px]"
            value={email}
            error={!!(errors && Object.hasOwn(errors, "email"))}
            inputHandler={(e) => setEmail(e.target.value)}
          />
          {errors && Object.hasOwn(errors, "email") ? (
            <span className="text-sm mt-1 text-qred">{errors.email[0]}</span>
          ) : (
            ""
          )}
        </div>
        {parseInt(phone_number_required) === 1 && (
          <div className="input-item mb-5 relative">
            <InputCom
              placeholder={langCntnt && langCntnt.Phone_Number}
              label={langCntnt && langCntnt.phone + "*"}
              name="phone"
              type="text"
              inputClasses="h-[50px] placeholder:capitalize pl-20"
              value={phone}
              error={!!(errors && Object.hasOwn(errors, "phone"))}
              inputHandler={(e) => setPhone(e.target.value)}
            />
            {errors && Object.hasOwn(errors, "phone") ? (
              <span className="text-sm mt-1 text-qred">{errors.phone[0]}</span>
            ) : (
              ""
            )}
            <button
              onClick={() => setCountryDropToggle(!countryDropToggle)}
              type="button"
              className="w-[70px] h-[50px] bg-qpurplelow/10 absolute left-0 top-[29px] flex justify-center items-center"
            >
              <div className="flex items-center">
                <span>
                  <Image
                    width="30"
                    height="20"
                    src={`/assets/images/countries/${selectedCountry}.svg`}
                    alt="country"
                  />
                </span>
                <span className="text-qgray">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M12 14l-4-4h8z" />
                  </svg>
                </span>
              </div>
            </button>
            <div
              style={{
                boxShadow: "rgb(0 0 0 / 14%) 0px 15px 50px 0px",
                display: countryDropToggle ? "block" : "none",
              }}
              className="country-dropdown-list w-[250px] h-[250px] bg-white absolute left-0 top-[80px] z-20 overflow-y-scroll"
            >
              <ul>
                {getCountries &&
                  getCountries.length > 0 &&
                  getCountries.map((item, i) => (
                    <li
                      onClick={() => selectCountryhandler(item)}
                      key={i}
                      className="flex space-x-1.5 items-center px-3 py-1 cursor-pointer"
                    >
                      <span className="w-[25px]">
                        <Image
                          width="25"
                          height="15"
                          src={`/assets/images/countries/${item.code}.svg`}
                          alt="country"
                        />
                      </span>
                      <span className="text-sm text-qgray capitalize flex-1">
                        {item.name}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}

        <div className="flex sm:flex-row flex-col space-y-5 sm:space-y-0 sm:space-x-5 mb-5">
          <div className="h-full">
            <InputCom
              placeholder="******"
              label={langCntnt && langCntnt.Password + "*"}
              name="password"
              type="password"
              inputClasses="h-[50px]"
              value={password}
              inputHandler={(e) => setPassword(e.target.value)}
            />
            {errors && Object.hasOwn(errors, "password") ? (
              <span className="text-sm mt-1 text-qred">
                {errors.password[0]}
              </span>
            ) : (
              ""
            )}
          </div>
          <div className="h-full">
            <InputCom
              placeholder="******"
              label={langCntnt && langCntnt.Confirm_Password + "*"}
              name="confirm_password"
              type="password"
              inputClasses="h-[50px]"
              value={confirmPassword}
              inputHandler={(e) => setConfirmPassword(e.target.value)}
            />
            {errors && Object.hasOwn(errors, "password") ? (
              <span className="text-sm mt-1 text-qred">
                {errors.password[0]}
              </span>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="forgot-password-area mb-7">
          <div className="remember-checkbox flex items-center space-x-2.5">
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
            {redirect ? (
              <Link href="/seller-terms-condition" legacyBehavior>
                <span className="text-base text-qblack cursor-pointer">
                  {langCntnt &&
                    langCntnt.I_agree_all_terms_and_condition_in_ecoShop}
                </span>
              </Link>
            ) : (
              <button type="button">
                <span className="text-base text-black cursor-pointer">
                  {langCntnt &&
                    langCntnt.I_agree_all_terms_and_condition_in_ecoShop}
                </span>
              </button>
            )}
          </div>
        </div>
        <div className="signin-area mb-3">
          <div className="flex justify-center">
            <button
              onClick={doSignup}
              type="button"
              disabled={checked ? false : true}
              className="bg-qpurple rounded-full disabled:bg-opacity-60 disabled:cursor-not-allowed  w-full h-[50px] font-semibold flex justify-center bg-purple items-center"
            >
              <span className="text-sm text-white block">
                {langCntnt && langCntnt.Create_Account}
              </span>
              {loading && (
                <span className="w-5 " style={{ transform: "scale(0.3)" }}>
                  <LoaderStyleOne />
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="signup-area flex justify-center">
          <p className="text-base text-qgray font-normal">
            {langCntnt && langCntnt.Already_have_an_Account}?
            {redirect ? (
              (<Link href="/login" passhref rel="noopener noreferrer">

                <span className="ml-2 text-qblack cursor-pointer">
                  {langCntnt && langCntnt.Log_In}
                </span>

              </Link>)
            ) : (
              <button onClick={signupActionPopup} type="button">
                <span className="ml-2 text-qblack cursor-pointer ml-1">
                  {langCntnt && langCntnt.Log_In}
                </span>
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupWidget;
