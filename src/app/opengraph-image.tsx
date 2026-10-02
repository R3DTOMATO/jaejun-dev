import {
  ImageResponse,
} from "next/og";

import {
  SITE_DESCRIPTION,
  SITE_NAME,
} from "../lib/site";

/*
|--------------------------------------------------------------------------
| Runtime
|--------------------------------------------------------------------------
*/

export const runtime =
  "edge";

/*
|--------------------------------------------------------------------------
| Metadata
|--------------------------------------------------------------------------
*/

export const alt =
  "Jaejun.dev Knowledge Operating System";

export const size = {
  width:
    1200,

  height:
    630,
};

export const contentType =
  "image/png";

/*
|--------------------------------------------------------------------------
| Open Graph Image
|--------------------------------------------------------------------------
*/

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position:
            "relative",

          width:
            "100%",

          height:
            "100%",

          display:
            "flex",

          flexDirection:
            "column",

          justifyContent:
            "space-between",

          overflow:
            "hidden",

          padding:
            "64px 72px",

          background:
            "linear-gradient(135deg, #10182a 0%, #050812 50%, #020617 100%)",

          color:
            "white",

          fontFamily:
            "sans-serif",
        }}
      >
        {/* Blue Glow */}

        <div
          style={{
            position:
              "absolute",

            left:
              -160,

            top:
              -240,

            width:
              680,

            height:
              680,

            borderRadius:
              999,

            background:
              "rgba(37, 99, 235, 0.24)",

            filter:
              "blur(100px)",
          }}
        />

        {/* Violet Glow */}

        <div
          style={{
            position:
              "absolute",

            right:
              -180,

            bottom:
              -280,

            width:
              700,

            height:
              700,

            borderRadius:
              999,

            background:
              "rgba(124, 58, 237, 0.19)",

            filter:
              "blur(120px)",
          }}
        />

        {/* Top */}

        <div
          style={{
            position:
              "relative",

            display:
              "flex",

            alignItems:
              "center",

            gap:
              20,
          }}
        >
          <div
            style={{
              width:
                64,

              height:
                64,

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              borderRadius:
                16,

              background:
                "white",

              color:
                "#050812",

              fontSize:
                34,

              fontWeight:
                800,
            }}
          >
            J
          </div>

          <div
            style={{
              display:
                "flex",

              flexDirection:
                "column",
            }}
          >
            <div
              style={{
                fontSize:
                  28,

                fontWeight:
                  700,
              }}
            >
              {SITE_NAME}
            </div>

            <div
              style={{
                marginTop:
                  4,

                fontSize:
                  17,

                color:
                  "rgba(255,255,255,0.52)",
              }}
            >
              KNOWLEDGE OPERATING SYSTEM
            </div>
          </div>
        </div>

        {/* Center */}

        <div
          style={{
            position:
              "relative",

            display:
              "flex",

            flexDirection:
              "column",

            maxWidth:
              920,
          }}
        >
          <div
            style={{
              fontSize:
                68,

              lineHeight:
                1.05,

              fontWeight:
                750,

              letterSpacing:
                "-0.04em",
            }}
          >
            Knowledge,
            <br />
            organized like an OS.
          </div>

          <div
            style={{
              marginTop:
                26,

              maxWidth:
                820,

              fontSize:
                23,

              lineHeight:
                1.45,

              color:
                "rgba(255,255,255,0.60)",
            }}
          >
            {SITE_DESCRIPTION}
          </div>
        </div>

        {/* Bottom */}

        <div
          style={{
            position:
              "relative",

            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            fontSize:
              17,

            color:
              "rgba(255,255,255,0.45)",
          }}
        >
          <span>
            Computer Science · AI · Quantum Computing
          </span>

          <span>
            jaejun.dev
          </span>
        </div>
      </div>
    ),

    {
      ...size,
    }
  );
}