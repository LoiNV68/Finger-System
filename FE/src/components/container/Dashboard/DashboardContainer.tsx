import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState, useEffect } from "react";
import { Summary } from "@/components/container/Dashboard/Summary";
import { FilterBar } from "@/components/business/FilterBar";
import { StudentTable } from "@/components/container/Dashboard/StudentTable";

const API_ATTENDANCE = "http://localhost:5000/api/attendance";

export interface Student {
    id: string;
    name: string;
    gender: string;
    studentId: string;
    timeIn: string;
    timeOut: string | null;
    room: string;
    class: string;
    department: string;
}

interface Filters {
    name: string;
    studentId: string;
    class: string;
    faculty: string;
    gender: string;
}

type FilterKey = keyof Filters;
const API = process.env.API_ATTENDANCE || "http://localhost:5000/api/rooms";
export default function Dashboard() {
    const [filters, setFilters] = useState<Filters>({
        name: "",
        studentId: "",
        class: "",
        faculty: "",
        gender: "",
    });
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredData, setFilteredData] = useState<Student[]>([]);
    const [registeredStudents, setRegisteredStudents] = useState<any[]>([]);

    useEffect(() => {
        fetchAttendanceData();
        fetchFingerprintData();
    }, []);

    const fetchAttendanceData = async () => {
        try {
            const response = await fetch(API_ATTENDANCE);
            const data = await response.json();
            const mappedData: Student[] = data.map((record: any) => ({
                id: record._id,
                name: record.student.name,
                gender: record.student.gender,
                studentId: record.student.studentId,
                timeIn: new Date(record.checkInTime).toLocaleString(),
                timeOut: record.checkOutTime ? new Date(record.checkOutTime).toLocaleString() : "",
                room: record.room.name,
                class: record.student.class,
                department: record.student.department,
            }));
            setStudents(mappedData);
            setFilteredData(mappedData);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu điểm danh:", error);
        }
    };

    const fetchFingerprintData = async () => {
        try {
            const response = await fetch(`${API}`);
            const data = await response.json();
            setRegisteredStudents(data.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách vân tay:", error);
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

    return (
        <div style={{ margin: "5px" }} className="p-6">
            <h1 style={{ margin: "20px 0" }} className="text-5xl font-bold text-center text-gray-900 mb-6">
                Dashboard
            </h1>
            <Summary />
            <div
                style={{ marginTop: "10px" }}
                className="bg-white p-6 rounded-lg shadow-lg mb-6 hover:shadow-xl transition-shadow duration-300"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 style={{ margin: "20px 0" }} className="text-3xl font-bold text-gray-900">
                        Lịch sử điểm danh
                    </h2>
                    <Button
                        style={{ padding: "10px", marginRight: "10px" }}
                        variant="outline"
                        className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300"
                    >
                        <Download className="w-4 h-4 mr-2" /> Xuất Excel
                    </Button>
                </div>
                <FilterBar filters={filters} handleFilterChange={handleFilterChange} resetFilters={resetFilters} />
                <StudentTable filteredData={filteredData} />
            </div>
        </div>
    );
}