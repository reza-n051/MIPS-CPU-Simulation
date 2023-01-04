import { NumberArray } from './types';
export default class InstructionMemory {
    private memory: NumberArray = [];

    public constructor(instructions: NumberArray) {
        this.memory = instructions;
    }

    private read(port: number) {
        let data = this.memory[port];
        return data;
    }
    public run(readPort: number) {
        let output = this.read(readPort/4);
        return output;
    }
}