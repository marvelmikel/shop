import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../store/Cart";
import { fetchCompareProducts } from "../../store/compareProduct";
import { setupAction } from "../../store/websiteSetup";
import { fetchWishlist } from "../../store/wishlistData";
import languageModel from "../../../utils/languageModel";
import LoginContext from "../Contexts/LoginContexts";
import Script from "next/script";
import Consent from "../Helpers/Consent";
import { useRouter } from "next/router";
import apiRequest from "../../../utils/apiRequest";
import { toast } from "react-toastify";
import auth from "../../../utils/auth";
import LoginWidget from "../Auth/Login/LoginWidget";
import SignupWidget from "../Auth/Signup/SignupWidget";
import VerifyWidget from "../Auth/Signup/VerifyWidget";
import hexToRgb from "../../../utils/hexToRgb";
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';

function DefaultLayout({ children }) {
  const router = useRouter();
  const getLoginContexts = useContext(LoginContext);
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();
  const [gtagId, setgTagId] = useState(null);
  const [twkData, setTwkData] = useState(null);
  const [fbPixexl, setFbPixel] = useState(null);
  const [popupView, setPopupView] = useState("login");
  const [langCntnt, setLangCntnt] = useState(null);
  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);
  const apiFetch = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}api/website-setup`)
      .then((res) => {
        // handle success
        dispatch(setupAction(res.data));
        localStorage.setItem(
          "settings",
          JSON.stringify(res.data && res.data.setting)
        );
        localStorage.setItem(
          "language",
          JSON.stringify(res.data && res.data.language)
        );
        if (res.data) {
          setgTagId(res.data.googleAnalytic.analytic_id);
          setTwkData({
            widgetId: res.data.tawk_setting.widget_id,
            propertyId: res.data.tawk_setting.property_id,
          });
          setFbPixel(res.data.facebookPixel);
        }
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
    dispatch(fetchWishlist());
  };
  useEffect(() => {
    !websiteSetup ? apiFetch() : false;
    dispatch(fetchCart());
    dispatch(fetchCompareProducts());
    const themeColor= JSON.parse(localStorage.getItem('settings'))
    if(themeColor){
      const root = document.querySelector(':root');
      if(themeColor.theme_one && themeColor.theme_two){
        root.style.setProperty('--primary-color', `${hexToRgb(themeColor?.theme_one)}`);
        root.style.setProperty('--secondary-color', `${hexToRgb(themeColor?.theme_two)}`);
      }
    }
    if (languageModel()) {
      setLoad(true);
    }
  },[websiteSetup, apiFetch, dispatch]);
  useEffect(() => {
    if (websiteSetup) {
      let current = new Date();
      let upComingDate = localStorage.getItem("upcoming_announcement");
      if (localStorage.getItem("ads")) {
        if (upComingDate && current < upComingDate) {
          localStorage.setItem("ads", "true");
        } else {
          return;
        }
      } else {
        localStorage.setItem("ads", "true");
      }
    }
  }, [websiteSetup]);
  useEffect(() => {
    if (fbPixexl) {
      import("react-facebook-pixel")
        .then((x) => x.default)
        .then((ReactPixel) => {
          ReactPixel.init(`${fbPixexl.app_id}`); // facebookPixelId
          ReactPixel.pageView();

          router.events.on("routeChangeComplete", () => {
            ReactPixel.pageView();
          });
        });
    }
  }, [fbPixexl, router.events]);
  const loginActionPopup = () => {
    setPopupView("signup");
  };
  const notVerifyHandler = () => {
    setPopupView("verify");
  };
  const signupActionPopup = () => {
    setPopupView("login");
  };
  const singupActionHandle = () => {
    setPopupView("verify");
  };
  const verifyActionPopup = () => {
    setPopupView("login");
  };
  useEffect(() => {
    if (getLoginContexts.loginPopup === false) {
      setPopupView("login");
      if (auth()) {
        const holdData = JSON.parse(localStorage.getItem("data-hold"));
        if (holdData && holdData.type === "add-to-cart") {
          if (holdData.variants) {
            const variantQuery = holdData.variants.map((value, index) => {
              return value ? `variants[]=${value}` : `variants[]=-1`;
            });
            const variantString = variantQuery
              .map((value) => value + "&")
              .join("");
            const itemsQuery = holdData.variantItems.map((value, index) => {
              return value ? `items[]=${value}` : `items[]=-1`;
            });
            const itemQueryStr = itemsQuery
              .map((value) => value + "&")
              .join("");
            const uri = `token=${auth().access_token}&product_id=${
              holdData.id
            }&${variantString}${itemQueryStr}quantity=${holdData.quantity}`;
            apiRequest
              .addToCard(uri)
              .then((res) => {
                toast.success(langCntnt && langCntnt.Item_added);
                localStorage.removeItem("data-hold");
                router.push("/cart");
              })
              .catch((err) => {
                console.log(err);
                toast.error(
                  err.response &&
                    err.response.data.message &&
                    err.response.data.message
                );
              });
            dispatch(fetchCart());
          } else {
            const uri = `token=${auth().access_token}&product_id=${
              holdData.id
            }&quantity=${holdData.quantity}`;
            apiRequest
              .addToCard(uri)
              .then((res) => {
                toast.success(langCntnt && langCntnt.Item_added);
                localStorage.removeItem("data-hold");
                router.push("/cart");
              })
              .catch((err) => {
                console.log(err);
                toast.error(
                  err.response &&
                    err.response.data.message &&
                    err.response.data.message
                );
              });
            dispatch(fetchCart());
          }
        }
      }
    }
  }, [dispatch, getLoginContexts.loginPopup]);
  return (
    <>
      {gtagId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gtagId}');
        `}
          </Script>
        </>
      )}

      <div>
        {load && (
          <>
            <Consent />
            <div> {children && children}</div>
            {twkData && (
                <TawkMessengerReact
                    propertyId={twkData.widgetId}
                    widgetId={twkData.propertyId}/>
            )}
            {getLoginContexts.loginPopup && (
              <div
                className={
                  "w-full h-screen fixed left-0 top-0 flex justify-center items-center z-40"
                }
              >
                <div
                  onClick={() => getLoginContexts.handlerPopup(false)}
                  className="w-full h-full fixed left-0 top-0 bg-black bg-opacity-50"
                ></div>
                <div
                  data-aos="fade-up"
                  className={`lg:w-[572px] w-full lg:h-[670px] h-full bg-white rounded-lg flex flex-col justify-center  p-5 border border-[#E0E0E0] relative z-40`}
                >
                  {popupView === "login" ? (
                    <LoginWidget
                      redirect={false}
                      loginActionPopup={loginActionPopup}
                      notVerifyHandler={notVerifyHandler}
                    />
                  ) : popupView === "signup" ? (
                    <SignupWidget
                      redirect={false}
                      signupActionPopup={signupActionPopup}
                      changeContent={singupActionHandle}
                    />
                  ) : popupView === "verify" ? (
                    <VerifyWidget
                      redirect={false}
                      verifyActionPopup={verifyActionPopup}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
export default DefaultLayout;
