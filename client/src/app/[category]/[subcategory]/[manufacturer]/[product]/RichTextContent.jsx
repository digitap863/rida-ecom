// 'use client'
// import React from 'react'
// import DOMPurify from 'isomorphic-dompurify'

// export const RichTextContent = ({ content }) => {
//   if (!content) return null;

//   const tempDiv = document.createElement('div');
//   tempDiv.innerHTML = content;

//   // Process tables
//   const tables = tempDiv.getElementsByTagName('table');
//   Array.from(tables).forEach(table => {
//     const rowCount = table.getElementsByTagName('tr').length;
//     if (rowCount > 2) {
//       table.classList.add('table-with-borders');
//     } else if (rowCount === 1) {
//       table.classList.add('table-single-row');
//     } else {
//       table.classList.add('table-no-borders');
//     }
//     // Double wrap table for better scrolling
//     table.outerHTML = `
//       <div class="overflow-x-auto relative w-full">
//         <div class="inline-block min-w-full align-middle">
//           ${table.outerHTML}
//         </div>
//       </div>`;
//   });

//   // Process images
//   const images = tempDiv.getElementsByTagName('img');
//   Array.from(images).forEach(img => {
//     img.classList.add('mix-blend-multiply');
//     img.style.imageRendering = 'crisp-edges';
//   });

//   return (
//     <div className="w-full overflow-hidden">
//       <div className={`
//         prose prose-sm sm:prose-base max-w-none font-urbanist

//         [&>div>h1]:text-xl  [&>div>h1]:sm:text-3xl [&>div>h1]:my-2 [&>div>h1]:font-semibold
//         [&>div>h2]:sm:text-2xl [&>div>h2]:my-2 [&>div>h2]:font-semibold
//         [&>div>h3]:sm:text-xl [&>div>h3]:my-3 [&>div>h3]:font-semibold
//         [&>div>p]:text-gray-600 [&>div>p]:text-sm


//         /* Base content styles */
//         prose-headings:font-urbanist
//         prose-p:font-urbanist
//         prose-li:font-urbanist

//         [&>div>div>table]:botder-2
//         /* Paragraph styles */
//         prose-p:text-base prose-p:leading-relaxed prose-p:text-gray-600 prose-p:mb-4

//         /* List styles */
//         prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
//         prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
//         prose-li:text-gray-600 prose-li:mb-2



//         /* Image styles */
//         prose-img:max-w-full prose-img:h-auto prose-img:rounded-lg prose-img:my-4 prose-img:shadow-md
//       `}>
//         <div 
//           className="w-full"
//           dangerouslySetInnerHTML={{ 
//             __html: DOMPurify.sanitize(tempDiv.innerHTML) 
//           }} 
//         />
//       </div>
//     </div>
//   );
// };

// export default RichTextContent;
'use client'
import React from 'react'
import DOMPurify from 'isomorphic-dompurify'


export const RichTextContent = ({ content }) => {
  if (!content) return null;

  return (
    <div className="rich-text-container overflow-x-auto">
      <div
        className="rich-text-content
            [&>h1]:text-xl  [&>h1]:sm:text-3xl [&>>h1]:my-2 [&>h1]:font-semibold
       [&>h2]:sm:text-2xl [&>h2]:my-2 [&>h2]:font-semibold
         [&>h3]:sm:text-xl [&>h3]:my-3 [&>h3]:font-semibold
         [&>p]:text-gray-600 [&>p]:text-sm font-urbanist
        
        "
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(content),
        }}
      />
    </div>
  );
};

export default RichTextContent;


