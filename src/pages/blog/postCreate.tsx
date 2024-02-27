import { Editor } from "@/components/Editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_POST } from "@/lib/queries/queriePost";
import { Post } from "@/types/post";
import { toast } from "sonner";
import { z } from "zod";
import { ImageUploader } from "@/components/fileInput/imageUploader";

export function PostCreate() {
  const [createPost] = useMutation(CREATE_POST);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const editorContentRef = useRef("");

  const currentDate = new Date()
  const formattedDate = currentDate.toISOString().split('T')[0];

  const postSchema = z.object({
    title: z.string().min(1, "O título é obrigatório."),
    author: z.string().min(1, "O autor é obrigatório."),
    tags: z.string(),
    coverImage: z.string(),
    content: z.string().min(1, "O conteúdo é obrigatório."),
    note: z.string().optional(),
  });

  const handleImageChange = (_image: File | null, url?: string) => {
    setCoverImageUrl(url || "");
  };

  const handleContentChange = (content: string) => {
    editorContentRef.current = content;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const postData: Omit< Post, "id"> = {
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      tags: formData.get("tags") as string,
      coverImage: coverImageUrl as string,
      content: editorContentRef.current,
      note: formData.get("note") as string,
      status: "Rascunho",
      dateCreate: formattedDate,
    };

    try {
      postSchema.parse(postData);

      await createPost({
        variables: {
          createPostObject: postData,
        },
      });
      toast(`Postagem criada com sucesso`, {
        description: `Postagem: ${postData.title}`,
      });
      console.log(postData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast(err.message);
        });
      } else {
        const errorMessage =
          (error as Error).message || "ocorreu um erro desconhecido";
        toast(`Erro ao criar postagem`, {
          description: `Erro: ${postData.title}`,
        });
        console.log("Erro ao criar o post:", errorMessage, postData);
      }
    }
  };

  return (
    <div className="p-6 w-full lg:max-w-4xl md:max-w-2xl mx-auto space-y-4">
      <div className="flex w-full gap-3">
        <a href="/blog">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </a>
        <h1 className="text-3xl font-bold ">Criar Post</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Título */}
          <div>
            <Label>Título</Label>
            <Input type="text" id="title" name="title" />
          </div>

          {/* Autor | Tags */}
          <div className="flex flex-1 w-full gap-4">
            <div className="w-full">
              <Label>Autor</Label>
              <Input type="text" id="author" name="author" />
            </div>
            <div className="w-full">
              <Label>Tags</Label>
              <Input type="text" id="tags" name="tags" />
            </div>
          </div>

          {/* Imagem de Capa */}
          <div>
            {/* <FileInput onChange={handleImageChange} /> */}
          </div>

          <div>
            <Label>Imagem de Capa</Label>
            <ImageUploader onChange={handleImageChange} />
          </div>

          {/* Conteúdo da postagem */}
          <div>
            <Label>Conteúdo da postagem</Label>
            <div className="border mt-[-8] p-8 rounded gap-4">
              <Editor onContentChange={handleContentChange} />
            </div>
          </div>

          {/* Notas */}
          <div>
            <Label>Notas</Label>
            <Input type="text" id="note" name="note" />
          </div>

          <Button type="submit">Criar Postagem</Button>
        </div>
      </form>
    </div>
  );
}
