import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import apiRequest from "../../../../utils/apiRequest";
import languageModel from "../../../../utils/languageModel";
import { fetchWishlist } from "../../../store/wishlistData";
import LoginContext from "../../Contexts/LoginContexts";
import InputCom from "../../Helpers/InputCom";
import LoaderStyleOne from "../../Helpers/Loaders/LoaderStyleOne";

const SEND = ({ action, des, btn }) => {
  return (
    <div>
      <p className="text-xs text-qblack">{des}</p>
      <button
        type="button"
        onClick={action}
        className="text-sm text-blue-500 font-bold mt-2"
      >
        {btn}
      </button>
    </div>
  );
};

function LoginWidget({ redirect = true, loginActionPopup, notVerifyHandler }) {
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const loginPopupBoard = useContext(LoginContext);
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checked, setValue] = useState(false);
  const [langCntnt, setLangCntnt] = useState(null);
  const [defaultProfileImg, setDefault] = useState(null);
  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);

  useEffect(() => {
    if (!defaultProfileImg) {
      if (websiteSetup) {
        setDefault(websiteSetup.payload.defaultProfile);
      }
    }
  }, [defaultProfileImg]);
  const rememberMe = () => {
    setValue(!checked);
  };
  const sendOtpHandler = () => {
    apiRequest
      .resend({
        email: email,
      })
      .then(() => {
        router.push(`/verify-you?email=${email}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const doLogin = async () => {
    setLoading(true);
    await apiRequest
      .login({
        email: email,
        password: password,
      })
      .then((res) => {
        setLoading(false);
        toast.success(langCntnt && langCntnt.Login_Successfully);
        setEmail("");
        setPassword("");
        localStorage.removeItem("auth");
        localStorage.setItem("auth", JSON.stringify(res.data));
        const activeUser = res.data && {
          name: res.data.user.name,
          phone: res.data.user.phone,
          image: res.data.user.image
            ? res.data.user.image
            : defaultProfileImg && defaultProfileImg.image,
        };
        if (activeUser) {
          localStorage.setItem("active-user", JSON.stringify(activeUser));
        }
        dispatch(fetchWishlist());
        if (redirect) {
          router.push("/");
        } else {
          if (res.data) {
            loginPopupBoard.handlerPopup(false);
          }
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          if (
            err.response.data.notification ===
            "Please verify your acount. If you didn't get OTP, please resend your OTP and verify"
          ) {
            toast.warn(
              <SEND
                des={
                  langCntnt &&
                  langCntnt.Please_verify_your_account__If_you_didnt_get_OTP__please_resend_your_OTP_and_verify
                }
                action={sendOtpHandler}
                btn={langCntnt && langCntnt.Send_OTP}
              />,
              {
                autoClose: 5000,
                icon: false,
                theme: "colored",
              }
            );
          } else {
            toast.error(langCntnt && langCntnt.Invalid_Credentials);
          }
        } else {
          return false;
        }
        console.log(err);
      });
  };
  return (
    <div className="w-full">
      <div className="title-area flex flex-col justify-center items-center relative text-center mb-7">
        <h1 className="text-[34px] font-bold leading-0 text-qblack">
          {langCntnt && langCntnt.Log_In}
        </h1>
      </div>
      <div className="input-area">
        <div className="input-item mb-5">
          <InputCom
            placeholder={langCntnt && langCntnt.Email}
            label={langCntnt && langCntnt.Email_Address + "*"}
            name="email"
            type="email"
            inputClasses="h-[50px]"
            inputHandler={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="input-item mb-5">
          <InputCom
            placeholder="******"
            label={langCntnt && langCntnt.Password + "*"}
            name="password"
            type="password"
            inputClasses="h-[50px]"
            inputHandler={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div className="forgot-password-area flex justify-between items-center mb-7">
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
            <span onClick={rememberMe} className="text-base text-qblack">
              {langCntnt && langCntnt.Remember_Me}
            </span>
          </div>
          {redirect && (
            <Link href="/forgot-password" legacyBehavior>
              <span className="text-base text-qpurple cursor-pointer">
                {langCntnt && langCntnt.Forgot_password}?
              </span>
            </Link>
          )}
        </div>
        <div className="signin-area mb-3.5">
          <div className="flex justify-center">
            <button
              onClick={doLogin}
              type="button"
              className="bg-qpurple rounded-full text-sm text-white w-full h-[50px] font-semibold flex justify-center bg-purple items-center"
            >
              <span>{langCntnt && langCntnt.Log_In}</span>
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
            {langCntnt && langCntnt.Dontt_have_an_account} ?
            {redirect ? (
              (<Link href="/signup" passhref rel="noopener noreferrer">

                <span className="ml-2 text-qblack cursor-pointer capitalize">
                  {langCntnt && langCntnt.sign_up_free}
                </span>

              </Link>)
            ) : (
              <button onClick={loginActionPopup} type="button">
                <span className="ml-2 text-qblack cursor-pointer capitalize">
                  {langCntnt && langCntnt.sign_up_free}
                </span>
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginWidget;
