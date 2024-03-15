"use client";

import { auth } from "@/lib/firebase/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { RequireEntityStep, Step } from "./AuthCard";

interface IProps {
  step: RequireEntityStep;
  changeStep: React.Dispatch<React.SetStateAction<Step>>;
}

const CreateAccount = ({ step, changeStep }: IProps) => {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [bio, setBio] = useState("");

  const handleCreateAccount = async () => {
    // Validate
    if (key.length < 3) {
      return;
    }

    const response = await fetch("/api/auth/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken: step.data.idToken, key, bio }),
    });

    const resBody = await response.json();
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full">
      <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white py-8 px-6 text-center rounded-t-lg">
        <h1 className="text-3xl font-bold mb-4">Create your account</h1>
      </div>
      <div className="p-6 flex flex-col items-center space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={step.data.picture}
            alt=""
            className="h-12 w-12 rounded-full"
          />
          <div>
            <p className="text-gray-600">Ciao,</p>
            <h3 className="font-semibold text-black">{step.data.name}</h3>
          </div>
        </div>
        <div className="w-full">
          <label
            htmlFor="username"
            className="block text-gray-700 font-bold mb-2"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 text-black"
          />
        </div>
        <div className="w-full">
          <label htmlFor="bio" className="block text-gray-700 font-bold mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          ></textarea>
        </div>
        <button
          disabled={key.length < 3}
          onClick={() => handleCreateAccount()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-red-300"
        >
          Create new account
        </button>
      </div>
    </div>
  );
};

export default CreateAccount;
