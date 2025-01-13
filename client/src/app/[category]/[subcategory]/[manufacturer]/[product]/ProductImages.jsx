import Image from 'next/image';

export const ProductImages = ({ images, selectedImage, setSelectedImage }) => {
  // Only render the image section if we have valid image data
  const renderMainImage = () => {
    if (!selectedImage) return null;

    return (
      <Image
        src={selectedImage}
        alt="Product Image"
        className="mx-auto object-contain aspect-square"
        width={400}
        height={400}
        priority={true}
      />
    );
  };

  // Only render thumbnail if the image source is valid
  const renderThumbnail = (image, index) => {
    if (!image) return null;

    return (
      <div
        key={index}
        className={`border rounded-lg p-2 w-24 h-24 cursor-pointer transition-all
          ${selectedImage === image ? 'border-blue-500 border-2' : 'border-gray-200'}
        `}
        onClick={() => setSelectedImage(image)}
      >
        <Image
          src={image}
          alt={`Product view ${index + 1}`}
          className="w-full h-full object-cover"
          width={96}
          height={96}
          priority={true}
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg p-4">
        {renderMainImage()}
      </div>
      <div className="flex gap-4">
        {images?.map((image, index) =>
          image ? renderThumbnail(image, index) : null
        )}
      </div>
    </div>
  );
};