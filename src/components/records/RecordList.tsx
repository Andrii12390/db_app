interface RecordListProps {
  children: React.ReactNode;
}

const RecordList = ({children}: RecordListProps) => {
  return (
    <div className="min-h-[196px]">
      {children}
    </div>
  )
}

export default RecordList;