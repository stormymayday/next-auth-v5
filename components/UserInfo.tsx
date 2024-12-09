// Client / Server agnostic component
// Inherits from a parent

import { ExtendedUser } from "@/auth";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface UserInfoProps {
    user?: ExtendedUser;
    label: string;
}

function UserInfo({ user, label }: UserInfoProps) {
    return (
        <Card className="w-full shadow-md">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">{label}</p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-sm border p-3 shadow-sm">
                    <p>ID</p>
                    <p className="truncate text-xs max-w-[180px] font-mono">
                        {user?.id}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-sm border p-3 shadow-sm">
                    <p>Name</p>
                    <p className="truncate text-xs max-w-[180px] font-mono">
                        {user?.name}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-sm border p-3 shadow-sm">
                    <p>Email</p>
                    <p className="truncate text-xs max-w-[180px] font-mono">
                        {user?.email}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-sm border p-3 shadow-sm">
                    <p>Role</p>
                    <p className="truncate text-xs max-w-[180px] font-mono">
                        {user?.role}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-sm border p-3 shadow-sm">
                    <p>2FA</p>
                    <Badge
                        variant={
                            user?.isTwoFactorEnabled ? "success" : "destructive"
                        }
                    >
                        <p className="truncate text-xs max-w-[180px] font-mono">
                            {user?.isTwoFactorEnabled ? "ON" : "OFF"}
                        </p>
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}

export default UserInfo;
