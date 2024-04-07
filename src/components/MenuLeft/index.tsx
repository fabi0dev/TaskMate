import { FC, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@chakra-ui/react";
import { cn } from "../../lib/utils";
import { Calendar, FormError } from "..";
import { EllipsisVertical, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import {
  Group,
  selectorGroups,
  createGroup,
  deleteGroup,
} from "../../store/reducers/groups";
import {
  selectDateCurrent,
  selectGroupIdCurrent,
  selectorTasks,
} from "../../store/reducers/tasks";
import { isSameDay } from "date-fns";

interface FormData {
  groupName: string;
}

export const MenuLeft: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const dispatch = useDispatch();

  const { groups } = useSelector(selectorGroups);

  const {
    data: tasks,
    groupIdCurrent,
    dateCurrent,
  } = useSelector(selectorTasks);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(
      yup.object().shape({
        groupName: yup.string().required("Nome do grupo é obrigatório"),
      })
    ),
  });

  const MenuTitle: FC<{ children: string }> = ({ children }) => {
    return <div className="text-sm text-gray-500 my-5">{children}</div>;
  };

  const GroupItem: FC<{ data: Group }> = ({ data: { id, title } }) => {
    const total = tasks
      .filter((item) => isSameDay(item.date, dateCurrent))
      .filter((item) => item.groupId === id);

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

    return (
      <div
        className={cn(
          groupIdCurrent == id ? "border" : "",
          `p-4 rounded-md bg-slate2 border-l-8 border-primary`,
          "flex items-center justify-between mb-3",
          "hover:opacity-80 cursor-pointer"
        )}
        onClick={() => handleSelectGroup()}
      >
        <div className="text-xl font-semibold">{title}</div>
        <div className="flex items-center gap-x-2">
          <div className="bg-primary bg-opacity-50 p-1 px-3 rounded-lg text-primary font-bold">
            {total.length}
          </div>
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
        </div>
      </div>
    );
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleConfirmDeleteGroup = () => {
    dispatch(deleteGroup(selectedGroupId!));
    setIsDeleteModalOpen(false);
  };

  const onSubmit = (data: FormData) => {
    dispatch(createGroup(data.groupName));
    handleModalClose();
    reset();
  };

  return (
    <div className="p-6 bg-slate1 h-full text-gray-50">
      <a href="/">
        <div className="text-xl mb-5 text-center">Task Mate</div>
      </a>

      <MenuTitle>Agenda</MenuTitle>

      <Calendar
        onClickDate={(date) => {
          dispatch(selectDateCurrent(date));
        }}
        dateSelected={dateCurrent}
      />

      <MenuTitle>Grupos de Tarefas</MenuTitle>

      <div
        className={cn(
          `p-4 rounded-md bg-slate2 text-center`,
          "flex items-center justify-center mb-3",
          "hover:opacity-80 cursor-pointer"
        )}
        onClick={handleModalOpen}
      >
        <Plus size={25} color="#242831" />
      </div>

      {groups.map((item) => (
        <GroupItem key={item.id} data={item} />
      ))}

      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Novo Grupo</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <Input
                placeholder="Nome do Grupo"
                {...register("groupName")}
                isInvalid={!!errors.groupName}
                autoComplete="off"
                autoFocus
              />
              {errors.groupName && (
                <FormError>{errors.groupName.message}</FormError>
              )}
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={handleModalClose}>
                Cancelar
              </Button>

              <Button
                colorScheme="blue"
                type="submit"
                variant={"primary"}
                leftIcon={<Plus size={16} />}
              >
                Adicionar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

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
