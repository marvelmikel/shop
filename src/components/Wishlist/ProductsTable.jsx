import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import apiRequest from "../../../utils/apiRequest";
import auth from "../../../utils/auth";
import settings from "../../../utils/settings";
import { fetchWishlist } from "../../store/wishlistData";
import CheckProductIsExistsInFlashSale from "../Shared/CheckProductIsExistsInFlashSale";
import { useRouter } from "next/dist/client/router";
import languageModel from "../../../utils/languageModel";
import {toast} from "react-toastify";

export default function ProductsTable({ className, products }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mainProduct, setMainProducts] = useState(null);
  const [langCntnt, setLangCntnt] = useState(null);
  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);
  const price = (item) => {
    if (item) {
      if (item.product.offer_price) {
        if (
          item.product.active_variants &&
          item.product.active_variants.length > 0
        ) {
          const prices = item.product.active_variants.map((item) =>
            item
              ? parseInt(
                  item.active_variant_items.length > 0
                    ? item.active_variant_items[0].price
                    : 0
                )
              : 0
          );

          const sumVarient = prices.reduce((p, c) => p + c);
          return parseInt(item.product.offer_price) + sumVarient;
        } else {
          return parseInt(item.product.offer_price);
        }
      } else {
        if (
          item.product.active_variants &&
          item.product.active_variants.length > 0
        ) {
          const prices = item.product.active_variants.map((item) =>
            item
              ? parseInt(
                  item.active_variant_items.length > 0
                    ? item.active_variant_items[0].price
                    : 0
                )
              : 0
          );
          const sumVarient = prices.reduce((p, c) => p + c);
          return parseInt(item.product.price) + sumVarient;
        } else {
          return item.product.price;
        }
      }
    }
  };
  useEffect(() => {
    if (products) {
      setMainProducts(
        products &&
          products.data.map((item) => {
            return {
              ...item,
              totalPrice: item.product.price,
            };
          })
      );
    } else {
      setMainProducts(null);
    }
  }, [products]);

  const removeToWishlist = (id) => {
    if (auth()) {
      apiRequest.removeToWishlist({ id: id, token: auth().access_token }).then((res)=>{
        console.log(res);
      }).catch((err)=>{
        if(err.response){
          toast.error(err.response.data?.message)
        }
      });
      dispatch(fetchWishlist());
    } else {
      router.push("/login");
    }
  };
  const { currency_icon } = settings();
  return (
    <div className={`w-full ${className || ""}`}>
      <div className="relative w-full overflow-x-auto rounded overflow-hidden border border-qpurplelow/10">
        <table className="w-full text-sm text-left text-qgray dark:text-gray-400">
          <tbody>
            {/* table heading */}
            <tr className="text-[13px] font-medium text-qblack bg-[#F6F6F6] whitespace-nowrap px-2 border-b border-qpurplelow/10 uppercase">
              <td className="py-4 pl-10 block whitespace-nowrap">
                {langCntnt && langCntnt.Product}
              </td>

              <td className="py-4 whitespace-nowrap text-center">
                {langCntnt && langCntnt.Price}
              </td>

              <td className="py-4 whitespace-nowrap text-center block">
                {langCntnt && langCntnt.Action}
              </td>
            </tr>
            {/*table heading end*/}
            {mainProduct &&
              mainProduct.map((item) => (
                <tr
                  key={item.id}
                  className="bg-white border-b border-qpurplelow/10"
                >
                  <td className="pl-10  py-4  w-[380px] ">
                    <div className="flex space-x-6 items-center">
                      <div className="w-[80px] h-[80px] rounded overflow-hidden flex justify-center items-center border border-qpurplelow/10 relative">
                        <Image
                          layout="fill"
                          src={`${
                            process.env.NEXT_PUBLIC_BASE_URL +
                            item.product.thumb_image
                          }`}
                          alt="product"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <Link
                          href={{
                            pathname: "/single-product",
                            query: { slug: item.product.slug },
                          }}
                          legacyBehavior>
                          <p className="font-medium text-[15px] text-qblack hover:text-qpurple cursor-pointer">
                            {item.product.name}
                          </p>
                        </Link>
                      </div>
                    </div>
                  </td>

                  <td className="text-center py-4 px-2">
                    <div className="flex space-x-1 items-center justify-center">
                      <span
                        suppressHydrationWarning
                        className="text-[15px] font-normal text-qblack"
                      >
                        {
                          <CheckProductIsExistsInFlashSale
                            id={item.product_id}
                            price={price(item)}
                          />
                        }
                      </span>
                    </div>
                  </td>
                  <td className="text-right py-4">
                    <div className="flex space-x-1 items-center justify-center">
                      <span
                        className="cursor-pointer"
                        onClick={() => removeToWishlist(item.id)}
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.7 0.3C9.3 -0.1 8.7 -0.1 8.3 0.3L5 3.6L1.7 0.3C1.3 -0.1 0.7 -0.1 0.3 0.3C-0.1 0.7 -0.1 1.3 0.3 1.7L3.6 5L0.3 8.3C-0.1 8.7 -0.1 9.3 0.3 9.7C0.7 10.1 1.3 10.1 1.7 9.7L5 6.4L8.3 9.7C8.7 10.1 9.3 10.1 9.7 9.7C10.1 9.3 10.1 8.7 9.7 8.3L6.4 5L9.7 1.7C10.1 1.3 10.1 0.7 9.7 0.3Z"
                            fill="#AAAAAA"
                          />
                        </svg>
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
