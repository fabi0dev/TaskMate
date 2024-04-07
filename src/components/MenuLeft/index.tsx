import { FC, useState } from "react";
import { cn } from "../../lib/utils";
import { Calendar } from "..";
import { EllipsisVertical } from "lucide-react";

interface MenuLeftProps {}
interface MenuItemProps {
  title: string;
}

export const MenuLeft: FC<MenuLeftProps> = ({}) => {
  const [dateSelected, setDateSelected] = useState<Date>();
  const MenuTitle = ({ children }: { children: string }) => {
    return <div className="text-sm text-gray-500 my-5">{children}</div>;
  };

  const MenuItem = ({ title }: MenuItemProps) => {
    return (
      <div
        className={cn(
          `p-4 rounded-md bg-slate2 border-l-8 border-primary`,
          "flex items-center justify-between mb-3"
        )}
      >
        <div className="text-xl font-semibold">{title}</div>
        <div className="flex items-center gap-x-2">
          <div className="bg-primary bg-opacity-50 p-1 px-3 rounded-lg text-primary font-bold">
            15
          </div>
          <EllipsisVertical className="text-gray-600" />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-slate1 h-full text-gray-50">
      <div className="text-xl mb-5 text-center">Task Mate</div>

      <MenuTitle>Agenda</MenuTitle>

      <Calendar
        onClickDate={(date) => {
          setDateSelected(date);
        }}
        dateSelected={dateSelected}
      />

      <MenuTitle>Grupos</MenuTitle>

      <MenuItem title={"Casa"} />

      <MenuItem title={"Trabalho"} />
    </div>
  );
};
