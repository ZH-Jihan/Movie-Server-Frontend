import CommonDetailsPage from "@/components/media/CommonDetailsPage";

export default function MoviePage({ params }: { params: { id: string } }) {
  return <CommonDetailsPage id={params.id} type="MOVIE" />;
}
