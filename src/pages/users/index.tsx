import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, PlusCircle, X } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_USER, GET_USER_BY_NAME } from "@/lib/queries/querieUser";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserCreateModal } from "@/components/Users/userCreateModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import React, { useState } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  accessLevel: string;
}

export function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [_selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data } = useQuery<{ usersByName: User[] }>(GET_USER_BY_NAME, {
    variables: { name: searchTerm },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const totalUsers = data?.usersByName.length ?? 0;
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const onPageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const firstUserIndex = (currentPage - 1) * usersPerPage;
  const lastUserIndex = firstUserIndex + usersPerPage;

  const usersOnCurrentPage =
    data?.usersByName.slice(firstUserIndex, lastUserIndex) ?? [];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const [deleteUser] = useMutation<
    { deleteUser: string },
    { deleteUserId: string }
  >(DELETE_USER);

  const handleDeleteConfirmation = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleDeleteUser = async (id: string) => {
    await deleteUser({
      variables: {
        deleteUserId: id.toString(),
      },
    });
    console.log(`Usuário excluído com sucesso`);
    toast(`Usuário excluído com sucesso`);
  };

  return (
    <div className="p-6 w-full max-w-4xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold ">Usuários</h1>

      <div className="flex items-center justify-between">
        <form className="flex items-center gap-2" onSubmit={handleSearch}>
          <Input
            name="title"
            placeholder="Nome do Usuário"
            className="w-auto"
            value={searchTerm}
            onChange={handleInputChange}
          />
          <Button type="submit" variant="link">
            <Search className="w-4 h-4 mr-2" />
            Buscar usuário
          </Button>
        </form>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Criar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Usuário</DialogTitle>
              <DialogDescription>
                <UserCreateModal />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded">
        <Table>
          <TableHeader>
            <TableHead>Nome</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Função</TableHead>
            <TableHead></TableHead>
          </TableHeader>
          <TableBody>
            {usersOnCurrentPage.map((data) => (
              <TableRow key={data.id}>
                <TableCell width="15%">{data.username}</TableCell>
                <TableCell width="30%">{data.name}</TableCell>
                <TableCell width="30%">{data.email}</TableCell>
                <TableCell width="15%">{data.accessLevel}</TableCell>
                <TableCell width="10%">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className=""
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          if (typeof data.id === "string") {
                            handleDeleteConfirmation(data.id);
                          } else {
                            console.error("Client ID is undefined");
                          }
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Excluir usuário</DialogTitle>
                      <DialogDescription>
                        Tem certeza que deseja excluir {data.name}?
                      </DialogDescription>
                      <DialogFooter>
                        <Button type="button" variant="outline">
                          Cancelar
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={async () => {
                            if (typeof data.id === "string") {
                              await handleDeleteUser(data.id);
                            } else {
                              console.error("Client ID is undefined");
                            }
                          }}
                        >
                          Excluir definitivamente
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination className="justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className={currentPage === 1 ? "pagination-disabled" : ""}
              onClick={(e) => {
                e.preventDefault();
                if (currentPage !== 1) onPageChange(currentPage - 1);
              }}
            />
          </PaginationItem>
          {pageNumbers.map((number) => (
            <PaginationItem key={number}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(number);
                }}
                isActive={currentPage === number}
              >
                {number}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              className={
                currentPage === totalPages ? "pagination-disabled" : ""
              }
              onClick={(e) => {
                e.preventDefault();
                if (currentPage !== totalPages) onPageChange(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
