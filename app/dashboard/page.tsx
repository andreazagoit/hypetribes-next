import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/firebase/firebase-admin";
import PageContent from "@/components/PageContent";
import Container from "@/components/Container";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/sign-in");

  return (
    <main className="container">
      <Container>
        <PageContent
          variant="dashboard"
          currentUser={currentUser.toJSON() as typeof currentUser}
        />
      </Container>
    </main>
  );
}
