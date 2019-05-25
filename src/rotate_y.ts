import { AABB } from "./aabb";
import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Hittable } from "./hittable";
import { HitRecord } from "./hit_record";
import { Material } from "./material";

export class RotateY implements Hittable {
    h: Hittable;
    angle: number;
    sin_theta: number;
    cos_theta: number;
    hasbox: boolean;
    bbox: AABB;

    constructor(h: Hittable, angle: number) {
        this.h = h;
        this.angle = angle;

        const radians = (Math.PI / 180) * angle;
        this.sin_theta = Math.sin(radians);
        this.cos_theta = Math.cos(radians);
        const bbox = new AABB(new Vec3(0, 0, 0), new Vec3(0, 0, 0));
        this.hasbox = h.bounding_box(0, 1, bbox);
        const min = new Array<number>(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        const max = new Array<number>(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                for (let k = 0; k < 2; k++) {
                    const x = i * bbox.max.x + (1 - i) * bbox.min.x;
                    const y = j * bbox.max.y + (1 - j) * bbox.min.y;
                    const z = k * bbox.max.z + (1 - k) * bbox.min.z;
                    const newx = this.cos_theta * x + this.sin_theta * z;
                    const newz = -this.sin_theta * x + this.cos_theta * z;
                    const tester = new Vec3(newx, y, newz);
                    if (tester.x > max[0]) {
                        max[0] = tester.x;
                    }
                    if (tester.x < min[0]) {
                        min[0] = tester.x;
                    }
                    if (tester.y > max[1]) {
                        max[1] = tester.y;
                    }
                    if (tester.y < min[1]) {
                        min[1] = tester.y;
                    }
                    if (tester.z > max[2]) {
                        max[2] = tester.z;
                    }
                    if (tester.z < min[2]) {
                        min[2] = tester.z;
                    }
                }
            }
        }
        this.bbox = new AABB(new Vec3(min[0], min[1], min[2]), new Vec3(max[0], max[1], max[2]));
    }

    hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
        const origin = new Vec3(0, 0, 0);
        origin.copy(r.origin);
        const direction = new Vec3(0, 0, 0);
        direction.copy(r.direction);

        origin.x = this.cos_theta * r.origin.x - this.sin_theta * r.origin.z;
        origin.z = this.sin_theta * r.origin.x + this.cos_theta * r.origin.z;
        direction.x = this.cos_theta * r.direction.x - this.sin_theta * r.direction.z;
        direction.z = this.sin_theta * r.direction.x + this.cos_theta * r.direction.z;
        const rotated_r = new Ray(origin, direction, r.time);

        if (this.h.hit(rotated_r, t_min, t_max, rec)) {
            const p = new Vec3(0, 0, 0);
            p.copy(rec.p);
            const normal = new Vec3(0, 0, 0);
            normal.copy(rec.normal);

            p.x = this.cos_theta * rec.p.x + this.sin_theta * rec.p.z;
            p.z = -this.sin_theta * rec.p.x + this.cos_theta * rec.p.z;
            normal.x = this.cos_theta * rec.normal.x + this.sin_theta * rec.normal.z;
            normal.z = -this.sin_theta * rec.normal.x + this.cos_theta * rec.normal.z;

            rec.p = p;
            rec.normal = normal;
            return true;
        } else {
            return false;
        }
    }

    bounding_box(t0: number, t1: number, box: AABB): boolean {
        box.copy(this.bbox);
        return this.hasbox;
    }
}
