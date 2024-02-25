"use client";

import { makeClient } from "@/lib/ApolloWrapper";
import { auth } from "@/lib/firebase/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import gql from "graphql-tag";
import { useRouter } from "next/navigation";
import React from "react";

const LoginWithGoogleButton = () => {
  const router = useRouter();

  const signInWithGoogle = async () => {
    try {
      const userData: any = await signInWithPopup(
        auth,
        new GoogleAuthProvider()
      );

      const accessToken = userData.user.accessToken!;

      const client = makeClient();

      const { data } = await client.mutate({
        mutation: gql`
          mutation LoginWithGoogle($accessToken: String!) {
            loginWithGoogle(accessToken: $accessToken) {
              id
              email
              name
              picture
              token
            }
          }
        `,
        variables: { accessToken },
      });

      const { email, id, name, picture, token } = data.loginWithGoogle;
      document.cookie = `__session=${token}; path=/;`;
      router.push("/account");
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return <button onClick={() => signInWithGoogle()}>google</button>;
};

export default LoginWithGoogleButton;
