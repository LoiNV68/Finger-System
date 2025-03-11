import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

interface Room {
    id: number;
    name: string;
    floor: number;
    deviceId?: string;
    deviceStatus?: string;
}

interface RoomFormProps {
    room: Room | null;
    isAdd: boolean;
    onSave: (room: Room) => void;
    onCancel: () => void;
}

export function RoomForm({ room, isAdd, onSave, onCancel }: RoomFormProps) {
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

    // Initialize form with room data or reset it
    useEffect(() => {
        if (isAdd) {
            resetForm();
        } else if (room) {
            setRoomName(room.name);
            setRoomFloor(room.floor);
            setDeviceId(room.deviceId || "");
            setDeviceStatus(room.deviceStatus || "Chưa gán");
        }
    }, [isAdd, room]);

    const handleSubmit = () => {
        onSave({
            id: room?.id || 0, // Actual ID will be set by parent component
            name: roomName,
            floor: roomFloor,
            deviceId: deviceId || undefined,
            deviceStatus: deviceId ? deviceStatus : "Chưa gán"
        });
    };

    return (
        <>
            <form style={{ padding: '20px' }} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="roomName" className="text-sm font-medium">Tên phòng</label>
                    <Input
                        style={{ margin: '10px 0' }}
                        id="roomName"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="Nhập tên phòng"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="roomFloor" className="text-sm font-medium">Tầng</label>
                    <Input
                        style={{ margin: '10px 0' }}
                        id="roomFloor"
                        type="number"
                        value={roomFloor}
                        onChange={(e) => setRoomFloor(Number(e.target.value))}
                        placeholder="Nhập tầng"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="deviceId" className="text-sm font-medium">Thiết bị vân tay</label>
                    <Input
                        style={{ margin: '10px 0' }}
                        id="deviceId"
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                        placeholder="Nhập mã thiết bị"
                    />
                </div>
                {deviceId && (
                    <div style={{ margin: '10px 0' }} className="space-y-2">
                        <label htmlFor="deviceStatus" className="text-sm font-medium">Trạng thái thiết bị</label>
                        <Select

                            value={deviceStatus}
                            onValueChange={(value) => setDeviceStatus(value)}
                        >
                            <SelectTrigger id="deviceStatus">
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Hoạt động">Hoạt động</SelectItem>
                                <SelectItem value="Không hoạt động">Không hoạt động</SelectItem>
                                <SelectItem value="Đang bảo trì">Đang bảo trì</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </form>
            <DialogFooter>
                <Button style={{ padding: '10px', margin: '10px 10px 10px' }} variant="outline" onClick={onCancel}>Hủy</Button>
                <Button style={{ padding: '10px', margin: '10px 10px 10px' }} onClick={handleSubmit}>Lưu</Button>
            </DialogFooter>
        </>
    );
}