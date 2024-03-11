"use client";
import useNotificationStore from "@/state/notificationStore";
import React from "react";
import Container from "../Container";

const NotificationProvider = () => {
  const notifications = useNotificationStore(
    (state: any) => state.notifications
  );
  const addNotification = useNotificationStore(
    (state: any) => state.addNotification
  );

  return (
    <>
      <div style={{ position: "fixed", zIndex: 900, width: "100%", top: 32 }}>
        <Container>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {notifications.map((notification) => (
              <div
                style={{
                  background: (notification.type = "error" ? "red" : "green"),
                  padding: "1rem",
                }}
              >
                {notification.message}
              </div>
            ))}
          </div>
        </Container>
        {/* <button
          onClick={() =>
            addNotification({ type: "error", message: "Notifica!" })
          }
        >
          Add notification
        </button> */}
      </div>
    </>
  );
};

export default NotificationProvider;
