import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";
import { useEffect, useState } from "react";
import languageModel from "../../../utils/languageModel";

export default function PrivacyPolicy({ datas }) {
  const { privacyPolicy } = datas;
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
                name: langCntnt && langCntnt.Privacy_Policy,
                path: "privacy-policy",
              },
            ]}
            title="Privacy Policy"
          />
        </div>
        <div className="w-full pb-[120px]">
          <div className="container-x mx-auto content-body">
            {privacyPolicy && (
              <div
                dangerouslySetInnerHTML={{
                  __html: privacyPolicy.privacy_policy,
                }}
              ></div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
