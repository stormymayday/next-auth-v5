import { currentUser } from "@/utils/server-current-user/currentUser";
import UserInfo from "@/components/UserInfo";

async function ServerPage() {
    const user = await currentUser();

    return (
        <section className="w-[95vw] max-w-[600px]">
            <UserInfo user={user} label="💻 Server Component" />
        </section>
    );
}

export default ServerPage;
