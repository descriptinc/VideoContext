import vertexShader from "./aaf_video_position.vert";
import fragmentShader from "./aaf_video_position.frag";

export const AAF_VIDEO_POSITION = {
    title: "AAF Video Position Effect",
    description: "A position effect based on the AAF spec.",
    vertexShader,
    fragmentShader,
    properties: {
        positionOffsetX: { type: "uniform", value: 0.0 },
        positionOffsetY: { type: "uniform", value: 0.0 }
    },
    inputs: ["u_image"]
};
