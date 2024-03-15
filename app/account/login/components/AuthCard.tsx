"use client";
import React, { useState } from "react";
import LoginWithGoogleStep from "./LoginWithGoogleStep";
import CreateAccount from "./CreateAccount";

type InitialStep = {
  status: "initial";
};
export type RequireEntityStep = {
  status: "require-entity";
  data: {
    name: string;
    picture: string;
    idToken: string;
  };
};
export type Step = InitialStep | RequireEntityStep;

const AuthCard = () => {
  const [step, setStep] = useState<Step>({ status: "initial" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
      {step.status === "initial" && (
        <LoginWithGoogleStep changeStep={setStep} />
      )}
      {step.status === "require-entity" && (
        <CreateAccount step={step} changeStep={setStep} />
      )}
    </div>
  );
};

export default AuthCard;
