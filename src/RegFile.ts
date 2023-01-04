
import { NumberArray, RFoutput } from './types';
export default class RegisterFile {
    private registerFile: NumberArray = [];


    public constructor(data: NumberArray) {
        this.registerFile = data;
    }

    public getData(): NumberArray {
        return this.registerFile;
    }

    public write(port: number, data: number) {
        this.registerFile[port] = data;
    }
    public read(read1Port: number, read2Port: number) {
        let port1Data = this.registerFile[read1Port];
        let port2Data = this.registerFile[read2Port];
        return {
            port1: port1Data,
            port2: port2Data,
        }
    }
    public run(s:number,read1Port: number, read2Port: number, writePort: number, data: number, regWrite: number) {
        let output: RFoutput = null;
        if (regWrite === 0b1) {
            this.write(writePort, data);
        } else {
            output = this.read(read1Port, read2Port);
        }
        return output;
    }
}