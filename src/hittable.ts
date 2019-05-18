import { Ray } from "./ray";
import { HitRecord } from "./hit_record";
import { AABB } from "./aabb";

export interface Hittable {
    hit: (r: Ray, t_min: number, t_max: number, hit_record: HitRecord) => boolean;
    bounding_box: (t0: number, t1: number, box: AABB) => boolean;
} 
