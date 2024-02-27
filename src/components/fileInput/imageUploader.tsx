import { useCallback, useEffect, useState } from "react";
import { CropModal } from "./cropModal";
import { Input } from "../ui/input";
import { RxImage } from "react-icons/rx";
import { Label } from "../ui/label";
import { toast } from "sonner";

interface FileInputProps {
  onChange: (file: File | null, url?: string) => void;
  initialImageUrl?: string;
}

export function ImageUploader({ onChange, initialImageUrl }: FileInputProps) {
  const [image, setImage] = useState<string>("");
  const [_file, setFile] = useState<File | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(
    initialImageUrl ?? null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const droppedFile = event.dataTransfer.files[0];
      processFile(droppedFile);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      processFile(selectedFile);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setIsModalOpen(true);
      setFile(file);
    };
    reader.readAsDataURL(file);
  };

  const onCrop = async (url: string) => {
    setCroppedImageUrl(url);
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });
        uploadToCloudinary(file).then((uploadedImageUrl) => {
          setIsModalOpen(false);
          onChange(null, uploadedImageUrl);
        });
      })
      .catch((error) =>
        toast.error("Erro ao converter a imagem cortada em File", error)
      );
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (initialImageUrl) {
      setCroppedImageUrl(initialImageUrl);
    }
  }, [initialImageUrl])

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
      return data.secure_url;
    } catch (error) {
        toast.error("Erro ao fazer upload da imagem");
      return null;
    }
  };

  return (
    <div>
      <div
        className={`flex min-h-40 justify-center border border-dashed rounded-lg p-4 text-center w-full border-gray-300 items-center ${
          isDragging ? "border-indigo-600 bg-indigo-50" : ""
        }`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={onDrop}
      >
        <div className="flex flex-col justify-center text-sm leading-6 text-gray-600 gap-2">
          {croppedImageUrl ? (
            <img src={croppedImageUrl} alt="Cropped" />
          ) : (
            <RxImage className="mx-auto h-12 w-12 text-gray-300" />
          )}

          <div className="flex justify-center text-sm leading-6 text-gray-600 items-center ">
            <Label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
            >
              <span>Clique aqui</span>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </Label>
            <p className="pl-1">ou arraste para cá</p>
          </div>
          <p className="text-xs mt-[-10px] text-center leading-5 text-gray-400">
            PNG, JPG, GIF até 10MB
          </p>
        </div>
      </div>
      <CropModal
        image={image}
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCrop={onCrop}
      />
    </div>
  );
}
