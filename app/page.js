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

  // This will be called by TopBar
  const handleSendEmail = (email, messages) => {
    // Convert messages to HTML
    const html = `
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
    // For now, just log it
    console.log("Email to:", email);
    console.log(html);
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
            onSendEmail={handleSendEmail}
            chatMessages={chatMessages}
          />
          <ChatUI
            initialMessages={initialMessages}
            onChatChange={setChatMessages}
          />
        </>
      )}
    </>
  );
}
