import React from "react";


const data = [
    {
        id: 1,
        title: "Fast & Easy Ordering Experience",
        description: "Bus Airconditioning Systems For Any Busses Bus Airconditioning Systems For Any Busses",
    },
    {
        id: 2,
        title: "Wide Collection And Availability",
        description: "Bus Airconditioning Systems For Any Busses Bus Airconditioning Systems For Any Busses "
    },
    {
        id: 3,
        title: "100% Service Guarantee",
        description: "Bus Airconditioning Systems For Any Busses Bus Airconditioning Systems For Any Busses"
    }
]
const ProvideBest = () => {
    return (
        <div className="bg-[#F6EEE3]  ">
            <div className="container mx-auto p-20">
                <h1 className="text-4xl font-urbanist text-center">
                    <span className="font-bold ">Providing</span> the best part since 2002
                </h1>
                <div className="max-w-screen-xl mx-auto p-10 flex gap-10 mt-10 ">
                    {
                        data.map((item,i) => (
                            <div className="flex flex-col  items-center justify-center" key={i}>
                                <div className="relative w-11 h-11 bg-ind_blue">
                                    <div className="bg-[#FEC500] w-3 h-3 absolute top-0 left-0 z-10"></div>
                                    <p className="font-ibmMono text-4xl absolute leading-none right-1 -bottom-0 text-white">
                                        {item.id}
                                    </p>
                                </div>
                                <h5 className="font-bold font-urbanist mt-3">
                                    {item.title}
                                </h5>
                                <p className="text-sm text-gray-500 font-urbanist font-medium  text-center mt-1">
                                    {item.description}
                                </p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default ProvideBest;
