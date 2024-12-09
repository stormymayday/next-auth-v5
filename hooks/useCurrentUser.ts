import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
    /// extracting the session data
    const { data: session } = useSession();

    return session?.user;
};
