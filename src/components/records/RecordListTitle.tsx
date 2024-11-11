const RecordListTitle = () => {
  return (
    <div className="sticky top-0 grid grid-cols-3 border-b border-slate-300 dark:border-neutral-600 bg-secondary-200 dark:bg-dark-200 rounded-t-md px-3 py-1 font-semibold">
      <div className="ml-[68px] dark:text-white">ID</div>
      <div className="text-right dark:text-white">Username</div>
      <div className="text-right dark:text-white">Password</div>
    </div>
  );
}

export default RecordListTitle;