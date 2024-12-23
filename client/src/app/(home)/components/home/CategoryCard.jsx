import { ArrowRight } from 'lucide-react'
import category_1 from '@/assets/home/category_1.png'
import Image from 'next/image'

const CategoryCard = ({item}) => {
    return (

        <div
            className="w-80 aspect-[1/1.2] bg-[#348A89]/30 mxauto rounded-2xl relative overflow-hidden shadow-lg 
      group cursor-pointer transition-transform duration-300 hover:scale-[1.02]"

        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
            <Image
                src={item?.image}
                alt=""
                className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                quality={100}
            />
            <div className="absolute bottom-5 left-5 z-20 opacity-100 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white font-medium  max-w-48">{item.name}</h3>
            </div>
            <button
                className=" text-white absolute bottom-5 right-5  rounded-full z-20 shadow-lg
        transform transition-all duration-300 hover:bg-teal hover:text-white
        group-hover:scale-110"
            >
                <ArrowRight size={20} />
            </button>
        </div>

    )
}

export default CategoryCard