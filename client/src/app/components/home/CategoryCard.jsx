import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query';
import { getdata } from '@/api/req';
import { useRouter } from 'next/navigation';

const CategoryCard = ({ item }) => {
    const router = useRouter()
    const { data: subcategoriesData } = useQuery({
        queryKey: ["subcategories"],
        queryFn: () => getdata("/subcategories"),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
    });

    const handleNavigate = (id) => {
        const sub = subcategoriesData?.data?.filter((sub) => sub.category._id === id)[0]
        router.push(`/${item.category}/${sub.subcategory}`)
    }

    return (
        <div
            className="w-64 sm:w-72 max-w-sm md:w-80 aspect-[1/1.2] bg-[#348A89]/30 mx-auto rounded-2xl relative overflow-hidden shadow-lg 
            group cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
            onClick={() => handleNavigate(item._id)}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
            <Image
                src={item?.image}
                alt={item?.name || "Category Image"}
                className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                quality={100}
                width={100}
                height={100}
            />
            <div className="absolute bottom-5 left-5 z-20 opacity-100 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white font-medium text-base md:text-lg lg:text-xl max-w-48">{item.name}</h3>
            </div>
            <button
                className="text-white absolute bottom-5 right-5 rounded-full z-20 shadow-lg
                transform transition-all duration-300 hover:bg-teal hover:text-white
                group-hover:scale-110"
            >
                <ArrowRight size={20} />
            </button>
        </div>
    )
}

export default CategoryCard