import {
  Checkbox,
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
  Input,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { Edit, EllipsisVertical, Pencil, Timer, Trash } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  markTaskAsDone,
  deleteTask,
  editTask,
  ITask,
} from "../../store/reducers/tasks";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormError } from "@components/FormError";
import { isAfter, parse } from "date-fns";
import InputMask from "react-input-mask";
import { selectorGroups } from "../../store/reducers/groups";

interface TaskProps {
  data: ITask;
}

interface FormData {
  editTaskTitle: string;
  editTaskStart: string; // Combine hora e minuto em um único campo
  editTaskEnd: string; // Combine hora e minuto em um único campo
}

const schema = yup.object().shape({
  editTaskTitle: yup.string().required("Título da Tarefa é obrigatório"),
  editTaskStart: yup
    .string()
    .required("Hora de Início é obrigatória")
    .matches(/^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/, "Formato de Hora inválido"),
  editTaskEnd: yup
    .string()
    .required("Hora de Fim é obrigatória")
    .matches(/^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/, "Formato de Hora inválido")
    .test(
      "is-greater",
      "Hora de Fim deve ser maior que Hora de Início",
      function (value, context) {
        const startDateTime = parse(
          context.parent.editTaskStart,
          "HH:mm",
          new Date()
        );
        const endDateTime = parse(value, "HH:mm", new Date());

        return isAfter(endDateTime, startDateTime);
      }
    ),
});

export const Task: FC<TaskProps> = ({
  data: { id, title, done, time, groupId },
}) => {
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const { groups } = useSelector(selectorGroups);
  const colorGroup = groups.find((group) => group.id == groupId)?.color;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleDeleteTask = () => {
    dispatch(deleteTask(id));
    handleMenuClose();
  };

  const handleEditTask = (data: FormData) => {
    dispatch(
      editTask({
        id,
        title: data.editTaskTitle,
        time: `${data.editTaskStart} ~ ${data.editTaskEnd}`,
      })
    );
    setShowEdit(false);
  };

  useEffect(() => {
    setValue("editTaskTitle", title);
    setValue("editTaskStart", time.split(" ~ ")[0]);
    setValue("editTaskEnd", time.split(" ~ ")[1]);
  }, [setValue, title, time]);

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

          <div className="pl-[28px] text-gray-500 text-[14px] flex  items-center gap-2">
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

        <Modal isOpen={showEdit} onClose={() => setShowEdit(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Atualizar Tarefa</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleSubmit(handleEditTask)}>
                <div>
                  <Input
                    placeholder="Título da Tarefa"
                    {...register("editTaskTitle")}
                    isInvalid={!!errors.editTaskTitle}
                  />

                  {errors.editTaskTitle && (
                    <FormError>{errors.editTaskTitle.message}</FormError>
                  )}
                </div>
                <div className="mt-4 flex gap-5 ">
                  <div className=" items-center">
                    <div>Hora de início</div>
                    <div>
                      <Input
                        type="text"
                        placeholder="Horas"
                        {...register("editTaskStart")}
                        isInvalid={!!errors.editTaskStart}
                        as={InputMask}
                        mask="99:99"
                      />
                    </div>
                  </div>

                  <div className=" items-center">
                    <div>Hora de Finalização</div>
                    <div>
                      <Input
                        type="text"
                        placeholder="Horas"
                        {...register("editTaskEnd")}
                        isInvalid={!!errors.editTaskEnd}
                        as={InputMask}
                        mask="99:99"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  {errors.editTaskStart && (
                    <FormError>{errors.editTaskStart.message}</FormError>
                  )}

                  {errors.editTaskEnd && (
                    <FormError>{errors.editTaskEnd.message}</FormError>
                  )}
                </div>
              </form>
            </ModalBody>

            <ModalFooter>
              <Button mr={3} onClick={() => setShowEdit(false)}>
                Cancelar
              </Button>
              <Button
                leftIcon={<Pencil size={16} />}
                variant={"secondary"}
                onClick={handleSubmit(handleEditTask)}
              >
                Atualizar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};
