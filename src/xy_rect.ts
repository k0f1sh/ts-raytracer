import { AABB } from "./aabb";
import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Hittable } from "./hittable";
import { HitRecord } from "./hit_record";
import { Material } from "./material";

export class XYRect implements Hittable {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
    k: number;
    mat: Material;

    constructor(x0: number, x1: number, y0: number, y1: number, k: number, mat: Material) {
        this.x0 = x0;
        this.x1 = x1;
        this.y0 = y0;
        this.y1 = y1;
        this.k = k;
        this.mat = mat;
    }

    hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
        const t = (this.k - r.origin.z) / r.direction.z;
        if (t < t_min || t > t_max) {
            return false;
        }

        const x = r.origin.x + t * r.direction.x;
        const y = r.origin.y + t * r.direction.y;
        if (x < this.x0 || x > this.x1 || y < this.y0 || y > this.y1) {
            return false;
        }
        const re = new HitRecord(
            t,
            r.point_at_parameter(t),
            new Vec3(0, 0, 1),
            this.mat,
            (x - this.x0) / (this.x1 - this.x0),
            (y - this.y0) / (this.y1 - this.y0)
        );
        rec.copy(re);
        return true;
    }

    bounding_box(t0: number, t1: number, box: AABB): boolean {
        const b = new AABB(new Vec3(this.x0, this.y0, this.k - 0.0001), new Vec3(this.x1, this.y1, this.k + 0.0001));
        box.copy(b);
        return true;
    }
}
