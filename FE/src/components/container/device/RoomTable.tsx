import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";
import { Room } from "./DeviceManagementContainer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoomTableProps {
    rooms: Room[];
    onEdit: (room: Room) => void;
    onDelete: (roomId: string) => void;
    onStatusChange: (roomId: string, status: string) => void; // Thêm prop để cập nhật trạng thái
}

export function RoomTable({ rooms, onEdit, onDelete, onStatusChange }: RoomTableProps) {
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
                            <TableCell>
                                <Select
                                    value={room.status}
                                    onValueChange={(value) => onStatusChange(room._id, value)}
                                >
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Hoạt động">Hoạt động</SelectItem>
                                        <SelectItem value="Chưa hoạt động">Chưa hoạt động</SelectItem>
                                        <SelectItem value="Không có thiết bị">Không có thiết bị</SelectItem>
                                    </SelectContent>
                                </Select>
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