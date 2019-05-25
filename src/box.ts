import { AABB } from "./aabb";
import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Hittable } from "./hittable";
import { HitRecord } from "./hit_record";
import { Material } from "./material";
import { BvhNode } from "./bvh_node";
import { XYRect } from "./xy_rect";
import { FlipNormals } from "./flip_normals";
import { XZRect } from "./xz_rect";
import { YZRect } from "./yz_rect";

export class Box implements Hittable {
    pmin: Vec3;
    pmax: Vec3;
    mat: Material;
    bvh: BvhNode;

    constructor(pmin: Vec3, pmax: Vec3, mat: Material) {
        this.pmin = pmin;
        this.pmax = pmax;
        this.mat = mat;

        let l = new Array<Hittable>();
        l.push(new XYRect(pmin.x, pmax.x, pmin.y, pmax.y, pmax.z, mat));
        l.push(new FlipNormals(new XYRect(pmin.x, pmax.x, pmin.y, pmax.y, pmin.z, mat)));

        l.push(new XZRect(pmin.x, pmax.x, pmin.z, pmax.z, pmax.y, mat));
        l.push(new FlipNormals(new XZRect(pmin.x, pmax.x, pmin.z, pmax.z, pmin.y, mat)));

        l.push(new YZRect(pmin.y, pmax.y, pmin.z, pmax.z, pmax.x, mat));
        l.push(new FlipNormals(new YZRect(pmin.y, pmax.y, pmin.z, pmax.z, pmin.x, mat)));

        this.bvh = new BvhNode(l, 0, 1.0);
    }

    hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
        return this.bvh.hit(r, t_min, t_max, rec);
    }

    bounding_box(t0: number, t1: number, box: AABB): boolean {
        box.copy(new AABB(this.pmin, this.pmax));
        return true;
    }
}
