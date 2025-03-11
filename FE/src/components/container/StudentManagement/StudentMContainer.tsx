import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { FilterBar } from "@/components/business/FilterBar";
import { StudentTable } from "./StudentTable";
import { StudentForm } from "./StudentForm";

export interface Student {
    id: number;
    name: string;
    gender: string;
    studentId: string;
    class: string;
    department: string;
    fingerprintRegistered: boolean;
    fingerprintId: string | null;
}

interface Filters {
    name: string;
    studentId: string;
    class: string;
    faculty: string;
    gender: string;
}

type FilterKey = keyof Filters;

export default function StudentManagement() {
    const initialData: Student[] = [
        {
            id: 1,
            name: "Nguyễn Văn A",
            gender: "Nam",
            studentId: "2254800165",
            class: "IT01",
            department: "CNTT",
            fingerprintRegistered: true,
            fingerprintId: "1234567890"
        },
        {
            id: 2,
            name: "Trần Thị B",
            gender: "Nữ",
            studentId: "2254800162",
            class: "IT02",
            department: "CNTT",
            fingerprintRegistered: false,
            fingerprintId: null
        }
    ];
    const [isAdd, setIsAdd] = useState(false);
    const [students, setStudents] = useState<Student[]>(initialData);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [filteredData, setFilteredData] = useState<Student[]>(initialData);
    const [filters, setFilters] = useState({
        name: "",
        studentId: "",
        class: "",
        faculty: "",
        gender: ""
    });

    const handleSave = (student: Student) => {
        if (editingStudent) {
            setStudents(students.map(s => s.id === student.id ? student : s));
        } else {
            setStudents([...students, { ...student, id: students.length + 1 }]);
        }
        setDialogOpen(false);
        setEditingStudent(null);
        setIsAdd(false);
    };

    const handleRegisterFingerprint = (studentId: number) => {
        alert(`Gửi yêu cầu đăng ký vân tay cho sinh viên có ID: ${studentId}`);
    };

    const handleFilterChange = (field: keyof typeof filters, value: string) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [field]: value,
        }));
    };

    const resetFilters = () => {
        setFilters({
            name: "",
            studentId: "",
            class: "",
            faculty: "",
            gender: ""
        });
    };

    const handleDeleteStudent = (studentId: number) => {
        setStudents(students.filter(s => s.id !== studentId));
    };

    const handleEditStudent = (student: Student) => {
        setEditingStudent(student);
        setDialogOpen(true);
        setIsAdd(false);
    };

    const handleAddStudent = () => {
        setIsAdd(true);
        setDialogOpen(true);
    }
    useEffect(() => {
        const filtered = students.filter(item => {
            return Object.keys(filters).every(key => {
                const filterKey = key as FilterKey;
                const filterValue = filters[filterKey];

                if (filterValue === "all" || filterValue === "") return true;

                let fieldValue = "";

                if (filterKey === "name") fieldValue = item.name;
                else if (filterKey === "studentId") fieldValue = item.studentId;
                else if (filterKey === "class") fieldValue = item.class;
                else if (filterKey === "faculty") fieldValue = item.department;
                else if (filterKey === "gender") fieldValue = item.gender;

                return fieldValue.toLowerCase().includes(filterValue.toLowerCase());
            });
        });

        setFilteredData(filtered);
    }, [filters]);

    return (
        <div style={{ margin: '5px' }} className="p-6 space-y-6 bg-gray-100 min-h-screen">
            <h1 style={{ margin: '20px 0' }} className="text-5xl text-center font-bold text-gray-900">Quản lý Sinh viên</h1>
            <div style={{ marginTop: "10px" }} className="flex justify-between items-center mb-4">
                <FilterBar
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    resetFilters={resetFilters}
                />
                <Button style={{ padding: '10px', marginBottom: '20px' }} onClick={handleAddStudent} className="bg-blue-500 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Thêm sinh viên
                </Button>
            </div>

            <StudentTable
                students={filteredData}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
                onRegisterFingerprint={handleRegisterFingerprint}
            />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent >
                    <DialogHeader>
                        <DialogTitle className="text-2xl">{editingStudent ? "Chỉnh sửa" : "Thêm mới"} Sinh viên</DialogTitle>
                    </DialogHeader>
                    <StudentForm
                        student={editingStudent}
                        onSave={handleSave}
                        isAdd={isAdd}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}