import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";
import { Room } from "./DeviceManagementContainer";

interface RoomTableProps {
    rooms: Room[];
    onEdit: (room: Room) => void;
    onDelete: (roomId: string) => void;
}

export function RoomTable({ rooms, onEdit, onDelete }: RoomTableProps) {
    return (
        <div className="mb-6">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-200">
                        <TableHead>ID</TableHead>
                        <TableHead>Tên phòng</TableHead>
                        <TableHead>Tầng</TableHead>
                        <TableHead>Thiết bị vân tay</TableHead>
                        <TableHead>Mã thiết bị</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rooms.map((room) => (
                        <TableRow key={room._id} className="hover:bg-gray-100">
                            <TableCell>{room._id}</TableCell>
                            <TableCell>{room.name}</TableCell>
                            <TableCell>{room.floor}</TableCell>
                            <TableCell>{room.deviceName || "Chưa gán"}</TableCell>
                            <TableCell>{room.deviceId || "Chưa gán"}</TableCell>
                            <TableCell className={room.status === "Hoạt động" ? "text-green-500" : "text-red-500"}>
                                {room.status || "Chưa gán"}
                            </TableCell>
                            <TableCell className="flex space-x-2">
                                <Button style={{ marginRight: '10px' }} size="icon" onClick={() => onEdit(room)}>
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="destructive" onClick={() => onDelete(room._id)}>
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
