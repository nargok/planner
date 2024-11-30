"use client";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { type Item } from "@/app/types/item";
import SortableItem from "@/app/_components/board/SortableItem";

const style = {
  padding: "1rem",
};

const BoardHome = () => {
  const [items, setItems] = useState<Array<Item>>([
    { id: 1, name: "dnd-kit example 1" },
    { id: 2, name: "dnd-kit example 2" },
    { id: 3, name: "dnd-kit example 3" },
    { id: 4, name: "dnd-kit example 4" },
    { id: 5, name: "dnd-kit example 5" },
    { id: 6, name: "dnd-kit example 6" },
    { id: 7, name: "dnd-kit example 7" },
    { id: 8, name: "dnd-kit example 8" },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((v) => v.id === active.id);
      const newIndex = items.findIndex((v) => v.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ul style={style}>
          {items.map((item) => (
            <SortableItem key={item.id} item={item} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

export default BoardHome;
