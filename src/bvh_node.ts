import { AABB } from "./aabb";
import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Hittable } from "./hittable";
import { HitRecord } from "./hit_record";
import { Material } from "./material";
import { surrounding_box } from "./util";

export class BvhNode implements Hittable {
    left: Hittable;
    right: Hittable;
    box: AABB;

    constructor(l: Array<Hittable>, time0: number, time1: number) {
        let axis = Math.floor(Math.random() * 3);
        let box_left = new AABB(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0));
        let box_right = new AABB(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0));
        if (axis == 0) {
            l.sort((a: Hittable, b: Hittable) => {
                if (!a.bounding_box(0, 0, box_left) || !b.bounding_box(0, 0, box_right)) {
                    throw new Error("no bounding box in bvh_node constructor");
                }
                if (box_left.min.x - box_right.min.x < 0.0) {
                    return -1;
                } else {
                    return 1;
                }
            });
        } else if (axis == 1) {
            l.sort((a: Hittable, b: Hittable) => {
                if (!a.bounding_box(0, 0, box_left) || !b.bounding_box(0, 0, box_right)) {
                    throw new Error("no bounding box in bvh_node constructor");
                }
                if (box_left.min.y - box_right.min.y < 0.0) {
                    return -1;
                } else {
                    return 1;
                }
            });
        } else {
            l.sort((a: Hittable, b: Hittable) => {
                if (!a.bounding_box(0, 0, box_left) || !b.bounding_box(0, 0, box_right)) {
                    throw new Error("no bounding box in bvh_node constructor");
                }
                if (box_left.min.z - box_right.min.z < 0.0) {
                    return -1;
                } else {
                    return 1;
                }
            });
        }

        const n = l.length;
        if (n == 1) {
            this.left = l[0];
            this.right = l[0];
        } else if (n == 2) {
            this.left = l[0];
            this.right = l[1];
        } else {
            const split_at = Math.floor(l.length / 2);
            this.left = new BvhNode(l.slice(0, split_at), time0, time1);
            this.right = new BvhNode(l.slice(split_at), time0, time1);
        }

        box_left = new AABB(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0));
        box_right = new AABB(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0));
        if (!this.left.bounding_box(time0, time1, box_left) || !this.right.bounding_box(time0, time1, box_right)) {
            throw new Error("no bounding box in bvh_node constructor");
        }

        this.box = surrounding_box(box_left, box_right);
    }

    hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
        if (this.box.hit(r, t_min, t_max)) {
            let left_rec = HitRecord.empty();
            let right_rec = HitRecord.empty();
            const hit_left = this.left.hit(r, t_min, t_max, left_rec);
            const hit_right = this.right.hit(r, t_min, t_max, right_rec);

            if (hit_left && hit_right) {
                if (left_rec.t < right_rec.t) {
                    rec.copy(left_rec);
                } else {
                    rec.copy(right_rec);
                }
                return true;
            } else if (hit_left) {
                rec.copy(left_rec);
                return true;
            } else if (hit_right) {
                rec.copy(right_rec);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    bounding_box(t0: number, t1: number, box: AABB): boolean {
        box.copy(this.box);
        return true;
    }
}
