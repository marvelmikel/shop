import React, { useEffect, useState } from "react";
import DateFormat from "../../../../../utils/DateFormat";
import Link from "next/link";
import languageModel from "../../../../../utils/languageModel";
import settings from "../../../../../utils/settings";

export default function OrderTab({ orders }) {
  const [langCntnt, setLangCntnt] = useState(null);
  const {currency_icon}=settings();
  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);
  return <>
    <div className="relative w-full overflow-x-auto sm:rounded-lg">
      <table className="w-full text-sm text-left text-qgray dark:text-gray-400">
        <tbody>
          {/* table heading */}
          <tr className="text-base text-qgray whitespace-nowrap px-2 border-b border-qpurplelow/10 ">
            <td className="text-qblack font-semibold py-4 block whitespace-nowrap text-center">
              <h3>{langCntnt && langCntnt.Order}</h3>
            </td>
            <td className="text-qblack font-semibold py-4 whitespace-nowrap text-center">
              <h3>{langCntnt && langCntnt.Date}</h3>
            </td>
            <td className="text-qblack font-semibold py-4 whitespace-nowrap text-center">
              <h3>{langCntnt && langCntnt.Amount}</h3>
            </td>
            <td className="text-qblack font-semibold py-4 whitespace-nowrap  text-center">
              <h3>{langCntnt && langCntnt.Action}</h3>
            </td>
          </tr>
          {/* table heading end */}
          {orders &&
            orders.length > 0 &&
            orders.map((item, i) => (
              <tr key={i} className="bg-white border-b border-qpurplelow/10">
                <td className="text-center py-4">
                  <span className="text-lg text-qgray font-medium">
                    #{item.order_id}
                  </span>
                </td>
                <td className="text-center py-4 px-2">
                  <span className="text-base text-qgray  whitespace-nowrap">
                    {DateFormat(item.created_at)}
                  </span>
                </td>
                {/*<td className="text-center py-4 px-2">*/}
                {/*  <span className="text-sm rounded text-green-500 bg-green-100 p-2">*/}
                {/*    Complated*/}
                {/*  </span>*/}
                {/*</td>*/}
                <td className="text-center py-4 px-2">
                  <span className="text-base text-qblack whitespace-nowrap px-2 ">
                    {currency_icon + item.total_amount}
                  </span>
                </td>
                <td className="py-4 flex justify-center">
                  <div className="flex space-x-2 items-center">
                    <Link href={`/order/${item.order_id}`} legacyBehavior>
                      <div className="w-[116px] h-[46px] transition-common bg-qpurple hover:bg-qpurplelow/10 hover:text-qpurple border border-transparent hover:border-qpurple text-white  font-bold flex justify-center items-center cursor-pointer rounded">
                        <span>{langCntnt && langCntnt.View_Details}</span>
                      </div>
                    </Link>
                    {/*{item.order_status === "0" && (*/}
                    {/*  <button*/}
                    {/*    type="button"*/}
                    {/*    className="text-green-500 text-sm font-semibold"*/}
                    {/*  >*/}
                    {/*    Review*/}
                    {/*  </button>*/}
                    {/*)}*/}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </>;
}
