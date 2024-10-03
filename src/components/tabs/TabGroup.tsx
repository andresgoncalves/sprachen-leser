import Tab from "./Tab";

interface TabGroupProps {
  texts: string[];
  currentKey: number;
  onChange: (key: number) => void;
}

export default function TabGroup({
  texts,
  currentKey,
  onChange,
}: TabGroupProps) {
  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${texts.length}, 1fr)` }}
    >
      {texts.map((text, key) => (
        <Tab
          key={key}
          text={text}
          active={key === currentKey}
          onClick={() => onChange(key)}
        />
      ))}
    </div>
  );
}
