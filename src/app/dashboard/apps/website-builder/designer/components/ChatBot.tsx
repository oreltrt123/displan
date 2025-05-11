import { useState } from "react";

export default function BotPage() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setInput("");
    setLoading(true);

    try {
      const apiKey = "AIzaSyDh4BsHon03emZ1wz98phjYhH8PZtLfrhA"; // Your API Key

      // Request to fetch available models
      const modelsRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
      );
      const modelsData = await modelsRes.json();
      console.log("Available models:", modelsData); // Log available models

      // Use a model that supports generateContent (replace 'gemini-2.0' with a valid model)
      const modelName = "gemini-2.0"; // Replace with an actual model name from the response

      // Request to generate content
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}-flash:generateContent?key=AIzaSyDh4BsHon03emZ1wz98phjYhH8PZtLfrhA`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userMessage }] }],
          }),
        }
      );

      const data = await res.json();
      console.log("API raw response:", data); // 👈 See exact error reason in console

      // Get real reply from Gemini
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (reply) {
        setMessages((prev) => [...prev, { text: reply, isUser: false }]);
      } else if (data.error) {
        // Show error message from API
        setMessages((prev) => [
          ...prev,
          { text: `API Error: ${data.error.message}`, isUser: false },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "Gemini gave empty reply. (Check API key or quota)", isUser: false },
        ]);
      }
    } catch (error: any) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error connecting to AI. Please try again later.", isUser: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>AI Chat Bot 🤖</h1>

      <div style={{ border: "1px solid #ccc", padding: 10, height: 400, overflowY: "auto", marginBottom: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.isUser ? "right" : "left", margin: "10px 0" }}>
            <span
              style={{
                display: "inline-block",
                padding: 10,
                borderRadius: 10,
                background: msg.isUser ? "#007bff" : "#e0e0e0",
                color: msg.isUser ? "#fff" : "#000",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <div>AI is typing...</div>}
      </div>

      <div style={{ display: "flex" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your question..."
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ padding: "10px 20px" }}>
          Send
        </button>
      </div>
    </div>
  );
}
