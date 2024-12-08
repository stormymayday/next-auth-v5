import CardWrapper from "@/components/auth/CardWrapper";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";

function ErrorCard() {
    return (
        <CardWrapper
            headerLabel="Oops! Something went wrong!"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <div className="w-full flex items-center justify-center">
                <HiOutlineExclamationTriangle className="text-2xl text-destructive" />
            </div>
        </CardWrapper>
    );
}
export default ErrorCard;
