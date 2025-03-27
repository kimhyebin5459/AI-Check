export default function CalendarPage({
    searchParams
  }: {
    searchParams: { id?: number }
  }) {
    const record_id = searchParams.id || new Date().getFullYear().toString();
  
    return <div>Detail for {record_id}</div>
  }