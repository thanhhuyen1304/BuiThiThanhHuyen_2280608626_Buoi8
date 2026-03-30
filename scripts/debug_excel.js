const ExcelJS = require('exceljs');
const path = require('path');

async function debugExcel() {
    try {
        const workbook = new ExcelJS.Workbook();
        const filePath = path.join(__dirname, '../user.xlsx');
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);

        worksheet.eachRow((row, i) => {
            console.log(`Row ${i}:`, JSON.stringify(row.values));
        });
    } catch (error) {
        console.error("Error reading Excel:", error.message);
    }
}

debugExcel();
