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
}
