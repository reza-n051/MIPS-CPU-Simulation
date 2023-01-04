import ALU from "./ALU";
import DataMemory from "./DataMemory";
import InstructionMemory from "./InstructionMemory";
import RegisterFile from "./RegFile";
import { NumberArray, cuflags, Instruction, RFoutput, SubInstruction, RegFileReadOut, AluOutput, MemoryOutput, MemoryReadOutput } from "./types";

export default class Cpu {
    private pc: number;
    private regFile: RegisterFile;
    private instMem: InstructionMemory;
    private dataMem: DataMemory;
    private alu: ALU;

    public constructor(instructions: NumberArray, memoryData: NumberArray, rFData: NumberArray) {
        this.pc = 0b0;
        this.instMem = new InstructionMemory(instructions);
        this.alu = new ALU();
        this.dataMem = new DataMemory(memoryData);
        this.regFile = new RegisterFile(rFData);
    }

    public run() {
        //run instruction
        while (this.pc < 256 * 4) {
            const instrucion: Instruction = this.instMem.run(this.pc);
            const subInstruction: SubInstruction = this.getSubInstruction(instrucion);

            const cuflags: cuflags = this.cu(subInstruction.z26_31);

            const alucu: number = this.aluCu(cuflags.aluOp, subInstruction.z0_5, subInstruction.z26_31);

            let regFileOutput: RFoutput = this.regFile.run(0,subInstruction.z21_25, subInstruction.z16_20, 0, 0, 0);

            const aluResult: AluOutput = this.alu.run(
                (regFileOutput as RegFileReadOut).port1,
                cuflags.aluSrc === 0b1 ? subInstruction.z0_15 : (regFileOutput as RegFileReadOut).port2,
                alucu
            );
            const dataMemory_Data: MemoryOutput = this.dataMem.run(
                aluResult.output,
                (regFileOutput as RegFileReadOut).port2,
                cuflags.memWrite,
                cuflags.memRead
            );

            //calcute pc
            const pc = this.pc + 4;
            const jPc31_28 = (parseInt((pc + Math.pow(2, 32)).toString(2).substring(1, 5), 2) + Math.pow(2, 4)).toString(2).substring(1);
            const jPc28_0 = (parseInt((subInstruction.z0_25 * 4).toString(2), 2) + Math.pow(2, 28)).toString(2).substring(1);
            const jPc = parseInt(jPc31_28.concat(jPc28_0), 2);
            const branchPc = subInstruction.z0_15 * 4 + pc;

            this.pc = cuflags.j === 0b1 ? jPc : (cuflags.branch === 0b1 && aluResult.z === 0b1) ? branchPc : pc;


            // write back in register file
            regFileOutput = this.regFile.run(
                subInstruction.z26_31,
                0,
                0,
                cuflags.regDst === 0b1 ? subInstruction.z11_15 : subInstruction.z16_20,
                cuflags.memToReg ? (dataMemory_Data as MemoryReadOutput).data : subInstruction.z0_5 === 42 ? aluResult.gt : aluResult.output,
                cuflags.regWrite
            );
        }

    }
    

    private cu(opcode: number): cuflags {
        
        let flags: cuflags = {
            j: opcode === 2 ? 0b1 : 0b0,
            branch: (opcode === 4 || opcode === 5) ? 0b1 : 0b0,
            aluOp: (opcode === 0 || opcode === 8 || opcode === 12 || opcode === 13) ? 0b10 : (opcode === 4 || opcode === 5) ? 0b01 : 0b0,
            aluSrc: (opcode !== 0b0 && opcode !== 0b100 && opcode !== 0b101) ? 0b1 : 0b0,
            memRead: (opcode === 35) ? 0b1 : 0b0,
            memToReg: (opcode === 35) ? 0b1 : 0b0,
            memWrite: (opcode === 43) ? 0b1 : 0b0,
            regDst: (opcode === 0) ? 0b1 : 0b0,
            regWrite: (opcode === 35 || opcode === 0 || opcode === 8 || opcode === 12 || opcode === 13) ? 0b1 : 0b0
        }
        return flags;
    }

    private aluCu(aluOp: number, funct: number, opcode: number): number {
        const number = aluOp === 0 ? 2 :
            aluOp === 1 ? 6 :
                funct === 32 ? 2 : funct === 34 ? 6 : funct === 36 ? 0 : funct === 37 ? 1 : funct === 42 ? 7 :
                    opcode === 8 ? 2 : opcode === 12 ? 0 : opcode === 13 ? 1 : 10
            ;
        return number;
    }

    private getSubInstruction(instruction: Instruction): SubInstruction {
        const instStr: string = (instruction + Math.pow(2, 32)).toString(2).substring(1);

        const subInstruction: SubInstruction = {

            z26_31: parseInt(instStr.substring(0, 6), 2),
            z21_25: parseInt(instStr.substring(6, 11), 2),
            z16_20: parseInt(instStr.substring(11, 16), 2),
            z11_15: parseInt(instStr.substring(16, 21), 2),
            z0_5: parseInt(instStr.substring(26, 32), 2),
            z0_15: parseInt(instStr.substring(16, 32), 2),
            z0_25: parseInt(instStr.substring(6, 32), 2)
        };
        return subInstruction;
    }

    public getDateMemory(): DataMemory {
        return this.dataMem;
    }

    public getRF(): RegisterFile {
        return this.regFile;
    }

}