import Image from "next/image";
import ProductCardStyleOne from "../Helpers/Cards/ProductCardStyleOne";
import DataIteration from "../Helpers/DataIteration";
import Star from "../Helpers/icons/Star";
import Link from "next/link";
import languageModel from "../../../utils/languageModel";
import { useEffect, useState } from "react";
import ShopNowBtn from "../Helpers/Buttons/ShopNowBtn";
export default function SallerInfo({ products, sellerInfo }) {
  const { seller } = sellerInfo;
  const [langCntnt, setLangCntnt] = useState(null);
  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);
  const rs =
    products.length > 0 &&
    products.map((item) => {
      return {
        id: item.id,
        title: item.name,
        slug: item.slug,
        image: process.env.NEXT_PUBLIC_BASE_URL + item.thumb_image,
        price: item.price,
        offer_price: item.offer_price,
        campaingn_product: null,
        review: parseInt(item.averageRating),
        variants: item.active_variants,
      };
    });
  return (
    <div className="saller-info-wrapper w-full">
      <div className="saller-info sm:flex justify-between items-center pb-[30px]">
        <div className="sm:flex sm:space-x-5 items-center sm:w-1/4">
          <div className="saller w-[73px] h-[73px] rounded-full overflow-hidden relative">
            {seller.user && (
              <Image
                layout="fill"
                src={`${
                  seller.user.image
                    ? process.env.NEXT_PUBLIC_BASE_URL + seller.user.image
                    : "/assets/images/Group.png"
                }`}
                alt="saller"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <h6 className="text-[18px] font-medium leading-[30px]">
              {seller.user.name}
            </h6>
            <p className="text-[13px] font-normal text-qgray leading-[30px]">
              {seller.address}
            </p>
            <div className="flex items-center mt-4">
              <div className="flex space-x-1">
                {Array.from(Array(parseInt(seller.averageRating)), () => (
                  <span key={parseInt(seller.averageRating) + Math.random()}>
                    <Star />
                  </span>
                ))}
                {parseInt(seller.averageRating) < 5 && (
                  <>
                    {Array.from(
                      Array(5 - parseInt(seller.averageRating)),
                      () => (
                        <span
                          key={parseInt(seller.averageRating) + Math.random()}
                          className="text-qgray"
                        >
                          <Star defaultValue={false} />
                        </span>
                      )
                    )}
                  </>
                )}
              </div>
              <span className="text-[13px] font-normal ml-1 leading-none">
                ({parseInt(seller.averageRating)})
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full sm:flex sm:space-x-5 justify-between sm:ml-[60px] mt-5 sm:mt-0">
          <div className="w-full mb-5 sm:mb-0">
            <ul>
              <li className="text-qgray leading-[30px]">
                <span className="text-[15px] text-qblack font-medium capitalize">
                  {langCntnt && langCntnt.products}
                </span>
                : {seller.sellerTotalProducts}
              </li>
              <li className="text-qgray leading-[30px]">
                <span className="text-[15px] text-qblack font-medium capitalize">
                  {langCntnt && langCntnt.Shop_Name}
                </span>
                : {seller.shop_name}
              </li>
              <li className="text-qgray leading-[30px]">
                <span className="text-[15px] text-qblack font-medium capitalize">
                  {langCntnt && langCntnt.phone}
                </span>
                : {seller.phone}
              </li>
            </ul>
          </div>
          <div className="w-full "></div>
        </div>
      </div>
      <div className="saller-product w-full mt-[30px]">
        <h1 className="text-[18px] font-medium mb-5">Product from Shop</h1>
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5">
          <DataIteration
            datas={rs}
            startLength={0}
            endLength={rs.length > 4 ? 4 : rs.length}
          >
            {({ datas }) => (
              <div key={datas.id} className="item">
                <ProductCardStyleOne datas={datas} />
              </div>
            )}
          </DataIteration>
        </div>
      </div>
      <div className="mt-[40px] w-full flex justify-center">
        <Link
          href={{
            pathname: "/seller-products",
            query: { seller: seller.slug },
          }}
          passHref
          rel="noopener noreferrer">

          <ShopNowBtn
            className="w-[300px] h-[50px] bg-qyellow"
            textColor="text-qblack group-hover:text-white font-semibold"
            label={langCntnt && langCntnt.View_Shop}
          />

        </Link>
      </div>
    </div>
  );
}
