"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PasscodePage() {
  const [pin, setPin] = useState("");
  const router = useRouter();

  const savePin = async () => {
    if (pin.length !== 6) return alert("Enter 6 digit pin");

    const hash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(pin)
    );

    const hex = Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    localStorage.setItem("user_pin", hex);
    sessionStorage.setItem("pin_verified", "true");

    router.push("/");
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <h2 className="text-xl font-bold mb-4">Create 6 Digit Passcode</h2>

        <input
          type="password"
          maxLength={6}
          value={pin}
          onChange={e => setPin(e.target.value)}
          className="border p-3 rounded w-full mb-4 text-center"
        />

        <button
          onClick={savePin}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
}
