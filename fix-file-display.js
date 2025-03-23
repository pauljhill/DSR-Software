document.querySelectorAll('.file-container.csv-file').forEach(container => {
  const fileNameElement = container.querySelector('.file-name');
  if (fileNameElement && fileNameElement.textContent.endsWith('.csv')) {
    const contentElement = container.querySelector('.file-content');
    if (contentElement) {
      const csvContent = contentElement.textContent;
      const rows = csvContent.trim().split('\n');
      const headerRow = rows[0].split(',');
      
      let tableHtml = '<table class="csv-table"><thead><tr>';
      headerRow.forEach(header => {
        tableHtml += `<th>${header}</th>`;
      });
      tableHtml += '</tr></thead><tbody>';
      
      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].split(',');
        tableHtml += '<tr>';
        cells.forEach(cell => {
          tableHtml += `<td>${cell}</td>`;
        });
        tableHtml += '</tr>';
      }
      
      tableHtml += '</tbody></table>';
      contentElement.innerHTML = tableHtml;
      
      // Add some basic styling
      const style = document.createElement('style');
      style.textContent = `
        .csv-table {
          border-collapse: collapse;
          width: 100%;
          font-family: Arial, sans-serif;
          font-size: 14px;
        }
        .csv-table th, .csv-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .csv-table th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        .csv-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
      `;
      document.head.appendChild(style);
    }
  }
});