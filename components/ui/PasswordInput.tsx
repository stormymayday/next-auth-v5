import * as React from "react";

import { Input } from "@/components/ui/Input";
import { AiOutlineEye } from "react-icons/ai";
import { TbEyeClosed } from "react-icons/tb";

const PasswordInput = React.forwardRef<
    HTMLInputElement,
    React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
        <Input
            type={showPassword ? "text" : "password"}
            suffix={
                showPassword ? (
                    <AiOutlineEye
                        className="absolute right-3 select-none cursor-pointer"
                        onClick={() => setShowPassword(false)}
                    />
                ) : (
                    <TbEyeClosed
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
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
