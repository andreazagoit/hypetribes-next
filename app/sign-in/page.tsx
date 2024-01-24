import { redirect } from "next/navigation";

import { isUserAuthenticated } from "@/lib/firebase/firebase-admin";
import PageContent from "@/components/PageContent";
import Container from "@/components/Container";

export default async function SignInPage() {
  if (await isUserAuthenticated()) redirect("/dashboard");

  return (
    <main className="container">
      <Container>
        <PageContent variant="sign-in" />
      </Container>
    </main>
  );
}
