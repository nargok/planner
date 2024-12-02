"use client";
import SortableItem from "@/app/_components/board/SortableItem";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

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
  const [activeId, setActiveId] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragOver = (event: DragEndEvent) => {
    if (event.over) {
      setDropTarget(event.over.id as number);
    } else {
      setDropTarget(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDropTarget(null);

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
   *  - Dragするカラムの枠線強調がいらない
   */
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
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
              <div className="space-y-2">
                {columns[column].map((item, index) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    isLast={index === columns[column].length - 1}
                    showDropLine={
                      dropTarget === item.id && activeId !== item.id
                    }
                  />
                ))}
                {columns[column].length === 0 && (
                  <div className="flex h-24 items-center rounded-lg border-2 border-dashed border-gray-300">
                    Drop here
                  </div>
                )}
              </div>
            </div>
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
};

export default BoardHome;
