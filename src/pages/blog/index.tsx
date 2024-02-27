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
import { Search, PlusCircle, X, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_POST, GET_POSTS } from "@/lib/queries/queriePost";
import dayjs from "dayjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/Spinner";

interface Post {
  id: string;
  title: string;
  author: string;
  tags: string;
  coverImage: string;
  content: string;
  note: string;
  status: string;
  dateCreate: string;
}

export function Blog() {
  const { data, loading } = useQuery<{ allPosts: Post[] }>(GET_POSTS, {});
  const width = window.innerWidth;
  const [_selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleEditPost = (postData: Post) => {
    navigate(`/blog/${postData.id}`, { state: { post: postData } });
  };

  const [deletePost] = useMutation<
    { deletePost: string },
    { deletePostId: string }
  >(DELETE_POST);

  const handleDeleteConfirmation = (postId: string) => {
    setSelectedPostId(postId);
  };

  const handleDeletePost = async (id: string) => {
    await deletePost({
      variables: {
        deletePostId: id.toString(),
      },
    });
    toast(`Postagem excluída com sucesso`);
  };
  return (
    <div className="p-6 w-full sm:max-w-[80%] max-w-4xl mx-auto space-y-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold ">Blog</h1>
        <a href="/blog/create">
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            Criar Post
          </Button>
        </a>
      </div>

      {loading ? (
        <div className="flex justify-center w-full">
          <Spinner />
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between">
            <form className="flex items-center gap-2">
              <Input
                name="title"
                placeholder="Título da postagem"
                className=""
              />
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="publicado">Publicado</SelectItem>
                  <SelectItem value="rascunho">Rascunho</SelectItem>
                  <SelectItem value="arquivado">Arquivado</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" variant="link" className="">
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </div>

          <div className="border rounded">
            <Table>
              <TableHeader>
                <TableHead>
                  <p className="sm:hidden">Status</p>
                </TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Data</TableHead>
              </TableHeader>
              <TableBody>
                {data?.allPosts.map((data) => (
                  <TableRow key={data.id}>
                    <TableCell width="10%">
                      {width < 600 ? (
                        <div
                          className={
                            data?.status === "Publicado"
                              ? "bg-teal-600 h-4 w-4 rounded-full"
                              : data?.status === "Rascunho"
                              ? "bg-orange-400 h-4 w-4 rounded-full"
                              : data?.status === "Arquivado"
                              ? "bg-zinc-400 h-4 w-4 rounded-full"
                              : ""
                          }
                        />
                      ) : (
                        <Badge
                          className={
                            data?.status === "Publicado"
                              ? "bg-teal-600"
                              : data?.status === "Rascunho"
                              ? "bg-orange-400"
                              : data?.status === "Arquivado"
                              ? "bg-zinc-400"
                              : ""
                          }
                        >
                          {data?.status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell width="40%">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{data.title}</span>
                        <span className="text-xs text-zinc-500">{data.id}</span>
                      </div>
                    </TableCell>
                    <TableCell width="30%">{data.tags}</TableCell>
                    <TableCell width="10%">
                      {dayjs(data.dateCreate).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell width="20%">
                      <div className="flex gap-1">
                        <a onClick={() => handleEditPost(data)}>
                          <Button size="icon" variant="outline">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </a>
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
                                  console.error("Post ID is undefined");
                                }
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogTitle>Excluir usuário</DialogTitle>
                            <DialogDescription>
                              Tem certeza que deseja excluir o post {data.title}
                              ?
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
                                    await handleDeletePost(data.id);
                                  } else {
                                    console.error("Post ID is undefined");
                                  }
                                }}
                              >
                                Excluir definitivamente
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
