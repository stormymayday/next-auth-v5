import { NextResponse } from "next/server";
import { currentRole } from "@/utils/server-current-user/currentUser";
import { UserRole } from "@prisma/client";

export async function GET() {
    const role = await currentRole();

    if (role === UserRole.ADMIN) {
        return new NextResponse(null, { status: 200 });
    } else {
        return new NextResponse(null, { status: 403 });
    }
}
