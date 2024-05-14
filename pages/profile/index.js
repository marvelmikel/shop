import React from "react";
import Profile from "../../src/components/Auth/Profile";
import PageHead from "../../src/components/Helpers/PageHead";
import Layout from "../../src/components/Partials/Layout";
function Index() {
  return (
    <>
      <PageHead title="TrustEtronicsABC | Dashboard" />
      <Layout childrenClasses="pt-0 pb-0">
        <Profile />
      </Layout>
    </>
  );
}

export default Index;
