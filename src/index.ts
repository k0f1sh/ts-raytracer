const fs = require("fs");
import { Vec3 } from "./vec3";
import { Ray } from "./ray";

const color = (r: Ray): Vec3 => {
    const unit_direction = r.direction.to_unit();
    const t = 0.5 * (unit_direction.y + 1.0);
    return (new Vec3(1.0, 1.0, 1.0)).muln(1.0 - t).plus((new Vec3(0.5, 0.7, 1.0).muln(t)));
}

const main = async () => {
    const nx: number = 200;
    const ny: number = 100;

    const lower_left_corner = new Vec3(-2.0, -1.0, -1.0);
    const horizontal = new Vec3(4.0, 0.0, 0.0);
    const vertical = new Vec3(0.0, 2.0, 0.0);
    const origin = new Vec3(0.0, 0.0, 0.0);

    console.log(`P3\n${nx} ${ny}\n255`);

    for (let j = ny - 1; j >= 0; j--) {
        for (let i = 0; i < nx; i++) {
            const u = i / nx;
            const v = j / ny;
            const r = new Ray(origin, lower_left_corner.plus(horizontal.muln(u).plus(vertical.muln(v))));
            const col = color(r);
            const ir = Math.floor(col.x * 255.99);
            const ig = Math.floor(col.y * 255.99);
            const ib = Math.floor(col.z * 255.99);
            console.log(`${ir} ${ig} ${ib}`);
        }
    }
}

main().catch(err => console.log(err));
