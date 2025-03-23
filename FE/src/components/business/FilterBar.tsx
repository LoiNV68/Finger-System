import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Filters {
    name: string;
    studentId: string;
    class: string;
    faculty: string;
    gender: string;
}

type FilterKey = keyof Filters;

interface FilterBarProps {
    filters: Filters;
    handleFilterChange: (field: FilterKey, value: string) => void;
    resetFilters: () => void;
}

export const FilterBar = ({ filters, handleFilterChange, resetFilters }: FilterBarProps) => {
    return (
        <div style={{ marginBottom: '20px' }} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            <div className="flex items-center space-x-2">
                <div className="relative w-full">
                    <Input
                        placeholder="Tên sinh viên"
                        value={filters.name}
                        onChange={(e) => handleFilterChange("name", e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>
            <div>
                <Input
                    placeholder="Mã sinh viên"
                    value={filters.studentId}
                    onChange={(e) => handleFilterChange("studentId", e.target.value)}
                />
            </div>
            {/* <div>
                <Select
                    value={filters.class}
                    onValueChange={(value) => handleFilterChange("class", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Lớp" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-amber-50">
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="IT01">IT01</SelectItem>
                        <SelectItem value="IT02">IT02</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Select
                    value={filters.faculty}
                    onValueChange={(value) => handleFilterChange("faculty", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Viện" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-amber-50">
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="CNTT">CNTT</SelectItem>
                        <SelectItem value="DTVT">TCDN</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Select
                    value={filters.gender}
                    onValueChange={(value) => handleFilterChange("gender", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Giới tính" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-amber-50">
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="Nam">Nam</SelectItem>
                        <SelectItem value="Nữ">Nữ</SelectItem>
                    </SelectContent>
                </Select>
            </div> */}
            <div>
                <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                >
                    Xóa bộ lọc
                </Button>
            </div>
        </div>
    );
};