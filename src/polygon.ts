import { AABB } from "./aabb";
import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Hittable } from "./hittable";
import { HitRecord } from "./hit_record";
import { Material } from "./material";

export class Polygon implements Hittable {
    v1: Vec3;
    v2: Vec3;
    v3: Vec3;
    mat: Material;

    constructor(v1: Vec3, v2: Vec3, v3: Vec3, mat: Material) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.mat = mat;
    }

    hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
        const normal = Vec3.normal(this.v1, this.v2, this.v3);
        const origin = r.origin;
        const direction = r.direction;
        const xp = this.v1.minus(origin);
        const xpn = xp.dot(normal);
        const vn = direction.dot(normal);
        if (0.00001 >= vn) {
            return false;
        } else {
            const t = xpn / vn;
            if (!((t < t_max) && (t > t_min))) {
                return false;
            }
            const p = r.point_at_parameter(t);
            if (p.minus(this.v1).cross(this.v2.minus(this.v1)).dot(normal) < 0) {
                return false;
            }
            if (p.minus(this.v2).cross(this.v3.minus(this.v2)).dot(normal) < 0) {
                return false;
            }
            if (p.minus(this.v3).cross(this.v1.minus(this.v3)).dot(normal) < 0) {
                return false;
            }
            rec.copy(new HitRecord(t, p, (normal.muln(-1.0)), this.mat));
            return true;
        }
    }

    bounding_box(t0: number, t1: number, box: AABB): boolean {
        const minx = Math.min(this.v1.x, this.v2.x, this.v3.x);
        const miny = Math.min(this.v1.y, this.v2.y, this.v3.y);
        const minz = Math.min(this.v1.z, this.v2.z, this.v3.z);

        const maxx = Math.max(this.v1.x, this.v2.x, this.v3.x);
        const maxy = Math.max(this.v1.y, this.v2.y, this.v3.y);
        const maxz = Math.max(this.v1.z, this.v2.z, this.v3.z);

        box.copy(new AABB(new Vec3(minx, miny, minz), new Vec3(maxx, maxy, maxz)));
        return true;
    }
}
