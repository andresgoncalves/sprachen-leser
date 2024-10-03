import { cn } from "../../utils/cn";

interface TabProps {
  text: string;
  active?: boolean;
  onClick?: () => void;
}

export default function Tab({ text, active, onClick }: TabProps) {
  return (
    <button
      className={cn(
        "border-b-2 border-transparent px-4 py-2 font-semibold",
        active && "border-orange-500",
      )}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
