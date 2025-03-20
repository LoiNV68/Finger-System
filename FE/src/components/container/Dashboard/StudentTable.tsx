import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Student } from "./DashboardContainer";


// Định nghĩa kiểu dữ liệu cho sinh viên


interface StudentTableProps {
    filteredData: Student[];
}

export const StudentTable = ({ filteredData }: StudentTableProps) => {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-200">
                        <TableHead>ID</TableHead>
                        <TableHead>Tên sinh viên</TableHead>
                        <TableHead>Giới tính</TableHead>
                        <TableHead>Mã sinh viên</TableHead>
                        <TableHead>Thời gian vào</TableHead>
                        <TableHead>Thời gian ra</TableHead>
                        <TableHead>Phòng học</TableHead>
                        <TableHead>Lớp</TableHead>
                        <TableHead>Viện</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredData.length > 0 ? (
                        filteredData.map((student) => (
                            <TableRow key={student.id} className="hover:bg-gray-100 transition-colors duration-300">
                                <TableCell>{student.id}</TableCell>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.gender}</TableCell>
                                <TableCell>{student.studentId}</TableCell>
                                <TableCell>{student.timeIn}</TableCell>
                                <TableCell>{student.timeOut}</TableCell>
                                <TableCell>{student.room}</TableCell>
                                <TableCell>{student.class}</TableCell>
                                <TableCell>{student.department}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center py-4">
                                Không tìm thấy dữ liệu phù hợp
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};