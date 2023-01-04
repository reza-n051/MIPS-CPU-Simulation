export type NumberArray = Array<number>;
export type AluOutput = {
    z: number,
    output: number,
    lt: number,
    gt: number
};
export type RFoutput = RegFileReadOut | RegFileWriteOut;
export type RegFileReadOut = {
    port1: number,
    port2: number
};
export type RegFileWriteOut = null;
export type MemoryOutput = MemoryReadOutput | MemoryWriteOutput;
export type MemoryReadOutput = {
    data: number
};
export type Instruction = number;
export type MemoryWriteOutput = null;

export type cuflags = {
    j: number,
    branch: number,
    regDst: number,
    memRead: number,
    memToReg: number,
    aluOp: number,
    memWrite: number,
    aluSrc: number,
    regWrite: number
};

export type SubInstruction = {
    z0_5: number,
    z0_15: number,
    z0_25: number,
    z11_15: number,
    z16_20: number,
    z21_25: number,
    z26_31: number,
}