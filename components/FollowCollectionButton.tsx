"use client";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface IProps {
  following: boolean;
  collectionKey: string;
  session: string;
}

const FOLLOW_COLLECTION = gql`
  mutation FollowCollection($key: String!) {
    followCollection(key: $key) {
      id
      name
      following
    }
  }
`;

const FollowCollectionButton = ({
  collectionKey,
  session,
  following,
}: IProps) => {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState<boolean>(following);
  const [followCollectionMutation, { loading, error }] =
    useMutation(FOLLOW_COLLECTION);

  const handleFollowCollection = async () => {
    try {
      const { data } = await followCollectionMutation({
        variables: { key: collectionKey },
        context: {
          headers: {
            authorization: `Bearer ${session}`,
          },
        },
      });

      setIsFollowing(data.followCollection.following);
      router.refresh();

      console.log("Collection followed successfully:", data.followCollection);
      // You can add further logic here after successfully following the collection
    } catch (error) {
      console.error("Error following collection:", error);
      // You can handle errors here
    }
  };

  return (
    <div>
      <button
        onClick={handleFollowCollection}
        disabled={loading}
        style={{ border: "1px solid white", padding: "8px 16px" }}
      >
        {loading ? "Following..." : <>{!isFollowing ? "Follow" : "Unfollow"}</>}
      </button>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default FollowCollectionButton;
