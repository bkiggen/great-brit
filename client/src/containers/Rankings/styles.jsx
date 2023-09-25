const grid = 8;

export const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  height: "40px",
  display: "flex",
  alignItems: "center",
  fontSize: "24px",
  color: "var(--dark-blue)",
  background: isDragging ? "var(--manilla-dark)" : "var(--manilla)",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.08)",
  ...draggableStyle,
});

export const getListStyle = (isDraggingOver) => ({
  padding: grid,
  margin: "0 auto",
  marginTop: "160px",
  width: "50%",
});
