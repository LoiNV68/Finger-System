import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Room {
    _id: string;
    name: string;
    floor: number;
    deviceId: string;
    deviceName: string;
    status: string;
}

interface Student {
    _id?: string;
    name: string;
    gender: string;
    studentId: string;
    class: string;
    department: string;
    deviceId?: string;
    roomName?: string;
}

interface StudentFormProps {
    student: Student | null;
    onSave: (student: Student) => void;
    isAdd: boolean;
    rooms: Room[];
    students: Student[]; // Thêm danh sách sinh viên để kiểm tra trùng
}

export function StudentForm({ student, onSave, isAdd, rooms, students }: StudentFormProps) {
    const [name, setName] = useState(student?.name || "");
    const [gender, setGender] = useState(student?.gender || "");
    const [studentId, setStudentId] = useState(student?.studentId || "");
    const [class_, setClass] = useState(student?.class || "");
    const [department, setDepartment] = useState(student?.department || "");
    const [deviceId, setDeviceId] = useState(student?.deviceId || "");

    useEffect(() => {
        if (isAdd) {
            setName("");
            setGender("");
            setStudentId("");
            setClass("");
            setDepartment("");
            setDeviceId("");
        } else if (student) {
            setName(student.name);
            setGender(student.gender);
            setStudentId(student.studentId);
            setClass(student.class);
            setDepartment(student.department);
            setDeviceId(student.deviceId || "");
        }
    }, [isAdd, student]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Kiểm tra đầy đủ thông tin
        if (!name || !gender || !studentId || !class_ || !department || !deviceId) {
            alert("Vui lòng điền đầy đủ thông tin, bao gồm phòng học.");
            return;
        }

        // Kiểm tra trùng mã sinh viên
        const isDuplicate = students.some(
            (s) => s.studentId === studentId && s._id !== student?._id // Ngoại trừ sinh viên hiện tại khi chỉnh sửa
        );
        if (isDuplicate) {
            alert("Mã sinh viên đã tồn tại. Vui lòng nhập mã khác.");
            return;
        }

        // Kiểm tra trạng thái phòng
        const selectedRoom = rooms.find((room) => room.deviceId === deviceId);
        if (selectedRoom && selectedRoom.status !== "Hoạt động") {
            alert("Chỉ có thể chọn phòng có trạng thái 'Hoạt động'.");
            return;
        }

        // Gửi dữ liệu nếu không có lỗi
        onSave({ name, gender, studentId, class: class_, department, deviceId });
    };

    return (
        <form style={{ padding: "20px" }} className="space-y-4" onSubmit={handleSubmit}>
            <div style={{ marginBottom: "10px" }}>
                <label htmlFor="name">Tên sinh viên</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label htmlFor="gender">Giới tính</label>
                <Input value={gender} onChange={(e) => setGender(e.target.value)} />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label htmlFor="studentId">Mã sinh viên</label>
                <Input value={studentId} onChange={(e) => setStudentId(e.target.value)} />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label htmlFor="class">Lớp</label>
                <Input value={class_} onChange={(e) => setClass(e.target.value)} />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label htmlFor="department">Viện</label>
                <Input value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label htmlFor="room">Phòng học</label>
                <Select value={deviceId} onValueChange={setDeviceId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Chọn phòng học" />
                    </SelectTrigger>
                    <SelectContent>
                        {rooms
                            .filter((room) => room.status === "Hoạt động") // Chỉ hiển thị phòng "Hoạt động"
                            .map((room) => (
                                <SelectItem key={room._id} value={room.deviceId}>
                                    {room.name} ({room.deviceName} - {room.deviceId})
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <Button style={{ padding: "10px" }} type="submit">
                    Lưu
                </Button>
            </DialogFooter>
        </form>
    );
}