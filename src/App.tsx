import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import FileDisplay from "./components/views/FileDisplay";
import FileLoader from "./components/views/FileLoader";

const queryClient = new QueryClient();

export default function App() {
  const [file, setFile] = React.useState<File | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      {file ? <FileDisplay file={file} /> : <FileLoader onLoad={setFile} />}
    </QueryClientProvider>
  );
}
