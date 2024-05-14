import Image from "next/image";
import Link from "next/link";
export default function BestSellers({ className, sallers = [] }) {
  return (
    <div
      data-aos="fade-left"
      data-aos-duration="500"
      className={`w-full ${className || ""}`}
    >
      <div className="grid xl:grid-cols-6 lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 xl:gap-[30px] sm:gap-5 gap-2">
        {sallers.length > 0 &&
          sallers
            .slice(0, sallers.length > 6 ? 6 : sallers.length)
            .map((saller, i) => (
              <div className={`item`} key={i}>
                <Link
                  href={{
                    pathname: "/seller-products",
                    query: { seller: saller.slug },
                  }}
                  rel="noopener noreferrer">

                  <div
                    key={saller.id}
                    className=" w-full flex flex-col items-center group "
                  >
                    <div className=" w-[100px] h-[100px] flex justify-center items-center overflow-hidden mb-2 relative transform scale-100 group-hover:scale-110 transition duration-300 ease-in-out">
                      <div className="w-full h-full relative ">
                        <Image
                          layout="fill"
                          objectFit="scale-down"
                          src={`${
                            process.env.NEXT_PUBLIC_BASE_URL + saller.logo
                          }`}
                          alt={saller.slug}
                        />
                      </div>
                    </div>
                    <p className="text-base text-qblack font-500 text-center cursor-pointer">
                      {saller.shop_name}
                    </p>
                  </div>

                </Link>
              </div>
            ))}
      </div>
    </div>
  );
}
