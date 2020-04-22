import vertexShader from "./verticalBlur.vert";
import fragmentShader from "./verticalBlur.frag";

export const VERTICAL_BLUR = {
    title: "Vertical Blur",
    description:
        "A vertical blur effect. Adpated from http://xissburg.com/faster-gaussian-blur-in-glsl/",
    vertexShader,
    fragmentShader,
    properties: {
        blurAmount: { type: "uniform", value: 1.0 }
    },
    inputs: ["u_image"]
};
