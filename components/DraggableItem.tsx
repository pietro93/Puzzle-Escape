import React from 'react';
import { useDrag } from 'react-dnd';

interface DraggableItemProps {
  id: string;
  name: string;
  children: React.ReactNode;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, name, children }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'inventory-item',
    item: { id: id, name: name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      {children}
    </div>
  );
};

export default DraggableItem;