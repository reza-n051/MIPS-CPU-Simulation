import * as readline from 'readline';
import Cpu from './Cpu';
import { NumberArray } from './types';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export default class Simulator {
    private testOrCode: boolean | undefined;
    private instructions: NumberArray = [];
    private dataMemory: NumberArray = [];
    private regFile: NumberArray = [];

    public async run() {

        if (this.testOrCode === undefined) {
            return;
        }

        if (this.testOrCode === true) {
            this.setDummyValuesForMemoriesTest();
        } else {
            this.setDummyValuesForMemories();
        }

        let cpu: Cpu = new Cpu(this.instructions, this.dataMemory, this.regFile);
        console.log("register file before excurte statements :: ");
        this.printData(cpu.getRF().getData(), 32);
        console.log("data memory before excurte statements :: ");
        this.printData(cpu.getDateMemory().getData(), 128);
        cpu.run();
        console.log("register file after excurte statements :: ");
        this.printData(cpu.getRF().getData(), 32);
        console.log("data memory after excurte statements :: ");
        this.printData(cpu.getDateMemory().getData(), 128);
    }

    public start() {
        rl.on('line', (answer: string) => {
            if (answer.trim() === "test" && this.instructions.length === 0) {
                this.testOrCode = true;
                rl.close();
            }else if (/^[0-1]+$/.test(answer.trim())) {
                if(answer.trim().length>32){
                    console.log("Instruction length must be less than 32");
                }else{
                    console.log(`line ${this.instructions.length} : ${answer.trim()}`);
                    this.testOrCode = false;
                    this.instructions.push(parseInt(answer.trim(), 2));
    
                }
            } else if (answer === "end") {
                rl.close();
            }else {
                console.log("input is wrong.");
            }
        });
        rl.on('close', () => {
            this.run();
        });
    }


    private printData(data: NumberArray, arrLength: number): void {
        for (let i = 0; i < arrLength; i++) {
            const datem: number = data[i];
            if (datem !== 0) {
                console.log(`data of index ${i} is ${datem}`);
            }
        }
    }

    private setDummyValuesForMemories() {
        this.dataMemory = new Array(128).fill(0);
        this.regFile = new Array(32).fill(0);
    }

    private setDummyValuesForMemoriesTest() {
        let dataMemory: NumberArray = new Array(128).fill(0);
        let instructionMemory: NumberArray = new Array(256).fill(0);
        let regFile: NumberArray = new Array(32).fill(0);
        regFile[10] = 16;
        dataMemory[16] = 35;
        dataMemory[17] = 50;
        dataMemory[18] = 141;
        dataMemory[19] = 215;
        dataMemory[20] = 58;
        dataMemory[21] = 25;
        dataMemory[22] = 105;
        dataMemory[23] = 305;
        dataMemory[24] = 52;
        dataMemory[25] = 53;
        instructionMemory[0] = parseInt("00100000000011110000000000001001", 2);
        instructionMemory[1] = parseInt("00000001010000000101100000100000", 2);
        instructionMemory[2] = parseInt("10001101011010010000000000000000", 2);
        instructionMemory[3] = parseInt("00000001001000000001000000100000", 2);
        instructionMemory[4] = parseInt("00000001001000000001100000100000", 2);
        instructionMemory[5] = parseInt("00000000000000000010000000100000", 2);
        instructionMemory[6] = parseInt("00100001011010110000000000000001", 2);
        instructionMemory[7] = parseInt("00100000100001000000000000000001", 2);
        instructionMemory[8] = parseInt("10001101011011000000000000000000", 2);
        instructionMemory[9] = parseInt("00000001001011000100100000100000", 2);
        instructionMemory[10] = parseInt("00000001100000100110100000101010", 2);
        instructionMemory[11] = parseInt("00010001101000000000000000000001", 2);
        instructionMemory[12] = parseInt("00000001100000000001000000100000", 2);
        instructionMemory[13] = parseInt("00000000011011000111000000101010", 2);
        instructionMemory[14] = parseInt("00010001110000000000000000000001", 2);
        instructionMemory[15] = parseInt("00000001100000000001100000100000", 2);
        instructionMemory[16] = parseInt("00010000100011110000000000000001", 2);
        instructionMemory[17] = parseInt("00001000000000000000000000000110", 2);
        this.instructions = instructionMemory;
        this.dataMemory = dataMemory;
        this.regFile = regFile;

    }

}
