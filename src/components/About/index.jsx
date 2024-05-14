import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import BlogCard from "../Helpers/Cards/BlogCard";
import DataIteration from "../Helpers/DataIteration";
import FontAwesomeCom from "../Helpers/icons/FontAwesomeCom";
import Star from "../Helpers/icons/Star";
import PageTitle from "../Helpers/PageTitle";
import SimpleSlider from "../Helpers/SliderCom";
import Layout from "../Partials/Layout";
import languageModel from "../../../utils/languageModel";
export default function About({ aboutData }) {
  const hww = [
    {
      id: Math.random(),
      title: aboutData.aboutUs.title_one,
      description: aboutData.aboutUs.description_one,
      icon: aboutData.aboutUs.icon_one,
    },
    {
      id: Math.random(),
      title: aboutData.aboutUs.title_two,
      description: aboutData.aboutUs.description_two,
      icon: aboutData.aboutUs.icon_two,
    },
    {
      id: Math.random(),
      title: aboutData.aboutUs.title_three,
      description: aboutData.aboutUs.description_three,
      icon: aboutData.aboutUs.icon_three,
    },
  ];
  const [videoPopup, setPopup] = useState(false);
  const settings = {
    slidesToShow:
      aboutData.testimonials.length < 3 ? aboutData.testimonials.length : 3,
    slidesToScroll: 1,
    autoplay: false,
    centerMode: false,
    infinite: true,
    arrows: false,
    // centerPadding: "60px",
    dots: true,
    responsive: [
      {
        breakpoint: 1026,
        settings: {
          slidesToShow:
            aboutData.testimonials.length < 2
              ? aboutData.testimonials.length
              : 2,
          slidesToScroll: 2,
          centerMode: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
    ],
  };
  const slider = useRef(null);
  const prev = () => {
    slider.current.slickPrev();
  };
  const next = () => {
    slider.current.slickNext();
  };
  const rs = aboutData.blogs.slice(0, 3).map((item) => {
    return {
      id: item.id,
      by: item.blog.admin_id,
      comments_length: item.blog.active_comments.length,
      title: item.blog.title,
      article: item.blog.description,
      picture: process.env.NEXT_PUBLIC_BASE_URL + item.blog.image,
      slug: item.blog.slug,
    };
  });
  const [langCntnt, setLangCntnt] = useState(null);
  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);
  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="about-page-wrapper w-full">
        <div className="title-area w-full">
          <PageTitle
            title={langCntnt && langCntnt.About_us}
            breadcrumb={[
              { name: `${langCntnt && langCntnt.home}`, path: "/" },
              {
                name: `${langCntnt && langCntnt.About_us}`,
                path: "/about",
              },
            ]}
          />
        </div>

        <div className="aboutus-wrapper w-full py-10 bg-white">
          <div className="container-x mx-auto">
            <div className="w-full min-h-[665px] lg:flex lg:space-x-12 items-center pb-10 lg:pb-0">
              <div className="lg:w-1/2 w-full h-[560px] rounded overflow-hidden my-5 lg:my-0 relative">
                <div className="absolute left-0 top-0 ">
                  <Image
                    width={375}
                    height={470}
                    src={
                      process.env.NEXT_PUBLIC_BASE_URL +
                      aboutData.aboutUs.image_two
                    }
                    alt="about"
                    className="w-full h-full"
                  />
                </div>
                <div className="absolute right-0 bottom-0">
                  <Image
                    width={333}
                    height={403}
                    src={
                      process.env.NEXT_PUBLIC_BASE_URL +
                      aboutData.aboutUs.banner_image
                    }
                    alt="about"
                    className="w-full h-full"
                  />
                </div>
              </div>
              <div className="content lg:w-1/2 w-full">
                <div className="about-content">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: aboutData.aboutUs.about_us,
                    }}
                  ></div>
                </div>

                <Link href="/contact" passHref rel="noopener noreferrer">

                  <div className="w-[160px] h-[54px] transition-common bg-qpurple hover:bg-qpurplelow/10 border border-transparent hover:border-qpurple hover:text-qpurple text-white mt-10 cursor-pointer rounded-full flex justify-center items-center">
                    <span>{langCntnt && langCntnt.Contact_Us}</span>
                  </div>

                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="how-we-work-section w-full py-[60px] qpurplelow/10">
          <div className="container-x mx-auto">
            <div className="flex justify-center w-full ">
              <div className="lg:flex-row flex flex-col space-y-[30px] lg:space-y-0 lg:justify-evenly w-full items-center">
                {hww.map((item, i) => (
                  <>
                    <div className="w-[286px]">
                      <div className="flex justify-center">
                        <div className="flex flex-col items-center">
                          <div className="w-[104px] h-[104px] rounded-full bg-qpurple flex justify-center items-center mb-7">
                            <span>
                              <FontAwesomeCom
                                className="w-10 h-10 text-white"
                                icon={item.icon}
                              />
                            </span>
                          </div>
                          <h3 className="text-center text-[26px] font-bold text-qblack mb-3">
                            {item.title}
                          </h3>
                          <p className="text-[15px] text-[#797979] text-center">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="separator w-[1px] lg:block hidden h-[197px] bg-qpurplelow/10"></div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div
          className="w-full h-[527px]"
          style={{
            backgroundImage: `url(${
              process.env.NEXT_PUBLIC_BASE_URL +
              aboutData.aboutUs.video_background
            })`,
            backgroundSize: `cover`,
            backgroundRepeat: `no-repeat`,
          }}
        >
          <div className="w-full h-full bg-black bg-opacity-60 flex justify-center items-center">
            <div
              onClick={() => setPopup(!videoPopup)}
              className="flex justify-center items-center w-[140px] h-[140px] rounded-full bg-white cursor-pointer button is-play"
            >
              <span className="relative z-10 text-qpurple">
                <svg
                  width="34"
                  height="38"
                  viewBox="0 0 34 38"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.19263 0.628906C6.0417 0.925379 6.95562 1.10689 7.72971 1.53849C15.5882 5.91299 23.4345 10.3097 31.2625 14.7386C34.8452 16.7655 34.8594 21.3861 31.2828 23.413C23.4567 27.846 15.6125 32.2467 7.75605 36.6252C4.10039 38.6622 0.0779523 36.3267 0.061741 32.1478C0.0293183 23.4452 0.0394504 14.7426 0.0576882 6.04005C0.0657938 2.98657 2.26243 0.751933 5.19263 0.628906Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <div className="button-outer-circle has-scale-animation"></div>
              <div className="button-outer-circle has-scale-animation has-delay-short"></div>
            </div>
          </div>
        </div>
        {videoPopup && (
          <div className="fixed w-full left-0 top-0 h-screen flex justify-center px-2 lg:px-0 items-center z-50">
            <div
              onClick={() => setPopup(!videoPopup)}
              className="fixed w-full h-full left-0 top-0 bg-black bg-opacity-50"
            ></div>

            <div
              data-aos="fade-up"
              className="lg:w-[900px] lg:h-[500px] w-full h-[300px]  bg-white rounded relative z-50 overflow-hidden"
            >
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${aboutData.aboutUs.video_id}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
        <div className="customer-feedback w-full bg-qpurplelow/10 py-[60px]">
          <div className="title flex justify-center mb-5">
            <h1 className="text-[36px] font-bold text-qblack">
              {langCntnt && langCntnt.Customers_Feedback}
            </h1>
          </div>
          <div className="container-x mx-auto">
            <div className="feedback-slider-wrapper w-vw relative">
              <SimpleSlider selector={slider} settings={settings}>
                {aboutData.testimonials.length > 0 &&
                  aboutData.testimonials.map((item, i) => (
                    <div key={i} className="item h-[275px]">
                      <div className="w-full h-full bg-qborder sm:px-10 sm:pt-5 p-5 rounded-md relative  bg-white">
                        <div className="w-1 h-[143px] styling-border rounded-full absolute left-0 top-[57px]"></div>
                        <div className="text-[18px]  text-qgray leading-[30px] line-clamp-3 mb-4 relative z-20">
                          {item.comment}
                        </div>
                        <div className="absolute left-10 top-5 z-10 text-[#E5E5E5]">
                          <svg
                            width="38"
                            height="30"
                            viewBox="0 0 38 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-current"
                          >
                            <path d="M7.82656 11.9446C8.29019 9.03034 11.933 5.91742 14.7809 5.85119C14.9796 5.85119 15.1783 5.78496 15.3108 5.65249C15.4433 5.58626 15.5757 5.52003 15.642 5.32133C16.6355 3.46683 16.1056 2.00972 14.4498 0.817536C12.5291 -0.573341 9.48237 0.817536 7.95903 2.07595C4.11756 5.2551 0.209852 10.7523 0.408549 15.9847C-0.253774 19.4951 -0.121309 23.2703 0.872175 26.3832C1.5345 28.3702 3.45523 29.3636 5.4422 29.4961C7.42917 29.6287 11.5356 30.2247 13.3238 29.0326C15.1121 27.8403 15.2446 25.5222 15.4433 23.5353C15.642 21.3496 16.2381 17.2431 14.3836 15.5211C12.5291 13.8653 7.23047 15.6536 7.82656 11.9446Z" />
                            <path d="M29.683 11.9446C30.1466 9.03034 33.7893 5.91742 36.6374 5.85119C36.8361 5.85119 37.0348 5.78496 37.1673 5.65249C37.2998 5.58626 37.4322 5.52003 37.4985 5.32133C38.492 3.46683 37.9622 2.00972 36.3064 0.817536C34.3856 -0.573341 31.3389 0.817536 29.8155 2.07595C25.974 5.2551 22.0663 10.7524 22.265 15.9847C21.6027 19.4951 21.7351 23.2703 22.7285 26.3832C23.3908 28.3702 25.3116 29.3636 27.2987 29.4961C29.2856 29.6287 33.392 30.2247 35.1803 29.0326C36.9685 27.8403 37.101 25.5222 37.2997 23.5353C37.4984 21.3496 38.0945 17.2431 36.24 15.5211C34.3855 13.8653 29.0207 15.6536 29.683 11.9446Z" />
                          </svg>
                        </div>
                        <div className="rating flex space-x-1 items-center mb-4">
                          {Array.from(Array(parseInt(item.rating)), () => (
                            <span className="text-qyellow" key={Math.random()}>
                              <Star w="20" h="20" />
                            </span>
                          ))}
                          {parseInt(item.rating) < 5 && (
                            <>
                              {Array.from(
                                Array(5 - parseInt(item.rating)),
                                () => (
                                  <span
                                    key={parseInt(item.rating) + Math.random()}
                                    className="text-qgray"
                                  >
                                    <Star defaultValue={false} w="20" h="20" />
                                  </span>
                                )
                              )}
                            </>
                          )}
                          <div>
                            <span className="text-[13px] text-qblack">
                              ({parseInt(item.rating)})
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-[1px] bg-qpurplelow/10"></div>
                        <div className="flex items-center space-x-2.5 mt-6">
                          <div className="w-[54px] h-[54px] rounded-full border border-qpurple relative">
                            <div className="w-full h-full relative rounded-full overflow-hidden">
                              <Image
                                layout="fill"
                                src={`${
                                  process.env.NEXT_PUBLIC_BASE_URL + item.image
                                }`}
                                alt="user"
                              />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-[22px] text-qblack font-bold">
                              {item.name}
                            </h3>
                            <p className="text-qgray text-base">
                              {item.designation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </SimpleSlider>
            </div>
          </div>
        </div>

        <div className="blog-post-wrapper w-full pt-[60px] pb-[114px] bg-white">
          <div className="container-x mx-auto">
            <div className="blog-post-title flex justify-center items-cente mb-[30px]">
              <h1 className="text-3xl font-semibold text-qblack">
                {langCntnt && langCntnt.My_Latest_News}
              </h1>
            </div>

            <div className="blogs-wrapper w-full">
              <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:gap-[30px] gap-5">
                <DataIteration datas={rs} startLength={0} endLength={3}>
                  {({ datas }) => (
                    <div
                      data-aos="fade-up"
                      key={datas.id}
                      className="item w-full"
                    >
                      <BlogCard datas={datas} />
                    </div>
                  )}
                </DataIteration>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
