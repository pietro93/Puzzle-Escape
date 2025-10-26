import React from 'react';
import { useDrop } from 'react-dnd';

interface DropabbleAreaProps {
  id: string;
  onDrop: (item: any) => void;
  children: React.ReactNode;
}


const DroppableArea: React.FC<DropabbleAreaProps> = ({ id, onDrop, children }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'inventory-item',
    drop: (item: any) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{
        backgroundColor: isOver ? 'rgba(0, 255, 0, 0.2)' : 'transparent',
      }}
    >
      {children}
    </div>
  );
};

export default DroppableArea;