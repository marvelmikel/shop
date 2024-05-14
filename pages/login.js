import React from "react";
import PageHead from "../src/components/Helpers/PageHead";
import Login from "./../src/components/Auth/Login/index";

export default function login() {
  return (
    <>
      <PageHead title="TrustEtronicsABC | Login" />
      <Login />
    </>
  );
}
