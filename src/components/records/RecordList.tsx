interface RecordListProps {
  children: React.ReactNode;
}

const RecordList = ({children}: RecordListProps) => {
  return (
    <div className="min-h-48">
      {children}
    </div>
  )
}

export default RecordList;