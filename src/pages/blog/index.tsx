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

const dataFake = [
  {
    status: "Rascunho",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    date: "07/02/2024",
  },
  {
    status: "Publicado",
    title: "Cras placerat ipsum vitae nunc rutrum consequat.",
    date: "06/02/2024",
  },
  {
    status: "Publicado",
    title: "Quisque quis ante a risus lobortis gravida.",
    date: "05/02/2024",
  },
];

export function Blog() {
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
            <TableHead className="w-[150px]">Data</TableHead>
          </TableHeader>
          <TableBody>
            {dataFake.map((dataFake) => (
              <TableRow>
                <TableCell>
                  <Badge
                    className={
                      dataFake.status === "Publicado"
                        ? "bg-teal-600"
                        : "bg-orange-400"
                    }
                  >
                    {dataFake.status}
                  </Badge>
                </TableCell>
                <TableCell>{dataFake.title}</TableCell>
                <TableCell>{dataFake.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
