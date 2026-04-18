import EditPersonalInfoUser from "@/components/users/editPersonlinfouser";

interface EditUserPageProps {
  params: { id: string };
}

export default function EditUserPage({ params }: EditUserPageProps) {
  return <EditPersonalInfoUser userId={params.id} />;
}