import { Button } from "@/components/ui/button";
import { Download, } from "lucide-react";
import { useState, useEffect } from "react";
import { Summary } from "@/components/container/Dashboard/Summary";
import { FilterBar } from "@/components/business/FilterBar";
import { StudentTable } from "@/components/container/Dashboard/StudentTable";

// Định nghĩa kiểu dữ liệu cho sinh viên
interface Student {
    id: string;
    name: string;
    gender: string;
    studentId: string;
    timeIn: string;
    timeOut: string;
    room: string;
    class: string;
    department: string;
}

// Định nghĩa kiểu dữ liệu cho bộ lọc
interface Filters {
    name: string;
    studentId: string;
    class: string;
    faculty: string;
    gender: string;
}

// Định nghĩa các khóa hợp lệ của bộ lọc
type FilterKey = keyof Filters;

export default function Dashboard() {
    // Dữ liệu mẫu
    const initialData: Student[] = [
        {
            id: "001",
            name: "Nguyễn Văn A",
            gender: "Nam",
            studentId: "2254800165",
            timeIn: "08:00 AM",
            timeOut: "08:00 PM",
            room: "501",
            class: "IT01",
            department: "CNTT"
        },
        {
            id: "002",
            name: "Trần Thị B",
            gender: "Nữ",
            studentId: "2254800162",
            timeIn: "08:05 AM",
            timeOut: "08:00 PM",
            room: "501",
            class: "IT02",
            department: "CNTT"
        }
    ];

    // State cho filters
    const [filters, setFilters] = useState({
        name: "",
        studentId: "",
        class: "",
        faculty: "",
        gender: ""
    });

    // State cho dữ liệu đã lọc
    const [filteredData, setFilteredData] = useState<Student[]>(initialData);

    // Xử lý thay đổi filter
    const handleFilterChange = (field: keyof typeof filters, value: string) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: value,
        }));
    };

    // Xử lý reset filter
    const resetFilters = () => {
        setFilters({
            name: "",
            studentId: "",
            class: "",
            faculty: "",
            gender: ""
        });
    };

    // Lọc dữ liệu khi filters thay đổi
    useEffect(() => {
        const filtered = initialData.filter((item) => {
            return Object.keys(filters).every((key) => {
                const filterKey = key as FilterKey;
                const filterValue = filters[filterKey];

                // Bỏ qua lọc nếu giá trị là "all" hoặc rỗng
                if (filterValue === "all" || filterValue === "") return true;

                let fieldValue = "";

                // Xử lý từng trường hợp cụ thể
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
        <div style={{ margin: '5px' }} className="p-6">
            <h1 style={{ margin: '20px 0' }} className="text-5xl font-bold text-center text-gray-900 mb-6">Dashboard</h1>
            <Summary />
            <div style={{ marginTop: "10px" }} className="bg-white p-6 rounded-lg shadow-lg mb-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h2 style={{ margin: '20px 0' }} className="text-3xl font-bold text-gray-900">Lịch sử điểm danh</h2>
                    <Button style={{ padding: '10px', marginRight: '10px' }} variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300">
                        <Download className="w-4 h-4 mr-2" /> Xuất Excel
                    </Button>
                </div>
                <FilterBar
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    resetFilters={resetFilters}
                />

                <StudentTable filteredData={filteredData} />
            </div>
        </div>
    );
}