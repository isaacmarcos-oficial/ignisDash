import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "@/lib/queries/querieUser";
import { User } from "@/types/users";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";

export function UserCreateModal() {
  const [createUser] = useMutation(CREATE_USER);
  const [username, setUsername] = useState('');

  const userSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    username: z.string().min(1, "Username é obrigatório"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    accessLevel: z.enum([
      "Usuário",
      "Editor",
      "Vendedor",
      "Financeiro",
      "Administrador",
    ]),
  });

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\s/g, '');
    setUsername(newValue);
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData: Omit<User, "id"> = {
      name: formData.get("name") as string,
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      accessLevel: formData.get("accessLevel") as string,
    };

    try {
      userSchema.parse(userData);
      await createUser({
        variables: {
          createUserObject: userData,
        },
      });
      toast.success(`Usuário criado com sucesso`, {
        description: `Usuário: ${userData.name}`,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => err.message).join(", ");
        toast.error(`Erro: ${errorMessages}`);
      } else {
        const errorMessage =
          (error as Error).message || "Ocorreu um erro desconhecido";
        toast.error(`Erro ao criar o usuário`, {
          description: `Erro: ${errorMessage}`,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full space-y-4">
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Nome"
          />
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            id="username"
            name="username"
            placeholder="Nome de Usuário"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            
            type="text"
            id="email"
            name="email"
            placeholder="E-mail do usuário"
          />
        </div>
        <div>
          <Label htmlFor="password">Senha</Label>
          <Input
            
            type="password"
            id="password"
            name="password"
            placeholder="Senha"
            autoComplete="on"
          />
        </div>
        <div>
          <Label htmlFor="password">Função</Label>
          <Select  name="accessLevel">
            <SelectTrigger className="">
              <SelectValue placeholder="Select a função" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Função</SelectLabel>
                <SelectItem value="Usuário">Usuário</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
                <SelectItem value="Vendedor">Vendedor</SelectItem>
                <SelectItem value="Financeiro">Financeiro</SelectItem>
                <SelectItem value="Administrador">Administrador</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="flex flex-1 w-full justify-end gap-2">
          <DialogClose>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit">Criar Usuário</Button>
        </DialogFooter>
      </div>
    </form>
  );
}
