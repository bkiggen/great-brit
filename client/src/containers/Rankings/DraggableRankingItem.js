import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Box } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import LockIcon from "@mui/icons-material/Lock";

const ItemType = "RANKING_ITEM";

const DraggableRankingItem = ({ item, index, moveItem, onDrop, disabled = false }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    canDrag: () => !disabled,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    canDrop: () => !disabled,
    hover: (draggedItem) => {
      if (!disabled && draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
    drop: () => {
      // Call onDrop when item is dropped
      if (onDrop && !disabled) {
        onDrop();
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  if (!disabled) {
    drag(drop(ref));
  }

  return (
    <Box
      ref={ref}
      sx={{
        height: "20px",
        width: "300px",
        margin: "0 auto",
        background: disabled ? "#f5f5f5" : isDragging ? "#f0f0f0" : "white",
        marginBottom: "12px",
        boxShadow: isOver
          ? "0px 0px 15px 0px rgba(66, 135, 245, 0.5)"
          : "0px 0px 10px 0px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "24px",
        borderRadius: "4px",
        cursor: disabled ? "not-allowed" : "move",
        opacity: disabled ? 0.6 : isDragging ? 0.5 : 1,
        transition: "box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: disabled
            ? "0px 0px 10px 0px rgba(0,0,0,0.2)"
            : "0px 0px 15px 0px rgba(0,0,0,0.3)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {disabled ? (
          <LockIcon sx={{ color: "#999" }} />
        ) : (
          <DragIndicatorIcon sx={{ color: "#999" }} />
        )}
        <Box sx={{ fontSize: "24px", fontWeight: 700 }}>
          {index + 1}: {item.star?.firstName} {item.star?.lastName}
        </Box>
      </Box>
    </Box>
  );
};

export default DraggableRankingItem;
