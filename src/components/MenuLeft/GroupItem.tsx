import { FC, useState } from "react";
import { Group, deleteGroup } from "../../store/reducers/groups";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGroupIdCurrent,
  selectorTasks,
} from "../../store/reducers/tasks";
import { isSameDay } from "date-fns";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { EllipsisVertical } from "lucide-react";
import { cn } from "../../lib/utils";

interface GroupItemProps {
  data: Group;
  showMenu?: boolean;
}

export const GroupItem: FC<GroupItemProps> = ({
  data: { id, name, color = "#4c504c" },
  showMenu = true,
}) => {
  const dispatch = useDispatch();
  const {
    data: tasks,
    groupIdCurrent,
    dateCurrent,
  } = useSelector(selectorTasks);

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  let total = tasks.filter((item) => isSameDay(item.date, dateCurrent));

  if (id != 0) {
    total = total.filter((item) => item.groupId === id);
  }

  const handleEditGroup = (groupId: number) => {
    console.log("Editar grupo com ID:", groupId);
  };

  const handleDeleteGroup = (groupId: number) => {
    setSelectedGroupId(groupId);
    setIsDeleteModalOpen(true);
  };

  const handleSelectGroup = () => {
    dispatch(selectGroupIdCurrent(id));
  };

  const handleConfirmDeleteGroup = () => {
    dispatch(deleteGroup(selectedGroupId!));
    setIsDeleteModalOpen(false);
  };

  return (
    <div
      className={cn(
        `p-4 rounded-md bg-slate2 border-l-[2px]`,
        groupIdCurrent == id ? "border-l-[15px]" : "",
        "flex items-center justify-between mb-3",
        "hover:opacity-80 cursor-pointer"
      )}
      style={{
        borderColor: color,
      }}
      onClick={() => handleSelectGroup()}
    >
      <div className="text-xl font-semibold">{name}</div>
      <div className="flex items-center gap-x-2">
        <div
          className={
            "p-1 px-3 rounded-lg bg-white bg-opacity-10 text-gray-300 text-sm"
          }
        >
          {total.length}
        </div>
        {showMenu && (
          <Menu>
            <MenuButton
              as={EllipsisVertical}
              className="text-gray-600 cursor-pointer"
            />
            <MenuList>
              <MenuItem onClick={() => handleEditGroup(id)}>Editar</MenuItem>
              <MenuItem onClick={() => handleDeleteGroup(id)}>Excluir</MenuItem>
            </MenuList>
          </Menu>
        )}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar exclusão</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Tem certeza que deseja excluir este grupo?</ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => handleConfirmDeleteGroup()}
            >
              Excluir
            </Button>
            <Button onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
