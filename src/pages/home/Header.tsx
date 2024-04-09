import { Button } from "@chakra-ui/react";
import { CalendarCheck, Plus } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectorTasks } from "../../store/reducers/tasks";
import { format, isSameDay } from "date-fns";
import { selectorGroups } from "../../store/reducers/groups";
import { ModalAddTask } from "./modals/ModalAddTask";

export const Header = () => {
  const {
    data: tasks,
    dateCurrent,
    groupIdCurrent,
  } = useSelector(selectorTasks);

  const { groups } = useSelector(selectorGroups);

  const tasksGroup = tasks
    .filter((item) => isSameDay(item.date, dateCurrent))
    .filter((item) => item.groupId == groupIdCurrent);

  const nameGroup = groups.find((item) => item.id == groupIdCurrent)?.name;
  const tasksPending = tasksGroup.filter((item) => !item.done);
  const tasksDone = tasksGroup.filter((item) => item.done);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 bg-slate2 z-10">
      <div className="p-5 w-[90%] mx-auto flex justify-between items-center">
        <div>
          <div className="text-2xl font-semibold ">{nameGroup}</div>

          <div className="text-gray-500">
            <div className="flex gap-3 items-center mb-2 text-gray-400">
              <CalendarCheck size={16} /> {format(dateCurrent, "dd/MM/yyyy")}
              {!tasksGroup.length && <span> - Nenhuma tarefa agendada.</span>}
            </div>
            <span>{tasksDone.length} Concluídos</span> e{" "}
            <span>{tasksPending.length} Pendentes</span>
          </div>
        </div>

        <div>
          <Button
            color={"white"}
            variant={"primary"}
            leftIcon={<Plus />}
            onClick={() => setIsOpen(true)}
          >
            Nova Tarefa
          </Button>
        </div>
      </div>

      <ModalAddTask isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};
