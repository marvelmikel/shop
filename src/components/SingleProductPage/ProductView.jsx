import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { toast } from "react-toastify";
import apiRequest from "../../../utils/apiRequest";
import auth from "../../../utils/auth";
import settings from "../../../utils/settings";
import { fetchCart } from "../../store/Cart";
import { fetchWishlist } from "../../store/wishlistData";
import Star from "../Helpers/icons/Star";
import ThinLove from "../Helpers/icons/ThinLove";
import Selectbox from "../Helpers/Selectbox";
import CheckProductIsExistsInFlashSale from "../Shared/CheckProductIsExistsInFlashSale";
import languageModel from "../../../utils/languageModel";
import LoginContext from "../Contexts/LoginContexts";
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
export default function ProductView({
  className,
  reportHandler,
  images = [],
  product,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const loginPopupBoard = useContext(LoginContext);
  const tags = product.tags && JSON.parse(product.tags);
  const [more, setMore] = useState(false);
  const productsImg = images && images.length > 0 && images;
  const varients =
    product && product.active_variants.length > 0 && product.active_variants;
  const [getFirstVarients, setFirstVarients] = useState(
    varients &&
      varients.map((v) =>
        v.active_variant_items.length > 0 ? v.active_variant_items[0] : {}
      )
  );
  const [langCntnt, setLangCntnt] = useState(null);
  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);
  const [price, setPrice] = useState(null);
  const [offerPrice, setOffer] = useState(null);
  const [src, setSrc] = useState(product.thumb_image);
  useEffect(() => {
   setSrc(product.thumb_image)
  }, [product]);

  const changeImgHandler = (current) => {
    setSrc(current);
  };
  const [quantity, setQuantity] = useState(1);
  const increment = () => {
    setQuantity((prev) => prev + 1);
  };
  const decrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  //varient selector handler
  const selectVarient = (value) => {
    if (varients.length > 0) {
      const replacePrice = getFirstVarients.map((v) => {
        if (
          parseInt(v.product_variant_id) === parseInt(value.product_variant_id)
        ) {
          return value;
        }
        return v;
      });
      setFirstVarients(replacePrice);
    }
  };
  useEffect(() => {
    if (varients) {
      const prices =
        getFirstVarients &&
        getFirstVarients.map((v) => (v.price ? v.price : 0));
      const sumPrice = parseFloat(
        prices.reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0) +
          parseFloat(product.price)
      );
      setPrice(parseFloat(sumPrice));
      if (product.offer_price) {
        const sumOfferPrice = parseFloat(
          prices.reduce(
            (prev, curr) => parseFloat(prev) + parseFloat(curr),
            0
          ) + parseFloat(product.offer_price)
        );
        setOffer(parseFloat(sumOfferPrice));
      }
    }
  }, [getFirstVarients, varients]);

  useEffect(() => {
    if (varients) {
      const prices = varients.map((v) =>
        v.active_variant_items.length > 0 && v.active_variant_items[0].price
          ? parseInt(v.active_variant_items[0].price)
          : 0
      );

      if (product.offer_price) {
        const sumCalc = prices.reduce(
          (prev, curr) => parseFloat(prev) + parseFloat(curr)
        );
        const sumPrice = parseFloat(sumCalc) + parseFloat(product.price);
        const sumOfferPrice =
          parseFloat(sumCalc) + parseFloat(product.offer_price);
        setPrice(parseFloat(sumPrice));
        setOffer(parseFloat(sumOfferPrice));
      } else {
        const sumCalc = prices.reduce(
          (prev, curr) => parseFloat(prev) + parseFloat(curr)
        );
        const sumPrice = parseFloat(sumCalc) + parseFloat(product.price);
        setPrice(parseFloat(sumPrice));
      }
    } else {
      setPrice(
        product && parseFloat(product.price) ? parseFloat(product.price) : null
      );
      setOffer(
        product && product.offer_price ? parseFloat(product.offer_price) : null
      );
    }
  }, [product, varients]);

  const addToCard = () => {
    const data = {
      id: product.id,
      token: auth() && auth().access_token,
      quantity: quantity,
      variants:
        getFirstVarients &&
        getFirstVarients.map((v) => parseInt(v.product_variant_id)),
      variantItems: getFirstVarients && getFirstVarients.map((v) => v.id),
    };
    if (auth()) {
      if (varients) {
        const variantQuery = data.variants.map((value, index) => {
          return `variants[]=${value}`;
        });
        const variantString = variantQuery.map((value) => value + "&").join("");

        const itemsQuery = data.variantItems.map((value, index) => {
          return `items[]=${value}`;
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
          .catch((err) => console.log(err));
        dispatch(fetchCart());
      } else {
        const uri = `token=${data.token}&product_id=${data.id}&quantity=${data.quantity}`;
        apiRequest
          .addToCard(uri)
          .then((res) => {
            toast.success(
              <Redirect
                message={langCntnt && langCntnt.Item_added}
                linkTxt={langCntnt && langCntnt.Go_To_Cart}
              />,
              {
                autoClose: 5000,
              }
            );
            toast.error(
              res.response &&
                res.response.data.message &&
                res.response.data.message
            );
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
    } else {
      localStorage.setItem(
        "data-hold",
        JSON.stringify({ type: "add-to-cart", ...data })
      );
      loginPopupBoard.handlerPopup(true);
    }
  };

  //wishlist

  const { wishlistData } = useSelector((state) => state.wishlistData);
  const wishlist = wishlistData && wishlistData.wishlists;
  const wishlisted =
    wishlist && wishlist.data.find((id) => id.product.id === product.id);

  const [arWishlist, setArWishlist] = useState(null);
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

  const { currency_icon } = settings();
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const [pricePercent, setPricePercent] = useState("");
  const [isProductInFlashSale, setData] = useState(null);
  useEffect(() => {
    if (websiteSetup) {
      const offerFlashSale = websiteSetup.payload.flashSale;
      const flashSaleProducts = websiteSetup.payload.flashSaleProducts;
      const isFlashSaleProduct = flashSaleProducts.find(
        (item) => parseInt(item.product_id) === product.id
      );
      if (isFlashSaleProduct) {
        const offer = parseInt(offerFlashSale.offer);
        const price = product.offer_price
          ? parseInt(product.offer_price)
          : parseInt(product.price);
        const discountPrice = (offer / 100) * price;
        const mainPrice = price - discountPrice;
        setPricePercent(
          Math.trunc(((mainPrice - product.price) / product.price) * 100)
        );
      } else {
        setPricePercent(
          Math.trunc(
            ((product.offer_price - product.price) / product.price) * 100
          )
        );
      }

      const getId = websiteSetup.payload.flashSaleProducts.find(
        (item) => parseInt(item.product_id) === parseInt(product.id)
      );
      if (getId) {
        setData(true);
      } else {
        setData(false);
      }
    }
  }, [websiteSetup]);
  return (
    <>
      <div
        className={`product-view w-full lg:flex justify-between h-full ${
          className || ""
        }`}
      >
        <div
          data-aos="fade-right"
          className="lg:w-1/2 xl:mr-[70px] lg:mr-[50px]"
        >
          <div className="w-full">
            <div className="w-full md:h-[600px] h-[350px] border border-qpurplelow/10 flex justify-center items-center overflow-hidden relative mb-3 relative rounded">
              <Image
                layout="fill"
                objectFit="scale-down"
                src={`${process.env.NEXT_PUBLIC_BASE_URL + src}`}
                alt=""
                className="object-contain  transform scale-110"
              />
              {product.offer_price && (
                <div className="w-[80px] h-[80px] rounded-full bg-qpurple text-qblack flex justify-center items-center text-xl font-medium absolute left-[30px] top-[30px]">
                  <span className="text-white">{pricePercent}%</span>
                </div>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <div
                onClick={() => changeImgHandler(product.thumb_image)}
                className="w-[110px] h-[110px] p-[15px] border border-qpurplelow/10 cursor-pointer relative rounded"
              >
                <Image
                  layout="fill"
                  objectFit="scale-down"
                  src={`${
                    process.env.NEXT_PUBLIC_BASE_URL + product.thumb_image
                  }`}
                  alt=""
                  className={`w-full h-full object-contain transform scale-110 ${
                    src !== product.thumb_image ? "opacity-50" : ""
                  } `}
                />
              </div>
              {productsImg &&
                productsImg.length > 0 &&
                productsImg.map((img, i) => (
                  <div
                    onClick={() => changeImgHandler(img.image)}
                    key={i}
                    className="w-[110px] h-[110px] p-[15px] border border-qborder cursor-pointer relative"
                  >
                    <Image
                      layout="fill"
                      objectFit="scale-down"
                      src={`${process.env.NEXT_PUBLIC_BASE_URL + img.image}`}
                      alt=""
                      className={`w-full h-full object-contain ${
                        src !== img.image ? "opacity-50" : ""
                      } `}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="product-details w-full mt-10 lg:mt-0">
            {product.brand && (
              <span
                data-aos="fade-up"
                className="text-qgray text-xs font-normal uppercase tracking-wider mb-2 inline-block"
              >
                {product.brand.name}
              </span>
            )}
            <h1
              data-aos="fade-up"
              className="text-xl font-medium text-qblack mb-4"
            >
              {product.name}
            </h1>
            <div
              data-aos="fade-up"
              className="flex space-x-[10px] items-center mb-6"
            >
              <div className="flex space-x-1">
                {Array.from(Array(parseInt(product.averageRating)), () => (
                  <span key={parseInt(product.averageRating) + Math.random()}>
                    <Star />
                  </span>
                ))}
                {parseInt(product.averageRating) < 5 && (
                  <>
                    {Array.from(
                      Array(5 - parseInt(product.averageRating)),
                      () => (
                        <span
                          key={parseInt(product.averageRating) + Math.random()}
                          className="text-qgray"
                        >
                          <Star defaultValue={false} />
                        </span>
                      )
                    )}
                  </>
                )}
              </div>
              <span className="text-base font-normal text-qblack">
                {parseInt(product.averageRating)} Reviews
              </span>
            </div>
            <div
              data-aos="fade-up"
              className="flex space-x-2 items-baseline mb-7"
            >
              <span
                suppressHydrationWarning
                className={`main-price  font-600  ${
                  offerPrice
                    ? "line-through text-qgray text-[15px]"
                    : "text-qred text-[24px]"
                }`}
              >
                {offerPrice ? (
                  <span>{currency_icon + price}</span>
                ) : (
                  <>
                    {isProductInFlashSale && (
                      <span className="main-price  font-600 line-through text-qgray text-[15px] mr-2">
                        {currency_icon &&
                          currency_icon + parseFloat(price).toFixed(2)}
                      </span>
                    )}
                    <CheckProductIsExistsInFlashSale
                      id={product.id}
                      price={price}
                    />
                  </>
                )}
              </span>
              {offerPrice && (
                <span
                  suppressHydrationWarning
                  className="offer-price text-qred font-600 text-[24px] ml-2"
                >
                  <CheckProductIsExistsInFlashSale
                    id={product.id}
                    price={offerPrice}
                  />
                </span>
              )}
            </div>

            <div data-aos="fade-up" className="mb-[30px]">
              <div
                className={`text-qgray text-sm text-normal leading-7 ${
                  more ? "" : "line-clamp-2"
                }`}
              >
                {product.short_description}
              </div>
              <button
                onClick={() => setMore(!more)}
                type="button"
                className="text-[#03a84e] text-xs font-bold"
              >
                {more ? "See Less" : "See More"}
              </button>
            </div>
            <div className="w-full h-[1px] bg-qpurplelow/10 mb-[30px]"></div>
            <div className="p-3 bg-qpurplelow/10 flex items-center space-x-2 mb-[30px] rounded-lg w-fit">
              <span className="text-base font-bold text-qblack">
                {langCntnt && langCntnt.Availability} :
              </span>
              <span className="text-base font-bold text-qpurple">
                {parseInt(product.qty) !== 0 && parseInt(product.qty) > 0
                  ? `${product.qty} ${
                      langCntnt && langCntnt.Products_Available
                    } `
                  : `${langCntnt && langCntnt.Products_not_Available}`}
              </span>
            </div>
            {varients.length > 0 &&
              varients.map((item) => (
                <div
                  key={item.id}
                  data-aos="fade-up"
                  className="product-size mb-[30px]"
                >
                  <span className="text-sm font-normal uppercase text-qgray mb-[14px] inline-block">
                    {item.name}
                  </span>
                  <div className="w-full">
                    <div className=" border border-qborder h-[50px] flex justify-between items-center px-6 cursor-pointer">
                      <Selectbox
                        action={selectVarient}
                        className="w-full"
                        datas={
                          item.active_variant_items &&
                          item.active_variant_items.length > 0 &&
                          item.active_variant_items
                        }
                      >
                        {({ item }) => (
                          <>
                            <div className="flex justify-between items-center w-full">
                              <div>
                                <span className="text-base text-qblack">
                                  {item}
                                </span>
                              </div>
                              <span>
                                <svg
                                  width="11"
                                  height="7"
                                  viewBox="0 0 11 7"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.4 6.8L0 1.4L1.4 0L5.4 4L9.4 0L10.8 1.4L5.4 6.8Z"
                                    fill="#222222"
                                  />
                                </svg>
                              </span>
                            </div>
                          </>
                        )}
                      </Selectbox>
                    </div>
                  </div>
                </div>
              ))}

            <div
              data-aos="fade-up"
              className="quantity-card-wrapper w-full flex items-center h-[50px] space-x-[10px] mb-[30px]"
            >
              <div className="w-[120px] h-full px-[26px] flex items-center border border-qpurplelow/10 rounded-md">
                <div className="flex justify-between items-center w-full">
                  <button
                    onClick={decrement}
                    type="button"
                    className="text-lg font-medium text-qgray"
                  >
                    -
                  </button>
                  <span className="text-qblack">{quantity}</span>
                  <button
                    onClick={increment}
                    type="button"
                    className="text-lg font-medium text-qgray"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="w-[60px] h-full flex justify-center items-center border border-qpurplelow/10 rounded-md">
                {!arWishlist ? (
                  <button
                    type="button"
                    onClick={() => addToWishlist(product.id)}
                  >
                    <span className="w-10 h-10 flex justify-center items-center">
                      <ThinLove />
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      removeToWishlist(wishlisted && wishlisted.id)
                    }
                  >
                    <span className="w-10 h-10 flex justify-center items-center">
                      <ThinLove fill={true} />
                    </span>
                  </button>
                )}
              </div>
              <div className="flex-1 h-full">
                <button
                  onClick={addToCard}
                  type="button"
                  className="bg-qpurple hover:bg-qpurplelow/10 hover:text-qpurple border border-transparent hover:border-qpurple transition-common text-white rounded-full text-sm font-semibold w-full h-full"
                >
                  {langCntnt && langCntnt.Add_To_Cart}
                </button>
              </div>
            </div>

            <div data-aos="fade-up" className="mb-[20px]">
              <p className="text-base text-qpurple leading-7">
                <span className="text-qblack">
                  {langCntnt && langCntnt.category} :
                </span>{" "}
                {product.category.name}
              </p>
              <p className="text-base text-qpurple leading-7">
                <span className="text-qblack uppercase">
                  {langCntnt && langCntnt.SKU}:
                </span>{" "}
                {product.sku}
              </p>
              {tags && (
                <p className="text-base text-qpurple leading-7">
                  <span className="text-qblack">Tags:</span>{" "}
                  {tags.length > 0 &&
                    tags.map((item, i) => (
                      <span key={i}>{item.value + ", "}</span>
                    ))}
                </p>
              )}
            </div>

            <div
              data-aos="fade-up"
              className="flex space-x-2 items-center mb-[20px] report-btn "
            >
              <span>
                <svg
                  width="12"
                  height="13"
                  viewBox="0 0 12 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 0C0.247634 0 0.475436 0 0.729172 0C0.738324 0.160174 0.747477 0.316279 0.757647 0.493233C1.05816 0.392044 1.33885 0.282211 1.62818 0.203395C3.11296 -0.201361 4.51385 0.0366111 5.84202 0.779512C6.47661 1.13494 7.14171 1.39071 7.86987 1.47207C8.88125 1.58496 9.82093 1.35817 10.7098 0.88426C10.9335 0.765274 11.1522 0.636627 11.411 0.491199C11.4161 0.606117 11.4237 0.693577 11.4237 0.780529C11.4242 3.18822 11.4222 5.5954 11.4288 8.00309C11.4293 8.1892 11.3718 8.29089 11.2096 8.38039C9.31956 9.42279 7.4285 9.43499 5.54557 8.37734C4.06231 7.54443 2.55363 7.43307 0.992568 8.13835C0.804428 8.22327 0.737816 8.33005 0.739341 8.53904C0.749003 9.9206 0.744426 11.3027 0.744426 12.6842C0.744426 12.7849 0.744426 12.8851 0.744426 13C0.48764 13 0.254244 13 0 13C0 8.67582 0 4.34961 0 0Z"
                    fill="#EB5757"
                  />
                </svg>
              </span>

              <button
                type="button"
                onClick={reportHandler}
                className="text-qred font-semibold text-base"
              >
                {langCntnt && langCntnt.Report_This_Item}
              </button>
            </div>

            <div
              data-aos="fade-up"
              className="social-share flex  items-center w-full"
            >
              <span className="text-qblack text-base mr-[17px] inline-block">
                {langCntnt && langCntnt.Share_This}:
              </span>

              <div className="flex space-x-5 items-center">
                <FacebookShareButton
                  url={`${
                    typeof window !== "undefined" &&
                    window.location.origin &&
                    window.location.origin +
                      "/single-product?slug=" +
                      product.slug
                  }`}
                  quotes={product.name}
                >
                  <span className="cursor-pointer">
                    <svg
                      width="10"
                      height="16"
                      viewBox="0 0 10 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 16V9H0V6H3V4C3 1.3 4.7 0 7.1 0C8.3 0 9.2 0.1 9.5 0.1V2.9H7.8C6.5 2.9 6.2 3.5 6.2 4.4V6H10L9 9H6.3V16H3Z"
                        fill="#3E75B2"
                      />
                    </svg>
                  </span>
                </FacebookShareButton>
                <TwitterShareButton
                  url={`${
                    typeof window !== "undefined" &&
                    window.location.origin &&
                    window.location.origin +
                      "/single-product?slug=" +
                      product.slug
                  }`}
                  title={product.name}
                >
                  <span className="cursor-pointer">
                    <svg
                      width="18"
                      height="14"
                      viewBox="0 0 18 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.0722 1.60052C16.432 1.88505 15.7562 2.06289 15.0448 2.16959C15.7562 1.74278 16.3253 1.06701 16.5742 0.248969C15.8985 0.640206 15.1515 0.924742 14.3335 1.10258C13.6933 0.426804 12.7686 0 11.7727 0C9.85206 0 8.28711 1.56495 8.28711 3.48557C8.28711 3.7701 8.32268 4.01907 8.39382 4.26804C5.51289 4.12577 2.9165 2.73866 1.17371 0.604639C0.889175 1.13814 0.71134 1.70722 0.71134 2.34742C0.71134 3.5567 1.31598 4.62371 2.27629 5.26392C1.70722 5.22835 1.17371 5.08608 0.675773 4.83711V4.87268C0.675773 6.5799 1.88505 8.00258 3.48557 8.32268C3.20103 8.39382 2.88093 8.42938 2.56082 8.42938C2.34742 8.42938 2.09845 8.39382 1.88505 8.35825C2.34742 9.74536 3.62784 10.7768 5.15722 10.7768C3.94794 11.7015 2.45412 12.2706 0.818041 12.2706C0.533505 12.2706 0.248969 12.2706 0 12.2351C1.56495 13.2309 3.37887 13.8 5.37062 13.8C11.8082 13.8 15.3294 8.46495 15.3294 3.84124C15.3294 3.69897 15.3294 3.52113 15.3294 3.37887C16.0052 2.9165 16.6098 2.31186 17.0722 1.60052Z"
                        fill="#3FD1FF"
                      />
                    </svg>
                  </span>
                </TwitterShareButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
