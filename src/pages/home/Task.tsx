import {
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
} from "@chakra-ui/react";
import { EllipsisVertical, Timer, Trash } from "lucide-react";
import { FC, useState } from "react";
import { cn } from "../../lib/utils";
import { useDispatch } from "react-redux";
import { markTaskAsDone, deleteTask } from "../../store/reducers/tasks";

interface Task {
  id: string;
  title: string;
  done: boolean;
  time: string;
}

interface TaskProps {
  data: Task;
}

export const Task: FC<TaskProps> = ({ data: { id, title, done, time } }) => {
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleDeleteTask = () => {
    dispatch(deleteTask(id));
    handleMenuClose();
  };

  const handleOtherAction = () => {
    handleMenuClose();
  };

  return (
    <div className="gap-7 p-5 bg-slate4 mb-4 rounded-xl shadow-md flex justify-between items-center">
      <div>
        <Checkbox
          size="lg"
          spacing="10px"
          isChecked={done}
          onChange={() => dispatch(markTaskAsDone(id))}
          iconColor="white"
          _checked={{
            "& .chakra-checkbox__control": { background: "#0bbe35", border: 0 },
          }}
        >
          <div
            className={cn(
              "text-[18px] text-gray-50",
              done ? "line-through" : ""
            )}
          >
            {title}
          </div>
        </Checkbox>

        <div className="pl-[28px] text-gray-500 text-[14px] flex items-center gap-2">
          <Timer size={20} />
          <div className="mt-1">{time}</div>
        </div>
      </div>

      <div>
        <Menu autoSelect={false}>
          <MenuButton
            as={EllipsisVertical}
            className="text-gray-400 hover:cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
          <MenuList>
            <MenuItem onClick={handleDeleteTask} icon={<Trash size={20} />}>
              Excluir
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  );
};
