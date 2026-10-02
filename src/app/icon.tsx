import {
  ImageResponse,
} from "next/og";

/*
|--------------------------------------------------------------------------
| Runtime
|--------------------------------------------------------------------------
*/

export const runtime =
  "edge";

/*
|--------------------------------------------------------------------------
| Image Metadata
|--------------------------------------------------------------------------
*/

export const size = {
  width:
    512,

  height:
    512,
};

export const contentType =
  "image/png";

/*
|--------------------------------------------------------------------------
| Icon
|--------------------------------------------------------------------------
*/

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width:
            "100%",

          height:
            "100%",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          background:
            "linear-gradient(145deg, #111827 0%, #050812 55%, #020617 100%)",

          color:
            "white",
        }}
      >
        {/* Glow */}

        <div
          style={{
            position:
              "absolute",

            width:
              340,

            height:
              340,

            borderRadius:
              "999px",

            background:
              "rgba(59, 130, 246, 0.23)",

            filter:
              "blur(60px)",
          }}
        />

        {/* App Icon */}

        <div
          style={{
            position:
              "relative",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            width:
              330,

            height:
              330,

            borderRadius:
              80,

            background:
              "rgba(255, 255, 255, 0.96)",

            border:
              "2px solid rgba(255, 255, 255, 0.35)",

            boxShadow:
              "0 40px 100px rgba(0,0,0,0.45)",

            color:
              "#050812",

            fontSize:
              190,

            fontWeight:
              800,

            fontFamily:
              "sans-serif",
          }}
        >
          J
        </div>
      </div>
    ),

    {
      ...size,
    }
  );
}