import vertexShader from "./aaf_video_scale.vert";
import fragmentShader from "./aaf_video_scale.frag";

export const AAF_VIDEO_SCALE = {
    title: "AAF Video Scale Effect",
    description: "A scale effect based on the AAF spec.",
    vertexShader,
    fragmentShader,
    properties: {
        scaleX: { type: "uniform", value: 1.0 },
        scaleY: { type: "uniform", value: 1.0 }
    },
    inputs: ["u_image"]
};
