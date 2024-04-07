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
import { Calendar } from "..";
import { EllipsisVertical, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import {
  Group,
  selectorGroups,
  createGroup,
} from "../../store/reducers/groups";
import { selectorTasks } from "../../store/reducers/tasks";

interface FormData {
  groupName: string;
}

export const MenuLeft: FC = () => {
  const [dateSelected, setDateSelected] = useState<Date>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();

  const { groups } = useSelector(selectorGroups);
  const { data: tasks } = useSelector(selectorTasks);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(
      yup.object().shape({
        groupName: yup.string().required("Nome do Grupo é obrigatório"),
      })
    ),
  });

  const MenuTitle: FC<{ children: string }> = ({ children }) => {
    return <div className="text-sm text-gray-500 my-5">{children}</div>;
  };

  const GroupItem: FC<{ data: Group }> = ({ data: { id, title } }) => {
    const total = tasks.filter((item) => item.groupId === id);

    return (
      <div
        className={cn(
          `p-4 rounded-md bg-slate2 border-l-8 border-primary`,
          "flex items-center justify-between mb-3",
          "hover:opacity-80 cursor-pointer"
        )}
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
              <MenuItem>Editar</MenuItem>
              <MenuItem>Excluir</MenuItem>
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

  const onSubmit = (data: FormData) => {
    dispatch(createGroup(data.groupName));
    handleModalClose();
  };

  return (
    <div className="p-6 bg-slate1 h-full text-gray-50">
      <a href="/">
        <div className="text-xl mb-5 text-center">Task Mate</div>
      </a>

      <MenuTitle>Agenda</MenuTitle>

      <Calendar
        onClickDate={(date) => {
          setDateSelected(date);
        }}
        dateSelected={dateSelected}
      />

      <MenuTitle>Grupos</MenuTitle>

      {groups.map((item) => (
        <GroupItem key={item.id} data={item} />
      ))}

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

      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adicionar Novo Grupo</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <Input
                placeholder="Nome do Grupo"
                {...register("groupName")}
                isInvalid={!!errors.groupName}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Adicionar
              </Button>
              <Button onClick={handleModalClose}>Cancelar</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};
