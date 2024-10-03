import { useQuery } from "@tanstack/react-query";

export enum TranslationCategory {
  "subst" = "Sustantivos",
  "verb" = "Verbos",
  "adjadv" = "Adjetivos / Adverbios",
  "praep" = "Preposiciones / Pronombres",
  "phrase" = "Frases",
  "example" = "Ejemplos",
}
export type TTranslationCategory = keyof typeof TranslationCategory;

export enum TranslationLanguages {
  "ende" = "Englisch-Deutsch",
  "esde" = "Spanisch-Deutsch",
  "deen" = "German-English",
  "esen" = "Spanish-English",
  "dees" = "Alemán-Español",
  "enes" = "Inglés-Español",
}
export type TTranslationLanguages = keyof typeof TranslationLanguages;

const translationPaths: Record<TTranslationLanguages, string> = {
  ende: "englisch-deutsch",
  esde: "spanisch-deutsch",
  deen: "german-english",
  esen: "spanish-english",
  dees: "alemán-español",
  enes: "inglés-español",
};

function parseTranslationTable({
  doc,
  category,
  languages,
}: {
  doc: Document;
  category: TTranslationCategory;
  languages: TTranslationLanguages;
}) {
  const source = languages.substring(0, 2);

  const dictentries = doc.querySelectorAll(
    `div[data-dz-name=${category}] tr[data-dz-ui=dictentry]`,
  );

  const translations = Array.from(dictentries, (dictentry): Translation => {
    const firstText = dictentry.querySelector("td:nth-child(5)")!;
    const secondText = dictentry.querySelector("td:nth-child(8)")!;

    const firstAudioId = dictentry
      .querySelector(`td:nth-child(4) i[data-dz-ui="dictentry:playLeoAudio"]`)
      ?.getAttribute("data-dz-rel-audio");
    const secondAudioId = dictentry
      .querySelector(`td:nth-child(7) i[data-dz-ui="dictentry:playLeoAudio"]`)
      ?.getAttribute("data-dz-rel-audio");

    return firstText.getAttribute("lang") === source
      ? {
          source: firstText.textContent!,
          target: secondText.textContent!,
          sourceAudio: firstAudioId
            ? `https://dict.leo.org/media/audio/${firstAudioId}.ogg`
            : undefined,
          targetAudio: secondAudioId
            ? `https://dict.leo.org/media/audio/${secondAudioId}.ogg`
            : undefined,
        }
      : {
          source: secondText.textContent!,
          target: firstText.textContent!,
          sourceAudio: secondAudioId
            ? `https://dict.leo.org/media/audio/${secondAudioId}.ogg`
            : undefined,
          targetAudio: firstAudioId
            ? `https://dict.leo.org/media/audio/${firstAudioId}.ogg`
            : undefined,
        };
  });

  return translations;
}

export interface Translation {
  source: string;
  target: string;
  sourceAudio?: string;
  targetAudio?: string;
}

export async function getTranslations({
  search,
  languages = "esde",
}: {
  search: string;
  languages?: TTranslationLanguages;
}) {
  const url = `/proxy/dict-leo-org/${encodeURIComponent(translationPaths[languages])}/${encodeURIComponent(search)}`;

  if (!document.cookie.split("; ").find((row) => row.startsWith("rewrite"))) {
    document.cookie = "rewrite=desktop; SameSite=None; Secure";
  }

  const res = await fetch(url, {
    credentials: "include",
  });
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, "text/html");

  const categories = (
    Object.keys(TranslationCategory) as TTranslationCategory[]
  ).reduce(
    (prev, category) => ({
      ...prev,
      [category]: parseTranslationTable({
        doc,
        category,
        languages,
      }),
    }),
    {} as Record<TTranslationCategory, Translation[]>,
  );

  return categories;
}

export function useTranslations({
  search,
  languages,
}: {
  search: string;
  languages?: TTranslationLanguages;
}) {
  return useQuery({
    queryKey: ["translations", { search, languages }],
    queryFn: () => getTranslations({ search, languages }),
  });
}
