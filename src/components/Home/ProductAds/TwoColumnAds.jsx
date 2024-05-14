import React from "react";
import Link from "next/link";
import ShopNowBtn from "../../Helpers/Buttons/ShopNowBtn";

function TwoColumnAds({ bannerOne, bannerTwo }) {
  return <>
      {bannerOne && bannerTwo && (
          <div className="w-full h-[460px]">
              <div className="container-x mx-auto h-full">
                  <div
                      className={`lg:flex xl:space-x-[30px] md:space-x-5 items-center w-full h-full  overflow-hidden`}
                  >
                      {bannerOne && (
                          <div
                              className="w-full rounded h-full px-[40px] py-[30px] flex justify-end"
                              style={{
                                  backgroundImage: `url(${
                                      process.env.NEXT_PUBLIC_BASE_URL + bannerOne.image
                                  })`,
                                  backgroundRepeat: "no-repeat",
                                  backgroundSize: "cover",
                              }}
                          >
                              <div className="md:w-[266px] w-full h-full">
                                  <div>
                                      <p className="text-qblack text-sm uppercase mb-2">
                                          {bannerOne.title_one}
                                      </p>
                                      <h2 className="md:text-[34px] text-[26px] font-semibold md:leading-[42px] mb-[40px]">
                                          {bannerOne.title_two}
                                      </h2>
                                  </div>
                                  <div>
                                      <Link
                                          href={{
                                              pathname: "/products",
                                              query: { category: bannerOne.product_slug },
                                          }}
                                          passHref
                                          rel="noopener noreferrer">

                                          <ShopNowBtn
                                              className="w-[128px] h-[40px] bg-qyellow"
                                              textColor="text-qblack group-hover:text-white"
                                          />

                                      </Link>
                                  </div>
                              </div>
                          </div>
                      )}
                      {bannerTwo && (
                          <div
                              className="w-full rounded h-full px-[40px] py-[30px]"
                              style={{
                                  backgroundImage: `url(${
                                      process.env.NEXT_PUBLIC_BASE_URL + bannerTwo.image
                                  })`,
                                  backgroundRepeat: "no-repeat",
                                  backgroundSize: "cover",
                              }}
                          >
                              <div className="w-[266px] h-full">
                                  <div>
                                      <p className="text-qblack text-sm uppercase mb-2">
                                          {bannerTwo.title_one}
                                      </p>
                                      <h2 className="text-[34px] font-semibold leading-[42px] mb-[40px]">
                                          {bannerTwo.title_two}
                                      </h2>
                                  </div>
                                  <div>
                                      <Link
                                          href={{
                                              pathname: "/products",
                                              query: { category: bannerTwo.product_slug },
                                          }}
                                          passHref
                                          rel="noopener noreferrer">

                                          <ShopNowBtn
                                              className="w-[128px] h-[40px] bg-qpurple"
                                              textColor="text-white group-hover:text-white"
                                          />

                                      </Link>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>

      )}



  </>;
}

export default TwoColumnAds;
