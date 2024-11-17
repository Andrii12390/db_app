
import { UserRound, Lock } from "lucide-react";
import { useState } from "react";
import Modal  from "../ui/Modal";
import FormInput from "./FormInput";

interface EditRecordProps {
  isOpen: boolean;
  initialUsername: string;
  initialPassword: string;
  handleClose: () => void;
  handleSave: (username: string, password: string) => void;
}

const EditRecordForm = ({
  isOpen,
  initialUsername,
  initialPassword,
  handleClose,
  handleSave,
}: EditRecordProps) => {
  const [newUsername, setNewUsername] = useState(initialUsername);
  const [newPassword, setNewPassword] = useState(initialPassword);

  return (
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <div className="flex flex-col gap-5">
        <FormInput
          placeholder="Username"
          Icon={UserRound}
          value={newUsername}
          onChange={setNewUsername}
        />
        <FormInput
          placeholder="Password"
          Icon={Lock}
          value={newPassword}
          onChange={setNewPassword}
        />
        <div className="flex justify-between gap-2">
          <button
            className="w-1/2 px-5 py-1 text-white bg-primary-200 rounded-md font-semibold hover:bg-primary-100 transition-colors duration-2"
            onClick={() => {
              handleSave(newUsername, newPassword);
              handleClose();
            }}
          >
            Save
          </button>
          <button
            className="w-1/2 py-1 border border-primary-200 text-primary-200 font-semibold rounded-md hover:bg-primary-200 hover:text-white transition-colors duration-300"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditRecordForm;
