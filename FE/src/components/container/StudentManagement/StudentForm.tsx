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
    // Thay thế dòng isAdd && resetForm();
    useEffect(() => {
        if (isAdd) {
            resetForm();
        } else if (student) {
            // Khi editing, đảm bảo form có dữ liệu từ student
            setName(student.name || "");
            setGender(student.gender || "");
            setStudentId(student.studentId || "");
            setClass(student.class || "");
            setDepartment(student.department || "");
        }
    }, [isAdd, student]);


    const handleSubmit = () => {
        onSave({
            id: student?.id || 0,
            name,
            gender,
            studentId,
            class: class_,
            department,
            fingerprintRegistered: student?.fingerprintRegistered || false,
            fingerprintId: student?.fingerprintId || null
        });
    };

    return (
        <form style={{ padding: '20px' }} className="space-y-4">
            <Input style={{ marginBottom: '15px' }} placeholder="Tên sinh viên" value={name} onChange={e => setName(e.target.value)} />
            <Input style={{ marginBottom: '15px' }} placeholder="Giới tính" value={gender} onChange={e => setGender(e.target.value)} />
            <Input style={{ marginBottom: '15px' }} placeholder="Mã sinh viên" value={studentId} onChange={e => setStudentId(e.target.value)} />
            <Input style={{ marginBottom: '15px' }} placeholder="Lớp" value={class_} onChange={e => setClass(e.target.value)} />
            <Input style={{ marginBottom: '15px' }} placeholder="Viện" value={department} onChange={e => setDepartment(e.target.value)} />
            <DialogFooter>
                <Button style={{ padding: '10px' }} onClick={handleSubmit}>Lưu</Button>
            </DialogFooter>
        </form>
    );
}