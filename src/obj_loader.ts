import { AABB } from "./aabb";
import { Vec3 } from "./vec3";
import { Ray } from "./ray";
import { Hittable } from "./hittable";
import { HitRecord } from "./hit_record";
import { Material } from "./material";
import { surrounding_box } from "./util";
import * as readline from "readline";
import * as fs from "fs";
import { Polygon } from "./polygon";

// vとfしかみない簡易版
export class ObjLoader {
    //box: AABB;

    static load(filename: string, mat: Material): Array<Hittable> {
        const data = fs.readFileSync(filename, 'utf-8');
        const lines = data.split("\n");


        const vertexs = new Array<Vec3>();
        const polygons = new Array<Polygon>();
        for (let line of lines) {
            if (line.startsWith("v ")) {
                const vvv = line.slice(2).split(" ").map((n) => parseFloat(n));
                if (vvv.length != 3) {
                    throw new Error("load obj error.");
                }
                vertexs.push(new Vec3(vvv[0], vvv[1], vvv[2]));
            }
            if (line.startsWith("f ")) {
                const iii = line.slice(2).split(" ").map((n) => {
                    // n = "123//345" みたいな文字列
                    const indexes = n.split("//"); // ただしくない。ちゃんとパースする。
                    if (indexes.length < 1) {
                        throw new Error("load obj error.");
                    }
                    return parseInt(indexes[0]);
                });
                if (iii.length != 3) {
                    throw new Error("load obj error.");
                }
                polygons.push(new Polygon(vertexs[iii[0] - 1], vertexs[iii[1] - 1], vertexs[iii[2] - 1], mat));
            }
        }
        console.error(polygons.length);

        return polygons;
    }
}
