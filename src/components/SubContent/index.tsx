import { FC, ReactNode } from "react";

interface SubContentProps {
  children: ReactNode;
}

export const SubContent: FC<SubContentProps> = ({ children }) => {
  return <div className="w-[60%] mx-auto">{children}</div>;
};
