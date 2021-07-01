import { readByteAtPc, readWordAtPc, readByte, writeByte } from '../readWriteOperations';
import { Cpu, getBC, setBC, getDE, setDE, getHL, setHL, setAF, setZeroFlag, setHalfCarryFlag, setNegativeFlag, getZeroFlag, getCarryFlag, setCarryFlag, setIme, unsetIme } from './state';
import { getLowNibble, getHighByte, getLowByte, combineBytes, getBitValue, setBitValue } from '../helpers';
import { handleCBOpcode } from './callbackOpcode';

function handle0xOpcode(opcode: u8): i32 {
    switch (opcode) {
        case 0x0: {
            // "NOP"
            return 4;
        }
        case 0x1: {
            // "LD BC, nn"
            Cpu.C = readByteAtPc();
            Cpu.B = readByteAtPc();
            return 12;
        }
        case 0x2: {
            // "LD (BC), A"
            const bcAddress = getBC();
            writeByte(bcAddress, Cpu.A);
            return 8;
        }
        case 0x3: {
            // "INC BC"
            const value = ((getBC() + 1) & 0xFFFF); 
            setBC(value);
            // syncCycle(4)
            return 8;
        }
        case 0x4: {
            // "INC B"
            const value = ((Cpu.B + 1) & 0xFF); 
            const halfCarry: bool = ((getLowNibble(Cpu.B) + 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(0);
            Cpu.B = value;
            return 4;
        }
        case 0x5: {
            // "DEC B"
            const value = ((Cpu.B - 1) & 0xFF);
            const halfCarry: bool = ((getLowNibble(Cpu.B) - 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(1);
            Cpu.B = value;
            return 4;
        }
        case 0x6: {
            // "LD B, n"
            Cpu.B = readByteAtPc();
            return 8;
        }
        case 0x7: {
            // "RLCA"
            const eighthBit = getBitValue(Cpu.A, 7);
            const shiftedValue = Cpu.A << 1;
            Cpu.A = setBitValue(shiftedValue, 0, eighthBit);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag(0);
            setCarryFlag(eighthBit);
            return 4;
        }
        case 0x8: {
            // "LD (nn), SP"
            const lowN = readByteAtPc();
            writeByte(lowN, getLowByte(Cpu.sp));
            const highN = readByteAtPc();
            writeByte(highN, getHighByte(Cpu.sp));
            return 20;
        }
        case 0x9: {
            // "ADD HL, BC"
            const hl = getHL();
            const bc = getBC();
            const result = hl + bc;
            const halfCarry: bool = ((getLowNibble(Cpu.L) + getLowByte(Cpu.C)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag(result > 0xFFFF ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setHL(result & 0xFFFF);
            // syncCycle(4)
            return 8;
        }
        case 0xA: {
            // "LD A, (BC)"
            const bcAddress = getBC();
            Cpu.A = readByte(bcAddress);
            return 8;
        }
        case 0xB: {
            // "DEC BC"
            const bc = getBC();
            const bcDec = ((bc - 1) & 0xFFFF);
            setBC(bcDec);
            // syncCycle(4)
            return 8;
        }
        case 0xC: {
            // "INC C"
            const value = ((Cpu.C + 1) & 0xFF); 
            const halfCarry: bool = ((getLowNibble(Cpu.C) + 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(0);
            Cpu.C = value;
            return 4;
        }
        case 0xD: {
            // "DEC C"
            const value = ((Cpu.C - 1) & 0xFF);
            const halfCarry: bool = ((getLowNibble(Cpu.C) - 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(1);
            Cpu.C = value;
            return 4;
        }
        case 0xE: {
            // "LD C, n"
            Cpu.C = readByteAtPc();
            return 8;
        }
        case 0xF: {
            // "RRCA"
            const firstBit = getBitValue(Cpu.A, 0);
            const shiftedValue = Cpu.A >> 1;
            Cpu.A = setBitValue(shiftedValue, 7, firstBit);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag(0);
            setCarryFlag(firstBit);
            return 4;
        }
        default: {
            abort("Impossible opcode");
            return -1;
        }
    }
}

function handle1xOpcode(opcode: u8): i32 {
    switch (opcode) {
        case 0x0: {
            // "STOP"
            abort("STOP CRASH IN GAMEBOY CLASSIC");
            // WEIRD_INSTRUCTION ONLY USE IN GBC
            Cpu.pc += 1;
            return 4;
        }
        case 0x1: {
            // "LD DE, nn"
            Cpu.E = readByteAtPc();
            Cpu.D = readByteAtPc();
            return 12;
        }
        case 0x2: {
            // "LD (DE), A"
            const deAddress = getDE();
            writeByte(deAddress, Cpu.A);
            return 8;
        }
        case 0x3: {
            // "INC DE"
            const value = ((getDE() + 1) & 0xFFFF); 
            setDE(value);
            // syncCycle(4)
            return 8;
        }
        case 0x4: {
            // "INC D"
            const value = ((Cpu.D + 1) & 0xFF); 
            const halfCarry: bool = ((getLowNibble(Cpu.D) + 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(0);
            Cpu.D = value;
            return 4;
        }
        case 0x5: {
            // "DEC D"
            const value = ((Cpu.D - 1) & 0xFF);
            const halfCarry: bool = ((getLowNibble(Cpu.D) - 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(1);
            Cpu.D = value;
            return 4;
        }
        case 0x6: {
            // "LD D, n"
            Cpu.D = readByteAtPc();
            return 8;
        }
        case 0x7: {
            // "RLA"
            const eighthBit = getBitValue(Cpu.B, 7);
            const shiftedValue = Cpu.A << 1;
            Cpu.A = setBitValue(shiftedValue, 0, getCarryFlag());
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag(0);
            setCarryFlag(eighthBit);
            return 4;
        }
        case 0x8: {
            // "JR e"
            const relativeOffset: i8 = <i8>readByteAtPc();
            // syncCycle(4)
            Cpu.pc += relativeOffset;
            return 12;
        }
        case 0x9: {
            // "ADD HL, DE"
            const hl = getHL();
            const de = getDE();
            const result = hl + de;
            const halfCarry: bool = ((getLowNibble(Cpu.L) + getLowByte(Cpu.E)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag(result > 0xFFFF ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setHL(result & 0xFFFF);
            // syncCycle(4)
            return 8;
        }
        case 0xA: {
            // "LD A, (DE)"
            const deAddress = getDE();
            Cpu.A = readByte(deAddress);
            return 8;
        }
        case 0xB: {
            // "DEC DE"
            const value = ((getDE() - 1) & 0xFFFF); 
            setDE(value);
            // syncCycle(4)
            return 8;
        }
        case 0xC: {
            // "INC E"
            const value = Cpu.E + 1;
            const halfCarry: bool = ((getLowNibble(Cpu.E) + 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(0);
            Cpu.E = value;
            return 4;
        }
        case 0xD: {
            // "DEC E"
            const value = ((Cpu.E - 1) & 0xFF);
            const halfCarry: bool = ((getLowNibble(Cpu.E) - 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(1);
            Cpu.E = value;
            return 4;
        }
        case 0xE: {
            // "LD E, n"
            Cpu.E = readByteAtPc();
            return 8;
        }
        case 0xF: {
            // "RRA"
            const firstBit = getBitValue(Cpu.A, 0);
            const shiftedValue = Cpu.A >> 1;
            Cpu.A = setBitValue(shiftedValue, 7, getCarryFlag());
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag(0);
            setCarryFlag(firstBit);
            return 4;
        }
        default: {
            abort("Impossible opcode");
            return -1;
        }
    }
}

function handle2xOpcode(opcode: u8): i32 {
    switch (opcode) {
        case 0x0: {
            // "JR NZ, e"
            const relativeOffset: i8 = <i8>readByteAtPc();
            const zeroFlag = getZeroFlag();
            if (zeroFlag == 0) {
                Cpu.pc += relativeOffset;
                // syncCycle(4)
                return 12;
            }
            return 8;
        }
        case 0x1: {
            // "LD HL, nn"
            Cpu.L = readByteAtPc();
            Cpu.H = readByteAtPc();
            return 12;
        }
        case 0x2: {
            // "LD (HL+), A"
            const hl = getHL();
            writeByte(hl, Cpu.A);
            const hlInc = ((hl + 1) & 0xFFFF);
            setHL(hlInc);
            return 8;
        }
        case 0x3: {
            // "INC HL"
            const value = ((getHL() + 1) & 0xFFFF); 
            setHL(value);
            // syncCycle(4)
            return 8;
        }
        case 0x4: {
            // "INC H"
            const value = ((Cpu.H + 1) & 0xFF); 
            const halfCarry: bool = ((getLowNibble(Cpu.H) + 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(0);
            Cpu.H = value;
            return 4;
        }
        case 0x5: {
            // "DEC H"
            const value = ((Cpu.H - 1) & 0xFF);
            const halfCarry: bool = ((getLowNibble(Cpu.H) - 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(1);
            Cpu.H = value;
            return 4;
        }
        case 0x6: {
            // "LD H, n"
            Cpu.H = readByteAtPc();
            return 8;
        }
        case 0x7: {
            // "DAA"
            // OPCODE_TBD
            return 4;
        }
        case 0x8: {
            // "JR Z, e"
            const relativeOffset: i8 = <i8>readByteAtPc();
            const zeroFlag = getZeroFlag();
            if (zeroFlag == 1) {
                Cpu.pc += relativeOffset;
                // syncCycle(4)
                return 12;
            }
            return 8;
        }
        case 0x9: {
            // "ADD HL, HL"
            const hl = getHL();
            const result = hl + hl;
            const halfCarry: bool = ((getLowNibble(Cpu.L) + getLowByte(Cpu.L)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag(result > 0xFFFF ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setHL(result & 0xFFFF);
            // syncCycle(4)
            return 8;
        }
        case 0xA: {
            // "LD A, (HL+)"
            const hl = getHL();
            Cpu.A = readByte(hl);
            const hlInc = ((hl + 1) & 0xFFFF);
            setHL(hlInc);
            return 8;
        }
        case 0xB: {
            // "DEC HL"
            const value = ((getHL() - 1) & 0xFFFF); 
            setHL(value);
            // syncCycle(4)
            return 8;
        }
        case 0xC: {
            // "INC L"
            const value = ((Cpu.L + 1) & 0xFF); 
            const halfCarry: bool = ((getLowNibble(Cpu.L) + 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(0);
            Cpu.L = value;
            return 4;
        }
        case 0xD: {
            // "DEC L"
            const value = ((Cpu.L - 1) & 0xFF);
            const halfCarry: bool = ((getLowNibble(Cpu.L) - 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(1);
            Cpu.L = value;
            return 4;
        }
        case 0xE: {
            // "LD L, n"
            Cpu.L = readByteAtPc();
            return 8;
        }
        case 0xF: {
            // "CPL"
            Cpu.A = Cpu.A ^ 0xFF;
            setHalfCarryFlag(1);
            setNegativeFlag(1);
            return 4;
        }
        default: {
            abort("Impossible opcode");
            return -1;
        }
    }    
}

function handle3xOpcode(opcode: u8): i32 {
    switch (opcode) {
        case 0x0: {
            // "JR NC, e"
            const relativeOffset: i8 = <i8>readByteAtPc();
            const carryFlag = getCarryFlag();
            if (carryFlag == 0) {
                Cpu.pc += relativeOffset;
                // syncCycle(4)
                return 12;
            }
            return 8;
        }
        case 0x1: {
            // "LD SP, nn"
            Cpu.sp = readWordAtPc();
            return 12;
        }
        case 0x2: {
            // "LD (HL-), A"
            const hl = getHL();
            writeByte(hl, Cpu.A);
            const hlDec = ((hl - 1) & 0xFFFF);
            setHL(hlDec);
            return 8;
        }
        case 0x3: {
            // "INC SP"
            const spInc = ((Cpu.sp + 1) & 0xFFFF);
            Cpu.sp = spInc;
            // syncCycle(4)
            return 8;
        }
        case 0x4: {
            // "INC (HL)"
            const hl = getHL();
            const value = readByte(hl);
            const valueInc = ((value + 1) & 0xFF);
            const halfCarry: bool = ((getLowNibble(value) + 1) & 0x10) > 0 ? 1 : 0;
            setNegativeFlag(0);
            setZeroFlag(valueInc > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            writeByte(hl, valueInc);
            return 12;
        }
        case 0x5: {
            // "DEC (HL)"
            const hl = getHL();
            const value = readByte(hl);
            const valueDec = ((value - 1) & 0xFF);
            const halfCarry: bool = ((getLowNibble(value) - 1) & 0x10) > 0 ? 1 : 0;
            setNegativeFlag(1);
            setZeroFlag(valueDec > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            writeByte(hl, valueDec);
            return 12;
        }
        case 0x6: {
            // "LD (HL), n"
            const n = readByteAtPc();
            const hlAddress = getHL();
            writeByte(hlAddress, n);
            return 12;
        }
        case 0x7: {
            // "SCF"
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setCarryFlag(1);
            return 4;
        }
        case 0x8: {
            // "JR C, e"
            const relativeOffset: i8 = <i8>readByteAtPc();
            const carryFlag = getCarryFlag();
            if (carryFlag) {
                Cpu.pc += relativeOffset;
                // syncCycle(4)
                return 12;
            }
            return 8;
        }
        case 0x9: {
            // "ADD HL, SP"
            const hl = getHL();
            const result = hl + Cpu.sp;
            const halfCarry: bool = ((getLowNibble(Cpu.L) + getLowByte(Cpu.sp)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag(result > 0xFFFF ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setHL(result & 0xFFFF);
            // syncCycle(4)
            return 8;
        }
        case 0xA: {
            // "LD A, (HL-)"
            const hl = getHL();
            Cpu.A = readByte(hl);
            const hlDec = ((hl - 1) & 0xFFFF);
            setHL(hlDec);
            return 8;
        }
        case 0xB: {
            // "DEC SP"
            const spDec = ((Cpu.sp - 1) & 0xFFFF);
            Cpu.sp = spDec;
            // syncCycle(4)
            return 8;
        }
        case 0xC: {
            // "INC A"
            const value = ((Cpu.A + 1) & 0xFF);
            const halfCarry: bool = ((getLowNibble(Cpu.A) + 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(0);
            Cpu.A = value;
            return 4;
        }
        case 0xD: {
            // "DEC A"
            const value = ((Cpu.A - 1) & 0xFF);
            const halfCarry: bool = ((getLowNibble(Cpu.A) - 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(1);
            Cpu.A = value;
            return 4;
        }
        case 0xE: {
            // "LD A, n"
            Cpu.A = readByteAtPc();
            return 8;
        }
        case 0xF: {
            // "CCF"
            // OPCODE_TBD
            return 4;
        }
        default: {
            abort("Impossible opcode");
            return -1;
        }
    }    
}

function handle4xOpcode(opcode: u8): i32 {
    switch (opcode) {
        case 0x0: {
            // "LD B, B"
            Cpu.B = Cpu.B;
            return 4;
        }
        case 0x1: {
            // "LD B, C"
            Cpu.B = Cpu.C;
            return 4;
        }
        case 0x2: {
            // "LD B, D"
            Cpu.B = Cpu.D;
            return 4;
        }
        case 0x3: {
            // "LD B, E"
            Cpu.B = Cpu.E;
            return 4;
        }
        case 0x4: {
            // "LD B, H"
            Cpu.B = Cpu.H;
            return 4;
        }
        case 0x5: {
            // "LD B, L"
            Cpu.B = Cpu.L;
            return 4;
        }
        case 0x6: {
            // "LD B, (HL)"
            const hl = getHL();
            Cpu.B = readByte(hl);
            return 8;
        }
        case 0x7: {
            // "LD B, A"
            Cpu.B = Cpu.A;
            return 4;
        }
        case 0x8: {
            // "LD C, B"
            Cpu.C = Cpu.B;
            return 4;
        }
        case 0x9: {
            // "LD C, C"
            Cpu.C = Cpu.C;
            return 4;
        }
        case 0xA: {
            // "LD C, D"
            Cpu.C = Cpu.D;
            return 4;
        }
        case 0xB: {
            // "LD C, E"
            Cpu.C = Cpu.E;
            return 4;
        }
        case 0xC: {
            // "LD C, H"
            Cpu.C = Cpu.H;
            return 4;
        }
        case 0xD: {
            // "LD C, L"
            Cpu.C = Cpu.L;
            return 4;
        }
        case 0xE: {
            // "LD C, (HL)"
            const hl = getHL();
            Cpu.C = readByte(hl);
            return 8;
        }
        case 0xF: {
            // "LD C, A"
            Cpu.C = Cpu.A;
            return 4;
        }
        default: {
            abort("Impossible opcode");
            return -1;
        }
    }
}

function handle5xOpcode(opcode: u8): i32 {
    switch (opcode) {
        case 0x0: {
            // "LD D, B"
            Cpu.D = Cpu.B;
            return 4;
        }
        case 0x1: {
            // "LD D, C"
            Cpu.D = Cpu.C;
            return 4;
        }
        case 0x2: {
            // "LD D, D"
            Cpu.D = Cpu.D;
            return 4;
        }
        case 0x3: {
            // "LD D, E"
            Cpu.D = Cpu.E;
            return 4;
        }
        case 0x4: {
            // "LD D, H"
            Cpu.D = Cpu.H;
            return 4;
        }
        case 0x5: {
            // "LD D, L"
            Cpu.D = Cpu.L;
            return 4;
        }
        case 0x6: {
            // "LD D, (HL)"
            const hl = getHL();
            Cpu.D = readByte(hl);
            return 8;
        }
        case 0x7: {
            // "LD D, A"
            Cpu.D = Cpu.A;
            return 4;
        }
        case 0x8: {
            // "LD E, B"
            Cpu.E = Cpu.B;
            return 4;
        }
        case 0x9: {
            // "LD E, C"
            Cpu.E = Cpu.C;
            return 4;
        }
        case 0xA: {
            // "LD E, D"
            Cpu.E = Cpu.D;
            return 4;
        }
        case 0xB: {
            // "LD E, E"
            Cpu.E = Cpu.E;
            return 4;
        }
        case 0xC: {
            // "LD E, H"
            Cpu.E = Cpu.H;
            return 4;
        }
        case 0xD: {
            // "LD E, L"
            Cpu.E = Cpu.L;
            return 4;
        }
        case 0xE: {
            // "LD E, (HL)"
            const hl = getHL();
            Cpu.E = readByte(hl);
            return 8;
        }
        case 0xF: {
            // "LD E, A"
            Cpu.E = Cpu.A;
            return 4;
        }
        default: {
            abort("Impossible opcode");
            return -1;
        }
    }
}

function handle6xOpcode(opcode: u8): i32 {
    switch (opcode) {
        case 0x0: {
            // "LD H, B"
            Cpu.H = Cpu.B;
            return 4;
        }
        case 0x1: {
            // "LD H, C"
            Cpu.H = Cpu.C;
            return 4;
        }
        case 0x2: {
            // "LD H, D"
            Cpu.H = Cpu.D;
            return 4;
        }
        case 0x3: {
            // "LD H, E"
            Cpu.H = Cpu.E;
            return 4;
        }
        case 0x4: {
            // "LD H, H"
            Cpu.H = Cpu.H;
            return 4;
        }
        case 0x5: {
            // "LD H, L"
            Cpu.H = Cpu.L;
            return 4;
        }
        case 0x6: {
            // "LD H, (HL)"
            const hl = getHL();
            Cpu.H = readByte(hl);
            return 8;
        }
        case 0x7: {
            // "LD H, A"
            Cpu.H = Cpu.A;
            return 4;
        }
        case 0x8: {
            // "LD L, B"
            Cpu.L = Cpu.B;
            return 4;
        }
        case 0x9: {
            // "LD L, C"
            Cpu.L = Cpu.C;
            return 4;
        }
        case 0xA: {
            // "LD L, D"
            Cpu.L = Cpu.D;
            return 4;
        }
        case 0xB: {
            // "LD L, E"
            Cpu.L = Cpu.E;
            return 4;
        }
        case 0xC: {
            // "LD L, H"
            Cpu.L = Cpu.H;
            return 4;
        }
        case 0xD: {
            // "LD L, L"
            Cpu.L = Cpu.L;
            return 4;
        }
        case 0xE: {
            // "LD L, (HL)"
            const hl = getHL();
            Cpu.L = readByte(hl);
            return 8;
        }
        case 0xF: {
            // "LD L, A"
            Cpu.L = Cpu.A;
            return 4;
        }
        default: {
            abort("Impossible opcode");
            return -1;
        }
    }
}

function handle7xOpcode(opcode: u8): i32 {
    switch (opcode) {
        case 0x0: {
            // "LD (HL), B"
            const hl = getHL();
            writeByte(hl, Cpu.B);
            return 8;
        }
        case 0x1: {
            // "LD (HL), C"
            const hl = getHL();
            writeByte(hl, Cpu.C);
            return 8;
        }
        case 0x2: {
            // "LD (HL), D"
            const hl = getHL();
            writeByte(hl, Cpu.D);
            return 8;
        }
        case 0x3: {
            // "LD (HL), E"
            const hl = getHL();
            writeByte(hl, Cpu.E);
            return 8;
        }
        case 0x4: {
            // "LD (HL), H"
            const hl = getHL();
            writeByte(hl, Cpu.H);
            return 8;
        }
        case 0x5: {
            // "LD (HL), L"
            const hl = getHL();
            writeByte(hl, Cpu.L);
            return 8;
        }
        case 0x6: {

            // TBD
            // "HALT"
            // TBD

            return 4;
        }
        case 0x7: {
            // "LD (HL), A"
            const hl = getHL();
            writeByte(hl, Cpu.A);
            return 8;
        }
        case 0x8: {
            // "LD A, B"
            Cpu.A = Cpu.B;
            return 4;
        }
        case 0x9: {
            // "LD A, C"
            Cpu.A = Cpu.C;
            return 4;
        }
        case 0xA: {
            // "LD A, D"
            Cpu.A = Cpu.D;
            return 4;
        }
        case 0xB: {
            // "LD A, E"
            Cpu.A = Cpu.E;
            return 4;
        }
        case 0xC: {
            // "LD A, H"
            Cpu.A = Cpu.H;
            return 8;
        }
        case 0xD: {
            // "LD A, L"
            Cpu.A = Cpu.L;
            return 4;
        }
        case 0xE: {
            // "LD A, (HL)"
            const hl = getHL();
            Cpu.A = readByte(hl);
            return 8;
        }
        case 0xF: {
            // "LD A, A"
            Cpu.A = Cpu.A;
            return 8;
        }
        default: {
            abort("Impossible opcode");
            return -1;
        }
    }
}

function handle8xOpcode(opcode: u8): i32 {
    switch (opcode) {
        case 0x0: {
            // "ADD A, B"
            const result = Cpu.A + Cpu.B;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.B)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0x1: {
            // "ADD A, C"
            const result = Cpu.A + Cpu.C;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.C)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0x2: {
            // "ADD A, D"
            const result = Cpu.A + Cpu.D;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.D)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0x3: {
            // "ADD A, E"
            const result = Cpu.A + Cpu.E;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.E)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0x4: {
            // "ADD A, H"
            const result = Cpu.A + Cpu.H;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.H)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0x5: {
            // "ADD A, L"
            const result = Cpu.A + Cpu.L;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.L)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0x6: {
            // "ADD A, (HL)"
            const hl = getHL();
            const hlValue = readByte(hl);
            const result = Cpu.A + hlValue;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(hlValue)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 8;
        }
        case 0x7: {
            // "ADD A, A"
            const result = Cpu.A + Cpu.A;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.A)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0x8: {
            // "ADC A, B"
            const carry = <u8>getCarryFlag();
            const result = Cpu.A + Cpu.B + carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.B) + carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0x9: {
            // "ADC A, C"
            const carry = <u8>getCarryFlag();
            const result = Cpu.A + Cpu.C + carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.C) + carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0xA: {
            // "ADC A, D"
            const carry = <u8>getCarryFlag();
            const result = Cpu.A + Cpu.D + carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.D) + carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0xB: {
            // "ADC A, E"
            const carry = <u8>getCarryFlag();
            const result = Cpu.A + Cpu.E + carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.E) + carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0xC: {
            // "ADC A, H"
            const carry = <u8>getCarryFlag();
            const result = Cpu.A + Cpu.H + carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.H) + carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0xD: {
            // "ADC A, L"
            const carry = <u8>getCarryFlag();
            const result = Cpu.A + Cpu.L + carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.L) + carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0xE: {
            // "ADC A, (HL)"
            const carry = <u8>getCarryFlag();
            const hl = getHL();
            const value = readByte(hl);
            const result = Cpu.A + value + carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(value) + carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 8;
        }
        case 0xF: {
            // "ADC A, A"
            const carry = <u8>getCarryFlag();
            const result = Cpu.A + Cpu.A + carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.A) + carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        default: {
            abort("Impossible opcode");
            return -1;
        }
    }
}

function handle9xOpcode(opcode: u8): i32 {
    switch (opcode) {
        case 0x0: {
            // "SUB A, B"
            const result = Cpu.A - Cpu.B;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.B)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0x1: {
            // "SUB A, C"
            const result = Cpu.A - Cpu.C;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.C)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0x2: {
            // "SUB A, D"
            const result = Cpu.A - Cpu.D;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.D)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0x3: {
            // "SUB A, E"
            const result = Cpu.A - Cpu.E;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.E)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0x4: {
            // "SUB A, H"
            const result = Cpu.A - Cpu.H;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.H)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0x5: {
            // "SUB A, L"
            const result = Cpu.A - Cpu.L;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.L)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0x6: {
            // "SUB A, (HL)"
            const hl = getHL();
            const hlValue = readByte(hl);
            const result = Cpu.A - hlValue;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(hlValue)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 8;
        }
        case 0x7: {
            // "SUB A, A"
            const result = Cpu.A - Cpu.A;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.A)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0x8: {
            // "SBC A, B"
            const carry = <u8>getCarryFlag();
            const result = Cpu.A - Cpu.B - carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.B) - carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0x9: {
            // "SBC A, C"
            const carry = <u8>getCarryFlag();
            const result = Cpu.A - Cpu.C - carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.C) - carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0xA: {
            // "SBC A, D"
            const carry = <u8>getCarryFlag();
            const result = Cpu.A - Cpu.D - carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.D) - carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0xB: {
            // "SBC A, E"
            const carry = <u8>getCarryFlag();
            const result = Cpu.A - Cpu.E - carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.E) - carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0xC: {
            // "SBC A, H"
            const carry = <u8>getCarryFlag();
            const result = Cpu.A - Cpu.H - carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.H) - carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0xD: {
            // "SBC A, L"
            const carry = <u8>getCarryFlag();
            const result = Cpu.A - Cpu.L - carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.L) - carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        case 0xE: {
            // "SBC A, (HL)"
            const carry = <u8>getCarryFlag();
            const hl = getHL();
            const value = readByte(hl);
            const result = Cpu.A - value - carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(value) - carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 8;
        }
        case 0xF: {
            // "SBC A, A"
            const carry = <u8>getCarryFlag();
            const result = Cpu.A - Cpu.A - carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.A) - carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 4;
        }
        default: {
            abort("Impossible opcode");
            return -1;
        }
    }
}

function handleAxOpcode(opcode: u8): i32 {
    switch (opcode) {
        case 0x0: {
            // "AND A, B"
            const result = Cpu.A & Cpu.B;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(1);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 4;
        }
        case 0x1: {
            // "AND A, C"
            const result = Cpu.A & Cpu.C;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(1);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 4;
        }
        case 0x2: {
            // "AND A, D"
            const result = Cpu.A & Cpu.D;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(1);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 4;
        }
        case 0x3: {
            // "AND A, E"
            const result = Cpu.A & Cpu.E;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(1);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 4;
        }
        case 0x4: {
            // "AND A, H"
            const result = Cpu.A & Cpu.H;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(1);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 4;
        }
        case 0x5: {
            // "AND A, L"
            const result = Cpu.A & Cpu.L;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(1);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 4;
        }
        case 0x6: {
            // "AND A, (HL)"
            const hl = getHL();
            const hlValue = readByte(hl);
            const result = Cpu.A & hlValue;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(1);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 8;
        }
        case 0x7: {
            // "AND A, A"
            const result = Cpu.A & Cpu.A;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(1);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 4;
        }
        case 0x8: {
            // "XOR A, B"
            const result = Cpu.A ^ Cpu.B;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 4;
        }
        case 0x9: {
            // "XOR A, C"
            const result = Cpu.A ^ Cpu.C;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 4;
        }
        case 0xA: {
            // "XOR A, D"
            const result = Cpu.A ^ Cpu.D;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 4;
        }
        case 0xB: {
            // "XOR A, E"
            const result = Cpu.A ^ Cpu.E;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 4;
        }
        case 0xC: {
            // "XOR A, H"
            const result = Cpu.A ^ Cpu.H;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 4;
        }
        case 0xD: {
            // "XOR A, L"
            const result = Cpu.A ^ Cpu.L;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 4;
        }
        case 0xE: {
            // "XOR A, (HL)"
            const hl = getHL();
            const value = readByte(hl);
            const result = Cpu.A ^ value;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 8;
        }
        case 0xF: {
            // "XOR A, A"
            const result = Cpu.A ^ Cpu.A;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 4;
        }
        default: {
            abort("Impossible opcode");
            return -1;
        }
    }
}

function handleBxOpcode(opcode: u8): i32 {
    switch (opcode) {
        case 0x0: {
            // "OR A, B"
            const result = Cpu.A | Cpu.B;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 4;
        }
        case 0x1: {
            // "OR A, C"
            const result = Cpu.A | Cpu.C;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 4;
        }
        case 0x2: {
            // "OR A, D"
            const result = Cpu.A | Cpu.D;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 4;
        }
        case 0x3: {
            // "OR A, E"
            const result = Cpu.A | Cpu.E;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 4;
        }
        case 0x4: {
            // "OR A, H"
            const result = Cpu.A | Cpu.H;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 4;
        }
        case 0x5: {
            // "OR A, L"
            const result = Cpu.A | Cpu.L;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 4;
        }
        case 0x6: {
            // "OR A, (HL)"
            const hl = getHL();
            const hlValue = readByte(hl);
            const result = Cpu.A | hlValue;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 8;
        }
        case 0x7: {
            // "OR A, A"
            const result = Cpu.A | Cpu.A;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            return 4;
        }
        case 0x8: {
            // "CP A, B"
            const result = Cpu.A - Cpu.B;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.B)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            return 4;
        }
        case 0x9: {
            // "CP A, C"
            const result = Cpu.A - Cpu.C;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.C)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            return 4;
        }
        case 0xA: {
            // "CP A, D"
            const result = Cpu.A - Cpu.D;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.D)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            return 4;
        }
        case 0xB: {
            // "CP A, E"
            const result = Cpu.A - Cpu.E;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.E)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            return 4;
        }
        case 0xC: {
            // "CP A, H"
            const result = Cpu.A - Cpu.H;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.H)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            return 4;
        }
        case 0xD: {
            // "CP A, L"
            const result = Cpu.A - Cpu.L;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.L)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            return 4;
        }
        case 0xE: {
            // "CP A, (HL)"
            const hl = getHL();
            const value = readByte(hl);
            const result = Cpu.A - value;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(value)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            return 8;
        }
        case 0xF: {
            // "CP A, A"
            const result = Cpu.A - Cpu.A;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.A)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            return 4;
        }
        default: {
            abort("Impossible opcode");
            return -1;
        }
    }
}

function handleCxOpcode(opcode: u8): i32 {
    switch (opcode) {
        case 0x0: {
            // "RET NZ"
            const zeroFlag = getZeroFlag();
            // syncCycle(4)
            if (zeroFlag == 0) {
                const lowByte = readByte(Cpu.sp);
                const highByte = readByte(Cpu.sp + 1);
                Cpu.sp += 2;
                // syncCycle(4)
                Cpu.pc = combineBytes(highByte, lowByte);
                return 20;
            }
            return 8;
        }
        case 0x1: {
            // "POP BC"
            const lowByte = readByte(Cpu.sp);
            const highByte = readByte(Cpu.sp + 1);
            Cpu.sp += 2;
            setBC(combineBytes(highByte, lowByte));
            return 12;
        }
        case 0x2: {
            // "JP NZ, nn"
            const zeroFlag = getZeroFlag();
            const nn = readWordAtPc();
            if (zeroFlag == 0) {
                // syncCycle(4)
                Cpu.pc = nn;
                return 16;
            }
            return 12;
        }
        case 0x3: {
            // "JP nn"
            const nn = readWordAtPc();
            // "NN", 1, nn
            // syncCycle(4)
            Cpu.pc = nn;
            return 16;
        }
        case 0x4: {
            // "CALL NZ, nn"
            const zeroFlag = getZeroFlag();
            const nn = readWordAtPc();
            if (zeroFlag == 0) {
                // syncCycle(4)
                writeByte(Cpu.sp - 1, getHighByte(Cpu.pc));
                writeByte(Cpu.sp - 2, getLowByte(Cpu.pc));
                Cpu.sp -= 2;
                Cpu.pc = nn;
                return 24;
            }
            return 12;
        }
        case 0x5: {
            // "PUSH BC"
            // syncCycle(4)
            writeByte(Cpu.sp - 1, Cpu.B);
            writeByte(Cpu.sp - 2, Cpu.C);
            Cpu.sp -= 2;
            return 16;
        }
        case 0x6: {
            // "ADD A, n"
            const n = readByteAtPc();
            const result = Cpu.A + n;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(n)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 8;
        }
        case 0x7: {
            // "RST 00h"
            // syncCycle(4)
            writeByte(Cpu.sp - 1, getHighByte(Cpu.pc));
            writeByte(Cpu.sp - 2, getLowByte(Cpu.pc));
            Cpu.sp -= 2;
            Cpu.pc = 0x0;
            return 16;
        }
        case 0x8: {
            // "RET Z"
            const zeroFlag = getZeroFlag();
            // syncCycle(4)
            if (zeroFlag == 1) {
                const lowByte = readByte(Cpu.sp);
                const highByte = readByte(Cpu.sp + 1);
                Cpu.sp += 2;
                // syncCycle(4)
                Cpu.pc = combineBytes(highByte, lowByte);
                return 20;
            }
            return 8;
        }
        case 0x9: {
            // "RET"
            const lowByte = readByte(Cpu.sp);
            const highByte = readByte(Cpu.sp + 1);
            Cpu.sp += 2;
            // syncCycle(4)
            Cpu.pc = combineBytes(highByte, lowByte);
            return 16;
        }
        case 0xA: {
            // "JP Z"
            const zeroFlag = getZeroFlag();
            const nn = readWordAtPc();
            if (zeroFlag == 1) {
                // syncCycle(4);
                Cpu.pc = nn;
                return 16;
            }
            return 12;
        }
        case 0xB: {
            // "PREFIX CB"
            const cbOpcode = readByteAtPc();
            return handleCBOpcode(cbOpcode);
        }
        case 0xC: {
            // "CALL Z, nn"
            const zeroFlag = getZeroFlag();
            const nn = readWordAtPc();
            if (zeroFlag == 1) {
                // syncCycle(4)
                writeByte(Cpu.sp - 1, getHighByte(Cpu.pc));
                writeByte(Cpu.sp - 2, getLowByte(Cpu.pc));
                Cpu.sp -= 2;
                Cpu.pc = nn;
                return 24;
            }
            return 12;
        }
        case 0xD: {
            // "CALL nn"
            const nn = readWordAtPc();
            // syncCycle(4)
            writeByte(Cpu.sp - 1, getHighByte(Cpu.pc));
            writeByte(Cpu.sp - 2, getLowByte(Cpu.pc));
            Cpu.sp -= 2;
            Cpu.pc = nn;
            return 24;
        }
        case 0xE: {
            // "ADC A, n"
            const carry = <u8>getCarryFlag();
            const n = readByteAtPc();
            const result = Cpu.A + n + carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(n) + carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 8;
        }
        case 0xF: {
            // "RST 08h"
            // syncCycle(4)
            writeByte(Cpu.sp - 1, getHighByte(Cpu.pc));
            writeByte(Cpu.sp - 2, getLowByte(Cpu.pc));
            Cpu.sp -= 2;
            Cpu.pc = 0x08;
            return 16;
        }
        default: {
            abort("Impossible opcode");
            return -1;
        }
    }
}

function handleDxOpcode(opcode: u8): i32 {
    switch (opcode) {
        case 0x0: {
            // "RET NC"
            const carryFlag = getCarryFlag();
            // syncCycle(4)
            if (carryFlag == 0) {
                const lowByte = readByte(Cpu.sp);
                const highByte = readByte(Cpu.sp + 1);
                Cpu.sp += 2;
                // syncCycle(4)
                Cpu.pc = combineBytes(highByte, lowByte);
                return 20;
            }
            return 8;
        }
        case 0x1: {
            // "POP DE"
            const lowByte = readByte(Cpu.sp);
            const highByte = readByte(Cpu.sp + 1);
            Cpu.sp += 2;
            setDE(combineBytes(highByte, lowByte));
            return 12;
        }
        case 0x2: {
            // "JP NC, nn"
            const carryFlag = getCarryFlag();
            const nn = readWordAtPc();
            if (carryFlag == 0) {
                // syncCycle(4)
                Cpu.pc = nn;
                return 16;
            }
            return 12;
        }
        case 0x4: {
            // "CALL NC, nn"
            const carryFlag = getCarryFlag();
            const nn = readWordAtPc();
            if (carryFlag == 0) {
                // syncCycle(4)
                writeByte(Cpu.sp - 1, getHighByte(Cpu.pc));
                writeByte(Cpu.sp - 2, getLowByte(Cpu.pc));
                Cpu.sp -= 2;
                Cpu.pc = nn;
                return 24;
            }
            return 12;
        }
        case 0x5: {
            // "PUSH DE"
            // syncCycle(4)
            writeByte(Cpu.sp - 1, Cpu.D);
            writeByte(Cpu.sp - 2, Cpu.E);
            Cpu.sp -= 2;
            return 16;
        }
        case 0x6: {
            // "SUB A, n"
            const n = readByteAtPc();
            const result = Cpu.A - n;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(n)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 8;
        }
        case 0x7: {
            // "RST 10h"
            // syncCycle(4)
            writeByte(Cpu.sp - 1, getHighByte(Cpu.pc));
            writeByte(Cpu.sp - 2, getLowByte(Cpu.pc));
            Cpu.sp -= 2;
            Cpu.pc = 0x10;
            return 16;
        }
        case 0x8: {
            // "RET C"
            const carryFlag = getCarryFlag();
            // syncCycle(4)
            if (carryFlag == 1) {
                const lowByte = readByte(Cpu.sp);
                const highByte = readByte(Cpu.sp + 1);
                Cpu.sp += 2;
                // syncCycle(4)
                Cpu.pc = combineBytes(highByte, lowByte);
                return 20;
            }
            return 8;
        }
        case 0x9: {
            // "RETI"
            const lowByte = readByte(Cpu.sp);
            const highByte = readByte(Cpu.sp + 1);
            Cpu.sp += 2;
            // syncCycle(4)
            Cpu.pc = combineBytes(highByte, lowByte);
            setIme();
            return 16;
        }
        case 0xA: {
            // "JP C"
            const carryFlag = getCarryFlag();
            const nn = readWordAtPc();
            if (carryFlag == 1) {
                // syncCycle(4);
                Cpu.pc = nn;
                return 16;
            }
            return 12;
        }
        case 0xC: {
            // "CALL C, nn"
            const carryFlag = getCarryFlag();
            const nn = readWordAtPc();
            if (carryFlag == 1) {
                // syncCycle(4)
                writeByte(Cpu.sp - 1, getHighByte(Cpu.pc));
                writeByte(Cpu.sp - 2, getLowByte(Cpu.pc));
                Cpu.sp -= 2;
                Cpu.pc = nn;
                return 24;
            }
            return 12;
        }
        case 0xE: {
            // "SBC A, n"
            const carry = <u8>getCarryFlag();
            const n = readByteAtPc();
            const result = Cpu.A - n - carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(n) - carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            return 8;
        }
        case 0xF: {
            // "RST 18h"
            // syncCycle(4)
            writeByte(Cpu.sp - 1, getHighByte(Cpu.pc));
            writeByte(Cpu.sp - 2, getLowByte(Cpu.pc));
            Cpu.sp -= 2;
            Cpu.pc = 0x18;
            return 16;

        }
        default: {
            abort("Impossible opcode");
            return -1;
        }
    }
}

function handleExOpcode(opcode: u8): i32 {
    switch (opcode) {
        case 0x0: {
            // "LD (FF00 + n), A"
            const n = readByteAtPc();
            const address = combineBytes(0xFF, n);
            writeByte(address, Cpu.A);
            return 12;
        }
        case 0x1: {
            // "POP HL"
            const lowByte = readByte(Cpu.sp);
            const highByte = readByte(Cpu.sp + 1);
            Cpu.sp += 2;
            setHL(combineBytes(highByte, lowByte));
            return 12;
        }
        case 0x2: {
            // "LD (FF00 + C), A"
            const address = combineBytes(0xFF, Cpu.C);
            writeByte(address, Cpu.A);
            return 8;
        }
        case 0x5: {
            // "PUSH HL"
            // syncCycle(4)
            writeByte(Cpu.sp - 1, Cpu.H);
            writeByte(Cpu.sp - 2, Cpu.L);
            Cpu.sp -= 2;
            return 16;
        }
        case 0x6: {
            // "AND A, n"
            const n = readByteAtPc();
            const result = Cpu.A & n;
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            setNegativeFlag(0);
            setCarryFlag(0);
            setHalfCarryFlag(1);
            Cpu.A = result;
            return 8;
        }
        case 0x7: {
            // "RST 20h"
            // syncCycle(4)
            writeByte(Cpu.sp - 1, getHighByte(Cpu.pc));
            writeByte(Cpu.sp - 2, getLowByte(Cpu.pc));
            Cpu.sp -= 2;
            Cpu.pc = 0x20;
            return 16;
        }
        case 0x8: {
            // "ADD SP, n"
            const n = <i8>readByteAtPc();
            const result = Cpu.sp + n;
            const lowSp = getLowByte(Cpu.sp);
            const halfCarry: bool = ((getLowNibble(lowSp) - getLowNibble(n)) & 0x10) > 0 ? 1 : 0;
            setHalfCarryFlag(halfCarry);
            setCarryFlag(result > 0xFFFF ? 1 : 0);
            setZeroFlag(0);
            setNegativeFlag(0);
            Cpu.sp = result & 0xFFFF;
            return 16;
        }
        case 0x9: {
            // "JP HL"
            Cpu.pc = getHL();
            return 4;
        }
        case 0xA: {
            // "LD (nn), A"
            const nn = readWordAtPc();
            writeByte(nn, Cpu.A);
            return 16;
        }
        case 0xE: {
            // "XOR A, n"
            const n = readByteAtPc();
            const result = Cpu.A ^ n;
            setZeroFlag(result > 0 ? 0 : 1);
            setCarryFlag(0);
            setHalfCarryFlag(0);
            setNegativeFlag(0);
            Cpu.A = result;
            return 8;
        }
        case 0xF: {
            // "RST 28h"
            // syncCycle(4)
            writeByte(Cpu.sp - 1, getHighByte(Cpu.pc));
            writeByte(Cpu.sp - 2, getLowByte(Cpu.pc));
            Cpu.sp -= 2;
            Cpu.pc = 0x28;
            return 16;
        }
        default: {
            abort("Impossible opcode");
            return -1;
        }
    }
}

function handleFxOpcode(opcode: u8): i32 {
    switch (opcode) {
        case 0x0: {
            // "LD A, (FF00 + n)"
            const n = readByteAtPc();
            const address = combineBytes(0xFF, n);
            Cpu.A = readByte(address);
            return 12;
        }
        case 0x1: {
            // "POP AF"
            const lowByte = readByte(Cpu.sp);
            const highByte = readByte(Cpu.sp + 1);
            Cpu.sp += 2;
            setAF(combineBytes(highByte, lowByte));
            return 12;
        }
        case 0x2: {
            // "LD A, (FF00 + C)"
            const address = combineBytes(0xFF, Cpu.C);
            Cpu.A = readByte(address);
            return 8;
        }
        case 0x3: {
            // "DI"
            unsetIme();
            return 4;
        }
        case 0x5: {
            // "PUSH AF"
            // syncCycle(4)
            writeByte(Cpu.sp - 1, Cpu.A);
            writeByte(Cpu.sp - 2, Cpu.F);
            Cpu.sp -= 2;
            return 16;
        }
        case 0x6: {
            // "OR A, n"
            const n = readByteAtPc();
            const result = Cpu.A | n;
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setCarryFlag(0);
            Cpu.A = result;
            return 8;
        }
        case 0x7: {
            // "RST 30h"
            // syncCycle(4)
            writeByte(Cpu.sp - 1, getHighByte(Cpu.pc));
            writeByte(Cpu.sp - 2, getLowByte(Cpu.pc));
            Cpu.sp -= 2;
            Cpu.pc = 0x30;
            return 16;
        }
        case 0x8: {
            // "LD HL, SP + n"
            // not sure about this instruction
            const n = <i8>readByteAtPc();
            const result = Cpu.sp + n;
            const lowSp = getLowByte(Cpu.sp);
            const halfCarry: bool = ((getLowNibble(lowSp) - getLowNibble(n)) & 0x10) > 0 ? 1 : 0;
            setHalfCarryFlag(halfCarry);
            setCarryFlag(result > 0xFFFF ? 1 : 0);
            setZeroFlag(0);
            setNegativeFlag(0);
            // syncCycle(4)
            setHL(result);
            return 12;
        }
        case 0x9: {
            // "LD SP, HL"
            // syncCycle(4)
            Cpu.sp = getHL();
            return 8;
        }
        case 0xA: {
            // "LD A, (nn)"
            const nn = readWordAtPc();
            Cpu.A = readByte(nn);
            return 16;
        }
        case 0xB: {
            // "EI"
            setIme();
            return 4;
        }
        case 0xE: {
            // "CP A, n"
            const n = readByteAtPc();
            const result = Cpu.A - n;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(n)) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(result > 0 ? 0 : 1);
            setCarryFlag(result > 0xFF ? 1 : 0);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(1);
            return 8;
        }
        case 0xF: {
            // "RST 38h"
            // syncCycle(4)
            writeByte(Cpu.sp - 1, getHighByte(Cpu.pc));
            writeByte(Cpu.sp - 2, getLowByte(Cpu.pc));
            Cpu.sp -= 2;
            Cpu.pc = 0x38;
            return 16;
        }
        default: {
            abort("Impossible opcode");
            return -1;
        }
    }
}

// Example: if opcode = 0x15
// firstNibble = 0x1
// secondNibble = 0x5
export function fetchExecuteOpcode(): i32 {
    const opcode: u8 = readByteAtPc();
    const firstNibble: u8 = opcode >> 4;
    const secondNibble: u8 = opcode & 0xF;

    switch (firstNibble) {
        case 0x0: return handle0xOpcode(secondNibble);
        case 0x1: return handle1xOpcode(secondNibble);
        case 0x2: return handle2xOpcode(secondNibble);
        case 0x3: return handle3xOpcode(secondNibble);
        case 0x4: return handle4xOpcode(secondNibble);
        case 0x5: return handle5xOpcode(secondNibble);
        case 0x6: return handle6xOpcode(secondNibble);
        case 0x7: return handle7xOpcode(secondNibble);
        case 0x8: return handle8xOpcode(secondNibble);
        case 0x9: return handle9xOpcode(secondNibble);
        case 0xA: return handleAxOpcode(secondNibble);
        case 0xB: return handleBxOpcode(secondNibble);
        case 0xC: return handleCxOpcode(secondNibble);
        case 0xD: return handleDxOpcode(secondNibble);
        case 0xE: return handleExOpcode(secondNibble);
        case 0xF: return handleFxOpcode(secondNibble);
        default: {
            abort("Imposible opcode");
            return -1;
        }
    }
}