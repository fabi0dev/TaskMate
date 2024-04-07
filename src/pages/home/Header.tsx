import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
} from "@chakra-ui/react";
import { CalendarCheck, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { selectorTasks, setNewTask } from "../../store/reducers/tasks";
import { FormError } from "@components/FormError";
import { format, isAfter, isSameDay, parse } from "date-fns";
import { selectorGroups } from "../../store/reducers/groups";

interface FormData {
  newTaskTitle: string;
  newTaskStartHour: string;
  newTaskStartMinute: string;
  newTaskEndHour: string;
  newTaskEndMinute: string;
}

const schema = yup.object().shape({
  newTaskTitle: yup.string().required("Título da Tarefa é obrigatório"),
  newTaskStartHour: yup
    .string()
    .required("Hora de Início é obrigatória")
    .matches(/^([01]?[0-9]|2[0-3])$/, "Hora inválida"),
  newTaskStartMinute: yup
    .string()
    .required("Minuto de Início é obrigatório")
    .matches(/^[0-5]?[0-9]$/, "Minuto inválido"),
  newTaskEndHour: yup
    .string()
    .required("Hora de Fim é obrigatória")
    .matches(/^([01]?[0-9]|2[0-3])$/, "Hora inválida")
    .test(
      "is-greater",
      "Hora de Fim deve ser maior que Hora de Início",
      function (value, context) {
        const startHour = parseInt(context.parent.newTaskStartHour, 10);
        const startMinute = parseInt(context.parent.newTaskStartMinute, 10);
        const endHour = parseInt(value, 10);
        const endMinute = parseInt(context.parent.newTaskEndMinute, 10);

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
  newTaskEndMinute: yup
    .string()
    .required("Minuto de Fim é obrigatório")
    .matches(/^[0-5]?[0-9]$/, "Minuto inválido"),
});

export const Header = () => {
  const dispatch = useDispatch();

  const {
    data: tasks,
    dateCurrent,
    groupIdCurrent,
  } = useSelector(selectorTasks);

  const { groups } = useSelector(selectorGroups);

  const tasksGroup = tasks
    .filter((item) => isSameDay(item.date, dateCurrent))
    .filter((item) => item.groupId == groupIdCurrent);

  const { title: titleGroup } = groups.find(
    (item) => item.id == groupIdCurrent
  );

  const tasksPending = tasksGroup.filter((item) => !item.done);
  const tasksDone = tasksGroup.filter((item) => item.done);

  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onClose = () => setIsOpen(false);

  const onSubmit = (data: FormData) => {
    const {
      newTaskStartHour,
      newTaskStartMinute,
      newTaskEndHour,
      newTaskEndMinute,
    } = data;
    const startTime = `${newTaskStartHour}:${newTaskStartMinute}`;
    const endTime = `${newTaskEndHour}:${newTaskEndMinute}`;

    dispatch(
      setNewTask({
        title: data.newTaskTitle,
        time: `${startTime} ~ ${endTime}`,
      })
    );
    setIsOpen(false);
    reset();
  };

  return (
    <div className="py-5 rounded-md">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold ">
          Atividades {titleGroup && ` de ${titleGroup}`}
        </div>
        <Button
          color={"white"}
          variant={"primary"}
          leftIcon={<Plus />}
          onClick={() => setIsOpen(true)}
        >
          Nova Tarefa
        </Button>
      </div>

      <div className="text-gray-500">
        <div className="flex gap-3 items-center mb-2">
          <CalendarCheck size={16} /> {format(dateCurrent, "dd/MM/yyyy")}
        </div>
        <span>{tasksDone.length} Concluídos</span> |{" "}
        <span>{tasksPending.length} Pendentes</span>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adicionar Nova Tarefa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Input
                  placeholder="Título da Tarefa"
                  {...register("newTaskTitle")}
                  isInvalid={!!errors.newTaskTitle}
                  autoFocus
                />

                {errors.newTaskTitle && (
                  <FormError>{errors.newTaskTitle.message}</FormError>
                )}
              </div>
              <div className="mt-4">
                <div>Hora de início</div>

                <div className="flex gap-5 items-center">
                  <div>
                    <Input
                      type="text"
                      placeholder="Hora "
                      {...register("newTaskStartHour")}
                      isInvalid={!!errors.newTaskStartHour}
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <Input
                      type="text"
                      placeholder="Minuto"
                      {...register("newTaskStartMinute")}
                      isInvalid={!!errors.newTaskStartMinute}
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
                      {...register("newTaskEndHour")}
                      isInvalid={!!errors.newTaskEndHour}
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <Input
                      type="text"
                      placeholder="Minuto"
                      {...register("newTaskEndMinute")}
                      isInvalid={!!errors.newTaskEndMinute}
                      maxLength={2}
                    />
                  </div>
                </div>

                <div>
                  {errors.newTaskEndHour && (
                    <FormError>{errors.newTaskEndHour.message}</FormError>
                  )}

                  {errors.newTaskEndMinute && (
                    <FormError>{errors.newTaskEndMinute.message}</FormError>
                  )}

                  {errors.newTaskStartHour && (
                    <FormError>{errors.newTaskStartHour.message}</FormError>
                  )}

                  {errors.newTaskStartMinute && (
                    <FormError>{errors.newTaskStartMinute.message}</FormError>
                  )}
                </div>
              </div>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancelar
            </Button>

            <Button
              leftIcon={<Plus size={16} />}
              variant={"primary"}
              onClick={handleSubmit(onSubmit)}
            >
              Adicionar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
