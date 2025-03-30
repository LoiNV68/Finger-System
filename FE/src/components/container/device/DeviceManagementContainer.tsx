import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { RoomTable } from "./RoomTable";
import { RoomForm } from "./RoomForm";

export interface Room {
    _id: string;
    name: string;
    floor: number;
    deviceId?: string;
    deviceName?: string;
    status: string;
}

const API = process.env.API_ROOM || "http://localhost:5000/api/rooms";

export default function RoomManagement() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [isAdd, setIsAdd] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await fetch(`${API}`);
            const data = await response.json();
            setRooms(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phòng:", error);
        }
    };

    const handleAddRoom = () => {
        setIsAdd(true);
        setEditingRoom(null);
        setError(null);
        setDialogOpen(true);
    };

    const handleEditRoom = (room: Room) => {
        setIsAdd(false);
        setEditingRoom(room);
        setError(null);
        setDialogOpen(true);
    };

    const handleDeleteRoom = async (roomId: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa phòng này không?")) {
            try {
                await fetch(`${API}/delete/${roomId}`, { method: "DELETE" });
                setRooms(rooms.filter(room => room._id !== roomId));
            } catch (error) {
                console.error("Lỗi khi xóa phòng:", error);
            }
        }
    };

    const handleSave = async (roomData: Partial<Room>) => {
        // Kiểm tra trùng tên phòng (chỉ khi thêm mới hoặc đổi tên)
        const isDuplicate = rooms.some(r => r.name === roomData.name && r._id !== editingRoom?._id);
        if (isDuplicate) {
            setError("Tên phòng đã tồn tại. Vui lòng chọn tên khác.");
            return;
        }

        try {
            let response;
            if (isAdd) {
                response = await fetch(`${API}/create`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(roomData),
                });
            } else if (editingRoom) {
                response = await fetch(`${API}/update/${editingRoom._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(roomData),
                });
            }

            if (response) {
                const updatedRoom = await response.json();
                setRooms(prevRooms =>
                    isAdd ? [...prevRooms, updatedRoom] : prevRooms.map(room => (room._id === updatedRoom._id ? updatedRoom : room))
                );
            }
        } catch (error) {
            console.error("Lỗi khi lưu phòng:", error);
        }
        setDialogOpen(false);
    };

    const handleStatusChange = async (roomId: string, status: string) => {
        try {
            const roomToUpdate = rooms.find(room => room._id === roomId);
            if (!roomToUpdate) return;

            const updatedRoomData = { ...roomToUpdate, status };
            const response = await fetch(`${API}/update/${roomId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedRoomData),
            });

            if (response.ok) {
                const updatedRoom = await response.json();
                setRooms(prevRooms =>
                    prevRooms.map(room => (room._id === roomId ? updatedRoom : room))
                );
            } else {
                throw new Error("Failed to update status");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            alert("Có lỗi xảy ra khi cập nhật trạng thái!");
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 style={{ margin: "20px 0" }} className="text-5xl font-bold text-center text-gray-900 mb-6">Quản lý Phòng học & Thiết bị</h1>

            <div className="flex justify-end mb-4">
                <Button onClick={handleAddRoom} className="bg-blue-500 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Thêm phòng
                </Button>
            </div>

            <RoomTable
                rooms={rooms}
                onEdit={handleEditRoom}
                onDelete={handleDeleteRoom}
                onStatusChange={handleStatusChange} // Truyền hàm xử lý trạng thái
            />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader style={{padding: '10px'}}>
                        <DialogTitle>{isAdd ? "Thêm mới" : "Chỉnh sửa"} Phòng học</DialogTitle>
                        <DialogDescription>
                            Nhập thông tin phòng học và nhấn lưu để cập nhật hệ thống.
                        </DialogDescription>
                    </DialogHeader>
                    <RoomForm
                        room={editingRoom}
                        isAdd={isAdd}
                        onSave={handleSave}
                        onCancel={() => setDialogOpen(false)}
                    />
                    {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                </DialogContent>
            </Dialog>
        </div>
    );
}