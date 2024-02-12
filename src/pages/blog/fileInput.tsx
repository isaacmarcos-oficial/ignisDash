import { ChangeEvent, DragEvent, useState } from "react";
import { RxImage } from "react-icons/rx";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FileInputProps {
  onChange: (file: File | null) => void;
}

export function FileInput({ onChange }: FileInputProps) {
  const [_file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onChange(selectedFile);

      const imageUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(imageUrl);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const selectedFile = event.dataTransfer.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onChange(selectedFile);

      const imageUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(imageUrl);
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
      <div className="text-center ">
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="mx-auto h-32 w-32 object-contain" />
        ) : (
          <RxImage className="mx-auto h-12 w-12 text-gray-300" />
        )}
        <div className="mt-4 flex text-sm leading-6 text-gray-600  ">
          <Label
            htmlFor="file-upload"
            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500 "
          >
            <span>Clique aqui</span>
            <Input
              required
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
            />
          </Label>
          <p className="pl-1 mt-[-5px]">ou arraste e solte a imagem</p>
        </div>
        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF até 10MB</p>
      </div>
    </div>
  );
}
