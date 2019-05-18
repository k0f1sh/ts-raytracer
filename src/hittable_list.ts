import { Vec3 } from "./vec3";
import { AABB } from "./aabb";
import { Ray } from "./ray";
import { Hittable } from "./hittable";
import { HitRecord } from "./hit_record";
import { surrounding_box } from "./util";

export class HittableList implements Hittable {
    hittables: Array<Hittable>;

    constructor(hittables: Array<Hittable>) {
        this.hittables = hittables;
    }

    hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
        let temp_rec = HitRecord.empty();
        let hit_anything = false;
        let closest_so_far = t_max;
        for (let h of this.hittables) {
            if (h.hit(r, t_min, closest_so_far, temp_rec)) {
                hit_anything = true;
                closest_so_far = temp_rec.t;
                rec.copy(temp_rec);
            }
        }
        return hit_anything;
    }

    bounding_box(t0: number, t1: number, box: AABB): boolean {
        if (this.hittables.length < 1) {
            return false;
        }

        let temp_box = new AABB(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0));
        const first_true = this.hittables[0].bounding_box(t0, t1, temp_box);
        if (!first_true) {
            return false;
        } else {
            box.copy(temp_box);
        }
        for (let i = 1; i < this.hittables.length; i++) {
            if (this.hittables[i].bounding_box(t0, t1, temp_box)) {
                box.copy(surrounding_box(box, temp_box));
            } else {
                return false;
            }
        }
        return true;
    }
}
