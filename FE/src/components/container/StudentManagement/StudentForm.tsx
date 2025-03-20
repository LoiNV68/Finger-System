import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Student } from "./StudentMContainer";

interface StudentFormProps {
    student: Student | null;
    onSave: (student: Student) => void;
    isAdd: boolean;
}

export function StudentForm({ student, onSave, isAdd }: StudentFormProps) {
    const [name, setName] = useState(student?.name || "");
    const [gender, setGender] = useState(student?.gender || "");
    const [studentId, setStudentId] = useState(student?.studentId || "");
    const [class_, setClass] = useState(student?.class || "");
    const [department, setDepartment] = useState(student?.department || "");

    const resetForm = () => {
        setName("");
        setGender("");
        setStudentId("");
        setClass("");
        setDepartment("");
    };

    useEffect(() => {
        if (isAdd) {
            resetForm();
        } else if (student) {
            setName(student.name || "");
            setGender(student.gender || "");
            setStudentId(student.studentId || "");
            setClass(student.class || "");
            setDepartment(student.department || "");
        }
    }, [isAdd, student]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Kiểm tra dữ liệu hợp lệ
        if (!name || !gender || !studentId || !class_ || !department) {
            alert("Vui lòng điền đầy đủ thông tin sinh viên.");
            return;
        }

        onSave({
            name,
            gender,
            studentId,
            class: class_,
            department,
        });
    };

    return (
        <form style={{ padding: "20px" }} className="space-y-4" onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="name">Tên sinh viên</label>
                <Input
                    id="name"
                    placeholder="Nhập tên sinh viên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="gender">Giới tính</label>
                <Input
                    id="gender"
                    placeholder="Nhập giới tính"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="studentId">Mã sinh viên</label>
                <Input
                    id="studentId"
                    placeholder="Nhập mã sinh viên"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="class">Lớp</label>
                <Input
                    id="class"
                    placeholder="Nhập lớp"
                    value={class_}
                    onChange={(e) => setClass(e.target.value)}
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="department">Viện</label>
                <Input
                    id="department"
                    placeholder="Nhập viện"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                />
            </div>
            <DialogFooter>
                <Button style={{ padding: "10px" }} type="submit">
                    Lưu
                </Button>
            </DialogFooter>
        </form>
    );
}