import React from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import { useScrollLock } from "usehooks-ts";
import {
  TranslationCategory,
  TTranslationCategory,
  TTranslationLanguages,
  useTranslations,
} from "../../services/translation";
import { cn } from "../../utils/cn";
import TabGroup from "../tabs/TabGroup";
import TranslationTable from "./TranslationTable";

interface TranslationSheetProps {
  search: string;
  languages?: TTranslationLanguages;
  className?: string;
}

export default function TranslationSheet({
  search,
  languages,
  className,
}: TranslationSheetProps) {
  const scrollLock = useScrollLock({ autoLock: false });
  const translations = useTranslations({ search, languages });

  const [currentKey, setCurrentKey] = React.useState<number>(0);
  const [isOpen, setOpen] = React.useState<boolean>(false);
  const [contentHeight, setContentHeight] = React.useState<number>(0);

  const contentRef = React.useRef<HTMLDivElement>(null);
  const sheetRef = React.useRef<SheetRef>(null);

  const categories = React.useMemo(
    () =>
      (
        Object.entries(TranslationCategory) as [
          TTranslationCategory,
          TranslationCategory,
        ][]
      )
        .filter(
          ([category]) =>
            translations.isSuccess && translations.data[category].length,
        )
        .map(([category, text]) => ({ category, text })),
    [translations.isSuccess, translations.data],
  );

  React.useEffect(() => {
    if (isOpen && !scrollLock.isLocked) {
      scrollLock.lock();
    } else if (!isOpen && scrollLock.isLocked) {
      scrollLock.unlock();
    }
  }, [scrollLock, isOpen]);

  React.useEffect(() => {
    setCurrentKey(0);
    setContentHeight(contentRef.current?.getBoundingClientRect().height ?? 0);
    setOpen(translations.isFetched);
  }, [translations.isFetched]);

  React.useEffect(() => {
    if (translations.isFetched) {
      sheetRef.current?.snapTo(isOpen ? 0 : 1);
    }
  }, [isOpen, translations.isFetched]);

  return (
    <Sheet
      isOpen={true}
      disableScrollLocking={true}
      snapPoints={[Math.max(contentHeight, 40), 40]}
      onSnap={(index) => setOpen(index === 0)}
      onClose={() => {}}
      ref={sheetRef}
    >
      <Sheet.Container
        className={cn(
          "flex flex-col rounded-t-xl border-t bg-white",
          className,
        )}
      >
        <Sheet.Header className="flex flex-col items-center">
          <div
            className="cursor-pointer p-4"
            onClick={() => setOpen((isOpen) => !isOpen)}
          >
            <div className="h-1.5 w-8 rounded-full bg-gray-500" />
          </div>
        </Sheet.Header>
        <Sheet.Content>
          <div ref={contentRef}>
            {categories[currentKey] ? (
              <>
                <TabGroup
                  texts={categories.map((item) => item.text)}
                  currentKey={currentKey}
                  onChange={setCurrentKey}
                />
                <div className="h-[50vh] overflow-y-auto px-2 py-4">
                  {translations.isSuccess ? (
                    <TranslationTable
                      title={categories[currentKey].text}
                      translations={
                        translations.data[categories[currentKey].category]
                      }
                    />
                  ) : null}
                </div>
              </>
            ) : (
              <div className="px-4 py-16 text-center font-semibold">
                {search
                  ? `No se encontraron resultados para "${search.slice(50)[0]}"`
                  : "Selecciona una palabra para traducir"}
              </div>
            )}
          </div>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
