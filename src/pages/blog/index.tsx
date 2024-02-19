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
import { Search, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@apollo/client";
import { GET_POSTS } from "@/lib/queries/queriePost";
import dayjs from "dayjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const { data } = useQuery<{ allPosts: Post[] }>(GET_POSTS, {});

  return (
    <div className="p-6 w-full max-w-4xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold ">Blog</h1>

      <div className="flex items-center justify-between">
        <form className="flex items-center gap-2">
          <Input
            name="title"
            placeholder="Título da postagem"
            className="w-auto"
          />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos" >Todos</SelectItem>
              <SelectItem value="publicado">Publicado</SelectItem>
              <SelectItem value="rascunho">Rascunho</SelectItem>
              <SelectItem value="arquivado">Arquivado</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" variant="link">
            <Search className="w-4 h-4 mr-2" />
            Buscar postagem
          </Button>
        </form>

        <a href="/blog/create">
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            Criar Post
          </Button>
        </a>
      </div>
      <div className="border rounded">
        <Table>
          <TableHeader>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="w-[150px]">Data</TableHead>
          </TableHeader>
          <TableBody>
            {data?.allPosts.map((data) => (
              <TableRow key={data.id}>
                <TableCell>
                  <Badge
                    className={
                      data?.status === "Publicado"
                        ? "bg-teal-600"
                        : "bg-orange-400"
                    }
                  >
                    {data?.status}
                  </Badge>
                </TableCell>
                <TableCell>{data.title}</TableCell>
                <TableCell>{data.tags}</TableCell>
                <TableCell>
                  {dayjs(data.dateCreate).format("DD/MM/YYYY")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
