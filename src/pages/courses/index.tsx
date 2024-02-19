import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableHeader, TableHead, TableBody, TableRow, TableCell, Table } from "@/components/ui/table";
import { GET_COURSES } from "@/lib/queries/Courses/querieCourses";
import { useQuery } from "@apollo/client";
import { PlusCircle, Search } from "lucide-react";

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    coverImage?: string
}

export function Courses() {
  const { data } = useQuery<{ allCourses: Course[] }>(
    GET_COURSES,{}
  );

  return (
    <div className="p-6 w-full max-w-4xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold ">Cursos</h1>
      
      <div className="flex items-center justify-between">
        <form className="flex items-center gap-2">
          <Input
            name="title"
            placeholder="Título do Curso"
            className="w-auto"
          />
          <Button type="submit" variant="link">
            <Search className="w-4 h-4 mr-2" />
            Buscar curso
          </Button>
        </form>

        <a href="#">
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            Criar Curso
          </Button>
        </a>
      </div>

      <div className="border rounded">
        <Table>
          <TableHeader>
            <TableHead>Título</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Descrição</TableHead>
          </TableHeader>
          <TableBody>
            {data?.allCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.slug}</TableCell>
                <TableCell>{course.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
