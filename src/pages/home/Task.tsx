import {
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Edit, EllipsisVertical, Timer, Trash, Watch } from "lucide-react";
import { FC, useState } from "react";
import { calculateHourDifference, cn } from "../../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { markTaskAsDone, deleteTask, ITask } from "../../store/reducers/tasks";

import { selectorGroups } from "../../store/reducers/groups";
import { ModalEditTask } from "./modals/ModalEditTask";

interface TaskProps {
  data: ITask;
}

export const Task: FC<TaskProps> = ({ data }) => {
  const { id, title, done, time, groupId } = data;
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { groups } = useSelector(selectorGroups);
  const colorGroup = groups.find((group) => group.id == groupId)?.color;
  const [showEdit, setShowEdit] = useState(false);

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleDeleteTask = () => {
    dispatch(deleteTask(id));
    handleMenuClose();
  };

  return (
    <div className="flex bg-slate4 rounded-xl shadow-xl mb-3 items-center">
      <div
        style={{ backgroundColor: colorGroup }}
        className="w-1 h-7 rounded-tr-lg rounded-br-lg"
      ></div>
      <div className="gap-7 p-5 flex w-full justify-between">
        <div className="flex items-center">
          <div>
            <Checkbox
              size="lg"
              spacing="15px"
              isChecked={done}
              onChange={() => dispatch(markTaskAsDone(id))}
              iconColor="white"
              _checked={{
                "& .chakra-checkbox__control": {
                  background: "#0bbe35",
                  border: 0,
                },
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
          </div>

          {time && (
            <div className="pl-[28px] text-gray-500 text-[14px] flex  items-center  gap-2">
              <div className="flex items-center">
                <Watch size={22} />
                <div className="mt-1 flex items-center">{time}</div>
              </div>

              <div className="flex items-center gap-1">
                {<Timer size={22} />}
                {calculateHourDifference(
                  time.split("-")[0],
                  time.split("-")[1]
                )}
              </div>
            </div>
          )}
        </div>

        <ModalEditTask
          show={showEdit}
          onClose={() => setShowEdit(false)}
          data={data}
        />

        <div>
          <Menu autoSelect={false}>
            <MenuButton
              as={EllipsisVertical}
              className="text-gray-400 hover:cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
            <MenuList>
              <MenuItem
                onClick={() => setShowEdit(true)}
                icon={<Edit size={20} />}
              >
                Editar
              </MenuItem>

              <MenuItem onClick={handleDeleteTask} icon={<Trash size={20} />}>
                Excluir
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </div>
  );
};
