import { AABB } from "./aabb";
import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Hittable } from "./hittable";
import { HitRecord } from "./hit_record";
import { Material } from "./material";

export class FlipNormals implements Hittable {
    h: Hittable;

    constructor(h: Hittable) {
        this.h = h;
    }

    hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
        if (this.h.hit(r, t_min, t_max, rec)) {
            rec.normal = rec.normal.muln(-1);
            return true;
        } else {
            return false;
        }
    }

    bounding_box(t0: number, t1: number, box: AABB): boolean {
        return this.h.bounding_box(t0, t1, box);
    }
}
