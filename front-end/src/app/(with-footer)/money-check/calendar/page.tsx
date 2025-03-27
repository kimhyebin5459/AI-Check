type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: { 
  searchParams : SearchParams
}) {
  const params = await props.searchParams;
  const year = (params.year as string) || new Date().getFullYear().toString();
  const month = (params.month as string) || (new Date().getMonth() + 1).toString().padStart(2, '0');

  return <div>Calendar for {year}/{month}</div>
}