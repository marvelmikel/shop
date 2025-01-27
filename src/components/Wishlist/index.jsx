import BreadcrumbCom from "../BreadcrumbCom";
import EmptyWishlistError from "../EmptyWishlistError";
import PageTitle from "../Helpers/PageTitle";
import ProductsTable from "./ProductsTable";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import auth from "../../../utils/auth";
import apiRequest from "../../../utils/apiRequest";
import { toast } from "react-toastify";
import { fetchWishlist } from "../../store/wishlistData";
import isAuth from "../../../Middleware/isAuth";
import { useEffect, useState } from "react";
import languageModel from "../../../utils/languageModel";

function Wishlist() {
  const dispatch = useDispatch();
  const { wishlistData } = useSelector((state) => state.wishlistData);
  const wishlists = wishlistData && wishlistData.wishlists;
  const [langCntnt, setLangCntnt] = useState(null);
  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);
  const clearList = () => {
    if (auth()) {
      apiRequest
        .clearWishlist({
          token: auth().access_token,
        })
        .then(() => {
          toast.success(langCntnt && langCntnt.Clear_wishlist);
          dispatch(fetchWishlist());
        });
    }
    return false;
  };
  return <>
    {!wishlists || (wishlists && wishlists.data.length === 0) ? (
      <div className="wishlist-page-wrapper w-full pt-[60px] pb-[114px]">
        <div className="container-x mx-auto">
          <BreadcrumbCom
            paths={[
              { name: langCntnt && langCntnt.home, path: "/" },
              { name: langCntnt && langCntnt.wishlist, path: "/wishlist" },
            ]}
          />
          <EmptyWishlistError />
        </div>
      </div>
    ) : (
      <div className="wishlist-page-wrapper w-full bg-white pb-[114px]">
        <div className="w-full">
          <PageTitle
            title="Wishlist"
            breadcrumb={[
              { name: langCntnt && langCntnt.home, path: "/" },
              { name: langCntnt && langCntnt.wishlist, path: "/wishlist" },
            ]}
          />
        </div>
        <div className="w-full  pt-[60px]">
          <div className="container-x mx-auto">
            <ProductsTable
              products={wishlists && wishlists}
              className="mb-[30px]"
            />
            {wishlists && wishlists.data.length > 0 && (
              <div className="w-full mt-[30px] flex sm:justify-end justify-start">
                <div className="sm:flex sm:space-x-[30px] items-center">
                  <button onClick={() => clearList()} type="button">
                    <div className="w-full text-sm font-semibold text-qred mb-5 sm:mb-0">
                      {langCntnt && langCntnt.Clean_Wishlist}
                    </div>
                  </button>
                  <Link href="/cart" legacyBehavior>
                    <div className="w-[180px] h-[50px] cursor-pointer">
                      <div className="yellow-btn flex justify-center rounded">
                        <span className="w-full text-sm font-semibold text-center">
                          {langCntnt && langCntnt.View_Cards}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </>;
}

export default isAuth(Wishlist);
