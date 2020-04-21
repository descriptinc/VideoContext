import vertexShader from "./opacity.vert";
import fragmentShader from "./opacity.frag";

export const OPACITY = {
    title: "Opacity",
    description: "Sets the opacity of an input.",
    vertexShader,
    fragmentShader,
    properties: {
        opacity: { type: "uniform", value: 0.7 }
    },
    inputs: ["u_image"]
};
