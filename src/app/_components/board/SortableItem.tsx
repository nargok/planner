import { type Item } from "@/app/types/item";
import { useSortable } from "@dnd-kit/sortable";
import { type FC } from "react";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  item: Item;
};

const SortableItem: FC<Props> = ({ item }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`ease mb-2 cursor-move list-none border border-gray-300 bg-gray-100 p-2 ${isDragging ? "bg-gray-200" : ""}`}
      {...attributes}
      {...listeners}
    >
      {item.name}
    </div>
  );
};

export default SortableItem;
