import { Editor } from "@/components/Editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { FileInput } from "./fileInput";

export function PostCreate() {
  const [formData, setFormData] = useState({
    title: "",
    tags: "",
    coverImage: null as File | null,
    author: "",
    notes: "",
    content: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCoverImageChange = (file: File | null) => {
    setFormData((prevState) => ({
      ...prevState,
      coverImage: file,
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prevState) => ({
      ...prevState,
      content: content,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="p-6 w-full lg:max-w-4xl md:max-w-2xl mx-auto space-y-4">
      <div className="flex gap-3">
        <a href="/blog">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </a>
        <h1 className="text-3xl font-bold ">Criar Post</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label>Título</Label>
            <Input
              required
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Autor</Label>
            <Input
              required
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Tags</Label>
            <Input
              required
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-full">
            <Label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
              Imagem de Capa
            </Label>
            <FileInput onChange={handleCoverImageChange} />
          </div>

          <div>
            <Label>Conteúdo da postagem</Label>
            <div className="border mt-[-8] p-8 rounded gap-4">
              <Editor onContentChange={handleContentChange} />
            </div>
          </div>
          <div>
            <Label>Notas</Label>
            <Input
              type="notes"
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <Button type="submit">Criar Postagem</Button>
        </div>
      </form>
    </div>
  );
}
