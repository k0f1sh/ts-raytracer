//const fs = require("fs");
import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { HitRecord } from "./hit_record";
import { Hittable } from "./hittable";
import { HittableList } from "./hittable_list";
import { Sphere } from "./sphere";
import { Camera } from "./camera";

const color = (r: Ray, world: Hittable): Vec3 => {
    let rec = HitRecord.empty();
    if (world.hit(r, 0.0, Number.MAX_VALUE, rec)) {
        return (new Vec3(rec.normal.x + 1.0, rec.normal.y + 1.0, rec.normal.z + 1.0)).muln(0.5);
    } else {
        const unit_direction = r.direction.to_unit();
        const t = 0.5 * (unit_direction.y + 1.0);
        return (new Vec3(1.0, 1.0, 1.0)).muln(1.0 - t).plus((new Vec3(0.5, 0.7, 1.0).muln(t)));
    }
};

const main = async () => {
    const nx: number = 200;
    const ny: number = 100;
    const ns: number = 100;

    const lower_left_corner = new Vec3(-2.0, -1.0, -1.0);
    const horizontal = new Vec3(4.0, 0.0, 0.0);
    const vertical = new Vec3(0.0, 2.0, 0.0);
    const origin = new Vec3(0.0, 0.0, 0.0);
    const camera = new Camera(lower_left_corner, horizontal, vertical, origin);

    const l: Array<Hittable> = [
        new Sphere(new Vec3(0, 0, -1), 0.5),
        new Sphere(new Vec3(0, -100.5, -1), 100),
    ];
    const list: HittableList = new HittableList(l);

    console.log(`P3\n${nx} ${ny}\n255`);

    for (let j = ny - 1; j >= 0; j--) {
        for (let i = 0; i < nx; i++) {
            let col = new Vec3(0.0, 0.0, 0.0);
            for (let s = 0; s < ns; s++) {
                const u = (i + Math.random()) / nx;
                const v = (j + Math.random()) / ny;
                const r = camera.get_ray(u, v);
                col = col.plus(color(r, list));
            }
            col = col.divn(ns);
            const ir = Math.floor(col.x * 255.99);
            const ig = Math.floor(col.y * 255.99);
            const ib = Math.floor(col.z * 255.99);
            console.log(`${ir} ${ig} ${ib}`);
        }
    }
};

main().catch(err => console.log(err));
