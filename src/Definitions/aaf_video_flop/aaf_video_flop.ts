import vertexShader from "./aaf_video_flop.vert";
import fragmentShader from "./aaf_video_flop.frag";

export const AAF_VIDEO_FLOP = {
    title: "AAF Video Flop Effect",
    description: "A flop effect based on the AAF spec. Mirrors the image in the y-axis",
    vertexShader,
    fragmentShader,
    properties: {},
    inputs: ["u_image"]
};
