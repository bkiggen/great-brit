import React, { useState, useEffect } from "react";
// import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchRankings,
  postRankings,
  rankingsSelector,
} from "store/rankingsSlice";
import { getItemStyle, getListStyle } from "./styles";

// fake data generator
const formatItems = (items) => {
  return items.map((item) => ({
    id: item._id,
    content: `${item.starId.firstName} ${item.starId.lastName}`,
    payload: item,
  }));
};

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const Rankings = () => {
  const dispatch = useDispatch();
  const rankings = useSelector(rankingsSelector);

  const [state, setState] = useState({
    items: [],
  });

  useEffect(() => {
    dispatch(fetchRankings());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (rankings) {
      setState({
        items: formatItems(rankings),
      });
    }
  }, [rankings]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (submittedItems) => {
    const out = submittedItems.map((si, idx) => {
      return { ...si.payload, rank: idx + 1 };
    });
    dispatch(postRankings(out));
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      state.items,
      result.source.index,
      result.destination.index
    );

    setState({
      items,
    });

    handleSubmit(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {state.items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    {index + 1}: {item.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Rankings;
