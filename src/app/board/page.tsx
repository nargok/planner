"use client";
import { use, useEffect, useState } from "react";
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

const initialColumns = {
  todo: [
    { id: 1, name: "dnd-kit example 1" },
    { id: 2, name: "dnd-kit example 2" },
  ],
  inProgress: [
    { id: 3, name: "dnd-kit example 3" },
    { id: 4, name: "dnd-kit example 4" },
  ],
  done: [
    { id: 5, name: "dnd-kit example 5" },
    { id: 6, name: "dnd-kit example 6" },
  ],
};

const BoardHome = () => {
  const [isClient, setIsClient] = useState(false);
  const [columns, setColumns] = useState(initialColumns);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeColumn = Object.keys(columns).find((column) =>
      columns[column].some((item) => item.id === active.id),
    );
    const overColumn = Object.keys(columns).find((column) =>
      columns[column].some((item) => item.id === over.id),
    );

    // カラムを移動しないとき
    if (activeColumn && overColumn && activeColumn === overColumn) {
      const oldIndex = columns[activeColumn].findIndex(
        (item) => item.id === active.id,
      );
      const newIndex = columns[activeColumn].findIndex(
        (item) => item.id === over.id,
      );

      setColumns({
        ...columns,
        [activeColumn]: arrayMove(columns[activeColumn], oldIndex, newIndex),
      });
    }

    // カラムを移動するとき
    if (activeColumn && overColumn && activeColumn !== overColumn) {
      const activeIndex = columns[activeColumn].findIndex(
        (item) => item.id === active.id,
      );
      const overIndex = columns[overColumn].findIndex(
        (item) => item.id === over.id,
      );

      const newColumn = [...columns[activeColumn]];
      const [movedItem] = newColumn.splice(activeIndex, 1);

      const newOverColumn = [...columns[overColumn]];
      newOverColumn.splice(overIndex, 0, movedItem);

      setColumns({
        ...columns,
        [activeColumn]: newColumn,
        [overColumn]: newOverColumn,
      });
    }
  };

  /**
   * TODO
   *  - カラム移動するときに明細が消える
   *  - すべてのItemを移動するとカラムにItemをDragできない
   */
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div style={{ display: "flex", gap: "16px", width: "600px" }}>
        {Object.keys(columns).map((column) => (
          <SortableContext
            key={column}
            items={columns[column]}
            strategy={verticalListSortingStrategy}
          >
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px",
              }}
            >
              <h3>{column}</h3>
              <ul style={style}>
                {columns[column].map((item) => (
                  <SortableItem key={item.id} item={item} />
                ))}
              </ul>
            </div>
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
};

export default BoardHome;
