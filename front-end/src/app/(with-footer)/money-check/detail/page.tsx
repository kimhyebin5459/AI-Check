type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: { 
  searchParams : SearchParams
}) {
  const params = await props.searchParams;
  const id = (params.id as string) || new Date().getFullYear().toString();

  return <div>Detail for {id}</div>
}