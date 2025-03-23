import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Room } from "./DeviceManagementContainer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    const [status, setStatus] = useState("Không có thiết bị"); // Thêm trạng thái

    // Reset form function
    const resetForm = () => {
        setRoomName("");
        setRoomFloor(1);
        setDeviceName("");
        setStatus("Không có thiết bị");
    };

    // Initialize form with room data or reset it
    useEffect(() => {
        if (isAdd) {
            resetForm();
        } else if (room) {
            setRoomName(room.name);
            setRoomFloor(room.floor);
            setDeviceName(room.deviceName || "");
            setStatus(room.status || "Không có thiết bị");
        }
    }, [isAdd, room]);

    const handleSubmit = () => {
        onSave({
            name: roomName,
            floor: roomFloor,
            deviceName: deviceName || undefined,
            status, // Lưu trạng thái được chọn
        });
    };

    return (
        <>
            <form style={{ padding: '10px' }} className="space-y-4 p-4">
                {/* Tên phòng */}
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="roomName" className="text-sm font-medium">Tên phòng</label>
                    <Input
                        id="roomName"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="Nhập tên phòng"
                    />
                </div>

                {/* Tầng */}
                <div style={{ marginBottom: '10px' }}>
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
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="deviceName" className="text-sm font-medium">Tên thiết bị</label>
                    <Input
                        id="deviceName"
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        placeholder="Nhập tên thiết bị"
                    />
                </div>

                {/* Trạng thái */}
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="status" className="text-sm font-medium">Trạng thái</label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Hoạt động">Hoạt động</SelectItem>
                            <SelectItem value="Chưa hoạt động">Chưa hoạt động</SelectItem>
                            <SelectItem value="Không có thiết bị">Không có thiết bị</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </form>

            <DialogFooter>
                <Button style={{ padding: '10px', margin: '10px' }} variant="outline" onClick={onCancel}>Hủy</Button>
                <Button style={{ padding: '10px', margin: '10px' }} onClick={handleSubmit}>Lưu</Button>
            </DialogFooter>
        </>
    );
}