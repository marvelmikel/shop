import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DateFormat from "../../../../../utils/DateFormat";
import DataIteration from "../../../Helpers/DataIteration";
import Star from "../../../Helpers/icons/Star";
import languageModel from "../../../../../utils/languageModel";

export default function ReviewTab({ className, reviews }) {
  const [langCntnt, setLangCntnt] = useState(null);
  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);
  return <>
    <div className="review-tab-wrapper w-full">
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-8">
        <DataIteration
          datas={reviews}
          startLength={0}
          endLength={reviews && reviews.length > 0 && reviews.length}
        >
          {({ datas }) => (
            <div key={datas.id} className="item">
              <div
                style={{ boxShadow: "0px 15px 64px rgba(0, 0, 0, 0.05)" }}
                className={`product-row-card-style-one border border-qpurple rounded w-full h-[170px] bg-white group relative overflow-hidden ${
                  className || ""
                }`}
              >
                <div className="flex space-x-2 items-center w-full h-full p-2">
                  <div className="w-1/3 h-full relative">
                    <Image
                      layout="fill"
                      objectFit="scale-down"
                      src={`${
                        process.env.NEXT_PUBLIC_BASE_URL +
                        datas.product.thumb_image
                      }`}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div>
                      <span className="text-qgray text-sm mb-1.5 block">
                        {DateFormat(datas.created_at)}
                      </span>
                      {/* reviews */}
                      <div className="flex space-x-1 mb-1.5">
                        {Array.from(Array(parseInt(datas.rating)), () => (
                          <span key={datas.review + Math.random()}>
                            <Star />
                          </span>
                        ))}
                      </div>
                      <Link
                        href={{
                          pathname: "/single-product",
                          query: { slug: datas.product.slug },
                        }}
                        legacyBehavior>
                        <h1 className="title mb-2 sm:text-[15px] text-[13px] font-600 text-qblack leading-[24px] line-clamp-1 hover:text-qpurple cursor-pointer">
                          {datas.product.name}
                        </h1>
                      </Link>
                      <p className="price text-sm text-qgray line-clamp-2">
                        {datas.review}
                      </p>
                    </div>
                  </div>
                </div>
                {parseInt(datas.status) === 0 && (
                  <div className="absolute right-3 font-medium top-3 px-3 py-1 rounded bg-[#fff6dc] bg-opacity-50 text-qyellow border text-sm border-qyellow">
                    {langCntnt && langCntnt.Pending_review}
                  </div>
                )}
              </div>
            </div>
          )}
        </DataIteration>
      </div>
    </div>
  </>;
}
