import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import apiRequest from "../../../../utils/apiRequest";
import auth from "../../../../utils/auth";
import settings from "../../../../utils/settings";
import { fetchCart } from "../../../store/Cart";
import { fetchCompareProducts } from "../../../store/compareProduct";
import { fetchWishlist } from "../../../store/wishlistData";
import CheckProductIsExistsInFlashSale from "../../Shared/CheckProductIsExistsInFlashSale";
import ProductView from "../../SingleProductPage/ProductView";
import Compair from "../icons/Compair";
import QuickViewIco from "../icons/QuickViewIco";
import Star from "../icons/Star";
import ThinLove from "../icons/ThinLove";
import languageModel from "../../../../utils/languageModel";
import LoginContext from "../../Contexts/LoginContexts";
const Redirect = ({ message, linkTxt }) => {
  return (
    <div className="flex space-x-2 items-center">
      <span className="text-sm text-qgray">{message && message}</span>
      <Link href="/cart" legacyBehavior>
        <span className="text-xs border-b border-blue-600 text-blue-600 mr-2 cursor-pointer">
          {linkTxt && linkTxt}
        </span>
      </Link>
    </div>
  );
};
export default function ProductCardRowStyleOne({ className, datas }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { wishlistData } = useSelector((state) => state.wishlistData);
  const wishlist = wishlistData && wishlistData.wishlists;
  const wishlisted =
    wishlist && wishlist.data.find((id) => id.product.id === datas.id);

  const [arWishlist, setArWishlist] = useState(null);
  const [langCntnt, setLangCntnt] = useState(null);
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const [isProductInFlashSale, setData] = useState(null);
  const loginPopupBoard = useContext(LoginContext);
  useEffect(() => {
    if (websiteSetup) {
      const getId = websiteSetup.payload.flashSaleProducts.find(
        (item) => parseInt(item.product_id) === parseInt(datas.id)
      );
      if (getId) {
        setData(true);
      } else {
        setData(false);
      }
    }
  }, [websiteSetup]);
  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);
  useEffect(() => {
    if (wishlisted) {
      setArWishlist(true);
    } else {
      setArWishlist(false);
    }
  }, [wishlisted]);

  const addToWishlist = (id) => {
    if (auth()) {
      setArWishlist(true);
      apiRequest.addToWishlist({ id: id, token: auth().access_token });
      dispatch(fetchWishlist());
    } else {
      loginPopupBoard.handlerPopup(true);
    }
  };
  const removeToWishlist = (id) => {
    if (auth()) {
      setArWishlist(false);
      apiRequest.removeToWishlist({ id: id, token: auth().access_token });
      dispatch(fetchWishlist());
    } else {
      router.push("/login");
    }
  };
  //cart
  const varients = datas && datas.variants.length > 0 && datas.variants;
  const [getFirstVarients, setFirstVarients] = useState(
    varients && varients.map((v) => v.active_variant_items[0])
  );
  const [price, setPrice] = useState(null);
  const [offerPrice, setOffer] = useState(null);
  const addToCart = (id) => {
    const data = {
      id: id,
      token: auth() && auth().access_token,
      quantity: 1,
      variants:
        getFirstVarients &&
        getFirstVarients.length > 0 &&
        getFirstVarients.map((v) =>
          v ? parseInt(v.product_variant_id) : null
        ),
      variantItems:
        getFirstVarients &&
        getFirstVarients.length > 0 &&
        getFirstVarients.map((v) => (v ? v.id : null)),
    };
    if (auth()) {
      if (varients) {
        const variantQuery = data.variants.map((value, index) => {
          return value ? `variants[]=${value}` : `variants[]=-1`;
        });
        const variantString = variantQuery.map((value) => value + "&").join("");

        const itemsQuery = data.variantItems.map((value, index) => {
          return value ? `items[]=${value}` : `items[]=-1`;
        });
        const itemQueryStr = itemsQuery.map((value) => value + "&").join("");
        const uri = `token=${data.token}&product_id=${data.id}&${variantString}${itemQueryStr}quantity=${data.quantity}`;
        apiRequest
          .addToCard(uri)
          .then((res) =>
            toast.success(
              <Redirect
                message={langCntnt && langCntnt.Item_added}
                linkTxt={langCntnt && langCntnt.Go_To_Cart}
              />,
              {
                autoClose: 5000,
              }
            )
          )
          .catch((err) => {
            toast.error(
              err.response &&
                err.response.data.message &&
                err.response.data.message
            );
          });
        dispatch(fetchCart());
      } else {
        const uri = `token=${data.token}&product_id=${data.id}&quantity=${data.quantity}`;
        apiRequest
          .addToCard(uri)
          .then((res) =>
            toast.success(
              <Redirect
                message={langCntnt && langCntnt.Item_added}
                linkTxt={langCntnt && langCntnt.Go_To_Cart}
              />,
              {
                autoClose: 5000,
              }
            )
          )
          .catch((err) => {
            toast.error(
              err.response &&
                err.response.data.message &&
                err.response.data.message
            );
          });
        dispatch(fetchCart());
      }
    } else {
      localStorage.setItem(
        "data-hold",
        JSON.stringify({ type: "add-to-cart", ...data })
      );
      loginPopupBoard.handlerPopup(true);
    }
  };
  useEffect(() => {
    if (varients) {
      const prices = varients.map((v) =>
        v.active_variant_items.length > 0 && v.active_variant_items[0].price
          ? v.active_variant_items[0].price
          : 0
      );

      if (datas.offer_price) {
        const sumOfferPrice = parseFloat(
          prices.reduce((prev, curr) => parseInt(prev) + parseInt(curr), 0) +
            parseFloat(datas.offer_price)
        );
        setPrice(datas.price);
        setOffer(sumOfferPrice);
      } else {
        const sumPrice = parseFloat(
          prices.reduce((prev, curr) => parseInt(prev) + parseInt(curr), 0) +
            parseFloat(datas.price)
        );
        setPrice(sumPrice);
      }
    } else {
      setPrice(datas && datas.price ? parseFloat(datas.price) : null);
      setOffer(
        datas && datas.offer_price ? parseFloat(datas.offer_price) : null
      );
    }
  }, [datas, varients]);
  const { currency_icon } = settings();
  /*compare product feature
   * add product for compare method
   * @params (id,token)
   * request method is (apiRequest)
   * */
  const productCompare = (id) => {
    if (auth()) {
      apiRequest
        .addProductForCompare(id, auth().access_token)
        .then((res) => {
          toast.success(res.data && res.data.notification);
          dispatch(fetchCompareProducts());
        })
        .catch((err) => {
          toast.error(err.response && err.response.data.notification);
          console.log(err);
        });
    } else {
      loginPopupBoard.handlerPopup(true);
    }
  };
  //quick view feature
  const [quickViewModal, setQuickView] = useState(false);
  const [quickViewData, setQuickViewData] = useState(null);
  const quickViewHandler = (slug) => {
    setQuickView(!quickViewModal);
    if (!quickViewData) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}api/product/${slug}`)
        .then((res) => {
          setQuickViewData(res.data ? res.data : null);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  useEffect(() => {
    if (quickViewModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [quickViewModal]);
  return (
    <div
      style={{ boxShadow: `0px 15px 64px rgba(0, 0, 0, 0.05)` }}
      data-aos="fade-left"
      className={`product-row-card-style-one w-full h-[214px] bg-white group p-5 relative overflow-hidden rounded-md border border-transparent hover:border-qpurple transition-all duration-300 ease-in-out ${
        className || ""
      }`}
    >
      <div className="flex space-x-5 items-center w-full h-full">
        <div className="sm:w-[174px] bg-qpurplelow/10 rounded-md w-[150px] h-full overflow-hidden ">
          <div className="w-full h-full relative transition-all duration-300 ease-in-out transform group-hover:scale-110 scale-100">
            <Image
              layout="fill"
              objectFit="scale-down"
              src={`${datas.image}`}
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <div className="flex-1">
          <div>
            {/* reviews */}
            <div className="flex space-x-1 mb-2.5">
              {Array.from(Array(datas.review), () => (
                <span key={datas.review + Math.random()}>
                  <Star />
                </span>
              ))}
              {datas.review < 5 && (
                <>
                  {Array.from(Array(5 - datas.review), () => (
                    <span
                      key={datas.review + Math.random()}
                      className="text-qgray"
                    >
                      <Star defaultValue={false} />
                    </span>
                  ))}
                </>
              )}
            </div>

            <Link
              href={{
                pathname: "/single-product",
                query: { slug: datas.slug },
              }}
              passHref
              rel="noopener noreferrer">

              <h1 className="title mb-2.5 sm:text-[18px] text-[13px]  font-700 text-qblack leading-[24px] line-clamp-1 hover:text-qpurple cursor-pointer">
                {datas.title}
              </h1>

            </Link>
            <p className="price">
              <span
                suppressHydrationWarning
                className={`main-price  font-500 text-base ${
                  offerPrice ? "line-through text-qgray" : "text-qpurple"
                }`}
              >
                {offerPrice ? (
                  <span>
                    {currency_icon &&
                      currency_icon + parseFloat(price).toFixed(2)}
                  </span>
                ) : (
                  <>
                    {isProductInFlashSale && (
                      <span className="line-through text-qgray font-500 text-base mr-2">
                        {currency_icon &&
                          currency_icon + parseFloat(price).toFixed(2)}
                      </span>
                    )}
                    <CheckProductIsExistsInFlashSale
                      id={datas.id}
                      price={price}
                    />
                  </>
                )}
              </span>
              {offerPrice && (
                <span
                  suppressHydrationWarning
                  className="offer-price text-qpurple font-500 text-base ml-2"
                >
                  <CheckProductIsExistsInFlashSale
                    id={datas.id}
                    price={offerPrice}
                  />
                </span>
              )}
            </p>
          </div>
          <div className="w-full h-[48px]">
            <div
              style={{ borderRadius: "30px 0px 0" }}
              onClick={() => addToCart(datas.id)}
              className="w-[135px] h-[48px] pl-6 pt-3 cursor-pointer bg-qpurplelow/10 group-hover:bg-qpurple absolute -bottom-1 -right-1  rounded transition-all duration-300 ease-in-out"
            >
              <div className="w-full h-full text-qpurple group-hover:text-white">
                <span className="text-base font-semibold">Add To Cart</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* quick-access-btns */}
      <div className="quick-access-btns flex flex-col space-y-2">
        <button
          className=" absolute group-hover:right-4 -right-10 top-5  transition-all ease-in-out"
          type="button"
          onClick={() => quickViewHandler(datas.slug)}
        >
          <span className="w-10 h-10 block justify-center  overflow-hidden text-qblack hover:text-white items-center transition-all duration-300 ease-in-out  bg-white rounded">
            <span className="w-full h-full flex justify-center items-center hover:bg-qpurple bg-qpurplelow/10">
              <QuickViewIco className="fill-current" />
            </span>
          </span>
        </button>
        {!arWishlist ? (
          <button
            className=" absolute group-hover:right-4 -right-10 top-[60px] duration-300   transition-all ease-in-out"
            type="button"
            onClick={() => addToWishlist(datas.id)}
          >
            <span className="w-10 h-10 block overflow-hidden text-qblack hover:text-white justify-center items-center transition-all duration-300 ease-in-out bg-white rounded">
              <span className="w-full h-full flex justify-center items-center hover:bg-qpurple bg-qpurplelow/10">
               <ThinLove className="fill-current" />
            </span>
            </span>
          </button>
        ) : (
          <button
            className=" absolute group-hover:right-4 -right-10 top-[60px] duration-300   transition-all ease-in-out"
            type="button"
            onClick={() => removeToWishlist(wishlisted && wishlisted.id)}
          >
            <span className="w-10 h-10 block bg-white overflow-hidden rounded">
              <span className="w-full h-full flex justify-center items-center hover:bg-qpurple bg-qpurplelow/10">
               <ThinLove fill={true} />
            </span>
            </span>
          </button>
        )}
        <button
          className=" absolute group-hover:right-4 -right-10 top-[107px]  transition-all duration-500 ease-in-out"
          type="button"
          onClick={() => productCompare(datas.id)}
        >
          <span className="w-10 h-10 block overflow-hidden justify-center text-qblack hover:text-white transition-all duration-300 ease-in-out items-center bg-white rounded">

             <span className="w-full h-full flex justify-center items-center hover:bg-qpurple bg-qpurplelow/10">
               <Compair />
            </span>
          </span>
        </button>
      </div>
      {quickViewModal && quickViewData && (
        <div className="quicke-view-wrapper w-full h-full flex fixed left-0 top-0 justify-center z-50 items-center ">
          <div
            onClick={() => setQuickView(!quickViewModal)}
            className="w-full h-full fixed left-0 right-0 bg-black  bg-opacity-25"
          ></div>
          <div
            data-aos="fade-up"
            className="md:mx-10 w-full bg-white relative py-[40px] sm:px-[38px] px-3 relative md:mt-12 h-full overflow-y-scroll xl:overflow-hidden xl:h-auto xl:mt-0"
            style={{ zIndex: "999" }}
          >
            <ProductView
              images={
                quickViewData.gellery.length > 0 ? quickViewData.gellery : []
              }
              product={quickViewData.product}
            />
            <button
              onClick={() => setQuickView(!quickViewModal)}
              type="button"
              className="absolute right-3 top-3"
            >
              <span className="text-red-500 w-12 h-12 flex justify-center items-center rounded border border-qred">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-10 h-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
