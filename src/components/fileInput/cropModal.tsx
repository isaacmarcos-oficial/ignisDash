import { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button } from "../ui/button";

interface CropModalProps {
  image: string;
  show: boolean;
  onClose: () => void;
  onCrop: (croppedImageUrl: string) => void;
}

export function CropModal({ image, show, onClose, onCrop }: CropModalProps) {
  const cropperRef = useRef<HTMLImageElement>(null);

  const handleCrop = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    cropper.getCroppedCanvas().toBlob((blob: Blob) => {
      const url = URL.createObjectURL(blob);
      onCrop(url);
      onClose();
    });
  };

  if (!show) return null;

  return (
    <div className="fixed rounded-lg top-1/2 left-1/2 -translate-x-1/2 gap-2 -translate-y-1/2 bg-zinc-50 p-5 z-50 flex flex-col items-center shadow-lg">
      <Cropper
        src={image}
        style={{ height: "50%", width: "100%" }}
        aspectRatio={3 / 1}
        guides={false}
        ref={cropperRef}
      />
      <div className="flex w-full justify-between">
        <Button type="button" onClick={onClose} variant="outline">
          Cancelar
        </Button>
        <Button type="button" onClick={handleCrop}>
          Cortar
        </Button>
      </div>
    </div>
  );
}
