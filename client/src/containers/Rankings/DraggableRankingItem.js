import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Box, Card, CardContent, Typography } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import LockIcon from "@mui/icons-material/Lock";

const ItemType = "RANKING_ITEM";

const DraggableRankingItem = ({
  item,
  index,
  moveItem,
  onDrop,
  disabled = false,
}) => {
  const ref = useRef(null);
  const rank = index + 1;

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
    <Card
      ref={ref}
      sx={{
        marginBottom: 2,
        background: disabled ? "#f5f5f5" : isDragging ? "#f0f0f0" : "white",
        cursor: disabled ? "not-allowed" : "move",
        opacity: disabled ? 0.7 : isDragging ? 0.5 : 1,
        transform: isDragging ? "rotate(-2deg)" : "none",
        transition: "all 0.2s ease",
        border: isOver ? "2px solid #2c5f4f" : "2px solid transparent",
        boxShadow: isOver
          ? "0px 8px 24px rgba(44, 95, 79, 0.3)"
          : "0px 2px 8px rgba(0, 0, 0, 0.08)",
        "&:hover": {
          transform: disabled ? "none" : "translateY(-2px)",
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
              <LockIcon sx={{ color: "#6b6562", fontSize: 24 }} />
            ) : (
              <DragIndicatorIcon
                sx={{
                  color: "#6b6562",
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
              color: "#2c5f4f",
            }}
          >
            {rank}
          </Box>

          {/* Baker Name */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "18px", sm: "22px" },
                color: "#2d2926",
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
