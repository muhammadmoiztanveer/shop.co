import React, { useState, useRef } from "react";
import { Modal, Button, Rate } from "antd";
import Draggable from "react-draggable";

const addReviewModal = ({ isVisible, onCancel, onReview, isReviewPosted }) => {
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);

  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  const [rating, setRating] = useState({
    rating: 0,
    comment: "",
  });

  const handleRatingChange = (value) => {
    setRating((prev) => ({ ...prev, rating: value }));
  };

  const handleMessageChange = (e) => {
    setRating((prev) => ({ ...prev, comment: e.target.value }));
  };

  async function sendReviewToParent() {
    console.log("this si the reviewww", rating);
    onReview(rating);
  }

  return (
    <Modal
      title={
        <div
          style={{ width: "100%", cursor: "move" }}
          onMouseOver={() => disabled && setDisabled(false)}
          onMouseOut={() => setDisabled(true)}
          onFocus={() => {}}
          onBlur={() => {}}
        >
          Post a Review
        </div>
      }
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button
          key="cancel"
          color="default"
          variant="outlined"
          onClick={onCancel}
        >
          Cancel
        </Button>,
        <Button color="default" variant="solid" onClick={sendReviewToParent}>
          {isReviewPosted ? "Posting..." : "Post Review"}
        </Button>,
      ]}
      modalRender={(modal) => (
        <Draggable
          disabled={disabled}
          bounds={bounds}
          nodeRef={draggleRef}
          onStart={onStart}
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
      className="hidden md:block"
    >
      <div className="flex flex-col gap-4">
        <Rate
          allowHalf
          defaultValue={rating.rating}
          onChange={handleRatingChange}
        />
        <div className="flex flex-col gap-2">
          <label htmlFor="message">Your Review</label>
          <textarea
            name="message"
            id="message"
            placeholder="Write your words here..."
            className="border rounded-md py-2 px-3"
            value={rating.comment}
            onChange={handleMessageChange}
          />
        </div>
      </div>
    </Modal>
  );
};

export default addReviewModal;
