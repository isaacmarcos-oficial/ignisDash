import { Editor } from "@/components/Editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Post } from "@/types/post";
import { toast } from "sonner";
import { z } from "zod";
import { useLocation } from "react-router-dom";
import { EDIT_POST } from "@/lib/queries/queriePost";
import { useMutation } from "@apollo/client";
import { ImageUploader } from "@/components/fileInput/imageUploader";

export function PostEdit() {
  const location = useLocation();
  const post = location.state?.post as Post;

  const postSchema = z.object({
    title: z.string().min(1, "O título é obrigatório."),
    author: z.string().min(1, "O autor é obrigatório."),
    tags: z.string(),
    coverImage: z.string(),
    content: z.string().min(1, "O autor é obrigatório."),
    note: z.string().optional(),
  });

  const [editPost] = useMutation(EDIT_POST);

  const [values, setValues] = useState({
    id: post.id,
    title: post.title,
    author: post.author,
    tags: post.tags,
    coverImage: post.coverImage,
    content: post.content,
    note: post.note,
    status: post.status,
    dateCreate: post.dateCreate,
  });

  useEffect(() => {
    if (post) {
      setValues({ ...post });
    }
  }, [post]);

  const [coverImageUrl, setCoverImageUrl] = useState(values.coverImage);
  const handleImageChange = (_file: File | null, url?: string) => {
    setValues((prevValues) => ({
      ...prevValues,
      coverImage: url || prevValues.coverImage,
    }));
    setCoverImageUrl(url || values.coverImage);
  };

  const editorContentRef = useRef(values.content);
  const handleContentChange = (initialContent: string) => {
    editorContentRef.current = initialContent;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const postData: Omit<Post, "dateCreate"> = {
      id: values.id,
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      tags: formData.get("tags") as string,
      coverImage: coverImageUrl as string,
      content: editorContentRef.current,
      note: formData.get("note") as string,
      status: "Rascunho",
    };

    try {
      postSchema.parse(postData);

      await editPost({
        variables: {
          editPostObject: {
            ...postData,
          },
        },
      });
      toast.success(`Postagem editada com sucesso`, {
        description: `Postagem: ${postData.title}`,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast(err.message);
        });
      } else {
        console.log(postData);
        const errorMessage =
          (error as Error).message || "ocorreu um erro desconhecido";
        toast.error(`Erro ao editar postagem`, {
          description: `Erro: ${errorMessage}`,
        });
      }
    }
  };

  return (
    <div className="p-6 w-full lg:max-w-4xl md:max-w-2xl mx-auto space-y-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full items-center gap-3">
          <a href="/blog">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </a>
          <h1 className="text-3xl font-bold ">Editar Post</h1>
          <span className="text-xs text-zinc-500">{post.id}</span>
        </div>
        <div>
          {values.status === "Publicado" ? (
            <Button>Despublicar</Button>
          ) : (
            <Button>Publicar</Button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Título */}
          <div>
            <Label>Título</Label>
            <Input
              type="text"
              id="title"
              name="title"
              onChange={handleInputChange}
              value={values.title}
            />
          </div>

          {/* Autor | Tags */}
          <div className="flex flex-1 w-full gap-4">
            <div className="w-full">
              <Label>Autor</Label>
              <Input
                type="text"
                id="author"
                name="author"
                onChange={handleInputChange}
                value={values.author}
              />
            </div>
            <div className="w-full">
              <Label>Tags</Label>
              <Input
                type="text"
                id="tags"
                name="tags"
                onChange={handleInputChange}
                value={values.tags}
              />
            </div>
          </div>

          {/* Imagem de Capa */}
          <div>
            <Label>Imagem de Capa</Label>
              {/* <Input
                type="text"
                id="coverImage"
                name="coverImage"
                onChange={handleInputChange}
                value={values.coverImage}
              /> */}
              {/* <FileInput onChange={handleImageChange}
              initialImageUrl={values.coverImage} /> */}
            <ImageUploader
              onChange={handleImageChange}
              initialImageUrl={values.coverImage}
            />
          </div>

          {/* Conteúdo da postagem */}
          <div>
            <Label>Conteúdo da postagem</Label>
            <div className="border mt-[-8] p-8 rounded gap-4">
              <Editor
                onContentChange={handleContentChange}
                initialContent={values.content}
              />
            </div>
          </div>

          {/* Notas */}
          <div>
            <Label>Notas</Label>
            <Input
              type="text"
              id="note"
              name="note"
              onChange={handleInputChange}
              value={values.note}
            />
          </div>

          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </div>
  );
}
