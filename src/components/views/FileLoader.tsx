import React from "react";
import { cn } from "../../utils/cn";

interface FileLoaderProps {
  onLoad: (file: File) => void;
}

export default function FileLoader({ onLoad }: FileLoaderProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files?.length) {
      onLoad(files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files?.length) {
      onLoad(files[0]);
    }
  };

  const [isDragOver, setDragOver] = React.useState<boolean>(false);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8">
      <label
        className={cn(
          "cursor-pointer flex-col items-center gap-8 rounded-2xl border-2 border-orange-500 bg-orange-400 px-8 py-6 text-center text-white hover:scale-105",
          isDragOver && "scale-105",
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <img src="icon.svg" className="h-64 w-64" />
        <div className="text-2xl font-medium">Selecciona un documento</div>
        <input
          className="hidden"
          type="file"
          name="file"
          accept=".pdf"
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
