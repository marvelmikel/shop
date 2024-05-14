import Link from "next/link";
import CountDown from "../Helpers/CountDown";
import ShopNowBtn from "../Helpers/Buttons/ShopNowBtn";
import { useEffect, useState } from "react";
import languageModel from "../../../utils/languageModel";
import DataIteration from "../Helpers/DataIteration";
import ProductCardStyleOne from "../Helpers/Cards/ProductCardStyleOne";

export default function CampaignCountDown({ className, datas, products = [] }) {
  const { showDate, showHour, showMinute, showSecound } = CountDown(
    datas.end_time
  );
  const [langCntnt, setLangCntnt] = useState(null);
  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);
  const cp =
    products &&
    products.length > 0 &&
    products.map((item) => {
      return {
        id: item.id,
        category_id: item.category_id,
        title: item.name,
        slug: item.slug,
        image: process.env.NEXT_PUBLIC_BASE_URL + item.thumb_image,
        price: item.price,
        offer_price: item.offer_price,
        campaingn_product: null,
        review: parseInt(item.averageRating),
        variants: item.active_variants ? item.active_variants : [],
      };
    });
  return (
    <div>
      <div className={`w-full ${className || ""}`}>
        <div
          data-aos="fade-right"
          className="campaign-countdown w-full h-full rounded relative bg-red-500 md:py-[60px] py-[30px]"
        >
          <div className="container-x mx-auto h-full">
            <div className="flex justify-center ">
              <div className="countdown-wrapper lg:hidden flex space-x-[20px] mb-5">
                <div className="countdown-item">
                  <div className="countdown-number flex justify-center">
                    <span className="font-700 sm:text-[30px] text-[20px] text-[#EB5757]">
                      {showDate}
                    </span>
                  </div>
                  <p className="sm:text-[18px] text-[12px] font-500 text-center leading-8">
                    {langCntnt && langCntnt.Days}
                  </p>
                </div>
                <div className="countdown-item">
                  <div className="countdown-number flex justify-center">
                    <span className="font-700 sm:text-[30px] text-[20px] text-[#2F80ED]">
                      {showHour}
                    </span>
                  </div>
                  <p className="sm:text-[18px] text-[12px] font-500 text-center leading-8">
                    {langCntnt && langCntnt.Hours}
                  </p>
                </div>
                <div className="countdown-item">
                  <div className="countdown-number flex justify-center">
                    <span className="font-700 sm:text-[30px] text-[20px] text-[#219653]">
                      {showMinute}
                    </span>
                  </div>
                  <p className="sm:text-[18px] text-[12px] font-500 text-center leading-8">
                    {langCntnt && langCntnt.Minutes}
                  </p>
                </div>
                <div className="countdown-item">
                  <div className="countdown-number flex justify-center">
                    <span className="font-700 sm:text-[30px] text-[20px] text-[#EF5DA8]">
                      {showSecound}
                    </span>
                  </div>
                  <p className="sm:text-[18px] text-[12px] font-500 text-center leading-8">
                    {langCntnt && langCntnt.Seconds}
                  </p>
                </div>
              </div>
            </div>
            <div className=" section-title flex justify-between items-center mb-5">
              <div>
                <h1 className="sm:text-3xl text-xl font-600 text-qblack leading-none">
                  Flash Sale
                </h1>
              </div>
              <div className="countdown-wrapper hidden  lg:flex space-x-[50px]">
                <div className="countdown-item">
                  <div className="countdown-number flex justify-center">
                    <span className="font-700 sm:text-[30px] text-[20px] text-[#EB5757]">
                      {showDate}
                    </span>
                  </div>
                  <p className="sm:text-[18px] text-[12px] font-500 text-center leading-8">
                    {langCntnt && langCntnt.Days}
                  </p>
                </div>
                <div className="countdown-item">
                  <div className="countdown-number flex justify-center">
                    <span className="font-700 sm:text-[30px] text-[20px] text-[#2F80ED]">
                      {showHour}
                    </span>
                  </div>
                  <p className="sm:text-[18px] text-[12px] font-500 text-center leading-8">
                    {langCntnt && langCntnt.Hours}
                  </p>
                </div>
                <div className="countdown-item">
                  <div className="countdown-number flex justify-center">
                    <span className="font-700 sm:text-[30px] text-[20px] text-[#219653]">
                      {showMinute}
                    </span>
                  </div>
                  <p className="sm:text-[18px] text-[12px] font-500 text-center leading-8">
                    {langCntnt && langCntnt.Minutes}
                  </p>
                </div>
                <div className="countdown-item">
                  <div className="countdown-number flex justify-center">
                    <span className="font-700 sm:text-[30px] text-[20px] text-[#EF5DA8]">
                      {showSecound}
                    </span>
                  </div>
                  <p className="sm:text-[18px] text-[12px] font-500 text-center leading-8">
                    {langCntnt && langCntnt.Seconds}
                  </p>
                </div>
              </div>

              <div className="view-more-btn">
                <Link href="/flash-sale" passHref rel="noopener noreferrer">

                  <div className="flex space-x-2 items-center cursor-pointer group">
                    <p className="text-base flex space-x-2 items-center font-600 group-hover:text-qpurple text-qblack capitalize transition duration-300 ease-in-out">
                      {langCntnt && langCntnt.View_More}
                      <span className="transform translate-x-0 group-hover:translate-x-0.5  transition duration-300 ease-in-out">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className={`fill-current`}
                        >
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
                        </svg>
                      </span>
                    </p>
                  </div>

                </Link>
              </div>
            </div>
            <div className="products-section w-full">
              <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5">
                {cp.length > 0 && (
                  <DataIteration
                    datas={cp}
                    startLength={0}
                    endLength={cp.length > 4 ? 4 : cp.length}
                  >
                    {({ datas }) => (
                      <div key={datas.id} className="item">
                        <ProductCardStyleOne datas={datas} />
                      </div>
                    )}
                  </DataIteration>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
