import Checkbox from "../Helpers/Checkbox";
import { useEffect, useState } from "react";
import languageModel from "../../../utils/languageModel";
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import settings from "../../../utils/settings";
export default function ProductsFilter({
  categories,
  categoryHandler,
  varientHandler,
  brandsHandler,
  volume,
  volumeHandler,
  className,
  filterToggle,
  filterToggleHandler,
  variantsFilter,
  priceMin,
  priceMax,
  brands,
}) {
  const [langCntnt, setLangCntnt] = useState(null);
  const { currency_icon } = settings();
  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);
  return (
    <>
      <div
        style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 15px 64px" }}
        className={`filter-widget w-full fixed xl:relative left-0 rounded top-0 h-screen z-10 lg:h-auto overflow-y-scroll lg:overflow-y-auto bg-white px-[30px] pt-[40px] ${
          className || ""
        }  ${filterToggle ? "block" : "hidden xl:block"}`}
      >
        <div className="filter-subject-item pb-10 border-b border-qpurplelow/10">
          <div className="subject-title mb-[30px]">
            <h1 className="text-qblack text-base font-500 capitalize">
              {langCntnt && langCntnt.Product_categories}
            </h1>
          </div>
          <div className="filter-items">
            <ul>
              {categories &&
                categories.length > 0 &&
                categories.map((item, i) => (
                  <li key={i} className="item mb-5">
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-[14px] items-center">
                        <div>
                          <Checkbox
                            className="accent-qpurple"
                            id={item.slug}
                            name={item.id}
                            handleChange={(e) => categoryHandler(e)}
                            checked={item.selected}
                          />
                        </div>
                        <label
                          htmlFor={item.slug}
                          className="text-sm font-black font-400 capitalize"
                        >
                          {item.name}
                        </label>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className="filter-subject-item pb-10 border-b border-qpurplelow/10 mt-10">
          <div className="subject-title mb-[30px]">
            <h1 className="text-qblack text-base font-500 capitalize">
              {langCntnt && langCntnt.Price_Range}
            </h1>
          </div>
          {volume && (
            <>
              <div className="price-range mb-5">
                {/*<InputRange*/}
                {/*  maxValue={priceMax}*/}
                {/*  minValue={priceMin}*/}
                {/*  value={volume}*/}
                {/*  onChange={volumeHandler}*/}
                {/*/>*/}
                <RangeSlider value={volume} onInput={volumeHandler} min={priceMin} max={priceMax} />
              </div>
              <p className="text-xs text-qblack font-400">
                {langCntnt && langCntnt.Price}: {currency_icon + volume[0]} - {currency_icon + volume[1]}
              </p>
            </>
          )}
        </div>
        <div className="filter-subject-item pb-10 border-b border-qpurplelow/10 mt-10">
          <div className="subject-title mb-[30px]">
            <h1 className="text-qblack text-base font-500 capitalize">
              {langCntnt && langCntnt.Brands}
            </h1>
          </div>
          <div className="filter-items">
            <ul>
              {brands &&
                brands.length > 0 &&
                brands.map((brand, i) => (
                  <li
                    key={i}
                    className="item flex justify-between items-center mb-5"
                  >
                    <div className="flex space-x-[14px] items-center">
                      <div>
                        <Checkbox
                          className="accent-qpurple"
                          id={brand.name}
                          name={brand.id}
                          handleChange={(e) => brandsHandler(e)}
                          checked={brand.selected}
                        />
                      </div>
                      <label
                        htmlFor={brand.name}
                        className="text-sm font-black font-400 capitalize"
                      >
                        {brand.name}
                      </label>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        {variantsFilter &&
          variantsFilter.length &&
          variantsFilter.map((variant, i) => (
            <div key={i} className="filter-subject-item pb-10 mt-10">
              <div className="subject-title mb-[30px]">
                <h1 className="text-qblack text-base font-500 capitalize">
                  {variant.name}
                </h1>
              </div>
              <div className="filter-items">
                <ul>
                  {variant &&
                    variant.active_variant_items.length > 0 &&
                    variant.active_variant_items.map((varientItem, i) => (
                      <li
                        key={i}
                        className="item flex justify-between items-center mb-5"
                      >
                        <div className="flex space-x-[14px] items-center">
                          <div>
                            <Checkbox
                              className="accent-qpurple"
                              id={varientItem.name}
                              name={varientItem.name}
                              handleChange={(e) => varientHandler(e)}
                              checked={varientItem.selected}
                            />
                          </div>
                          <label
                            htmlFor={varientItem.name}
                            className="text-sm font-black font-400 capitalize"
                          >
                            {varientItem.name}
                          </label>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))}

        <button
          onClick={filterToggleHandler}
          type="button"
          className="w-10 h-10 fixed top-5 right-5 z-50 rounded  lg:hidden flex justify-center items-center border border-qred text-qred"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
