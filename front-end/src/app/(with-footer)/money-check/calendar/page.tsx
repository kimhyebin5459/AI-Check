export default function CalendarPage({
    searchParams
  }: {
    searchParams: { year?: string; month?: string }
  }) {
    const year = searchParams.year || new Date().getFullYear().toString();
    const month = searchParams.month || (new Date().getMonth() + 1).toString().padStart(2, '0');
  
    return <div>Calendar for {year}/{month}</div>
  }