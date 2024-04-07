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
import { useDispatch } from "react-redux";
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

interface TaskProps {
  data: ITask;
}

interface FormData {
  editTaskTitle: string;
  editTaskStartHour: string;
  editTaskStartMinute: string;
  editTaskEndHour: string;
  editTaskEndMinute: string;
}

const schema = yup.object().shape({
  editTaskTitle: yup.string().required("Título da Tarefa é obrigatório"),
  editTaskStartHour: yup
    .string()
    .required("Hora de Início é obrigatória")
    .matches(/^([01]?[0-9]|2[0-3])$/, "Hora inválida"),
  editTaskStartMinute: yup
    .string()
    .required("Minuto de Início é obrigatório")
    .matches(/^[0-5]?[0-9]$/, "Minuto inválido"),
  editTaskEndHour: yup
    .string()
    .required("Hora de Fim é obrigatória")
    .matches(/^([01]?[0-9]|2[0-3])$/, "Hora inválida")
    .test(
      "is-greater",
      "Hora de Fim deve ser maior que Hora de Início",
      function (value, context) {
        const startHour = parseInt(context.parent.editTaskStartHour, 10);
        const startMinute = parseInt(context.parent.editTaskStartMinute, 10);
        const endHour = parseInt(value, 10);
        const endMinute = parseInt(context.parent.editTaskEndMinute, 10);

        const startDateTime = parse(
          `${startHour}:${startMinute}`,
          "HH:mm",
          new Date()
        );
        const endDateTime = parse(
          `${endHour}:${endMinute}`,
          "HH:mm",
          new Date()
        );

        return isAfter(endDateTime, startDateTime);
      }
    ),
  editTaskEndMinute: yup
    .string()
    .required("Minuto de Fim é obrigatório")
    .matches(/^[0-5]?[0-9]$/, "Minuto inválido"),
});

export const Task: FC<TaskProps> = ({ data: { id, title, done, time } }) => {
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
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
    const {
      editTaskStartHour,
      editTaskStartMinute,
      editTaskEndHour,
      editTaskEndMinute,
    } = data;
    const startTime = `${editTaskStartHour}:${editTaskStartMinute}`;
    const endTime = `${editTaskEndHour}:${editTaskEndMinute}`;

    dispatch(
      editTask({
        id,
        title: data.editTaskTitle,
        time: `${startTime} ~ ${endTime}`,
      })
    );
    setShowEdit(false);
  };

  useEffect(() => {
    setValue("editTaskTitle", title);
    setValue("editTaskStartHour", time.split(" ~ ")[0].split(":")[0]);
    setValue("editTaskStartMinute", time.split(" ~ ")[0].split(":")[1]);
    setValue("editTaskEndHour", time.split(" ~ ")[1].split(":")[0]);
    setValue("editTaskEndMinute", time.split(" ~ ")[1].split(":")[1]);
  }, [setValue, title, time]);

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
              <div className="mt-4">
                <div>Hora de início</div>

                <div className="flex gap-5 items-center">
                  <div>
                    <Input
                      type="text"
                      placeholder="Hora"
                      {...register("editTaskStartHour")}
                      isInvalid={!!errors.editTaskStartHour}
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <Input
                      type="text"
                      placeholder="Minuto"
                      {...register("editTaskStartMinute")}
                      isInvalid={!!errors.editTaskStartMinute}
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div>Hora de Finalização</div>

                <div className="flex gap-5 items-center">
                  <div>
                    <Input
                      type="text"
                      placeholder="Hora"
                      {...register("editTaskEndHour")}
                      isInvalid={!!errors.editTaskEndHour}
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <Input
                      type="text"
                      placeholder="Minuto"
                      {...register("editTaskEndMinute")}
                      isInvalid={!!errors.editTaskEndMinute}
                      maxLength={2}
                    />
                  </div>
                </div>

                <div>
                  {errors.editTaskStartHour && (
                    <FormError>{errors.editTaskStartHour.message}</FormError>
                  )}

                  {errors.editTaskStartMinute && (
                    <FormError>{errors.editTaskStartMinute.message}</FormError>
                  )}

                  {errors.editTaskEndHour && (
                    <FormError>{errors.editTaskEndHour.message}</FormError>
                  )}

                  {errors.editTaskEndMinute && (
                    <FormError>{errors.editTaskEndMinute.message}</FormError>
                  )}
                </div>
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
  );
};
