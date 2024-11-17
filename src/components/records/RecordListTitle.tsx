interface RecordListTitleProps {
  columns: string[];
}

const RecordListTitle = ({ columns }: RecordListTitleProps) => {
  return (
    <div className="sticky top-0 grid grid-cols-3 border-b border-slate-300 dark:border-neutral-600 bg-secondary-200 dark:bg-dark-200 rounded-t-md px-3 py-1 font-semibold">
      {columns.map((column, index) => (
        <div
          key={column}
          className={`dark:text-white ${index === 0 ? "ml-[68px]" : "text-right"}`}
        >
          {column}
        </div>
      ))}
    </div>
  );
};

export default RecordListTitle;