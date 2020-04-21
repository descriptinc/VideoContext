import vertexShader from "./horizontalWipe.vert";
import fragmentShader from "./horizontalWipe.frag";

export const HORIZONTAL_WIPE = {
    title: "Horizontal Wipe",
    description: "A horizontal wipe effect. Typically used as a transistion.",
    vertexShader,
    fragmentShader,
    properties: {
        mix: { type: "uniform", value: 0.0 }
    },
    inputs: ["u_image_a", "u_image_b"]
};
