import { type Item } from "@/app/types/item";
import { useSortable } from "@dnd-kit/sortable";
import { type FC } from "react";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  item: Item;
  isLast?: boolean;
  showDropLine?: boolean;
};

const SortableItem: FC<Props> = ({ item, isLast, showDropLine }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    over,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverCurrent = over?.id === item.id;

  return (
    <div className="relative">
      <div
        ref={setNodeRef}
        style={style}
        className={`ease mb-2 cursor-move list-none rounded border border-gray-300 bg-gray-100 p-2 ${isDragging ? "bg-gray-200" : ""} ${isOverCurrent ? "border-b-2 border-blue-500" : ""}`}
        {...attributes}
        {...listeners}
      >
        {item.name}
      </div>
      {showDropLine && !isLast && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 translate-y-1 transform bg-blue-500" />
      )}
    </div>
  );
};

export default SortableItem;
