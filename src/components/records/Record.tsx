import { Trash, Pencil } from "lucide-react";
import { useState } from "react";
import { RecordItem } from "../../types";
import EditRecordForm from "../forms/EditRecordForm";

interface RecordProps {
  data: RecordItem;
  handleDelete: (id: number) => void;
  handleEdit: (id: number, username: string, password: string) => void;
}

const Record = ({ data, handleDelete, handleEdit }: RecordProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = (username: string, password: string) => {
    handleEdit(data.id, username, password);
    setIsOpen(false);
  };

  const iconStyle = "p-1 hover:bg-secondary-200 dark:hover:bg-dark-100 rounded-md transition-all duration-300";

  return (
    <div className="grid grid-cols-3 border-b border-slate-300 dark:border-neutral-600 px-3 py-1 dark:bg-dark-200 dark:text-light-100">
      <div className="flex gap-4">
        <div className="flex gap-1 items-center">
          <Pencil
            className={iconStyle}
            onClick={() => setIsOpen(true)}
            strokeWidth={1.5}
          />
          <Trash
            className={iconStyle}
            onClick={() => handleDelete(data.id)}
            strokeWidth={1.5}
          />
        </div>
        <div>{data.id}</div>
      </div>
      <div className="text-right">{data.username}</div>
      <div className="text-right">{data.password}</div>

      {isOpen && (
        <EditRecordForm
          isOpen={isOpen}
          initialUsername={data.username}
          initialPassword={data.password}
          handleClose={() => setIsOpen(false)}
          handleSave={handleSave}
        />
      )}
    </div>
  );
};

export default Record;
