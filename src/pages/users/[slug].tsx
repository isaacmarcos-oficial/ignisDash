import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EDIT_USER } from "@/lib/queries/querieUser";
import { useMutation } from "@apollo/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { User } from "@/types/users";
import { z } from "zod";
import { toast } from "sonner";

export function UserInfo() {
  const location = useLocation();
  const user = location.state?.user as User;

  const userSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    username: z.string().min(1, "Username é obrigatório"),
    email: z.string().email("E-mail inválido"),
    accessLevel: z.enum([
      "Usuário",
      "Editor",
      "Vendedor",
      "Financeiro",
      "Administrador",
    ]),
  });

  const [editUser] = useMutation(EDIT_USER);

  const [values, setValues] = useState({
    id: user.id,
    password: user?.password,
    name: user.name,
    username: user.username,
    email: user.email,
    accessLevel: user.accessLevel,
  });

  useEffect(() => {
    if (user) {
      setValues({ ...user });
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "username") {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value.replace(/\s/g, ""), // Remove espaços
      }));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const userData: User = {
      id: values.id,
      password: values.password,
      name: formData.get("name") as string,
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      accessLevel: formData.get("accessLevel") as string,
    };

    try {
      userSchema.parse(userData);

      await editUser({
        variables: {
          editUserObject: {
            ...userData,
          },
        },
      });
      toast.success(`Usuário editado: ${userData.name}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message).join(", ");
        toast.error(`Erro: ${errorMessages}`);
      } else {
        const errorMessage =
          (error as Error).message || "Ocorreu um erro desconhecido";
        toast.error(`Erro ao editar o usuário`, {
          description: `Erro: ${errorMessage}`,
        });
      }
    }
  };

  return (
    <div className="p-6 w-full max-w-4xl mx-auto space-y-4 ">
      <div className="flex w-full gap-3 items-center">
        <a href="/users">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </a>
        <h1 className="text-3xl font-bold ">Editar Usuário</h1>
        <span className="text-xs text-zinc-500">{user.id}</span>
      </div>

      <div>
        <form onSubmit={handleSubmit}>
          <div className="w-full space-y-4">
            <div className="flex gap-4">
              <div className="w-full">
                <Label htmlFor="name">Nome</Label>
                <Input
                  required
                  type="text"
                  id="name"
                  name="name"
                  onChange={handleInputChange}
                  value={values.name}
                />
              </div>
              <div className="w-full">
                <Label htmlFor="username">Username</Label>
                <Input
                  required
                  type="text"
                  id="username"
                  name="username"
                  onChange={handleInputChange}
                  value={values.username}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-full">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  required
                  type="text"
                  id="email"
                  name="email"
                  onChange={handleInputChange}
                  value={values.email}
                />
              </div>
              <div className="w-full">
                <Label htmlFor="accessLevel">Função</Label>
                <Select
                  name="accessLevel"
                  defaultValue={values.accessLevel}
                  onValueChange={() => handleInputChange}
                >
                  <SelectTrigger className="">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Usuário">Usuário</SelectItem>
                      <SelectItem value="Editor">Editor</SelectItem>
                      <SelectItem value="Vendedor">Vendedor</SelectItem>
                      <SelectItem value="Financeiro">Financeiro</SelectItem>
                      <SelectItem value="Administrador">
                        Administrador
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Button variant="link">Enviar redefinição de senha</Button>
            </div>

            <div className="flex gap-1 justify-end ">
              <Button type="submit" variant="outline">
                Salvar
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
