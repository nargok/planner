import { type Item } from "@/app/types/item";
import { useSortable } from "@dnd-kit/sortable";
import { type FC } from "react";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  item: Item;
};

const SortableItem: FC<Props> = ({ item }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    border: "1px solid #ddd",
    padding: "0.5rem 1rem",
    marginBottom: "0.5rem",
    backgroundColor: "#fafafa",
    cursor: "move",
    listStyle: "none",
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {item.name}
    </div>
  );
};

export default SortableItem;
