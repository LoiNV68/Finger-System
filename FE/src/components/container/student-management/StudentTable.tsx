import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Fingerprint, Edit, Trash } from "lucide-react";
import { Student } from "./StudentMContainer";
import axios from "axios";

interface StudentTableProps {
    students: Student[];
    onEdit: (student: Student) => void;
    onDelete: (student: Student) => void;
    onRegisterFingerprint: (student: Student) => void;
}

const FINGERPRINT_API_URL = process.env.API_FINGERPRINT || "http://localhost:5000/api/fingerprint";

export function StudentTable({ students, onEdit, onDelete, onRegisterFingerprint }: StudentTableProps) {
    const handleDeleteWithFingerprint = async (student: Student) => {
        try {
            const isConfirmed = confirm("Bạn có chắc muốn xóa sinh viên này?");
            if (!isConfirmed) return;

            if (student.hasFingerprint && student.deviceId) {
                await axios.post(`${FINGERPRINT_API_URL}/delete-fingerprint`, {
                    studentId: student.studentId,
                    deviceId: student.deviceId,
                });
            }
            await onDelete(student); // Gọi hàm xóa sinh viên
        } catch (error) {
            console.error("Lỗi khi xóa sinh viên và vân tay:", error);
            alert("Có lỗi xảy ra khi xóa!");
        }
    };

    return (
        <Table style={{ padding: "0 5px" }}>
            <TableHeader>
                <TableRow className="bg-gray-200">
                    <TableHead>STT</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Giới tính</TableHead>
                    <TableHead>Mã SV</TableHead>
                    <TableHead>Lớp</TableHead>
                    <TableHead>Viện</TableHead>
                    <TableHead>Phòng học</TableHead>
                    <TableHead>Thiết bị</TableHead>
                    <TableHead>Vân tay</TableHead>
                    <TableHead>Hành động</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {students.map((student, index) => (
                    <TableRow key={student._id || student.studentId || index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{student.name || "N/A"}</TableCell>
                        <TableCell>{student.gender || "N/A"}</TableCell>
                        <TableCell>{student.studentId || "N/A"}</TableCell>
                        <TableCell>{student.class || "N/A"}</TableCell>
                        <TableCell>{student.department || "N/A"}</TableCell>
                        <TableCell>{student.roomName || "Chưa gán"}</TableCell>
                        <TableCell>{student.deviceId || "Chưa gán"}</TableCell>
                        <TableCell>
                            {student.hasFingerprint ? (
                                <span className="text-green-500 font-semibold">✅ Đã đăng ký</span>
                            ) : (
                                <Button
                                    style={{ padding: "12px" }}
                                    size="sm"
                                    className="bg-yellow-500 text-white"
                                    onClick={() => onRegisterFingerprint(student)}
                                    disabled={!student.deviceId}
                                >
                                    <Fingerprint className="w-4 h-4 mr-2" /> Đăng ký
                                </Button>
                            )}
                        </TableCell>
                        <TableCell className="flex space-x-2">
                            <Button style={{ marginRight: "10px" }} size="icon" onClick={() => onEdit(student)}>
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => handleDeleteWithFingerprint(student)}
                            >
                                <Trash className="w-4 h-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}