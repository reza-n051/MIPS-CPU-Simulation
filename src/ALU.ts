import { AluOutput } from './types';
export default class ALU {
    public run(a: number, b: number, opcode: number): AluOutput {
        let output, lt = 0b0, gt = 0b0, z = 0b0;
        switch (opcode) {
            case 0b0010:
                output = a + b;
                break;
            case 0b0110:
                output = a - b;
                break;
            case 0b0000:
                output = a & b;
                break;
            case 0b0001:
                output = a | b;
                break;
            case 0b0100:
                output = a ^ b;
                break;
            default:
                output = a + b;
                break;
        }
        if (a < b) {
            gt = 0b1;
        } else {
            lt = 0b1;
        }
        if (output === 0b0) {
            z = 0b1;
        }
        return {
            output: output,
            z: z,
            lt: lt,
            gt: gt
        }
    }

}