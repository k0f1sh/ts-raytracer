import { Vec3 } from "./vec3";
import { Ray } from "./ray";

export class Camera {
    lower_left_corner: Vec3;
    horizontal: Vec3;
    vertical: Vec3;
    origin: Vec3;

    constructor(
        lower_left_corner: Vec3,
        horizontal: Vec3,
        vertical: Vec3,
        origin: Vec3
    ) {
        this.lower_left_corner = lower_left_corner;
        this.horizontal = horizontal;
        this.vertical = vertical;
        this.origin = origin;
    }

    get_ray(u: number, v: number): Ray {
        return new Ray(this.origin, this.lower_left_corner.plus(this.horizontal.muln(u).plus(this.vertical.muln(v).minus(this.origin))));
    }

    static create(lookfrom: Vec3, lookat: Vec3, vup: Vec3, vfov: number, aspect: number): Camera {
        const theta = vfov * Math.PI / 180;
        const half_height = Math.tan(theta / 2);
        const half_width = aspect * half_height;
        const origin = lookfrom;
        const w = lookfrom.minus(lookat).to_unit();
        const u = vup.cross(w).to_unit();
        const v = w.cross(u);
        const lower_left_corner = origin.minus(u.muln(half_width)).minus(v.muln(half_height)).minus(w);
        const horizontal = u.muln(2 * half_width);
        const vertical = v.muln(2 * half_height);

        return new Camera(lower_left_corner, horizontal, vertical, origin);
    }
}
