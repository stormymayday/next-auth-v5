"use client";

import RoleGate from "@/components/auth/RoleGate";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import FormSuccess from "@/components/FormSuccess";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";
import { adminTest } from "@/actions/admin-test";

function AdminPage() {
    const onApiRouteClick = async () => {
        const response = await fetch("/api/admin");

        if (response.ok) {
            toast.success("API ROUTE: access granted");
        } else {
            toast.error("API ROUTE: access denied");
        }
    };

    const onServerActionClick = async () => {
        const response = await adminTest();

        if (response.success) {
            toast.success(response.success);
        }
        if (response.error) {
            toast.error(response.error);
        }
    };

    return (
        <section
            className="mt-5 bg-slate-50 p-4 rounded-sm shadow-sm h-[80vh] flex items-center justify-center"
            style={{ minHeight: "calc(100vh - 7.7rem)" }}
        >
            <Card className="w-[90vw] max-w-[600px]">
                <CardHeader>
                    <p className="text-2xl font-semibold text-center">
                        🔑 Admin
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <RoleGate allowedRole={UserRole.ADMIN}>
                        <FormSuccess message="Access granted!" />
                    </RoleGate>
                    <div className="flex flex-row items-center justify-between rounded-sm border p-3 shadow-md">
                        <p className="text-sm font-medium">
                            Admin-only API Route
                        </p>
                        <Button onClick={onApiRouteClick}>Click to test</Button>
                    </div>
                    <div className="flex flex-row items-center justify-between rounded-sm border p-3 shadow-md">
                        <p className="text-sm font-medium">
                            Admin-only Server Action
                        </p>
                        <Button onClick={onServerActionClick}>
                            Click to test
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}

export default AdminPage;
