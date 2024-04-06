import { FC, ReactNode } from "react";

interface FrameTaskColumnProps {
  children: ReactNode;
  title: string;
}

export const FrameTaskColumn: FC<FrameTaskColumnProps> = ({
  children,
  title,
}) => {
  return (
    <div>
      <div className="font-bold text-xl mb-8">{title}</div>
      {children}
    </div>
  );
};
