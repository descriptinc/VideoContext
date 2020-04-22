import vertexShader from "./crossfade.vert";
import fragmentShader from "./crossfade.frag";

export const CROSSFADE = {
    title: "Cross-Fade",
    description: "A cross-fade effect. Typically used as a transistion.",
    vertexShader,
    fragmentShader,
    properties: {
        mix: { type: "uniform", value: 0.0 }
    },
    inputs: ["u_image_a", "u_image_b"]
};
