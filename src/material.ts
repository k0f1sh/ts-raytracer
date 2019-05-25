import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { HitRecord } from "./hit_record";

export interface Material {
    scatter: (r_in: Ray, rec: HitRecord, attenuation: Vec3, scatterd: Ray) => boolean;
    emitted: (u: number, v: number, p: Vec3) => Vec3;
}
