import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  handleClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, handleClose, children }: ModalProps) => {
  return (
    <>
      {isOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 flex justify-center items-center bg-black/30 bg-opacity-50 transition-colors"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`rounded-md shadow-md transition-transform duration-300 ${
              isOpen ? "scale-100 opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={handleClose}
              className="absolute top-1 right-1 p-1 transition-colors duration-300 rounded-md hover:bg-secondary-200 dark:hover:bg-dark-100"
            >
              <X />
            </button>
            <div className="p-10 rounded-md bg-light-100 dark:bg-dark-200">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;