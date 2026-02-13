import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 42,
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          color: "white",
          fontSize: 88,
          fontWeight: 800,
          fontFamily: "Arial",
        }}
      >
        F
      </div>
    ),
    size
  );
}
