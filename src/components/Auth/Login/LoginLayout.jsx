import Layout from "../../Partials/Layout";
import Image from "next/image";
function LoginLayout({ imgThumb, children }) {
  return (
    <Layout childrenClasses="pt-0 pb-0 min-h-0">
      <div className="login-page-wrapper w-full relative">
        <div className="w-full h-full  min-h-screen absolute left-0 top-0">
          <div className="w-full h-full relative z-10">
            {imgThumb && (
              <Image
                layout="fill"
                src={`${process.env.NEXT_PUBLIC_BASE_URL + imgThumb}`}
                alt="login"
              />
            )}
            <div className="bg-[#232532] bg-opacity-50 relative w-full h-full absolute left-0 top-0"></div>
          </div>
        </div>
        <div className="container-x mx-auto">
          <div className="lg:flex items-center justify-center relative pt-[60px] pb-[114px]">
            <div className="lg:w-[572px] w-full h-[630px] bg-white flex flex-col justify-center sm:p-10 p-5 border border-qpurplelow/10 rounded-lg relative z-20">
              {children && children}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default LoginLayout;
