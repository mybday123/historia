"use client";

import { useState } from "react";
import UploadTextForm from "./components/UploadTextForm";
import ChatUI from "./components/ChatUI";
import TopBar from "./components/TopBar";
import React from "react";
import stripMarkdown from "@/lib/stripMarkdown";

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [initialMessages, setInitialMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("Your Historia Conversation");
  const [message, setMessage] = useState("");
  const [chatKey, setChatKey] = useState(0);

  const sendEmail = async (email, messages) => {
    try {
      const htmlBody = `
        <html>
          <body>
            <h2>Historia Conversation</h2>
            <ul>
              ${messages
                .map((msg) => {
                  const plainText = stripMarkdown(msg.text || "").replace(
                    /\n/g,
                    "<br />",
                  );
                  return `
                    <li>
                      <b>${msg.role === "user" ? "You" : "Historia"}:</b>
                      ${plainText ? `<div>${plainText}</div>` : ""}
                      ${
                        msg.file
                          ? `<div><img src="${msg.file.url}" alt="${msg.file.name}" style="max-width:200px;"/></div>`
                          : ""
                      }
                    </li>
                  `;
                })
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
    setChatKey((k) => k + 1);
  };
  const handleNewChat = () => {
    setShowChat(false);
    setInitialMessages([]);
    setChatMessages([]);
    setChatKey((k) => k + 1);
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
            key={chatKey}
            initialMessages={initialMessages}
            onChatChange={setChatMessages}
          />
        </>
      )}
    </>
  );
}
