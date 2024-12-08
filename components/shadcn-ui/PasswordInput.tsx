import * as React from "react";
import { Input } from "@/components/shadcn-ui/Input";
import { AiOutlineEye } from "react-icons/ai";
import { TbEyeClosed } from "react-icons/tb";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PasswordInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);

        return (
            <Input
                type={showPassword ? "text" : "password"}
                suffix={
                    showPassword ? (
                        <TbEyeClosed
                            className="absolute right-3 select-none cursor-pointer"
                            onClick={() => setShowPassword(false)}
                        />
                    ) : (
                        <AiOutlineEye
                            className="absolute right-3 select-none cursor-pointer"
                            onClick={() => setShowPassword(true)}
                        />
                    )
                }
                className={className}
                {...props}
                ref={ref}
            />
        );
    }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
