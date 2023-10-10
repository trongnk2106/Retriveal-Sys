import React, { useState } from "react";
import Modal from "react-modal";

const ModalImage = ({ image , openModal}) => {
  const [isOpen, setIsOpen] = useState(openModal);


  console.log(isOpen)
  const handleClose = () => {
    setIsOpen(false);
  };
  console.log('in modal')
  return (
    
  );
};

export default ModalImage;