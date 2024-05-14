import { useState, useEffect } from "react";
import CategoryCard from "./Cards/CategoryCard";
import ProductCardStyleOne from "./Cards/ProductCardStyleOne";
import DataIteration from "./DataIteration";
import LoaderStyleTwo from "./Loaders/LoaderStyleTwo";
import ViewMoreTitle from "./ViewMoreTitle";
export default function SectionStyleOne({
  className,
  categoryTitle,
  sectionTitle,
  seeMoreUrl,
  categories = [],
  products = [],
  categoryBackground,
}) {
  const [selectedId, setId] = useState(
    categories.length > 0 && parseInt(categories[0].category_id)
  );
  const [load, setLoad] = useState(false);
  const cp =
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
  const [filterProducts, setProducts] = useState(
    cp && cp.filter((item) => item.category_id === selectedId)
  );
  const categoryHandler = (id) => {
    setLoad(true);
    setTimeout(() => {
      setId(id);
      setLoad(false);
    }, 500);
  };
  useEffect(() => {
    if (cp) {
      const products = cp.filter(
        (item) => parseInt(item.category_id) === selectedId
      );

      setProducts(products);
    }
  }, [selectedId]);

  return (
    <>
      {categories.length > 0 && products.length > 0 && (
        <div
          data-aos="fade-up"
          className={`section-style-one md:py-[60px] py-[30px] bg-qpurplelow/10 ${
            className || ""
          }`}
        >
          <ViewMoreTitle
            categoryHandler={categoryHandler}
            categoryies={categories}
            categoryTitle={sectionTitle}
            seeMoreUrl={seeMoreUrl}
            productsInCategoryIds={cp.map((i) => parseInt(i.category_id))}
          >
            <div className="products-section w-full">
              <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5">
                {load === false ? (
                  filterProducts.length > 0 && (
                    <DataIteration
                      datas={filterProducts}
                      startLength={0}
                      endLength={
                        filterProducts.length > 4 ? 4 : filterProducts.length
                      }
                    >
                      {({ datas }) => (
                        <div key={datas.id} className="item">
                          <ProductCardStyleOne datas={datas} />
                        </div>
                      )}
                    </DataIteration>
                  )
                ) : (
                  <div className="loading  h-[445px] flex justify-center items-center col-span-4">
                    <LoaderStyleTwo />
                  </div>
                )}
              </div>
            </div>
          </ViewMoreTitle>
        </div>
      )}
    </>
  );
}
