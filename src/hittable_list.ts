//import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Hittable } from "./hittable";
import { HitRecord } from "./hit_record";

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
}
