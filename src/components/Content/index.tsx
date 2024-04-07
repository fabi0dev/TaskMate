import { FC, ReactNode } from "react";

interface ContentProps {
  children: ReactNode;
}

export const Content: FC<ContentProps> = ({ children }) => {
  return <div className="text-gray-50 flex min-h-[100vh]">{children}</div>;
};
