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
import InputMask from "react-input-mask";

interface FormData {
  newTaskTitle: string;
  newTaskStart: string; // Combine hora e minuto em um único campo
  newTaskEnd: string; // Combine hora e minuto em um único campo
}

const schema = yup.object().shape({
  newTaskTitle: yup.string().required("Título da Tarefa é obrigatório"),
  newTaskStart: yup
    .string()
    .required("Hora de Início é obrigatória")
    .matches(/^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/, "Formato de Hora inválido"),
  newTaskEnd: yup
    .string()
    .required("Hora de Fim é obrigatória")
    .matches(/^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/, "Formato de Hora inválido")
    .test(
      "is-greater",
      "Hora de Fim deve ser maior que Hora de Início",
      function (value, context) {
        const startDateTime = parse(
          context.parent.newTaskStart,
          "HH:mm",
          new Date()
        );
        const endDateTime = parse(value, "HH:mm", new Date());

        return isAfter(endDateTime, startDateTime);
      }
    ),
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

  const titleGroup = groups.find((item) => item.id == groupIdCurrent)?.title;

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
    dispatch(
      setNewTask({
        title: data.newTaskTitle,
        time: `${data.newTaskStart} ~ ${data.newTaskEnd}`,
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
              <div className="flex mt-4 gap-5 ">
                <div className="items-center">
                  <div>Hora de início</div>
                  <div>
                    <Input
                      type="text"
                      placeholder="Horas"
                      {...register("newTaskStart")}
                      isInvalid={!!errors.newTaskStart}
                    />
                  </div>
                </div>

                <div className="items-center">
                  <div>Hora de Finalização</div>
                  <div>
                    <Input
                      type="text"
                      placeholder="Horas"
                      {...register("newTaskEnd")}
                      isInvalid={!!errors.newTaskEnd}
                      as={InputMask}
                      mask="99:99"
                    />
                  </div>
                </div>
              </div>
              <div>
                {errors.newTaskStart && (
                  <FormError>{errors.newTaskStart.message}</FormError>
                )}

                {errors.newTaskEnd && (
                  <FormError>{errors.newTaskEnd.message}</FormError>
                )}
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
