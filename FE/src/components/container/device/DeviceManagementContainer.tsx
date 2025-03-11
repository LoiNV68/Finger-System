import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoomTable } from "./RoomTable";
import { RoomForm } from "./RoomForm";

interface Room {
    id: number;
    name: string;
    floor: number;
    deviceId?: string;
    deviceStatus?: string;
}

export default function RoomManagement() {
    const roomsPerFloor = 5;
    const initialRooms: Room[] = Array.from({ length: roomsPerFloor }, (_, index) => ({
        id: index + 1,
        name: `Phòng ${((index % roomsPerFloor) + 1).toString().padStart(2, '0')}`,
        floor: Math.floor(index / roomsPerFloor) + 1,
        deviceId: index % 3 === 0 ? `ESP32-Wroom` : undefined,
        deviceStatus: index % 3 === 0 ? "Hoạt động" : "Chưa gán"
    }));

    const [rooms, setRooms] = useState<Room[]>(initialRooms);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [isAdd, setIsAdd] = useState(false);

    // Form state
    const [roomName, setRoomName] = useState("");
    const [roomFloor, setRoomFloor] = useState<number>(1);
    const [deviceId, setDeviceId] = useState("");
    const [deviceStatus, setDeviceStatus] = useState("Chưa gán");

    // Reset form function
    const resetForm = () => {
        setRoomName("");
        setRoomFloor(1);
        setDeviceId("");
        setDeviceStatus("Chưa gán");
    };

    // Handle form based on whether we're adding or editing
    useEffect(() => {
        if (isAdd) {
            resetForm();
        } else if (editingRoom) {
            setRoomName(editingRoom.name);
            setRoomFloor(editingRoom.floor);
            setDeviceId(editingRoom.deviceId || "");
            setDeviceStatus(editingRoom.deviceStatus || "Chưa gán");
        }
    }, [isAdd, editingRoom]);

    const handleAddRoom = () => {
        setIsAdd(true);
        setEditingRoom(null);
        setDialogOpen(true);
    };

    const handleEditRoom = (room: Room) => {
        setIsAdd(false);
        setEditingRoom(room);
        setDialogOpen(true);
    };

    const handleDeleteRoom = (roomId: number) => {
        if (confirm("Bạn có chắc chắn muốn xóa phòng này không?")) {
            setRooms(rooms.filter(room => room.id !== roomId));
        }
    };

    const handleSave = () => {
        const newRoom: Room = {
            id: editingRoom ? editingRoom.id : rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1,
            name: roomName,
            floor: roomFloor,
            deviceId: deviceId || undefined,
            deviceStatus: deviceId ? deviceStatus : "Chưa gán"
        };

        if (isAdd) {
            setRooms([...rooms, newRoom]);
        } else {
            setRooms(rooms.map(room => room.id === newRoom.id ? newRoom : room));
        }

        setDialogOpen(false);
        resetForm();
    };

    return (
        <div style={{ padding: '5px' }} className="p-6 bg-gray-100 min-h-screen">
            <h1 style={{ padding: '20px' }} className="text-5xl font-bold text-center text-gray-900 mb-6">Quản lý Phòng học & Thiết bị</h1>

            <div style={{ margin: '10px 0' }} className="flex justify-end mb-4">
                <Button style={{ padding: '10px' }} onClick={handleAddRoom} className="bg-blue-500 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Thêm phòng
                </Button>
            </div>

            <RoomTable
                rooms={rooms}
                onEdit={handleEditRoom}
                onDelete={handleDeleteRoom}
            />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle style={{ padding: '20px' }}>{isAdd ? "Thêm mới" : "Chỉnh sửa"} Phòng học</DialogTitle>
                    </DialogHeader>
                    <RoomForm
                        room={editingRoom}
                        isAdd={isAdd}
                        onSave={handleSave}
                        onCancel={() => setDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}