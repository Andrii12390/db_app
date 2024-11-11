import { useState } from "react";
import { Shuffle } from "lucide-react";
import FormInput from "./FormInput";
import toast from "react-hot-toast";

interface RecordFormProps {
  generateRecords: (quantity: number) => void;
}

const GenerateRecordForm = ({ generateRecords }: RecordFormProps) => {
  const [quantity, setQuantity] = useState("");

  const handleGenerate = async () => {
    const quantityNumber = Number(quantity);
    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      toast.error("Quantity must be a valid positive number!");
      return;
    }
    generateRecords(quantityNumber);
    setQuantity("");
  };

  return (
    <div className="h-fit bg-light-100 rounded-md p-10 shadow-md flex flex-col gap-y-5 dark:text-white dark:bg-dark-200">
      <FormInput
        placeholder="Quantity"
        Icon={Shuffle}
        value={quantity}
        onChange={setQuantity}
        autoFocus
      />
      <button
        className="text-white w-48 bg-primary-200 rounded-md px-2 py-1 font-semibold hover:bg-primary-100 transition-colors duration-300"
        onClick={handleGenerate}
      >
        Generate rows
      </button>
    </div>
  );
};

export default GenerateRecordForm;
