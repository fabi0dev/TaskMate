import { FC, useState } from "react";
import {
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
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { selectorGroups, createGroup } from "../../store/reducers/groups";
import { selectDateCurrent, selectorTasks } from "../../store/reducers/tasks";
import { GroupItem } from "./GroupItem";
import { colorsGroup } from "../../constants/colorsGroup";

interface FormData {
  name: string;
  color: string;
}

export const MenuLeft: FC = () => {
  const dispatch = useDispatch();
  const { groups } = useSelector(selectorGroups);
  const { dateCurrent } = useSelector(selectorTasks);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const MenuTitle: FC<{ children: string }> = ({ children }) => {
    return <div className="text-sm text-gray-500 my-5">{children}</div>;
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required("Nome do grupo é obrigatório"),
        color: yup.string().required("Selecione uma cor"),
      })
    ),
  });

  const onSubmit = (data: FormData) => {
    dispatch(
      createGroup({
        ...data,
      })
    );
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

      <MenuTitle>Grupos</MenuTitle>

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

      <GroupItem
        data={{
          id: 0,
          name: "Todos",
        }}
        showMenu={false}
      />

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
    </div>
  );
};
