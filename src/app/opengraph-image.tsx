import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Академия профессионального образования - Интернет-магазин"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
      }}
    >
      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)",
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          zIndex: 1,
        }}
      >
        {/* Logo/Brand name */}
        <div
          style={{
            fontSize: "120px",
            fontWeight: "bold",
            color: "#ffffff",
            letterSpacing: "-0.02em",
            textAlign: "center",
            display: "flex",
            textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          }}
        >
         Академия профессионального образования
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "32px",
            color: "#d1d5db",
            textAlign: "center",
            display: "flex",
            letterSpacing: "0.05em",
          }}
        >
          Интернет-магазин качественных товаров
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            width: "200px",
            height: "4px",
            background: "linear-gradient(90deg, transparent, #ffffff, transparent)",
            marginTop: "20px",
            display: "flex",
          }}
        />
      </div>

      {/* Corner decorations */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          width: "80px",
          height: "80px",
          border: "3px solid rgba(255, 255, 255, 0.2)",
          borderRight: "none",
          borderBottom: "none",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          right: "40px",
          width: "80px",
          height: "80px",
          border: "3px solid rgba(255, 255, 255, 0.2)",
          borderLeft: "none",
          borderTop: "none",
          display: "flex",
        }}
      />
    </div>,
    {
      ...size,
    },
  )
}
