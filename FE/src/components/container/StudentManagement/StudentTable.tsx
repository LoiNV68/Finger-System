import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Fingerprint, Edit, Trash } from "lucide-react";

interface Student {
    id: number;
    name: string;
    gender: string;
    studentId: string;
    class: string;
    department: string;
    fingerprintRegistered: boolean;
    fingerprintId: string | null;
}

interface StudentTableProps {
    students: Student[];
    onEdit: (student: Student) => void;
    onDelete: (studentId: number) => void;
    onRegisterFingerprint: (studentId: number) => void;
}

export function StudentTable({
    students,
    onEdit,
    onDelete,
    onRegisterFingerprint
}: StudentTableProps) {
    return (
        <Table style={{ padding: '0 5px' }}>
            <TableHeader>
                <TableRow className="bg-gray-200">
                    <TableHead>STT</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Giới tính</TableHead>
                    <TableHead>Mã SV</TableHead>
                    <TableHead>Lớp</TableHead>
                    <TableHead>Viện</TableHead>
                    <TableHead>Vân tay</TableHead>
                    <TableHead>Hành động</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {students.map(student => (
                    <TableRow key={student.id}>
                        <TableCell>{student.id}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.gender}</TableCell>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>{student.department}</TableCell>
                        <TableCell>
                            {student.fingerprintRegistered ? (
                                <span className="text-green-500 font-semibold">✅ Đã đăng ký</span>
                            ) : (
                                <Button
                                    style={{ padding: '12px' }}
                                    size="sm"
                                    className="bg-yellow-500 text-white"
                                    onClick={() => onRegisterFingerprint(student.id)}
                                >
                                    <Fingerprint className="w-4 h-4 mr-2" /> Đăng ký
                                </Button>
                            )}
                        </TableCell>
                        <TableCell className="flex space-x-2">
                            <Button style={{ marginRight: '10px' }} size="icon" onClick={() => onEdit(student)}>
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="destructive" onClick={() => onDelete(student.id)}>
                                <Trash className="w-4 h-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}