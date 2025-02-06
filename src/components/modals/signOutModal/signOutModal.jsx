import React from "react";
import { Modal, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { signOut } from "aws-amplify/auth";

const SignOutModal = ({ isVisible, onCancel }) => {
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }

  return (
    <Modal
      title="Sign Out"
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key="signOut" type="primary" danger onClick={handleSignOut}>
          Sign Out
        </Button>,
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
      ]}
    >
      <p>Are you sure you want to dismiss this session?</p>
    </Modal>
  );
};

export default SignOutModal;
