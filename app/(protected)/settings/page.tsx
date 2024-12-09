"use client";

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/useCurrentUser";

function SettingsPage() {
    const user = useCurrentUser();

    const onClick = () => {
        logout();
    };

    return (
        <div className="bg-white p-10 rounded-xl">
            {JSON.stringify(user)}
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
