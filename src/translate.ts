import { AABB } from "./aabb";
import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Hittable } from "./hittable";
import { HitRecord } from "./hit_record";

export class Translate implements Hittable {
    h: Hittable;
    displacement: Vec3;

    constructor(h: Hittable, displacement: Vec3) {
        this.h = h;
        this.displacement = displacement;
    }

    hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
        const moved_r = new Ray(r.origin.minus(this.displacement), r.direction, r.time);
        if (this.h.hit(moved_r, t_min, t_max, rec)) {
            rec.p = rec.p.plus(this.displacement);
            return true;
        } else {
            return false;
        }
    }

    bounding_box(t0: number, t1: number, box: AABB): boolean {
        if (this.h.bounding_box(t0, t1, box)) {
            box.copy(new AABB(box.min.plus(this.displacement), box.max.plus(this.displacement)));
            return true;
        } else {
            return false;
        }
    }
}
