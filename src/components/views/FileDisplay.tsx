import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  useDebounceValue,
  useEventListener,
  useResizeObserver,
} from "usehooks-ts";
import TranslationSheet from "../translation/TranslationSheet";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface FileDisplayProps {
  file: File;
}

export default function FileDisplay({ file }: FileDisplayProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const documentRef = React.useRef<Document>(document);

  const [documentProxy, setDocumentProxy] =
    React.useState<pdfjs.PDFDocumentProxy | null>(null);

  const [selectedText, setSelectedText] = useDebounceValue<string | null>(
    null,
    100,
  );

  const { width: containerWidth = 0 } = useResizeObserver({
    ref: containerRef,
    box: "border-box",
  });

  useEventListener(
    "selectionchange",
    () => {
      const selection = getSelection();
      const selectedText = selection?.toString().trim();
      if (selection && selectedText) {
        setSelectedText(selectedText);
      }
    },
    documentRef,
  );

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-screen-sm">
      <Document file={file} onLoadSuccess={setDocumentProxy}>
        {Array.from(Array(documentProxy?.numPages), (_, index) => (
          <Page key={index} pageNumber={index + 1} width={containerWidth} />
        ))}
      </Document>
      {selectedText ? (
        <TranslationSheet
          className="fixed bottom-0 left-0 z-10 w-full"
          search={selectedText}
          languages="dees"
        />
      ) : null}
    </div>
  );
}
