import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Box, Card, CardContent, Typography } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import LockIcon from "@mui/icons-material/Lock";
import { BakerAvatar } from "components/BakerName";

const ItemType = "RANKING_ITEM";

const DraggableRankingItem = ({
  item,
  index,
  moveItem,
  onDragStart,
  onDragEnd,
  disabled = false,
}) => {
  const ref = useRef(null);
  const rank = index + 1;

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: () => {
      if (onDragStart) onDragStart();
      return { index };
    },
    canDrag: () => !disabled,
    // Fires however the drag ends, so a drop in a gap still saves
    end: () => {
      if (onDragEnd && !disabled) onDragEnd();
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    canDrop: () => !disabled,
    hover: (draggedItem, monitor) => {
      if (disabled || !ref.current) return;
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      // Only swap once the cursor passes the middle of the hovered card.
      // Without this, tall cards swap back and forth while dragging.
      const rect = ref.current.getBoundingClientRect();
      const middleY = (rect.bottom - rect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - rect.top;
      if (dragIndex < hoverIndex && hoverClientY < middleY) return;
      if (dragIndex > hoverIndex && hoverClientY > middleY) return;

      moveItem(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  if (!disabled) {
    drag(drop(ref));
  }

  return (
    <Card
      ref={ref}
      sx={{
        marginBottom: 2,
        background: disabled ? "#f5f5f5" : isDragging ? "#f0f0f0" : "white",
        cursor: disabled ? "not-allowed" : "move",
        opacity: disabled ? 0.7 : isDragging ? 0.5 : 1,
        transform: isDragging ? "rotate(-2deg)" : "none",
        // No transform transition: animating position during a drag
        // makes hit-testing lag behind the cursor
        transition: "background 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
        border: isOver ? "2px solid #197b9f" : "2px solid transparent",
        boxShadow: isOver
          ? "0px 8px 24px rgba(44, 95, 79, 0.3)"
          : "0px 2px 8px rgba(0, 0, 0, 0.08)",
        "&:hover": {
          boxShadow: disabled
            ? "0px 2px 8px rgba(0, 0, 0, 0.08)"
            : "0px 8px 24px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Drag Handle or Lock Icon */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 32,
            }}
          >
            {disabled ? (
              <LockIcon sx={{ color: "#77756f", fontSize: 24 }} />
            ) : (
              <DragIndicatorIcon
                sx={{
                  color: "#77756f",
                  fontSize: 28,
                }}
              />
            )}
          </Box>

          {/* Rank Number */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: 40, sm: 50 },
              height: { xs: 40, sm: 50 },
              borderRadius: "50%",
              background: "rgba(44, 95, 79, 0.1)",
              fontWeight: 700,
              fontSize: { xs: "20px", sm: "24px" },
              color: "#197b9f",
            }}
          >
            {rank}
          </Box>

          {/* Baker Photo + Name */}
          <BakerAvatar star={item.star} size={48} />
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "18px", sm: "22px" },
                color: "#4a4a4a",
              }}
            >
              {item.star?.firstName} {item.star?.lastName}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DraggableRankingItem;
