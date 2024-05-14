import Link from "next/link";
import { useEffect, useState } from "react";
import languageModel from "../../../utils/languageModel";

export default function ViewMoreTitle({
  categoryTitle = "",
  className,
  children,
  seeMoreUrl = "",
  categoryies = [],
  categoryHandler,
  productsInCategoryIds,
}) {
  const filterCategory =
    categoryies &&
    categoryies.length > 0 &&
    categoryies.filter((category) => {
      const id = parseInt(category.category_id);
      return productsInCategoryIds.includes(id);
    });
  const [langCntnt, setLangCntnt] = useState(null);
  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);
  return (
    <div className={`section-wrapper w-full ${className || ""}`}>
      <div className="container-x mx-auto">
        <div className=" section-title flex justify-between items-center mb-5">
          <div>
            <h1 className="sm:text-3xl text-xl font-600 text-qblack leading-none">
              {categoryTitle}
            </h1>
          </div>
          {filterCategory && filterCategory.length > 0 && (
            <div className="row-categories lg:flex space-x-10 items-center hidden">
              {filterCategory
                .slice(0, filterCategory.length > 4 ? 4 : filterCategory.length)
                .map((item, i) => (
                  <div key={i}>
                    <button
                      onClick={() => categoryHandler(item.category.id)}
                      title="button"
                      className="cat-item text-tblack hover:text-qpurple hover:underline text-lg font-medium"
                    >
                      {item.category.name}
                    </button>
                  </div>
                ))}
            </div>
          )}

          <div className="view-more-btn">
            <Link href={seeMoreUrl} passHref rel="noopener noreferrer">

              <div className="flex space-x-2 items-center cursor-pointer group">
                <p className="text-base font-600 flex space-x-2 items-center text-qblack group-hover:text-qpurple capitalize  transition duration-300 ease-in-out">
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
        <div className="section-content">{children && children}</div>
      </div>
    </div>
  );
}
