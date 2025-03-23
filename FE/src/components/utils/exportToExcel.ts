// utils/exportToExcel.ts
import * as XLSX from "xlsx";

// Hàm để định dạng ngày thành chuỗi YYYYMMDD
const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0, cần +1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
};

// Hàm exportToExcel nhận dữ liệu, tiêu đề cột, tên sheet và tên file
export const exportToExcel = (
    headers: string[], // Tiêu đề cột
    data: any[][], // Dữ liệu dạng mảng 2D
    sheetName: string = "Danh sách", // Tên sheet mặc định
    fileName: string = "Danh_sach" // Tên file mặc định (không bao gồm đuôi .xlsx)
) => {
    // Tạo worksheet từ dữ liệu
    const worksheetData = [headers, ...data];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Tự động điều chỉnh độ rộng cột
    const colWidths = headers.map((header, i) => {
        const maxLength = Math.max(
            header.length,
            ...data.map((row) => (row[i] ? row[i].toString().length : 0))
        );
        return { wch: maxLength + 2 }; // Thêm khoảng trống để dễ đọc
    });
    worksheet["!cols"] = colWidths;

    // Tự động điều chỉnh chiều cao hàng
    const rowHeights = worksheetData.map((row, i) => ({
        hpt: i === 0 ? 20 : 18, // Hàng tiêu đề cao hơn một chút
    }));
    worksheet["!rows"] = rowHeights;

    // Tạo workbook và thêm worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Thêm ngày tháng năm vào tên file
    const currentDate = formatDate(new Date());
    const finalFileName = `${fileName}_${currentDate}.xlsx`;

    // Xuất file Excel
    XLSX.writeFile(workbook, finalFileName);
};