import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";
import languageModel from "../../../utils/languageModel";
import { useEffect, useState } from "react";

export default function TermsCondition({ datas }) {
  const { seller_tems_conditions } = datas;
  const [langCntnt, setLangCntnt] = useState(null);
  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);
  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="terms-condition-page w-full bg-white pb-[30px]">
        <div className="w-full mb-[30px]">
          <PageTitle
            breadcrumb={[
              { name: langCntnt && langCntnt.home, path: "/" },
              {
                name: langCntnt && langCntnt.Term_and_Conditions,
                path: "/seller-terms-condition",
              },
            ]}
            title={langCntnt && langCntnt.Term_and_Conditions}
          />
        </div>
        <div className="w-full pb-[120px]">
          <div
            className="container-x mx-auto content-body"
            dangerouslySetInnerHTML={{
              __html: seller_tems_conditions.seller_condition,
            }}
          ></div>
        </div>
      </div>
    </Layout>
  );
}
