import React from 'react'

const Navbutton = ({prev, next}) => {
    return (
        <div className="flex justify-center gap-4 mt-8">
            <button className={`${prev}  w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-ind_blue flex items-center justify-center group hover:bg-ind_blue transition-colors duration-300 ${prev ? 'block' : 'hidden'}`}>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    className="stroke-ind_blue group-hover:stroke-white transition-colors duration-300"
                >
                    <path
                        d="M15 19l-7-7 7-7"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            <button className={`${next}  w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-ind_blue flex items-center justify-center group hover:bg-ind_blue transition-colors duration-300 ${next ? 'block' : 'hidden'}`}>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    className="stroke-ind_blue group-hover:stroke-white transition-colors duration-300"
                >
                    <path
                        d="M9 5l7 7-7 7"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </div>
    )
}

export default Navbutton