import { useState } from "react";
import { UserRound, Lock } from "lucide-react";
import FormInput from "./FormInput";
import toast from "react-hot-toast";

interface RecordFormProps {
  addRecord: (username: string, password: string) => void;
}

const AddRecordForm = ({ addRecord }: RecordFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAdd = async () => {
    if (!password || !username) {
      toast.error("You should fill in all fields!");
      return;
    }

    addRecord(username, password);
    setUsername("");
    setPassword("");
  };

  return (
    <div className="h-fit bg-light-100 rounded-md p-10 shadow-md flex flex-col gap-y-5 dark:text-white dark:bg-dark-200">
      <FormInput
        placeholder="Username"
        Icon={UserRound}
        value={username}
        onChange={setUsername}
        autoFocus
      />
      <FormInput
        placeholder="Password"
        Icon={Lock}
        value={password}
        onChange={setPassword}
      />
      <button
        className="text-white w-48 bg-primary-200 rounded-md px-2 py-1 font-semibold hover:bg-primary-100 transition-colors duration-300"
        onClick={handleAdd}
      >
        Add row
      </button>
    </div>
  );
};

export default AddRecordForm;
