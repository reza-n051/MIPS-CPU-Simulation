import { NumberArray, MemoryOutput, MemoryReadOutput } from './types';
export default class DataMemory {
    private memory: NumberArray = [];


    public constructor(data: NumberArray) {
        this.memory =data;
    }
    public getData(): NumberArray {
        return this.memory;
    }
    public write(port: number, data: number) {
        this.memory[port] = data;
    }
    public read(port: number) : MemoryReadOutput{
        let data = this.memory[port];
        return {
            data: data
        }
    }
    public run(port: number, data: number, MemWrite: number, MemRead: number) {
        let output: MemoryOutput = null;
        if (MemWrite === 0b1) {
            this.write(port, data);
        }
        if (MemRead === 0b1) {
            output = this.read(port);
        }
        return output;
    }
}