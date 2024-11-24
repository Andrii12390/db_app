import { useEffect, useState, useRef, useMemo } from "react";
import { RecordItem } from "../../types";
import RecordManager from "../../RecordManager";
import RecordMenu from "../records/RecordMenu";
import toast from "react-hot-toast";
import Header from "./Header";
import AddRecordForm from "../forms/AddRecordForm";
import GenerateRecordForm from "../forms/GenerateRecordsForm";

const AppLayout = () => {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const recordManager = useRef(new RecordManager()).current;
  const [searchText, setSearchText] = useState("");
  const [option, setOption] = useState("Add");

  useEffect(() => {
    const loadData = async () => {
      await recordManager.loadRecords();
      setRecords(recordManager.getRecords());
    };
    loadData();
  }, [recordManager]);

  const addRecord = async (username: string, password: string) => {
    await recordManager.addRecord(username, password);
    await recordManager.loadRecords();
    setRecords(recordManager.getRecords());
  };

  const deleteRecord = async (id: number) => {
    await recordManager.deleteRecord(id);
    setRecords(recordManager.getRecords());
    toast.success("Record successfully deleted");
  };

  const generateRecords = async (quantity: number) => {
    await recordManager.generateRecords(quantity);
    await recordManager.loadRecords();
    setRecords(recordManager.getRecords());
    toast.success("Records generated");
  };

  const editRecord = async (id: number, username: string, password: string) => {
    if (!username || !password) {
      toast.error("You should fill in all fields ")
      return;
    }
    await recordManager.editRecord(id, username, password);
    await recordManager.loadRecords();
    setRecords(recordManager.getRecords());
    toast.success("Record successfully updated");
  };

  const searchedRecord = useMemo(() => {
    if (searchText) {
      const searchId = Number(searchText);
      if (!isNaN(searchId)) {
        const record = recordManager.searchRecordById(searchId);
        return record ? [record] : [];
      } else {
        return [];
      }
    }
    return records;
  }, [searchText, records]);

  return (
    <div className="h-full bg-gradient flex flex-col">
      <Header />
      <div className="p-5 flex gap-5">
        <div className="flex flex-col gap-y-1">
          <div className="flex justify-center gap-x-3 mb-4">
            <button
              className={`text-lg font-semibold border-b-2 ${
                option === "Add"
                  ? "border-primary-200"
                  : "border-transparent"
              }`}
              onClick={() => setOption("Add")}
            >
              Add
            </button>
            <button
              className={`text-lg font-semibold border-b-2 ${
                option === "Generate"
                  ? "border-primary-200"
                  : "border-transparent"
              }`}
              onClick={() => setOption("Generate")}
            >
              Generate
            </button>
          </div>
          {option === "Add" ? (
            <AddRecordForm addRecord={addRecord} />
          ) : (
            <GenerateRecordForm generateRecords={generateRecords} />
          )}
        </div>
        <RecordMenu
          searchText={searchText}
          onSearchChange={setSearchText}
          records={searchedRecord}
          deleteRecord={deleteRecord}
          editRecord={editRecord}
        />
      </div>
    </div>
  );
};

export default AppLayout;
