"use client";

import { useState } from "react";
import UploadTextForm from "./components/UploadTextForm";
import ChatUI from "./components/ChatUI";
import TopBar from "./components/TopBar";
import React from "react";

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [initialMessages, setInitialMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("Your Historia Conversation");
  const [message, setMessage] = useState("");

  const sendEmail = async (email, messages) => {
    try {
      const htmlBody = `
        <html>
          <body>
            <h2>Historia Conversation</h2>
            <ul>
              ${messages
                .map(
                  (msg) => `
                    <li>
                      <b>${msg.role === "user" ? "You" : "Historia"}:</b>
                      ${msg.text ? `<div>${msg.text}</div>` : ""}
                      ${
                        msg.file
                          ? `<div><img src="${msg.file.url}" alt="${msg.file.name}" style="max-width:200px;"/></div>`
                          : ""
                      }
                    </li>
                  `,
                )
                .join("")}
            </ul>
          </body>
        </html>
      `;

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to: email, subject, htmlBody }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send email.");
      }

      const data = await response.json();
      setMessage("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      setMessage(error.message || "An error occurred while sending the email.");
    }
  };

  const handleFirstSubmit = ({ user, api }) => {
    const messages = [
      { role: "user", ...user },
      { role: "api", ...api },
    ];
    setInitialMessages(messages);
    setChatMessages(messages);
    setShowChat(true);
  };
  const handleNewChat = () => {
    setShowChat(false);
    setInitialMessages([]);
    setChatMessages([]);
  };

  return (
    <>
      {!showChat ? (
        <>
          <h1>Historia</h1>
          <UploadTextForm onFirstSubmit={handleFirstSubmit} />
        </>
      ) : (
        <>
          <TopBar
            onNewChat={handleNewChat}
            onSendEmail={(email) => sendEmail(email, chatMessages)}
            chatMessages={chatMessages}
          />
          <ChatUI
            initialMessages={initialMessages}
            onChatChange={setChatMessages}
          />
        </>
      )}
      {message && <p>{message}</p>}
    </>
  );
}
