import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState, useEffect } from "react";
import { Summary } from "@/components/container/dashboard/Summary";
import { FilterBar } from "@/components/business/FilterBar";
import { StudentTable } from "@/components/container/dashboard/StudentTable";
import { exportToExcel } from "@/components/utils/exportToExcel";

const API_ATTENDANCE = process.env.API_ATTENDANCE || "http://localhost:5000/api/attendance";
const API_STUDENT = process.env.API_STUDENT || "http://localhost:5000/api/students";

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
    const [isLoading, setIsLoading] = useState(true);
    const [classOptions, setClassOptions] = useState<string[]>([]); // Lớp
    const [facultyOptions, setFacultyOptions] = useState<string[]>([]); // Viện
    const [genderOptions, setGenderOptions] = useState<string[]>([]); // Giới tính

    const fetchAttendanceData = async () => {
        try {
            const response = await fetch(API_ATTENDANCE);
            if (!response.ok) throw new Error("Lỗi khi gọi API");
            const data = await response.json();

            const mappedData: Student[] = data.map((record: any) => ({
                id: record._id || "N/A",
                name: record.student?.name || "Không xác định",
                gender: record.student?.gender || "N/A",
                studentId: record.student?.studentId || "N/A",
                timeIn: record.checkInTime ? new Date(record.checkInTime).toLocaleString() : "N/A",
                timeOut: record.checkOutTime ? new Date(record.checkOutTime).toLocaleString() : "",
                room: record.room?.name || "N/A",
                class: record.student?.class || "N/A",
                department: record.student?.department || "N/A",
            }));
            setStudents(mappedData);
            setFilteredData(mappedData);

            // Lấy danh sách giá trị duy nhất
            const uniqueClasses = [...new Set(mappedData.map((s) => s.class).filter(Boolean))];
            const uniqueFaculties = [...new Set(mappedData.map((s) => s.department).filter(Boolean))];
            const uniqueGenders = [...new Set(mappedData.map((s) => s.gender).filter(Boolean))];
            setClassOptions(uniqueClasses);
            setFacultyOptions(uniqueFaculties);
            setGenderOptions(uniqueGenders);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu điểm danh:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFingerprintData = async () => {
        try {
            const response = await fetch(`${API_STUDENT}/list`);
            const data = await response.json();
            setRegisteredStudents(data.data || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách vân tay:", error);
        }
    };

    useEffect(() => {
        fetchAttendanceData();
        fetchFingerprintData();

        const interval = setInterval(() => {
            fetchAttendanceData();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

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

    const handleExportToExcel = () => {
        const headers = [
            "STT",
            "Tên sinh viên",
            "Giới tính",
            "Mã sinh viên",
            "Thời gian vào",
            "Thời gian ra",
            "Phòng học",
            "Lớp",
            "Viện",
        ];

        const data = filteredData.map((student, index) => [
            index + 1,
            student.name,
            student.gender,
            student.studentId,
            student.timeIn,
            student.timeOut || "N/A",
            student.room,
            student.class,
            student.department,
        ]);

        exportToExcel(headers, data, "Danh sách điểm danh", "Danh_sach_diem_danh");
    };

    return (
        <div style={{ margin: "5px" }} className="p-6">
            <h1 style={{ margin: "20px 0" }} className="text-5xl font-bold text-center text-gray-900 mb-6">
                Thống kê và báo cáo
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
                        onClick={handleExportToExcel}
                    >
                        <Download className="w-4 h-4 mr-2" /> Xuất Excel
                    </Button>
                </div>
                <FilterBar
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    resetFilters={resetFilters}
                    classOptions={classOptions}
                    facultyOptions={facultyOptions}
                    genderOptions={genderOptions}
                />
                {isLoading ? (
                    <div className="text-center py-4">Đang tải dữ liệu...</div>
                ) : (
                    <StudentTable filteredData={filteredData} />
                )}
            </div>
        </div>
    );
}