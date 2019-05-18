import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { random_in_unit_disk } from "./util";

export class Camera {
    lower_left_corner: Vec3;
    horizontal: Vec3;
    vertical: Vec3;
    origin: Vec3;
    lens_radius: number;
    w: Vec3;
    u: Vec3;
    v: Vec3;
    time0: number;
    time1: number;

    constructor(
        lower_left_corner: Vec3,
        horizontal: Vec3,
        vertical: Vec3,
        origin: Vec3,
        lens_radius: number,
        w: Vec3,
        u: Vec3,
        v: Vec3,
        time0: number,
        time1: number
    ) {
        this.lower_left_corner = lower_left_corner;
        this.horizontal = horizontal;
        this.vertical = vertical;
        this.origin = origin;
        this.lens_radius = lens_radius;
        this.w = w;
        this.u = u;
        this.v = v;
        this.time0 = time0;
        this.time1 = time1;
    }

    get_ray(s: number, t: number): Ray {
        const rd = random_in_unit_disk().muln(this.lens_radius);
        const offset = this.u.muln(rd.x).plus(this.v.muln(rd.y));
        const time = this.time0 + (Math.random() * (this.time1 - this.time0));
        return new Ray(
            this.origin.plus(offset),
            this.lower_left_corner.plus(this.horizontal.muln(s).plus(this.vertical.muln(t).minus(this.origin).minus(offset))),
            time
        );
    }

    static create(lookfrom: Vec3, lookat: Vec3, vup: Vec3, vfov: number, aspect: number, aperture: number, focus_dist: number, time0: number, time1: number): Camera {
        const lens_radius = aperture / 2;
        const theta = vfov * Math.PI / 180;
        const half_height = Math.tan(theta / 2);
        const half_width = aspect * half_height;
        const origin = lookfrom;
        const w = lookfrom.minus(lookat).to_unit();
        const u = vup.cross(w).to_unit();
        const v = w.cross(u);
        const lower_left_corner = origin.minus(u.muln(half_width).muln(focus_dist)).minus(v.muln(half_height).muln(focus_dist)).minus(w.muln(focus_dist));
        const horizontal = u.muln(2 * half_width).muln(focus_dist);
        const vertical = v.muln(2 * half_height).muln(focus_dist);

        return new Camera(lower_left_corner, horizontal, vertical, origin, lens_radius, w, u, v, time0, time1);
    }
}
