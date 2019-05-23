import { Vec3 } from "./vec3";

export class Perlin {
    static ranvec: Array<Vec3>;
    static perm_x: Array<number>;
    static perm_y: Array<number>;
    static perm_z: Array<number>;

    static noise(p: Vec3) {
        let u = p.x - Math.floor(p.x);
        let v = p.y - Math.floor(p.y);
        let w = p.z - Math.floor(p.z);
        const i = Math.floor(p.x);
        const j = Math.floor(p.y);
        const k = Math.floor(p.z);
        let c = [[[new Vec3(0, 0, 0), new Vec3(0, 0, 0)], [new Vec3(0, 0, 0), new Vec3(0, 0, 0)]], [[new Vec3(0, 0, 0), new Vec3(0, 0, 0)], [new Vec3(0, 0, 0), new Vec3(0, 0, 0)]]];
        for (let di = 0; di < 2; di++)
            for (let dj = 0; dj < 2; dj++)
                for (let dk = 0; dk < 2; dk++)
                    c[di][dj][dk] = Perlin.ranvec[Perlin.perm_x[(i + di) & 255] ^ Perlin.perm_y[(j + dj) & 255] ^ Perlin.perm_z[(k + dk) & 255]];

        return Perlin.perlin_interp(c, u, v, w);
    }

    static perlin_generate() {
        const p: Array<Vec3> = new Array();
        for (let i = 0; i < 256; ++i) {
            p[i] = new Vec3(-1 + 2 * Math.random(), -1 + 2 * Math.random(), -1 + 2 * Math.random()).to_unit();
        }
        return p;
    }

    static permute(p: Array<number>, n: number) {
        for (let i = n - 1; i > 0; i--) {
            let target = Math.floor(Math.random() * (i + 1));
            let tmp = p[i];
            p[i] = p[target];
            p[target] = tmp;
        }
    }

    static perlin_generate_perm() {
        const p: Array<number> = new Array(256);
        for (let i = 0; i < 256; ++i) {
            p[i] = i;
        }
        Perlin.permute(p, 256);
        return p;
    }

    static trilinear_interp(c: Array<Array<Array<number>>>, u: number, v: number, w: number) {
        let accum = 0.0;
        for (let i = 0; i < 2; i++)
            for (let j = 0; j < 2; j++)
                for (let k = 0; k < 2; k++)
                    accum +=
                        (i * u + (1 - i) * (1 - u)) *
                        (j * v + (1 - j) * (1 - v)) *
                        (k * w + (1 - k) * (1 - w)) * c[i][j][k];
        return accum;
    }

    static perlin_interp(c: Array<Array<Array<Vec3>>>, u: number, v: number, w: number) {
        const uu = u * u * (3 - 2 * u);
        const vv = v * v * (3 - 2 * v);
        const ww = w * w * (3 - 2 * w);
        let accum = 0;
        for (let i = 0; i < 2; i++)
            for (let j = 0; j < 2; j++)
                for (let k = 0; k < 2; k++) {
                    const weight_v = new Vec3(u - i, v - j, w - k);
                    accum += (i * uu + (1 - i) * (1 - uu)) *
                        (j * vv + (1 - j) * (1 - vv)) *
                        (k * ww + (1 - k) * (1 - ww)) * (c[i][j][k].dot(weight_v));
                }
        return accum;
    }


    static init() {
        Perlin.ranvec = Perlin.perlin_generate();
        Perlin.perm_x = Perlin.perlin_generate_perm();
        Perlin.perm_y = Perlin.perlin_generate_perm();
        Perlin.perm_z = Perlin.perlin_generate_perm();
    }
}


