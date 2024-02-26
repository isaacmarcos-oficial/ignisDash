import { useEffect, useState } from "react";
import { RxImage } from "react-icons/rx";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RotateCw } from "lucide-react";

interface FileInputProps {
  onChange: (file: File | null, url?: string) => void;
}

export function FileInput({ onChange, initialImageUrl }: FileInputProps & {initialImageUrl?: string }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl ?? null);
  const [_file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const croppedFile = await cropImage(file);
      setIsUploading(true)
      const url = await uploadToCloudinary(croppedFile);
      setPreviewUrl(url);
      onChange(file, url);
      setIsUploading(false)
    }
  };

  useEffect(() => {
    if (initialImageUrl) {
      setPreviewUrl(initialImageUrl);
    }
  }, [initialImageUrl])

  const cropImage = (file: File) => {
    return new Promise<File>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;
          canvas.width = 1350; // Defina a largura desejada do recorte
          canvas.height = 450; // Defina a altura desejada do recorte
          ctx.drawImage(img, 0, 0, 1350, 450, 0, 0, 1350, 450); // Recorte a imagem
          canvas.toBlob((blob) => {
            const croppedFile = new File([blob!], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(croppedFile);
          }, file.type);
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadAndSetPreview = async (file: File) => {
    setIsUploading(true); // Ativar o spinner enquanto a imagem é enviada

    const url = await uploadToCloudinary(file);
    setPreviewUrl(url);
    onChange(file, url);

    setIsUploading(false); // Desativar o spinner após o envio da imagem
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dugegvq2j/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      console.log(data.asset_id)
      return data.secure_url;
      
    } catch (error) {
      console.error("Erro ao fazer upload da imagem", error);
      return null;
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const selectedFile =  event.dataTransfer.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      uploadAndSetPreview(selectedFile)
    }
  };


  return (
    <div
      className={`mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 text-center ${
        isDragging ? "border-indigo-600 bg-indigo-50" : ""
      }`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col justify-center text-center ">
        {isUploading ? (
          <div className="flex mx-auto w-full text-center">
            <RotateCw className="h-4 w-4 mx-auto animate-spin text-center" />
          </div>
        ) : previewUrl ? (
          <img src={previewUrl} alt="Preview" className="mx-auto h-32 w-full object-cover" />
        ) : (
          <RxImage className="mx-auto h-12 w-12 text-gray-300" />
        )}
        <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600  ">
          <Label
            htmlFor="file-upload"
            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
          >
            <span>Clique aqui</span>
            <Input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              onChange={handleImageChange}
            />
          </Label>
          <p className="pl-1 mt-[-5px]">ou arraste e solte a imagem</p>
        </div>
        <p className="text-xs text-center leading-5 text-gray-600">PNG, JPG, GIF até 10MB</p>
      </div>
    </div>
  );
}