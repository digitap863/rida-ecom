import React from 'react'

export const RichTextContent = ({ content }) => {
  if (!content) return null;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
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
  });

  return (
    <div className='mt-5'>
      <div className='[&>h1]:text-3xl 
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
                    [&>table]:my-4
                    [&>table]:w-full
                    [&>table]:border-collapse
                    [&>.table-with-borders]:border
                    [&>.table-with-borders]:border-ind_blue
                    [&>.table-with-borders>thead>tr>th]:border
                    [&>.table-with-borders>thead>tr>th]:border-ind_blue
                    [&>.table-with-borders>tbody>tr>td]:border
                    [&>.table-with-borders>tbody>tr>td]:border-ind_blue
                    [&>.table-single-row>tbody>tr]:bg-[#F1F1F1]
                    [&>table>thead>tr>th]:p-3
                    [&>table>tbody>tr>td]:p-3
                    [&>table>tbody>tr:nth-child(even)]:bg-white
                    [&>table>tbody>tr:nth-child(odd)]:bg-[#F1F1F1]
                    [&>table>tbody>tr:hover]:bg-gray-100
                    [&>table>tbody>tr]:transition-all
                    [&>table>tbody>tr]:duration-300'
        dangerouslySetInnerHTML={{ __html: tempDiv.innerHTML }} />
    </div>
  );
};

export default RichTextContent