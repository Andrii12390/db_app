import { useState } from "react";
import { RecordItem } from "../../types";
import Record from "./Record";
import Pagination from "../ui/Pagination";

interface RecordListProps {
  records: RecordItem[] | undefined;
  handleDelete: (id: number) => void;
  handleEdit: (id: number, username: string, password: string) => void;
}

const RecordList = ({ records, handleDelete, handleEdit }: RecordListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 11;

  const currentRecords = records?.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );
  return (
    <div className="min-h-[360px]">
      <div className="h-[calc(100%-32px)]">
        
      {currentRecords?.map((record) => {
        return (
          <Record
            data={record}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        );
      })}
      </div>
      <Pagination
        totalItems={records?.length || 0}
        itemsPerPage={recordsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default RecordList;
