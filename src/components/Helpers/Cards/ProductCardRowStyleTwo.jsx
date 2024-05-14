import Image from "next/image";
import Link from "next/link";
import settings from "../../../../utils/settings";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import auth from "../../../../utils/auth";
import apiRequest from "../../../../utils/apiRequest";
import { toast } from "react-toastify";
import { fetchCart } from "../../../store/Cart";
import CheckProductIsExistsInFlashSale from "../../Shared/CheckProductIsExistsInFlashSale";
import Star from "../icons/Star";

const Redirect = () => {
  return (
    <div className="flex space-x-2 items-center">
      <span className="text-sm text-qgray">Item added</span>
      <Link href="/cart" legacyBehavior>
        <span className="text-xs border-b border-blue-600 text-blue-600 mr-2 cursor-pointer">
          Go To Cart
        </span>
      </Link>
    </div>
  );
};

export default function ProductCardRowStyleTwo({ className, datas }) {
  const router = useRouter();
  const dispatch = useDispatch();

  //cart
  const varients = datas && datas.variants.length > 0 && datas.variants;
  const [getFirstVarients, setFirstVarients] = useState(
    varients && varients.map((v) => v.active_variant_items[0])
  );
  const [price, setPrice] = useState(null);
  const [offerPrice, setOffer] = useState(null);
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const [isProductInFlashSale, setData] = useState(null);
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
  const addToCart = (id) => {
    if (auth()) {
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
            toast.success(<Redirect />, {
              autoClose: 5000,
            })
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
            toast.success(<Redirect />, {
              autoClose: 5000,
            })
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
      router.push("/login");
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
  return <>
    <Link
      href={{
        pathname: "/single-product",
        query: { slug: datas.slug },
      }}
      passHref
      rel="noopener noreferrer">

      <div
        style={{ boxShadow: "0px 11px 73px rgba(0, 0, 0, 0.07)" }}
        className={`product-card-row-two rounded-md w-full h-[315px] overflow-hidden bg-white border border-transparent hover:border-qpurple transition-all duration-300 ease-in-out ${
          className || ""
        }`}
      >
        <div className="w-full h-[105px] bg-white px-5 ">
          <div className="w-full h-full ">
            <div className="w-full h-[205px] relative">
              <Image
                layout="fill"
                objectFit="scale-down"
                src={`${datas.image}`}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 h-full flex flex-col justify-center">
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

              <h3 className="title mb-2 text-base font-600 text-qblack leading-[24px] line-clamp-1 hover:text-qpurple cursor-pointer">
                {datas.title}
              </h3>

              <p className="price">
                <span
                  suppressHydrationWarning
                  className={`main-price  font-500 text-base ${
                    offerPrice ? "line-through text-qgray" : "text-qpurple"
                  }`}
                >
                  {offerPrice ? (
                    <span>{currency_icon && currency_icon + price}</span>
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
          </div>
        </div>
      </div>

    </Link>
  </>;
}
