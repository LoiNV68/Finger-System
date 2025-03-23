import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, XCircle } from "lucide-react";
import axios from "axios";

const API_STUDENT = process.env.API_STUDENT || "http://localhost:5000/api/students";
const API_ATTENDANCE = process.env.API_ATTENDANCE || "http://localhost:5000/api/attendance";

export const Summary = () => {
    const [totalStudents, setTotalStudents] = useState(0);
    const [attendedToday, setAttendedToday] = useState(0);
    const [notAttendedToday, setNotAttendedToday] = useState(0);

    const fetchSummaryData = async () => {
        try {
            // Lấy tổng số sinh viên
            const studentResponse = await axios.get(API_STUDENT);
            const total = studentResponse.data.length;
            setTotalStudents(total);

            // Lấy danh sách điểm danh
            const attendanceResponse = await axios.get(API_ATTENDANCE);
            const attendanceData = attendanceResponse.data;

            // Xác định ngày hiện tại
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Đặt về 0h để so sánh cả ngày
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            // Đếm số sinh viên đã điểm danh hôm nay
            const attended = new Set<string>(); // Dùng Set để tránh đếm trùng studentId
            attendanceData.forEach((record: any) => {
                const checkInTime = record.checkInTime ? new Date(record.checkInTime) : null;
                const checkOutTime = record.checkOutTime ? new Date(record.checkOutTime) : null;
                if (
                    (checkInTime && checkInTime >= today && checkInTime < tomorrow) ||
                    (checkOutTime && checkOutTime >= today && checkOutTime < tomorrow)
                ) {
                    attended.add(record.student.studentId);
                }
            });
            setAttendedToday(attended.size);

            // Tính số sinh viên chưa điểm danh
            setNotAttendedToday(total - attended.size);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu Summary:", error);
        }
    };

    useEffect(() => {
        fetchSummaryData();
        // Polling: Cập nhật dữ liệu mỗi 5 giây
        const interval = setInterval(() => {
            fetchSummaryData();
        }, 2000);

        // Cleanup interval khi component unmount
        return () => clearInterval(interval);
    }, []);


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-blue-500 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex items-center space-x-4">
                    <Users size={32} />
                    <CardTitle>Tổng số sinh viên</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl text-center font-bold">{totalStudents}</p>
                </CardContent>
            </Card>
            <Card className="bg-green-500 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex items-center space-x-4">
                    <CheckCircle size={32} />
                    <CardTitle>Hôm nay đã điểm danh</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl text-center font-bold">{attendedToday}</p>
                </CardContent>
            </Card>
            <Card className="bg-red-500 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex items-center space-x-4">
                    <XCircle size={32} />
                    <CardTitle>Chưa điểm danh</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl text-center font-bold">{notAttendedToday}</p>
                </CardContent>
            </Card>
        </div>
    );
};