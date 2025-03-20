import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Room } from "./DeviceManagementContainer";

interface RoomFormProps {
    room: Room | null;
    isAdd: boolean;
    onSave: (room: Partial<Room>) => void;
    onCancel: () => void;
}

export function RoomForm({ room, isAdd, onSave, onCancel }: RoomFormProps) {
    const [roomName, setRoomName] = useState("");
    const [roomFloor, setRoomFloor] = useState<number>(1);
    const [deviceName, setDeviceName] = useState("");

    // Reset form function
    const resetForm = () => {
        setRoomName("");
        setRoomFloor(1);
        setDeviceName("");
    };

    // Initialize form with room data or reset it
    useEffect(() => {
        if (isAdd) {
            resetForm();
        } else if (room) {
            setRoomName(room.name);
            setRoomFloor(room.floor);
            setDeviceName(room.deviceName || "");
        }
    }, [isAdd, room]);

    const handleSubmit = () => {
        onSave({
            name: roomName,
            floor: roomFloor,
            deviceName: deviceName || undefined,
            status: deviceName ? "Hoạt động" : "Không có thiết bị", // Trạng thái tự động cập nhật
        });
    };

    return (
        <>
            <form className="space-y-4 p-4">
                {/* Tên phòng */}
                <div className="space-y-2">
                    <label htmlFor="roomName" className="text-sm font-medium">Tên phòng</label>
                    <Input
                        id="roomName"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="Nhập tên phòng"
                    />
                </div>

                {/* Tầng */}
                <div className="space-y-2">
                    <label htmlFor="roomFloor" className="text-sm font-medium">Tầng</label>
                    <Input
                        id="roomFloor"
                        type="number"
                        value={roomFloor}
                        onChange={(e) => setRoomFloor(Number(e.target.value))}
                        placeholder="Nhập tầng"
                    />
                </div>

                {/* Thiết bị vân tay */}
                <div className="space-y-2">
                    <label htmlFor="deviceName" className="text-sm font-medium">Tên thiết bị</label>
                    <Input
                        id="deviceName"
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        placeholder="Nhập tên thiết bị"
                    />
                </div>
            </form>

            <DialogFooter>
                <Button variant="outline" onClick={onCancel}>Hủy</Button>
                <Button onClick={handleSubmit}>Lưu</Button>
            </DialogFooter>
        </>
    );
}
