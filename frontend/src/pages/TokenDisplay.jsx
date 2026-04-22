import { useEffect, useRef, useState } from "react";
import axios from "axios";

const TokenDisplay = () => {
  const [tokens, setTokens] = useState([]);
  const lastTokenRef = useRef(null);
  const audioRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  /* AUTO FULLSCREEN */
  useEffect(() => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }, []);

  const loadTokens = async () => {
    try {
      const res = await axios.get(
        `https://sts-backend-0zqu.onrender.com/api/admin/queue?date=${today}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`
          }
        }
      );

      const called = res.data
        .filter(t => t.status === "called")
        .slice(0, 1); // Only main token for sound

      if (
        called.length > 0 &&
        lastTokenRef.current !== called[0].tokenNumber
      ) {
        lastTokenRef.current = called[0].tokenNumber;
        audioRef.current?.play();
      }

      setTokens(called);
    } catch {
      console.log("Token fetch failed");
    }
  };

  useEffect(() => {
    loadTokens();
    const interval = setInterval(loadTokens, 4000);
    return () => clearInterval(interval);
  }, []);

  const badge = (p) => {
    if (p === "senior") return "🧓";
    if (p === "disabled") return "♿";
    return "";
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center tracking-widest">

      {/* 🔔 AUDIO */}
      <audio ref={audioRef} src="/sounds/ding.mp3" />

      <h1 className="text-4xl font-bold mb-10">
        NOW SERVING
      </h1>

      {tokens.length === 0 ? (
        <p className="text-gray-400 text-2xl animate-pulse">
          Please wait for your token
        </p>
      ) : (
        tokens.map(t => (
         <div
  key={t._id}
  className="border-4 border-white px-20 py-12 text-center animate-blink"
>
  <div className="text-8xl font-extrabold">
    TOKEN {t.tokenNumber}
  </div>

  <div className="text-4xl mt-6 font-bold">
    ➜ COUNTER {t.counterNumber}
  </div>

  <div className="text-2xl mt-4">
    {badge(t.priorityCategory)} {t.timeSlot}
  </div>
</div>

        ))
      )}

      <p className="absolute bottom-6 text-sm text-gray-500">
        Please proceed to the counter immediately
      </p>
    </div>
  );
};

export default TokenDisplay;
