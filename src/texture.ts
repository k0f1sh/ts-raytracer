import { Vec3 } from "./vec3";

export interface Texture {
    value: (u: number, v: number, p: Vec3) => Vec3;
} 
