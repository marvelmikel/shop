import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Layout from "./Partials/Layout";
import PageTitle from "./Helpers/PageTitle";
import languageModel from "../../utils/languageModel";
import PageHead from "./Helpers/PageHead";

function CustomPageCom({ slug }) {
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const [pageData, setPageData] = useState(null);
  const [langCntnt, setLangCntnt] = useState(null);
  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);
  const router = useRouter();
  useEffect(() => {
    if (websiteSetup) {
      const checkPageIsExist = websiteSetup.payload.customPages.find((item) => {
        return item.slug === slug;
      });
      if (checkPageIsExist) {
        setPageData(checkPageIsExist);
      } else {
        router.push("/404");
      }
    }
  }, [pageData, slug, websiteSetup]);
  return (
    <>
      {pageData && <PageHead title={pageData.page_name} />}
      <Layout childrenClasses="pt-0 pb-0">
        <div className="terms-condition-page w-full bg-white pb-[30px]">
          <div className="w-full mb-[30px]">
            {pageData && (
              <PageTitle
                breadcrumb={[
                  { name: langCntnt && langCntnt.home, path: "/" },
                  {
                    name: pageData.page_name,
                    path: `/pages?custom=${pageData.slug}`,
                  },
                ]}
                title={pageData.page_name}
              />
            )}
          </div>
          <div className="w-full pb-[120px]">
            <div className="container-x mx-auto content-body">
              {pageData && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: pageData.description,
                  }}
                ></div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default CustomPageCom;
