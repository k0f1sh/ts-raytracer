//const fs = require("fs");
import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { HitRecord } from "./hit_record";
import { Hittable } from "./hittable";
import { Camera } from "./camera";
import { random_scene, two_perlin_spheres, simple_light } from "./util";
import { Perlin } from "./perlin";

const color = (r: Ray, world: Hittable, depth: number): Vec3 => {
    let rec = HitRecord.empty();
    if (world.hit(r, 0.001, Number.MAX_VALUE, rec)) {
        let scatterd = Ray.empty();
        let attenuation = new Vec3(0.0, 0.0, 0.0);
        let emitted = rec.mat.emitted(rec.u, rec.v, rec.p);
        if ((depth < 50) && rec.mat.scatter(r, rec, attenuation, scatterd)) {
            return attenuation.mul(color(scatterd, world, depth + 1));
        } else {
            return emitted;
        }
    } else {
        // const unit_direction = r.direction.to_unit();
        // const t = 0.5 * (unit_direction.y + 1.0);
        // return (new Vec3(1.0, 1.0, 1.0)).muln(1.0 - t).plus((new Vec3(0.5, 0.7, 1.0).muln(t)));
        return new Vec3(0.0, 0.0, 0.0);
    }
};

const main = async () => {
    const nx: number = 600;
    const ny: number = 400;
    const ns: number = 50;

    Perlin.init();

    //const lookfrom = new Vec3(13, 2, 3);
    const lookfrom = new Vec3(26, 4, 6);
    const lookat = new Vec3(0, 0, 0);
    const dist_to_focus = 10;
    const aperture = 0.0;
    const camera = Camera.create(lookfrom, lookat, new Vec3(0, 1, 0), 20, nx / ny, aperture, dist_to_focus, 0.0, 1.0);

    //const list = random_scene();
    //const list = two_perlin_spheres();
    const list = simple_light();

    console.log(`P3\n${nx} ${ny}\n255`);

    for (let j = ny - 1; j >= 0; j--) {
        for (let i = 0; i < nx; i++) {
            let col = new Vec3(0.0, 0.0, 0.0);
            for (let s = 0; s < ns; s++) {
                const u = (i + Math.random()) / nx;
                const v = (j + Math.random()) / ny;
                const r = camera.get_ray(u, v);
                col = col.plus(color(r, list, 0));
            }
            col = col.divn(ns);
            col = new Vec3(Math.sqrt(col.x), Math.sqrt(col.y), Math.sqrt(col.z));
            const ir = Math.floor(col.x * 255.99);
            const ig = Math.floor(col.y * 255.99);
            const ib = Math.floor(col.z * 255.99);
            console.log(`${ir} ${ig} ${ib}`);
            console.error(`${(ny - j) * nx + i}/${nx * ny}`);
        }
    }
};

main().catch(err => console.error(err));
