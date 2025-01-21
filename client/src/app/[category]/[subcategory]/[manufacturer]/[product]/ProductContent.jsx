import { Button } from '@/components/ui/button';
import { RichTextContent } from './RichTextContent';
import { VideoSection } from './VideoSection';
import { RelatedProducts } from './RelatedProducts';
import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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
      block: 'start',

    });
  };

  return (
    <div className='w-full lg:w-3/4 bg-[#FAFAFA] px-3 sm:px-6 lg:px-8 py-5 rounded-lg'>
      {/* Buttons container with improved wrapping */}
      <div className='w-full'>
        <div className='flex flex-wrap gap-2 justify-start lg:justify-between sticky top-0 bg-[#FAFAFA] py-4 z-10'>
          {[
            { ref: specificationsRef, label: 'Specifications' },
            { ref: technicalDataRef, label: 'Technical Data' },
            { ref: videoRef, label: 'Video' },
            { ref: relatedProductsRef, label: 'Related Products' },
            { ref: inquiryRef, label: 'Inquiry' },
          ].map((item) => (
            <Button
              key={item.label}
              onClick={() => scrollToSection(item.ref)}
              className='bg-transparent border border-ind_blue text-ind_blue 
                       px-3 py-1.5 text-sm whitespace-nowrap
                       hover:bg-ind_blue hover:text-white flex-shrink-0'
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <div className='space-y-5 mt-4 overflow-hidden'>
        <div ref={specificationsRef} className="w-full overflow-hidden">
          <RichTextContent content={product?.specifications} />
        </div>

        <div ref={technicalDataRef} className="w-full overflow-hidden">
          <RichTextContent content={product?.technicalData} />
        </div>

        <div ref={videoRef}>
          <VideoSection videoLink={product?.videoLink} />
        </div>

        <div ref={relatedProductsRef} className='overflow-hidden'>
          <RelatedProducts products={relatedProducts} />
        </div>

        <div ref={inquiryRef}>
          <h2 className='text-xl sm:text-2xl font-semibold mb-4'>Inquiry</h2>
          <form>
            <div className='flex flex-col gap-4 w-full sm:max-w-xl'>
              <Input type='text' id='name' placeholder='Name' className="text-sm sm:text-base" />
              <Input type='text' id='contactNumber' placeholder='Contact Number' className="text-sm sm:text-base" />
              <Input type='email' id='email' placeholder='Email' className="text-sm sm:text-base"/>
              <Input type='text' id='companyName' placeholder='Company Name' className="text-sm sm:text-base"/>
              <Input type='text' id='country' placeholder='Country' className="text-sm sm:text-base" />
              <Textarea type='text' id='message' placeholder='Message' className='h-24 text-sm sm:text-sm' />
              <Button type='submit' className='bg-ind_blue text-white w-fit'>Send</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};