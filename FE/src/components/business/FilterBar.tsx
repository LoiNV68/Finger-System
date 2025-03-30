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
    classOptions: string[];
    facultyOptions: string[];
    genderOptions: string[];
}

export const FilterBar = ({
    filters,
    handleFilterChange,
    resetFilters,
    classOptions,
    facultyOptions,
    genderOptions,
}: FilterBarProps) => {
    return (
        <div style={{ marginBottom: "20px" }} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
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
            <div>
                <Select
                    value={filters.class || "all"}
                    onValueChange={(value) => handleFilterChange("class", value === "all" ? "" : value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Lớp" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-amber-50">
                        <SelectItem value="all">Tất cả</SelectItem>
                        {classOptions.map((className) => (
                            <SelectItem key={className} value={className}>
                                {className}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Select
                    value={filters.faculty || "all"}
                    onValueChange={(value) => handleFilterChange("faculty", value === "all" ? "" : value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Viện" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-amber-50">
                        <SelectItem value="all">Tất cả</SelectItem>
                        {facultyOptions.map((faculty) => (
                            <SelectItem key={faculty} value={faculty}>
                                {faculty}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Select
                    value={filters.gender || "all"}
                    onValueChange={(value) => handleFilterChange("gender", value === "all" ? "" : value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Giới tính" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-amber-50">
                        <SelectItem value="all">Tất cả</SelectItem>
                        {genderOptions.map((gender) => (
                            <SelectItem key={gender} value={gender}>
                                {gender}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
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