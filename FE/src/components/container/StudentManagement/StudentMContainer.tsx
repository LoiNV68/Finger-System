import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { FilterBar } from "@/components/business/FilterBar";
import { StudentTable } from "./StudentTable";
import { StudentForm } from "./StudentForm";
import axios from "axios";

export interface Student {
    _id?: string;
    studentId: string;
    name: string;
    gender: string;
    class: string;
    department: string;
    fingerprintTemplate?: string | null;
}

interface Filters {
    name: string;
    studentId: string;
    class: string;
    faculty: string;
    gender: string;
}

type FilterKey = keyof Filters;
const API_URL = process.env.API_STUDENT || "http://localhost:5000/api/students";
const FINGERPRINT_API_URL = process.env.API_STUDENT || "http://localhost:5000/api/fingerprint";

export default function StudentManagement() {
    const [isAdd, setIsAdd] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [filteredData, setFilteredData] = useState<Student[]>([]);
    const [filters, setFilters] = useState<Filters>({
        name: "",
        studentId: "",
        class: "",
        faculty: "",
        gender: "",
    });
    const [registeredStudents, setRegisteredStudents] = useState<any[]>([]);
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(API_URL);
                console.log(response.data);
                setStudents(response.data);
                setFilteredData(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sinh viên:", error);
            }
        };
        fetchStudents();
    }, []);

    useEffect(() => {
        const filtered = students.filter((item) => {
            return Object.keys(filters).every((key) => {
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
    }, [filters, students]);

    const handleSave = async (student: Student) => {
        try {
            if (editingStudent) {
                const response = await axios.put(`${API_URL}/update/${editingStudent._id}`, student);
                setStudents(students.map((s) => (s._id === editingStudent._id ? response.data : s)));
            } else {
                const response = await axios.post(`${API_URL}/create`, student);
                setStudents([...students, response.data]);
            }
            setDialogOpen(false);
            setEditingStudent(null);
            setIsAdd(false);
        } catch (error) {
            console.error("Lỗi khi lưu sinh viên:", error);
            alert("Có lỗi xảy ra khi lưu sinh viên!");
        }
    };

    const handleDeleteStudent = async (student: Student) => {
        try {
            if (!student._id) throw new Error("Không tìm thấy _id của sinh viên");
            const isConfirmed = confirm("Bạn có chắc muốn xóa sinh viên này?");
            if (!isConfirmed) return;
            await axios.delete(`${API_URL}/delete/${student._id}`);
            setStudents(students.filter((s) => s._id !== student._id));
        } catch (error) {
            console.error("Lỗi khi xóa sinh viên:", error);
            alert("Có lỗi xảy ra khi xóa sinh viên!");
        }
    };

    const handleEditStudent = (student: Student) => {
        setEditingStudent(student);
        setDialogOpen(true);
        setIsAdd(false);
    };

    const handleAddStudent = () => {
        setIsAdd(true);
        setDialogOpen(true);
        setEditingStudent(null);
    };
    const fetchFingerprintData = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/student/list");
            const data = await response.json();
            setRegisteredStudents(data.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách vân tay:", error);
        }
    };
    const handleRegisterFingerprint = async (student: Student) => {
        try {
            const response = await axios.post(`${FINGERPRINT_API_URL}/request-register`, {
                studentId: student.studentId,
            });
            alert(
                `Yêu cầu đăng ký vân tay cho sinh viên ${student.studentId} đã được gửi! Vui lòng quét vân tay trên ESP32.`
            );
            console.log(response.data);
            fetchFingerprintData();
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu đăng ký vân tay:", error);
            alert("Có lỗi xảy ra khi gửi yêu cầu đăng ký vân tay!");
        }
    };

    

    const handleFilterChange = (field: keyof Filters, value: string) => {
        setFilters((prevFilters) => ({
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
            gender: "",
        });
    };

    return (
        <div style={{ margin: "5px" }} className="p-6 space-y-6 bg-gray-100 min-h-screen">
            <h1 style={{ margin: "20px 0" }} className="text-5xl text-center font-bold text-gray-900">
                Quản lý Sinh viên
            </h1>
            <div style={{ marginTop: "10px" }} className="flex justify-between items-center mb-4">
                <FilterBar
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    resetFilters={resetFilters}
                />
                <Button
                    style={{ padding: "10px", marginBottom: "20px" }}
                    onClick={handleAddStudent}
                    className="bg-blue-500 text-white"
                >
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            {editingStudent ? "Chỉnh sửa" : "Thêm mới"} Sinh viên
                        </DialogTitle>
                        <DialogDescription>
                            {editingStudent
                                ? "Chỉnh sửa thông tin sinh viên hiện có."
                                : "Thêm thông tin sinh viên mới."}
                        </DialogDescription>
                    </DialogHeader>
                    <StudentForm student={editingStudent} onSave={handleSave} isAdd={isAdd} />
                </DialogContent>
            </Dialog>
        </div>
    );
}