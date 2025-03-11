import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function LoginContainer() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleLogin = () => {
        if (username === "admin" && password === "12345") {
            localStorage.setItem('isLoggedIn', 'true');
            navigate('/')
        } else {
            setError("Sai tên đăng nhập hoặc mật khẩu");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-96 shadow-lg">
                <CardHeader>
                    <div className="flex items-center flex-col justify-center">
                        <CardTitle className="text-center text-4xl font-bold">Đăng nhập</CardTitle>
                        <img style={{ width: '100px', height: '100px', margin: '10px 0' }} src="/logo.png" alt="logo" />
                    </div>
                </CardHeader>
                <CardContent style={{ padding: '20px' }}>
                    <div className="space-y-4">
                        <Input style={{ marginBottom: '20px' }}
                            type="text"
                            placeholder="Tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input style={{ marginBottom: '20px' }}
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button className="w-full bg-blue-500 text-white" onClick={handleLogin}>
                            Đăng nhập
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
