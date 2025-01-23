'use client'
import React from 'react'
import DOMPurify from 'isomorphic-dompurify'

export const RichTextContent = ({ content }) => {
  if (!content) return null;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  // Process tables
  const tables = tempDiv.getElementsByTagName('table');
  Array.from(tables).forEach(table => {
    const rows = table.getElementsByTagName('tr');
    const cols = rows[0]?.getElementsByTagName('td')?.length || 0;
    
    // Check if it's a single row with two columns
    if (rows.length === 1 && cols === 2) {
      const cells = rows[0].getElementsByTagName('td');
      const leftContent = cells[0].innerHTML;
      const rightContent = cells[1].innerHTML;
      
      // Replace table with a flex container
      table.outerHTML = `
        <div class="flex flex-col md:flex-row md:gap-8 gap-4 my-4">
          <div class="flex-1 text-sm font-urbanist">${leftContent}</div>
          <div class="flex-1 text-sm font-urbanist">${rightContent}</div>
        </div>
      `;
    } else {
      // For other tables, keep the horizontal scroll
      table.outerHTML = `<div class="overflow-x-auto">${table.outerHTML}</div>`;
    }
  });

  // Process images
  const images = tempDiv.getElementsByTagName('img');
  Array.from(images).forEach(img => {
    img.classList.add('mix-blend-multiply');
    img.style.imageRendering = 'crisp-edges';
  });

  return (
    <div className="rich-text-container">
      <div
        className="rich-text-content
            [&>h1]:text-xl  [&>h1]:sm:text-3xl [&>>h1]:my-2 [&>h1]:font-semibold
            [&>h2]:sm:text-2xl [&>h2]:my-2 [&>h2]:font-semibold
            [&>h3]:sm:text-xl [&>h3]:my-3 [&>h3]:font-semibold
            [&>p]:text-gray-600 [&>p]:text-sm font-urbanist"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(tempDiv.innerHTML)
        }}
      />
    </div>
  );
};

export default RichTextContent;
