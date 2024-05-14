import Link from "next/link";
import { useEffect, useState } from "react";
import languageModel from "../../../../../utils/languageModel";
export default function TopBar({ className, contact }) {
  const [auth, setAuth] = useState(null);
  const [langCntnt, setLangCntnt] = useState(null);
  useEffect(() => {
    setAuth(JSON.parse(localStorage.getItem("auth")));
    setLangCntnt(languageModel());
  }, []);

  return <>
    <div
      className={`w-full bg-qpurplelow/10 h-10 border-b border-qpurple ${
        className || ""
      }`}
    >
      <div className="container-x mx-auto h-full">
        <div className="flex justify-between items-center h-full">
          <div className="topbar-nav">
            <ul className="flex space-x-6">
              <li>
                {auth ? (
                  (<Link href="/profile#dashboard" passHref rel="noopener noreferrer">

                    <span className="text-sm leading-6 text-qblack font-500 cursor-pointer">
                      {langCntnt && langCntnt.Account}
                    </span>

                  </Link>)
                ) : (
                  (<Link href="/login" passHref rel="noopener noreferrer">

                    <span className="text-sm leading-6 text-qblack font-500 cursor-pointer">
                      {langCntnt && langCntnt.Account}
                    </span>

                  </Link>)
                )}
              </li>
              <li>
                <Link href="/tracking-order" passHref rel="noopener noreferrer">

                  <span className="text-sm leading-6 text-qblack font-500 cursor-pointer">
                    {langCntnt && langCntnt.Track_Order}
                  </span>

                </Link>
              </li>
              <li>
                <Link href="/faq" passHref rel="noopener noreferrer">

                  <span className="text-sm leading-6 text-qblack font-500 cursor-pointer">
                    {langCntnt && langCntnt.Support}
                  </span>

                </Link>
              </li>
            </ul>
          </div>
          <div className="topbar-dropdowns sm:block hidden">
            <a href={`tel:${contact && contact.phone}`}>
              <div className="flex space-x-2 items-center">
                <span className="text-qblack text-sm font-medium">
                  {langCntnt && langCntnt.Need_help}
                </span>
                <span className="text-xs text-qpurple font-bold leading-none">
                  {contact && contact.phone}
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </>;
}
