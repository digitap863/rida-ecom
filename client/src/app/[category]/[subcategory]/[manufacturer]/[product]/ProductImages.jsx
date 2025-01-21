import Image from 'next/image';

export const ProductImages = ({ images, selectedImage, setSelectedImage }) => {
  return (
    <div className="space-y-4 px-4 sm:px-0">
      <div className="rounded-lg p-2 sm:p-4 bg-white">
        {selectedImage && (
          <Image
            src={selectedImage}
            alt="Product Image"
            className="mx-auto object-contain w-full h-[200px] sm:h-[300px] lg:h-[400px]"
            width={400}
            height={400}
            priority={true}
          />
        )}
      </div>
      
      <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {images?.map((image, index) => (
          image ? (
            <div
              key={index}
              className={`flex-shrink-0 border rounded-lg p-1 sm:p-2 w-16 h-16 sm:w-24 sm:h-24 cursor-pointer transition-all
                ${selectedImage === image ? 'border-blue-500 border-2' : 'border-gray-200'}`}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`Product view ${index + 1}`}
                className="w-full h-full object-contain"
                width={96}
                height={96}
                priority={true}
              />
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
};