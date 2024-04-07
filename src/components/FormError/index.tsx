import { FC } from "react";

interface FormErrorProps {
  children: React.ReactNode;
}

export const FormError: FC<FormErrorProps> = ({ children }) => {
  return <div className="text-red-400 text-xs mt-1">{children}</div>;
};
