import { Backdrop, Slide } from "@mui/material";

const Modal = ({
  children,
  open,
  direction = "left",
  timeout = 300,
  mountOnEnter = true,
  unmountOnExit = true,
  onClose,
  ...props
}) => {
  return (
    <Backdrop open={open} onClick={onClose}>
      <Slide
        direction={direction}
        in={open}
        timeout={timeout}
        mountOnEnter={mountOnEnter}
        unmountOnExit={unmountOnExit}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </Slide>
    </Backdrop>
  );
};

export default Modal;
