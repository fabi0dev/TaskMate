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
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { selectorTasks, setNewTask } from "../../store/reducers/tasks";
import { FormError } from "@components/FormError";

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
        const endHour = parseInt(value, 10);
        return endHour > startHour;
      }
    ),
  newTaskEndMinute: yup
    .string()
    .required("Minuto de Fim é obrigatório")
    .matches(/^[0-5]?[0-9]$/, "Minuto inválido"),
});

export const Header = () => {
  const dispatch = useDispatch();

  const { data: tasks } = useSelector(selectorTasks);

  const tasksPending = tasks.filter((item) => !item.done);
  const tasksDone = tasks.filter((item) => item.done);

  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
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
        id: Math.random().toString(36).substring(7),
        title: data.newTaskTitle,
        time: `${startTime} ~ ${endTime}`,
        done: false,
      })
    );
    setIsOpen(false);
  };

  return (
    <div className="py-5 rounded-md">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold ">Atividades</div>
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
                      placeholder="Hora de Início"
                      {...register("newTaskStartHour")}
                      isInvalid={!!errors.newTaskStartHour}
                      maxLength={2}
                    />
                    {errors.newTaskStartHour && (
                      <FormError>{errors.newTaskStartHour.message}</FormError>
                    )}
                  </div>
                  <div>
                    <Input
                      type="text"
                      placeholder="Minuto de Início"
                      {...register("newTaskStartMinute")}
                      isInvalid={!!errors.newTaskStartMinute}
                      maxLength={2}
                    />
                    {errors.newTaskStartMinute && (
                      <FormError>{errors.newTaskStartMinute.message}</FormError>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <div>Hora de Finalização</div>

                <div className="flex gap-5 items-center">
                  <Input
                    type="text"
                    placeholder="Hora de Fim"
                    {...register("newTaskEndHour")}
                    isInvalid={!!errors.newTaskEndHour}
                    maxLength={2}
                  />
                  <Input
                    type="text"
                    placeholder="Minuto de Fim"
                    {...register("newTaskEndMinute")}
                    isInvalid={!!errors.newTaskEndMinute}
                    maxLength={2}
                  />
                </div>
              </div>
              <div className="text-red-500 text-sm">
                {errors.newTaskEndHour && (
                  <FormError>{errors.newTaskEndHour.message}</FormError>
                )}
                {errors.newTaskEndMinute && (
                  <FormError>{errors.newTaskEndMinute.message}</FormError>
                )}
              </div>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              leftIcon={<Plus />}
              variant={"primary"}
              mr={3}
              onClick={handleSubmit(onSubmit)}
            >
              Adicionar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
