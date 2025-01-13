import { Button } from '@/components/ui/button';
import { RichTextContent } from './RichTextContent';
import { VideoSection } from './VideoSection';
import { RelatedProducts } from './RelatedProducts';
import { useRef } from 'react';

export const ProductContent = ({ product, relatedProducts }) => {
  // Create refs for each section
  const specificationsRef = useRef(null);
  const technicalDataRef = useRef(null);
  const videoRef = useRef(null);
  const relatedProductsRef = useRef(null);
  const inquiryRef = useRef(null);

  // Scroll to section function
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className='w-3/4 bg-[#FAFAFA] px-8 py-5 rounded-lg'>
      <div className='flex gap-4 justify-between sticky top-0 bg-[#FAFAFA] py-4 z-10'>
        <Button 
          onClick={() => scrollToSection(specificationsRef)}
          className='bg-transparent border border-ind_blue text-ind_blue min-w-[150px] hover:bg-ind_blue hover:text-white'
        >
          Specifications
        </Button>
        <Button 
          onClick={() => scrollToSection(technicalDataRef)}
          className='bg-transparent border border-ind_blue text-ind_blue min-w-[150px] hover:bg-ind_blue hover:text-white'
        >
          Technical Data
        </Button>
        <Button 
          onClick={() => scrollToSection(videoRef)}
          className='bg-transparent border border-ind_blue text-ind_blue min-w-[150px] hover:bg-ind_blue hover:text-white'
        >
          Video
        </Button>
        <Button 
          onClick={() => scrollToSection(relatedProductsRef)}
          className='bg-transparent border border-ind_blue text-ind_blue min-w-[150px] hover:bg-ind_blue hover:text-white'
        >
          Related Products
        </Button>
        <Button 
          onClick={() => scrollToSection(inquiryRef)}
          className='bg-transparent border border-ind_blue text-ind_blue min-w-[150px] hover:bg-ind_blue hover:text-white'
        >
          Inquiry
        </Button>
      </div>
      
      <div className='space-y-5'> 
        <div ref={specificationsRef}>
          <RichTextContent content={product?.specifications} />
        </div>

        <div ref={technicalDataRef}>
          <RichTextContent content={product?.technicalData} />
        </div>

        <div ref={videoRef}>
          <VideoSection videoLink={product?.videoLink} />
        </div>

        <div ref={relatedProductsRef}>
          <RelatedProducts products={relatedProducts} />
        </div>

        <div ref={inquiryRef}>
          <h2 className='text-2xl font-semibold mb-4'>Inquiry</h2>
          {/* Add your inquiry form or content here */}
        </div>
      </div>
    </div>
  );
};