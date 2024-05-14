import React from "react";
import Image from "next/image";
import Link from "next/link";
import ShopNowBtn from "../Helpers/Buttons/ShopNowBtn";

function CategorySection({ sectionTitle, categories, adsOne, adsTwo }) {
  return (
    <div className="category-section-wrapper w-full">
      <div className="container-x mx-auto md:py-[60px] py-[30px]">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-[30px] lg:mb-[60px] mb-[30px]">
          {adsOne && parseInt(adsOne.status)===1 && (
              <div
                  data-aos="fade-right"
                  className="item w-full rounded-2xl overflow-hidden"
              >
                <div
                    className="w-full  h-[453px] rounded bg-center"
                    style={{
                      backgroundImage: `url(${
                          process.env.NEXT_PUBLIC_BASE_URL + adsOne.image
                      })`,
                      backgroundRepeat: `no-repeat`,
                      backgroundSize: "cover",
                    }}
                >
                  <div className="px-[40px] pt-[40px]">
                <span className="text-sm text-qblack mb-2 inline-block uppercase font-medium">
                  {adsOne.title_one}
                </span>
                    <h1 className="text-[34px] leading-[38px] font-semibold text-qblack mb-[20px] w-[277px]">
                      {adsOne.title_two}
                    </h1>
                    <Link
                      href={{
                        pathname: "/products",
                        query: { category: adsOne.product_slug },
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
          {adsTwo && parseInt(adsTwo.status)===1 && (
              <div
                  data-aos="fade-up"
                  className="item w-full rounded-2xl  overflow-hidden"
              >
                <div
                    className="w-full  h-[453px] rounded bg-center"
                    style={{
                      backgroundImage: `url(${
                          process.env.NEXT_PUBLIC_BASE_URL + adsTwo.image
                      })`,
                      backgroundRepeat: `no-repeat`,
                      backgroundSize: "cover",
                    }}
                >
                  <div className="px-[40px] pt-[40px]">
                <span className="text-sm text-qblack mb-2 inline-block uppercase font-medium">
                  {adsTwo.title_one}
                </span>
                    <h1 className="text-[34px] leading-[38px] font-semibold text-qblack mb-[20px] w-[277px]">
                      {adsTwo.title_two}
                    </h1>
                    <Link
                      href={{
                        pathname: "/products",
                        query: { category: adsTwo.product_slug },
                      }}
                      passhref
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
        <div>
          <div className="section-title flex justify-between items-center mb-5">
            <div>
              <h1 className="sm:text-3xl text-xl font-600 text-qblack">
                {sectionTitle}
              </h1>
            </div>
          </div>
          <div className="w-full grid xl:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-[30px]">
            {categories.length > 0 &&
              categories
                .slice(0, categories.length > 6 ? 6 : categories.length)
                .map((item, i) => (
                  <div
                    data-aos="fade-left"
                    data-aos-delay={i + "00"}
                    key={i}
                    className="item w-full cursor-pointer group"
                  >
                    <Link
                      href={{
                        pathname: "/products",
                        query: { category: item.slug },
                      }}
                      passhref
                      rel="noopener noreferrer">

                      <div className="w-full h-[180px] relative rounded-[6px] bg-qpurplelow/10 border border-transparent  group-hover:border-qpurple transition duration-300 ease-in-out  flex flex-col justify-center items-center">
                        <div className="mb-5 relative transform scale-100 group-hover:scale-110 transition duration-300 ease-in-out">
                          <Image
                            layout="fill"
                            objectFit="scale-down"
                            src={
                              process.env.NEXT_PUBLIC_BASE_URL + item.image
                            }
                            alt="category"
                          />
                        </div>
                        <p className="text-base text-qblack font-500 text-center group-hover:text-qpurple transition duration-300 ease-in-out">
                          {item.name}
                        </p>
                      </div>

                    </Link>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategorySection;
