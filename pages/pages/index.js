import React from "react";
import CustomPageCom from "../../src/components/CustomPageCom";
import { useRouter } from "next/router";

export default function Pages() {
  const router = useRouter();
  return (
    <>
      <CustomPageCom slug={router.query.custom} />
    </>
  );
}
