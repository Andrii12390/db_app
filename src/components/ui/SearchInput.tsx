import { Search } from "lucide-react";

interface SearchInputProps {
  searchText: string;
  onSearchChange: (text: string) => void;
}

export const SearchInput = ({ searchText, onSearchChange }: SearchInputProps) => {
  return (
    <div className="relative">
      <Search className="absolute right-3 top-2 text-slate-500" strokeWidth={1.5}/>
      <input
        type="text"
        className="w-full bg-light-100 dark:bg-dark-200 px-3 py-2 rounded-full outline-none dark:text-light-100"
        placeholder="Search by id"
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};
