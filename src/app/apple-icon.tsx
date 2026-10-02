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
| Metadata
|--------------------------------------------------------------------------
*/

export const size = {
  width:
    180,

  height:
    180,
};

export const contentType =
  "image/png";

/*
|--------------------------------------------------------------------------
| Apple Icon
|--------------------------------------------------------------------------
*/

export default function AppleIcon() {
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
            "#050812",

          color:
            "#050812",
        }}
      >
        <div
          style={{
            width:
              126,

            height:
              126,

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            borderRadius:
              32,

            background:
              "white",

            fontSize:
              74,

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