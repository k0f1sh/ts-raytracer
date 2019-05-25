import { AABB } from "./aabb";
import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Hittable } from "./hittable";
import { HitRecord } from "./hit_record";
import { Material } from "./material";

export class YZRect implements Hittable {
    y0: number;
    y1: number;
    z0: number;
    z1: number;
    k: number;
    mat: Material;

    constructor(y0: number, y1: number, z0: number, z1: number, k: number, mat: Material) {
        this.y0 = y0;
        this.y1 = y1;
        this.z0 = z0;
        this.z1 = z1;
        this.k = k;
        this.mat = mat;
    }

    hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
        const t = (this.k - r.origin.x) / r.direction.x;
        if (t < t_min || t > t_max) {
            return false;
        }

        const y = r.origin.y + t * r.direction.y;
        const z = r.origin.z + t * r.direction.z;
        if (y < this.y0 || y > this.y1 || z < this.z0 || z > this.z1) {
            return false;
        }
        const re = new HitRecord(
            t,
            r.point_at_parameter(t),
            new Vec3(1, 0, 0),
            this.mat,
            (y - this.y0) / (this.y1 - this.y0),
            (z - this.z0) / (this.z1 - this.z0)
        );
        rec.copy(re);
        return true;
    }

    bounding_box(t0: number, t1: number, box: AABB): boolean {
        const b = new AABB(new Vec3(this.k - 0.0001, this.y0, this.z0), new Vec3(this.k + 0.0001, this.y1, this.z1));
        box.copy(b);
        return true;
    }
}
