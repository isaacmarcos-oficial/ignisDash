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

export function UserCreateModal() {
  const [createUser] = useMutation(CREATE_USER);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const userData: User = {
      name: formData.get("name") as string,
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      accessLevel: formData.get("accessLevel") as string,
    };

    try {
      await createUser({
        variables: {
          createUserObject: userData,
        },
      });
      toast(`Cliente criado com sucesso`, {
        description: `Cliente: ${userData.name}`,
      });
    } catch (error) {
      const errorMessage =
        (error as Error).message || "Ocorreu um erro desconhecido";
      toast(`Erro ao criar o cliente`, {
        description: `Erro: ${errorMessage}`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full space-y-4">
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input
            required
            type="text"
            id="name"
            name="name"
            placeholder="Nome"
          />
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            required
            type="text"
            id="username"
            name="username"
            placeholder="Nome de Usuário"
          />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            required
            type="text"
            id="email"
            name="email"
            placeholder="E-mail do usuário"
          />
        </div>
        <div>
          <Label htmlFor="password">Senha</Label>
          <Input
            required
            type="password"
            id="password"
            name="password"
            placeholder="Senha"
            autoComplete="on"
          />
        </div>
        <div>
          <Label htmlFor="password">Função</Label>
          <Select required name="accessLevel">
            <SelectTrigger className="">
              <SelectValue placeholder="Select a função" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Função</SelectLabel>
                <SelectItem value="user">Usuário</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="vendedor">Vendedor</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
                <SelectItem value="admintrador">Administrador</SelectItem>
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
