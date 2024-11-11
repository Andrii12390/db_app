import Record from "./Record";
import RecordList from "./RecordList";
import RecordListTitle from "./RecordListTitle";
import { RecordItem } from "../../types";
import { SearchInput } from "../ui/SearchInput";

interface RecordMenuProps {
  records: RecordItem[] | undefined;
  deleteRecord: (id: number) => void;
  editRecord: (id: number, username: string, password: string) => void;
  searchText: string;
  onSearchChange: (text: string) => void;
}
const RecordMenu = ({ records, deleteRecord, editRecord, searchText, onSearchChange }: RecordMenuProps) => {

  return (
    <div className="flex w-full h-full flex-col gap-2">
      <SearchInput searchText={searchText} onSearchChange={onSearchChange}/>
      <div className="w-full bg-light-100 rounded-md shadow-md flex flex-col overflow-y-auto no-scrollbar dark:bg-dark-200 gap-y-2">
        <RecordListTitle />
        <RecordList>
          {records?.map((record) => {
            return (
              <Record
                data={record}
                handleDelete={deleteRecord}
                handleEdit={editRecord}
              />
            );
          })}
        </RecordList>
      </div>
    </div>
  );
};

export default RecordMenu;
