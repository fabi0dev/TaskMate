import { Button } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { FC } from "react";

interface HeaderProps {}

export const Header: FC<HeaderProps> = ({}) => {
  return (
    <div className="p-5 w-full flex border bg-white rounded-sm shadow-lg justify-between items-center">
      <div className="font-bold text-xl">Tarefas</div>
      <Button colorScheme="green" leftIcon={<Plus />}>
        Adicionar
      </Button>
    </div>
  );
};
