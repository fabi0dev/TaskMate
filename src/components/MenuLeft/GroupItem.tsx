// Importações necessárias...
import { FC, useEffect, useState } from "react";
import { Group, deleteGroup, updateGroup } from "../../store/reducers/groups";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTaskByGroup,
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
  Input, // Adicionando Input do Chakra UI para uso na modal de edição
} from "@chakra-ui/react";
import { Edit, EllipsisVertical, Pencil, Trash } from "lucide-react";
import { cn } from "../../lib/utils";
import { useForm } from "react-hook-form"; // Importando react-hook-form
import { yupResolver } from "@hookform/resolvers/yup"; // Importando yup resolver
import * as yup from "yup"; // Importando yup para validação
import { FormError } from "..";
import { colorsGroup } from "../../constants/colorsGroup";

// Definindo schema de validação com yup
const schema = yup.object().shape({
  name: yup.string().required("Nome do grupo é obrigatório"),
  color: yup.string().required("Selecione uma cor"),
});

type FormData = yup.Asserts<typeof schema>;

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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  let total = tasks.filter((item) => isSameDay(item.date, dateCurrent));
  if (id != 0) {
    total = total.filter((item) => item.groupId === id);
  }

  const handleDeleteGroup = () => {
    setIsDeleteModalOpen(true);
  };

  const handleSelectGroup = () => {
    dispatch(selectGroupIdCurrent(id));
  };

  const handleConfirmDeleteGroup = () => {
    dispatch(deleteGroup(id));
    dispatch(deleteTaskByGroup(id));
    setIsDeleteModalOpen(false);
  };

  const handleEditGroup = (data: FormData) => {
    dispatch(updateGroup({ ...data, id }));
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    setValue("name", name);
    setValue("color", color);
  }, []);

  return (
    <div
      className={cn(
        `p-4 rounded-md bg-slate2 border-l-[2px]`,
        groupIdCurrent == id ? "border-l-[15px]" : "",
        "flex items-center justify-between mb-3",
        "cursor-pointer"
      )}
      style={{
        borderColor: color,
      }}
      onClick={handleSelectGroup}
    >
      <div className="text-[18px] font-semibold truncate ">{name}</div>
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
              className="text-gray-600 cursor-pointer hover:opacity-80 "
            />
            <MenuList>
              <MenuItem
                onClick={() => setIsEditModalOpen(true)}
                icon={<Edit size={20} />}
              >
                Editar
              </MenuItem>
              <MenuItem onClick={handleDeleteGroup} icon={<Trash size={20} />}>
                Excluir
              </MenuItem>
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
            <Button variant="danger" mr={3} onClick={handleConfirmDeleteGroup}>
              Excluir
            </Button>
            <Button onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Grupo</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(handleEditGroup)}>
            <ModalBody>
              <div>
                <Input
                  placeholder="Nome"
                  {...register("name")}
                  isInvalid={!!errors.name}
                  autoComplete="off"
                  autoFocus
                />
                {errors.name && <FormError>{errors.name.message}</FormError>}
              </div>

              <div className="mt-4 mb-1 font-bold">Cor</div>
              <div className="flex gap-3 justify-between">
                {colorsGroup.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => setValue("color", color)}
                    className={cn(
                      "w-8 h-8 cursor-pointer rounded-md",
                      color == watch("color") ? "border-slate-200 border-2" : ""
                    )}
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>

              {errors.color && <FormError>{errors.color.message}</FormError>}
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>

              <Button
                colorScheme="blue"
                type="submit"
                variant={"primary"}
                leftIcon={<Pencil size={16} />}
              >
                Alterar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};
