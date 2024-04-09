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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputMask from "react-input-mask";
import { useDispatch } from "react-redux";
import { setNewTask } from "../../../store/reducers/tasks";
import { FormError } from "@components/FormError";
import { isAfter, parse } from "date-fns";
import { useEffect } from "react";

interface FormData {
  newTaskTitle: string;
  newTaskStart: string;
  newTaskEnd: string;
}

interface ModalAddTaskProps {
  isOpen: boolean;
  onClose: () => void;
  time?: string;
}

const schema = yup.object().shape({
  newTaskTitle: yup.string().required("Título da Tarefa é obrigatório"),
  newTaskStart: yup
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
  newTaskEnd: yup
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
        if (value != "") {
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

export const ModalAddTask = ({ isOpen, onClose, time }: ModalAddTaskProps) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    dispatch(
      setNewTask({
        title: data.newTaskTitle,
        time:
          data.newTaskStart && data.newTaskEnd
            ? `${data.newTaskStart} - ${data.newTaskEnd}`
            : "",
      })
    );
    onClose();
    reset();
  };

  useEffect(() => {
    if (time) {
      reset({
        newTaskStart: time.split("-")[0],
        newTaskEnd: time.split("-")[1],
      });
    }
  }, [time, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Nova Tarefa</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-1">Título</div>
            <div>
              <Input
                placeholder="Tarefa"
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
                <div className="mb-1">Hora de início</div>
                <div>
                  <Input
                    type="text"
                    placeholder="hh:mm"
                    {...register("newTaskStart")}
                    isInvalid={!!errors.newTaskStart}
                    as={InputMask}
                    mask="99:99"
                  />
                </div>
              </div>

              <div className="items-center">
                <div className="mb-1">Hora de Finalização</div>
                <div>
                  <Input
                    type="text"
                    placeholder="hh:mm"
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
  );
};
