import React from "react";
import FontAwesomeCom from "../Helpers/icons/FontAwesomeCom";

function Services({ services = [] }) {
  return (
    <div className="w-full">
      <div className="container-x mx-auto">
        <div className="best-services rounded w-full bg-qpurple flex flex-col space-y-10 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center lg:h-[110px] h-full px-10 lg:py-0 py-10">
          {services.map((service, i) => (
            <div key={i}>
              <div key={service.id} className="item">
                <div className="flex space-x-5 items-center">
                  <div>
                    <span className="w-10 h-10 text-white">
                      <FontAwesomeCom className="w-8 h-8" icon={service.icon} />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white text-[15px] font-700 tracking-wide mb-1">
                      {service.title}
                    </h3>
                    <p className="text-sm text-white line-clamp-1">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="service-sparator w-[1px] h-[64px] bg-[#BE49AE]"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Services;
