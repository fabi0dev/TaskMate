import { FC, ReactNode } from "react";

interface ContentProps {
  children: ReactNode;
}

export const Content: FC<ContentProps> = ({ children }) => {
  return <div className="bg-gray-100 flex min-h-[100vh]">{children}</div>;
};
