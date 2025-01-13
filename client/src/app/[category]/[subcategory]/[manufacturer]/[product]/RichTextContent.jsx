import React from 'react'

export const RichTextContent = ({ content }) => {
  if (!content) return null;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  // Process tables
  const tables = tempDiv.getElementsByTagName('table');
  Array.from(tables).forEach(table => {
    const rowCount = table.getElementsByTagName('tr').length;
    if (rowCount > 2) {
      table.classList.add('table-with-borders');
    } else if (rowCount === 1) {
      table.classList.add('table-single-row');
    } else {
      table.classList.add('table-no-borders');
    }
    table.outerHTML = `<div class="table-responsive">${table.outerHTML}</div>`;
  });

  // Process images
  const images = tempDiv.getElementsByTagName('img');
  Array.from(images).forEach(img => {
    img.classList.add('mix-blend-multiply');
    img.style.imageRendering = 'crisp-edges';
  });

  return (
    <div className='mt-5'>
      <div className={`
        [&>h1]:text-3xl 
        [&>h1]:font-semibold 
        [&>h1]:mb-4
        [&>h2]:text-2xl
        [&>h2]:font-semibold
        [&>h2]:mb-3
        [&>h3]:text-xl 
        [&>h3]:font-semibold 
        [&>h3]:mb-2
        [&>h4]:text-lg
        [&>h4]:font-medium
        [&>h4]:mb-2
        [&>h5]:text-base
        [&>h5]:font-medium
        [&>h5]:mb-2
        [&>h6]:text-sm
        [&>h6]:font-medium
        [&>h6]:mb-2
        [&>p]:text-[#444444] 
        [&>p]:text-sm 
        [&>p]:pt-2
        [&>p]:pb-2
        font-urbanist

        /* Image styles */
        [&>p>img]:mix-blend-multiply
        [&>img]:mix-blend-multiply
        [&_img]:mix-blend-multiply
        [&>p>img]:max-w-full
        [&>img]:max-w-full
        [&>p>img]:h-auto
        [&>img]:h-auto
        [&>p>img]:my-4
        [&>img]:my-4

        /* Table responsive styles */
        [&>.table-responsive]:w-full
        [&>.table-responsive]:overflow-x-auto
        [&>.table-responsive]:shadow-sm
        [&>.table-responsive]:rounded-lg
        [&>.table-responsive]:-mx-2
        [&>.table-responsive]:px-2

        /* Table styles */
        [&>div>table]:my-4
        [&>div>table]:w-full
        [&>div>table]:min-w-[640px]
        [&>div>table]:border-collapse
        
        /* Table with borders */
        [&>div>.table-with-borders]:border
        [&>div>.table-with-borders]:border-ind_blue
        [&>div>.table-with-borders>thead>tr>th]:border
        [&>div>.table-with-borders>thead>tr>th]:border-ind_blue
        [&>div>.table-with-borders>tbody>tr>td]:border
        [&>div>.table-with-borders>tbody>tr>td]:border-ind_blue
        
        /* Single row table */
        [&>div>.table-single-row>tbody>tr]:bg-[#F1F1F1]
        
        /* Table cell styles */
        [&>div>table>thead>tr>th]:p-3
        [&>div>table>thead>tr>th]:whitespace-nowrap
        [&>div>table>tbody>tr>td]:p-3
        
        /* Table row styles */
        [&>div>table>tbody>tr:nth-child(even)]:bg-white
        [&>div>table>tbody>tr:nth-child(odd)]:bg-[#F1F1F1]
        [&>div>table>tbody>tr]:transition-all
        [&>div>table>tbody>tr]:duration-300
        [&>div>table>tbody>tr:hover]:bg-gray-100

        /* Table header styles */
        [&>div>table>thead>tr>th]:bg-[#F8F8F8]
        [&>div>table>thead>tr>th]:text-left
        [&>div>table>thead>tr>th]:font-semibold
      `}
        dangerouslySetInnerHTML={{ __html: tempDiv.innerHTML }} 
        style={{ imageRendering: 'crisp-edges' }}
      />
    </div>
  );
};

export default RichTextContent