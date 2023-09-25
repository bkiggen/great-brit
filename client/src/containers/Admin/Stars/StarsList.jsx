import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchStars,
  deleteStar, // Import the deleteStar action
  sendHomeStar, // Import the sendHomeStar action
} from "store/starsSlice";
import { starsSelector } from "store/starsSlice";
import { tableStyles } from "./styles";

const StarsList = () => {
  const dispatch = useDispatch();
  const stars = useSelector(starsSelector);

  useEffect(() => {
    dispatch(fetchStars());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Define a function to handle deleting a star
  const handleDeleteStar = (id) => {
    dispatch(deleteStar(id));
  };

  // Define a function to handle sending a star home
  const handleSendHomeStar = (id) => {
    dispatch(sendHomeStar(id));
  };

  return (
    <div className={`betTable ${tableStyles}`}>
      {stars?.map((star) => {
        return (
          <div key={star.id} className="betCard">
            <div>{star.firstName}</div>
            <div>{star.lastName}</div>
            <div>{star.bio}</div>
            <div>{star.sentHome ? "Sent Home" : "Active"}</div>
            <div>
              <button onClick={() => handleDeleteStar(star._id)}>Delete</button>
              <button onClick={() => handleSendHomeStar(star._id)}>
                {star.sentHome ? "Reactivate" : "Send Home"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StarsList;
