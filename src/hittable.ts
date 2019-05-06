import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { HitRecord } from "./hit_record";

export interface Hittable {
    hit: (r: Ray, t_min: number, t_max: number, hit_record: HitRecord) => boolean;
}
