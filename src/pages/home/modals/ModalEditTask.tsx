import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import * as yup from "yup";
import { ITask, editTask } from "../../../store/reducers/tasks";
import { useDispatch } from "react-redux";
import { FormError } from "@components/FormError";
import { Pencil } from "lucide-react";
import InputMask from "react-input-mask";
import { isAfter, parse } from "date-fns";

interface FormData {
  editTaskTitle: string;
  editTaskStart: string;
  editTaskEnd: string;
}

const schema = yup.object().shape({
  editTaskTitle: yup.string().required("Título da Tarefa é obrigatório"),
  editTaskStart: yup
    .string()
    .test(
      "hour-start-validate",
      "Hora de início inválida.",
      (value: string | undefined) => {
        if (value) {
          return !!value.match(/^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/);
        }

        return true;
      }
    ),
  editTaskEnd: yup
    .string()
    .test(
      "hour-end-validate",
      "Hora fim inválida.",
      (value: string | undefined) => {
        if (value) {
          return !!value.match(/^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/);
        }

        return true;
      }
    )
    .test(
      "is-greater",
      "Hora de finalização deve ser maior que Hora de Início",
      function (value, context) {
        if (value != "" && context.parent.newTaskStart) {
          const startDateTime = parse(
            context.parent.newTaskStart,
            "HH:mm",
            new Date()
          );
          const endDateTime = parse(value as string, "HH:mm", new Date());
          return isAfter(endDateTime, startDateTime);
        }
        return true;
      }
    ),
});

interface ModalEditTaskProps {
  data: ITask;
  show: boolean;
  onClose: () => void;
}

export const ModalEditTask = ({
  data: { id, title, time },
  show,
  onClose,
}: ModalEditTaskProps) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleEditTask = (data: FormData) => {
    dispatch(
      editTask({
        id,
        title: data.editTaskTitle,
        time: `${data.editTaskStart} - ${data.editTaskEnd}`,
      })
    );

    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    if (show) {
      const [startTime, endTime] = time.split(" - ");
      reset({
        editTaskTitle: title,
        editTaskStart: startTime,
        editTaskEnd: endTime,
      });
    }
  }, [title, time, reset, show]);

  return (
    <Modal isOpen={show} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Atualizar Tarefa</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(handleEditTask)}>
            <div className="mb-1">Título</div>
            <div>
              <Input
                placeholder="Tarefa"
                {...register("editTaskTitle")}
                isInvalid={!!errors.editTaskTitle}
              />

              {errors.editTaskTitle && errors.editTaskTitle.message && (
                <FormError>{errors.editTaskTitle.message}</FormError>
              )}
            </div>
            <div className="mt-4 flex gap-5 ">
              <div className=" items-center">
                <div>Hora de início</div>
                <div>
                  <Input
                    type="text"
                    placeholder="hh:mm"
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
                    placeholder="hh:mm"
                    {...register("editTaskEnd")}
                    isInvalid={!!errors.editTaskEnd}
                    as={InputMask}
                    mask="99:99"
                  />
                </div>
              </div>
            </div>

            <div>
              {errors.editTaskStart && errors.editTaskStart.message && (
                <FormError>{errors.editTaskStart.message}</FormError>
              )}

              {errors.editTaskEnd && errors.editTaskEnd.message && (
                <FormError>{errors.editTaskEnd.message}</FormError>
              )}
            </div>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            leftIcon={<Pencil size={16} />}
            onClick={handleSubmit(handleEditTask)}
            variant={"primary"}
          >
            Atualizar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
