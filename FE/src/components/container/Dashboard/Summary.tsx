import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Users, XCircle } from 'lucide-react'

export const Summary = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-blue-500 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex items-center space-x-4">
                    <Users size={32} />
                    <CardTitle>Tổng số sinh viên</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl text-center font-bold">350</p>
                </CardContent>
            </Card>
            <Card className="bg-green-500 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex items-center space-x-4">
                    <CheckCircle size={32} />
                    <CardTitle>Hôm nay đã điểm danh</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl text-center font-bold">120</p>
                </CardContent>
            </Card>
            <Card className="bg-red-500 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex items-center space-x-4">
                    <XCircle size={32} />
                    <CardTitle>Chưa điểm danh</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl text-center font-bold">230</p>
                </CardContent>
            </Card>
        </div>
    )
}

