import React from "react";
import Page from "@/components/Page";
import { redirect } from "next/navigation";
import { getUserFromSession } from "@/utils/user";
import LogoutButton from "./components/LogoutButton";

const AccountPage = async () => {
  const user = await getUserFromSession();
  if (!user) redirect("/account/login");

  return (
    <Page title="Account">
      <div style={{ display: "flex" }}>
        <div style={{ flex: 0.8 }}>
          <div
            style={{
              height: 400,
              width: 500,
              borderRadius: 10,
              padding: 20,
              backgroundImage:
                "linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)",
              border: "2px solid #ddd",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <img
                  src={user.entity.picture}
                  style={{ height: 80, width: 80, borderRadius: 999 }}
                />
                <div style={{ marginTop: -4 }}>
                  <h2
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                    }}
                  >
                    {user.entity.name}
                  </h2>
                  <p style={{ marginTop: -4 }}>{user.entity.key}</p>
                </div>
              </div>
              <button
                style={{
                  fontSize: 12,
                  border: "1px solid white",
                  padding: "8px 16px",
                  borderRadius: 99,
                }}
              >
                Condividi
              </button>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
              Collections
            </h3>
            Non sono ancora presenti collezioni
          </div>
        </div>
        <div style={{ flex: 0.2 }}>
          <h3 style={{ fontSize: 24, fontWeight: "bold" }}>Settings</h3>
          <div
            style={{ border: "1px solid #fff3", borderRadius: 8, marginTop: 8 }}
          >
            <div style={{ padding: "8px 16px" }}>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default AccountPage;
