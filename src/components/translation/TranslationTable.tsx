import React from "react";
import { Translation } from "../../services/translation";

interface TranslationTableProps {
  title: string;
  translations: Translation[];
}

export default function TranslationTable({
  title,
  translations,
}: TranslationTableProps) {
  const [currentAudio, setCurrentAudio] = React.useState<{
    src: string;
    audio: HTMLAudioElement;
  } | null>(null);

  function playAudio(src: string) {
    stopAudio();
    const audio = new Audio(src);
    audio.addEventListener("ended", () => setCurrentAudio(null));
    audio.play();
    setCurrentAudio({ src, audio });
  }

  function stopAudio() {
    currentAudio?.audio.pause();
  }

  return (
    <table className="w-full border-collapse [&_tr>*]:border [&_tr>*]:px-2 [&_tr>*]:py-1">
      <thead>
        <tr>
          <th className="font-semibold" colSpan={4}>
            {title}
          </th>
        </tr>
      </thead>
      <tbody>
        {translations.map(
          ({ source, target, sourceAudio, targetAudio }, key) => (
            <tr key={key} className="text-sm">
              <td className="w-8">
                {sourceAudio && sourceAudio !== currentAudio?.src ? (
                  <button onClick={() => playAudio(sourceAudio)}>{">"}</button>
                ) : null}
                {sourceAudio && sourceAudio === currentAudio?.src ? (
                  <button onClick={() => stopAudio()}>{"-"}</button>
                ) : null}
              </td>
              <td className="w-[calc(50%-16px)]">{source}</td>
              <td className="w-[calc(50%-16px)]">{target}</td>
              <td className="w-8">
                {targetAudio && targetAudio !== currentAudio?.src ? (
                  <button onClick={() => playAudio(targetAudio)}>{">"}</button>
                ) : null}
                {targetAudio && targetAudio === currentAudio?.src ? (
                  <button onClick={() => stopAudio()}>{"-"}</button>
                ) : null}
              </td>
            </tr>
          ),
        )}
      </tbody>
    </table>
  );
}
