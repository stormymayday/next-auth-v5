// import { auth } from "@/auth";
import { currentUser } from "@/utils/current-user-server/auth";
import UserInfo from "@/components/UserInfo";

async function ServerPage() {
    // const session = await auth();
    const user = await currentUser();

    return (
        <section
            className="mt-5 bg-slate-50 p-4 rounded-sm shadow-sm h-[80vh] flex items-center justify-center"
            style={{ minHeight: "calc(100vh - 7.7rem)" }}
        >
            <article className="w-[90vw] max-w-[600px]">
                {/* <p>{JSON.stringify(session)}</p> */}
                <UserInfo user={user} label="💻 Server Component" />
            </article>
        </section>
    );
}

export default ServerPage;
