import CommonDetailsPage from "@/components/media/CommonDetailsPage";

export default function SeriesPage({ params }: { params: { id: string } }) {
  return <CommonDetailsPage id={params.id} type="SERIES" />;
}
