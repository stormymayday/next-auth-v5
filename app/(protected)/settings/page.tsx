"use client";

import { logout } from "@/actions/logout";
import { useSession } from "next-auth/react";

function SettingsPage() {
    // extracting the session data.
    const { data: session } = useSession();

    // console.log(session);

    const onClick = () => {
        logout();
    };

    return (
        <div>
            {JSON.stringify(session)}
            <button onClick={onClick}>sign out</button>
        </div>
    );
}
export default SettingsPage;

// import { auth, signOut } from "@/auth";
// import { logout } from "@/actions/logout";

// async function SettingsPage() {
//     const session = await auth();

//     return (
//         <div>
//             {JSON.stringify(session)}
//             <form
//                 action={async () => {
//                     "use server";
//                     // await signOut({ redirectTo: "/auth/login" });
//                     await logout();
//                 }}
//             >
//                 <button type="submit">sign out</button>
//             </form>
//         </div>
//     );
// }
// export default SettingsPage;
