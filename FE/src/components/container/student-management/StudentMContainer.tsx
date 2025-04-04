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

export interface Room {
    _id: string;
    name: string;
    floor: number;
    deviceId: string;
    deviceName: string;
    status: string;
}

export interface Student {
    _id?: string;
    studentId: string;
    name: string;
    gender: string;
    class: string;
    department: string;
    deviceId?: string;
    hasFingerprint?: boolean;
    roomName?: string;
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
const FINGERPRINT_API_URL = process.env.API_FINGERPRINT || "http://localhost:5000/api/fingerprint";
const ROOM_API_URL = process.env.API_ROOM || "http://localhost:5000/api/rooms";

export default function StudentManagement() {
    const [isAdd, setIsAdd] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [filteredData, setFilteredData] = useState<Student[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [classOptions, setClassOptions] = useState<string[]>([]);
    const [facultyOptions, setFacultyOptions] = useState<string[]>([]);
    const [genderOptions, setGenderOptions] = useState<string[]>([]);
    const [filters, setFilters] = useState<Filters>({
        name: "",
        studentId: "",
        class: "",
        faculty: "",
        gender: "",
    });

    const fetchStudents = async () => {
        try {
            const response = await axios.get<Student[]>(API_URL); // Chỉ định kiểu Student[]
            console.log("Dữ liệu sinh viên từ API:", response.data);
            setStudents(response.data);
            setFilteredData(response.data);

            // Lấy danh sách giá trị duy nhất và ép kiểu
            const uniqueClasses = [...new Set(response.data.map((s) => s.class).filter(Boolean))] as string[];
            const uniqueFaculties = [...new Set(response.data.map((s) => s.department).filter(Boolean))] as string[];
            const uniqueGenders = [...new Set(response.data.map((s) => s.gender).filter(Boolean))] as string[];
            setClassOptions(uniqueClasses);
            setFacultyOptions(uniqueFaculties);
            setGenderOptions(uniqueGenders);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sinh viên:", error);
        }
    };

    const fetchRooms = async () => {
        try {
            const response = await axios.get(ROOM_API_URL);
            console.log("Danh sách phòng từ API:", response.data);
            setRooms(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phòng:", error);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchRooms();

        const interval = setInterval(() => {
            fetchStudents();
        }, 5000);

        return () => clearInterval(interval);
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
            fetchStudents();
        } catch (error: any) {
            console.error("Lỗi khi lưu sinh viên:", error);
            alert(error.response?.data?.error || "Có lỗi xảy ra khi lưu sinh viên!");
        }
    };

    const handleDeleteStudent = async (student: Student) => {
        try {
            if (!student._id) throw new Error("Không tìm thấy _id của sinh viên");

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

    const handleRegisterFingerprint = async (student: Student) => {
        try {
            if (!student.deviceId) {
                alert("Sinh viên chưa được gán phòng học/thiết bị!");
                return;
            }
            const response = await axios.post(`${FINGERPRINT_API_URL}/request-register`, {
                studentId: student.studentId,
                deviceId: student.deviceId,
            });
            if (response.data.message === "Yêu cầu đăng ký đã được gửi") {
                alert(`Yêu cầu đăng ký vân tay cho ${student.studentId} đã được gửi! Vui lòng quét vân tay trên thiết bị ${student.deviceId}.`);
            }
        } catch (error) {
            alert("Lỗi: " + (error || "Không thể gửi yêu cầu đăng ký!"));
        }
    };

    const handleFilterChange = (field: FilterKey, value: string) => {
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
        setFilteredData(students);
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
                    classOptions={classOptions}
                    facultyOptions={facultyOptions}
                    genderOptions={genderOptions}
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
                    <StudentForm
                        student={editingStudent}
                        onSave={handleSave}
                        isAdd={isAdd}
                        rooms={rooms}
                        students={students}
                        onCancel={() => setDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}