import vertexShader from "./aaf_video_crop.vert";
import fragmentShader from "./aaf_video_crop.frag";

export const AAF_VIDEO_CROP = {
    title: "AAF Video Crop Effect",
    description: "A crop effect based on the AAF spec.",
    vertexShader,
    fragmentShader,
    properties: {
        cropLeft: { type: "uniform", value: -1.0 },
        cropRight: { type: "uniform", value: 1.0 },
        cropTop: { type: "uniform", value: -1.0 },
        cropBottom: { type: "uniform", value: 1.0 }
    },
    inputs: ["u_image"]
};
