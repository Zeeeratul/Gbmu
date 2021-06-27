import { readByteAtPc, readWordAtPc, readByte, writeByte } from './readWriteOperations';
import { Cpu, getBC, setBC, getDE, setDE, getHL, setHL, setZeroFlag, setHalfCarryFlag, setNegativeFlag, getZeroFlag, getCarryFlag, setCarryFlag, setAF } from './cpuState';
import { loadToRegister, loadToPairRegister, loadToMemoryAddress } from './instructions';
import { getLowNibble, getHighByte, getLowByte, combineBytes, getBitValue, setBitValue, getHighNibble, combineNibbles } from './helpers';


function handleCBOpcode(opcode: u8): void {
    switch (opcode) {
        case 0x20: {
            trace("SLA B");
            const result = Cpu.B << 1;
            setHalfCarryFlag(0);
            setNegativeFlag(0);
            setZeroFlag(result > 0 ? 0 : 1);
            setCarryFlag(result > 0xFF ? 1 : 0);
            Cpu.B = result;
            break;
        }
        case 0x21: {
            trace("SLA C");
            const result = Cpu.C << 1;
            setHalfCarryFlag(0);
            setNegativeFlag(0);
            setZeroFlag(result > 0 ? 0 : 1);
            setCarryFlag(result > 0xFF ? 1 : 0);
            Cpu.C = result;
            break;
        }
        case 0x22: {
            trace("SLA D");
            const result = Cpu.D << 1;
            setHalfCarryFlag(0);
            setNegativeFlag(0);
            setZeroFlag(result > 0 ? 0 : 1);
            setCarryFlag(result > 0xFF ? 1 : 0);
            Cpu.D = result;
            break;
        }
        case 0x23: {
            trace("SLA E");
            const result = Cpu.E << 1;
            setHalfCarryFlag(0);
            setNegativeFlag(0);
            setZeroFlag(result > 0 ? 0 : 1);
            setCarryFlag(result > 0xFF ? 1 : 0);
            Cpu.E = result;
            break;
        }
        case 0x24: {
            trace("SLA H");
            const result = Cpu.H << 1;
            setHalfCarryFlag(0);
            setNegativeFlag(0);
            setZeroFlag(result > 0 ? 0 : 1);
            setCarryFlag(result > 0xFF ? 1 : 0);
            Cpu.H = result;
            break;
        }
        case 0x25: {
            trace("SLA L");
            const result = Cpu.L << 1;
            setHalfCarryFlag(0);
            setNegativeFlag(0);
            setZeroFlag(result > 0 ? 0 : 1);
            setCarryFlag(result > 0xFF ? 1 : 0);
            Cpu.L = result;
            break;
        }
        case 0x26: {
            trace("SLA (HL)");
            const hl = getHL();
            const value = readByte(hl);
            const result = value << 1;
            setHalfCarryFlag(0);
            setNegativeFlag(0);
            setZeroFlag(result > 0 ? 0 : 1);
            setCarryFlag(result > 0xFF ? 1 : 0);
            writeByte(hl, result);
            break;
        }
        case 0x27: {
            trace("SLA A");
            const result = Cpu.A << 1;
            setHalfCarryFlag(0);
            setNegativeFlag(0);
            setZeroFlag(result > 0 ? 0 : 1);
            setCarryFlag(result > 0xFF ? 1 : 0);
            Cpu.A = result;
            break;
        }
        case 0x28: {
            trace("SRA B");
            let resultU8: u8;
            Cpu.B = 160;
            const value: i8 = Cpu.B;

            const result = value >> 1;
            // const i8Val: i8 = -80;
            // const u8Val: u8 = i8Val;

            trace("result", 1, result);
            resultU8 = result;
            trace("resultU8", 1, resultU8);

            // setNegativeFlag(0);
            // setZeroFlag(result > 0 ? 0 : 1);
            // setCarryFlag(result > 0xFF ? 1 : 0);
            // Cpu.B = result;
            break;
        }
        case 0x29: {
            trace("BIT 1, C");
            const bit = getBitValue(Cpu.C, 1);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x2A: {
            trace("BIT 1, D");
            const bit = getBitValue(Cpu.D, 1);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x2B: {
            trace("BIT 1, E");
            const bit = getBitValue(Cpu.E, 1);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x2C: {
            trace("BIT 1, H");
            const bit = getBitValue(Cpu.H, 1);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x2D: {
            trace("BIT 1, L");
            const bit = getBitValue(Cpu.L, 1);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x2E: {
            trace("BIT 1, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            const bit = getBitValue(value, 1);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x2F: {
            trace("BIT 1, A");
            const bit = getBitValue(Cpu.A, 1);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x30: {
            trace("SWAP B");
            const lowNibble = getLowNibble(Cpu.B);
            const highNibble = getHighNibble(Cpu.B);
            const swapped = combineNibbles(lowNibble, highNibble);
            Cpu.B = swapped;
            break;
        }
        case 0x31: {
            trace("SWAP C");
            const lowNibble = getLowNibble(Cpu.C);
            const highNibble = getHighNibble(Cpu.C);
            const swapped = combineNibbles(lowNibble, highNibble);
            Cpu.C = swapped;
            break;
        }
        case 0x32: {
            trace("SWAP D");
            const lowNibble = getLowNibble(Cpu.D);
            const highNibble = getHighNibble(Cpu.D);
            const swapped = combineNibbles(lowNibble, highNibble);
            Cpu.D = swapped;
            break;
        }
        case 0x33: {
            trace("SWAP E");
            const lowNibble = getLowNibble(Cpu.E);
            const highNibble = getHighNibble(Cpu.E);
            const swapped = combineNibbles(lowNibble, highNibble);
            Cpu.E = swapped;
            break;
        }
        case 0x34: {
            trace("SWAP H");
            const lowNibble = getLowNibble(Cpu.H);
            const highNibble = getHighNibble(Cpu.H);
            const swapped = combineNibbles(lowNibble, highNibble);
            Cpu.H = swapped;
            break;
        }
        case 0x35: {
            trace("SWAP L");
            const lowNibble = getLowNibble(Cpu.L);
            const highNibble = getHighNibble(Cpu.L);
            const swapped = combineNibbles(lowNibble, highNibble);
            Cpu.L = swapped;
            break;
        }
        case 0x36: {
            trace("SWAP (HL)");
            const hl = getHL();
            const value = readByte(hl);
            const lowNibble = getLowNibble(value);
            const highNibble = getHighNibble(value);
            const swapped = combineNibbles(lowNibble, highNibble);
            writeByte(hl, swapped);
            break;
        }
        case 0x37: {
            trace("SWAP A");
            const lowNibble = getLowNibble(Cpu.A);
            const highNibble = getHighNibble(Cpu.A);
            const swapped = combineNibbles(lowNibble, highNibble);
            Cpu.A = swapped;
            break;
        }
        case 0x38: {
            trace("SRL B");
            const result = Cpu.B >> 1;
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag(result > 0 ? 0 : 1);
            setCarryFlag(0)
            Cpu.B = result;
            break;
        }
        case 0x39: {
            trace("SRL C");
            const result = Cpu.C >> 1;
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag(result > 0 ? 0 : 1);
            setCarryFlag(0)
            Cpu.C = result;
            break;
        }
        case 0x3A: {
            trace("SRL D");
            const result = Cpu.D >> 1;
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag(result > 0 ? 0 : 1);
            setCarryFlag(0)
            Cpu.D = result;
            break;
        }
        case 0x3B: {
            trace("SRL E");
            const result = Cpu.E >> 1;
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag(result > 0 ? 0 : 1);
            setCarryFlag(0)
            Cpu.E = result;
            break;
        }
        case 0x3C: {
            trace("SRL H");
            const result = Cpu.H >> 1;
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag(result > 0 ? 0 : 1);
            setCarryFlag(0)
            Cpu.H = result;
            break;
        }
        case 0x3D: {
            trace("SRL L");
            const result = Cpu.L >> 1;
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag(result > 0 ? 0 : 1);
            setCarryFlag(0)
            Cpu.L = result;
            break;
        }
        case 0x3E: {
            trace("SRL (HL)");
            const hl = getHL();
            const value = readByte(hl);
            const result = value >> 1;
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag(result > 0 ? 0 : 1);
            setCarryFlag(0)
            writeByte(hl, value);
            break;
        }
        case 0x3F: {
            trace("SRL A");
            const result = Cpu.A >> 1;
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag(result > 0 ? 0 : 1);
            setCarryFlag(0)
            Cpu.A = result;
            break;
        }
        case 0x40: {
            trace("BIT 0, B");
            const bit = getBitValue(Cpu.B, 0);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x41: {
            trace("BIT 0, C");
            const bit = getBitValue(Cpu.C, 0);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x42: {
            trace("BIT 0, D");
            const bit = getBitValue(Cpu.D, 0);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x43: {
            trace("BIT 0, E");
            const bit = getBitValue(Cpu.E, 0);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x44: {
            trace("BIT 0, H");
            const bit = getBitValue(Cpu.H, 0);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x45: {
            trace("BIT 0, L");
            const bit = getBitValue(Cpu.L, 0);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x46: {
            trace("BIT 0, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            const bit = getBitValue(value, 0);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x47: {
            trace("BIT 0, A");
            const bit = getBitValue(Cpu.A, 0);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x48: {
            trace("BIT 1, B");
            const bit = getBitValue(Cpu.B, 1);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x49: {
            trace("BIT 1, C");
            const bit = getBitValue(Cpu.C, 1);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x4A: {
            trace("BIT 1, D");
            const bit = getBitValue(Cpu.D, 1);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x4B: {
            trace("BIT 1, E");
            const bit = getBitValue(Cpu.E, 1);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x4C: {
            trace("BIT 1, H");
            const bit = getBitValue(Cpu.H, 1);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x4D: {
            trace("BIT 1, L");
            const bit = getBitValue(Cpu.L, 1);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x4E: {
            trace("BIT 1, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            const bit = getBitValue(value, 1);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x4F: {
            trace("BIT 1, A");
            const bit = getBitValue(Cpu.A, 1);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x50: {
            trace("BIT 2, B");
            const bit = getBitValue(Cpu.B, 2);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x51: {
            trace("BIT 2, C");
            const bit = getBitValue(Cpu.C, 2);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x52: {
            trace("BIT 2, D");
            const bit = getBitValue(Cpu.D, 2);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x53: {
            trace("BIT 2, E");
            const bit = getBitValue(Cpu.E, 2);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x54: {
            trace("BIT 2, H");
            const bit = getBitValue(Cpu.H, 2);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x55: {
            trace("BIT 2, L");
            const bit = getBitValue(Cpu.L, 2);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x56: {
            trace("BIT 2, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            const bit = getBitValue(value, 2);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x57: {
            trace("BIT 2, A");
            const bit = getBitValue(Cpu.A, 2);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x58: {
            trace("BIT 3, B");
            const bit = getBitValue(Cpu.B, 3);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x59: {
            trace("BIT 3, C");
            const bit = getBitValue(Cpu.C, 3);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x5A: {
            trace("BIT 3, D");
            const bit = getBitValue(Cpu.D, 3);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x5B: {
            trace("BIT 3, E");
            const bit = getBitValue(Cpu.E, 3);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x5C: {
            trace("BIT 3, H");
            const bit = getBitValue(Cpu.H, 3);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x5D: {
            trace("BIT 3, L");
            const bit = getBitValue(Cpu.L, 3);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x5E: {
            trace("BIT 3, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            const bit = getBitValue(value, 3);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x5F: {
            trace("BIT 3, A");
            const bit = getBitValue(Cpu.A, 3);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x60: {
            trace("BIT 4, B");
            const bit = getBitValue(Cpu.B, 4);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x61: {
            trace("BIT 4, C");
            const bit = getBitValue(Cpu.C, 4);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x62: {
            trace("BIT 4, D");
            const bit = getBitValue(Cpu.D, 4);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x63: {
            trace("BIT 4, E");
            const bit = getBitValue(Cpu.E, 4);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x64: {
            trace("BIT 4, H");
            const bit = getBitValue(Cpu.H, 4);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x65: {
            trace("BIT 4, L");
            const bit = getBitValue(Cpu.L, 4);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x66: {
            trace("BIT 4, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            const bit = getBitValue(value, 4);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x67: {
            trace("BIT 4, A");
            const bit = getBitValue(Cpu.A, 4);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x68: {
            trace("BIT 5, B");
            const bit = getBitValue(Cpu.B, 5);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x69: {
            trace("BIT 5, C");
            const bit = getBitValue(Cpu.C, 5);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x6A: {
            trace("BIT 5, D");
            const bit = getBitValue(Cpu.D, 5);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x6B: {
            trace("BIT 5, E");
            const bit = getBitValue(Cpu.E, 5);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x6C: {
            trace("BIT 5, H");
            const bit = getBitValue(Cpu.H, 5);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x6D: {
            trace("BIT 5, L");
            const bit = getBitValue(Cpu.L, 5);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x6E: {
            trace("BIT 5, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            const bit = getBitValue(value, 5);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x6F: {
            trace("BIT 5, A");
            const bit = getBitValue(Cpu.A, 5);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x70: {
            trace("BIT 6, B");
            const bit = getBitValue(Cpu.B, 6);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x71: {
            trace("BIT 6, C");
            const bit = getBitValue(Cpu.C, 6);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x72: {
            trace("BIT 6, D");
            const bit = getBitValue(Cpu.D, 6);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x73: {
            trace("BIT 6, E");
            const bit = getBitValue(Cpu.E, 6);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x74: {
            trace("BIT 6, H");
            const bit = getBitValue(Cpu.H, 6);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x75: {
            trace("BIT 6, L");
            const bit = getBitValue(Cpu.L, 6);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x76: {
            trace("BIT 6, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            const bit = getBitValue(value, 6);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x77: {
            trace("BIT 6, A");
            const bit = getBitValue(Cpu.A, 6);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x78: {
            trace("BIT 7, B");
            const bit = getBitValue(Cpu.B, 7);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x79: {
            trace("BIT 7, C");
            const bit = getBitValue(Cpu.C, 7);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x7A: {
            trace("BIT 7, D");
            const bit = getBitValue(Cpu.D, 7);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x7B: {
            trace("BIT 7, E");
            const bit = getBitValue(Cpu.E, 7);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x7C: {
            trace("BIT 7, H");
            const bit = getBitValue(Cpu.H, 7);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x7D: {
            trace("BIT 7, L");
            const bit = getBitValue(Cpu.L, 7);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x7E: {
            trace("BIT 7, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            const bit = getBitValue(value, 7);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x7F: {
            trace("BIT 7, A");
            const bit = getBitValue(Cpu.A, 7);
            setHalfCarryFlag(1);
            setNegativeFlag(0);
            setZeroFlag(bit);
            break;
        }
        case 0x80: {
            trace("RES 0, B");
            Cpu.B = setBitValue(Cpu.B, 0, 0);
            break;
        }
        case 0x81: {
            trace("RES 0, C");
            Cpu.C = setBitValue(Cpu.C, 0, 0);
            break;
        }
        case 0x82: {
            trace("RES 0, D");
            Cpu.D = setBitValue(Cpu.D, 0, 0);
            break;
        }
        case 0x83: {
            trace("RES 0, E");
            Cpu.E = setBitValue(Cpu.E, 0, 0);
            break;
        }
        case 0x84: {
            trace("RES 0, H");
            Cpu.H = setBitValue(Cpu.H, 0, 0);
            break;
        }
        case 0x85: {
            trace("RES 0, L");
            Cpu.L = setBitValue(Cpu.L, 0, 0);
            break;
        }
        case 0x86: {
            trace("RES 0, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            writeByte(hl, setBitValue(value, 0, 0));
            break;
        }
        case 0x87: {
            trace("RES 0, A");
            Cpu.A = setBitValue(Cpu.A, 0, 0);
            break;
        }
        case 0x88: {
            trace("RES 1, B");
            Cpu.B = setBitValue(Cpu.B, 1, 0);
            break;
        }
        case 0x89: {
            trace("RES 1, C");
            Cpu.C = setBitValue(Cpu.C, 1, 0);
            break;
        }
        case 0x8A: {
            trace("RES 1, D");
            Cpu.D = setBitValue(Cpu.D, 1, 0);
            break;
        }
        case 0x8B: {
            trace("RES 1, E");
            Cpu.E = setBitValue(Cpu.E, 1, 0);
            break;
        }
        case 0x8C: {
            trace("RES 1, H");
            Cpu.H = setBitValue(Cpu.H, 1, 0);
            break;
        }
        case 0x8D: {
            trace("RES 1, L");
            Cpu.L = setBitValue(Cpu.L, 1, 0);
            break;
        }
        case 0x8E: {
            trace("RES 1, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            writeByte(hl, setBitValue(value, 1, 0));
            break;
        }
        case 0x8F: {
            trace("RES 1, A");
            Cpu.A = setBitValue(Cpu.A, 1, 0);
            break;
        }
        case 0x90: {
            trace("RES 2, B");
            Cpu.B = setBitValue(Cpu.B, 2, 0);
            break;
        }
        case 0x91: {
            trace("RES 2, C");
            Cpu.C = setBitValue(Cpu.C, 2, 0);
            break;
        }
        case 0x92: {
            trace("RES 2, D");
            Cpu.D = setBitValue(Cpu.D, 2, 0);
            break;
        }
        case 0x93: {
            trace("RES 2, E");
            Cpu.E = setBitValue(Cpu.E, 2, 0);
            break;
        }
        case 0x94: {
            trace("RES 2, H");
            Cpu.H = setBitValue(Cpu.H, 2, 0);
            break;
        }
        case 0x95: {
            trace("RES 2, L");
            Cpu.L = setBitValue(Cpu.L, 2, 0);
            break;
        }
        case 0x96: {
            trace("RES 2, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            writeByte(hl, setBitValue(value, 2, 0));
            break;
        }
        case 0x97: {
            trace("RES 2, A");
            Cpu.A = setBitValue(Cpu.A, 2, 0);
            break;
        }
        case 0x98: {
            trace("RES 3, B");
            Cpu.B = setBitValue(Cpu.B, 3, 0);
            break;
        }
        case 0x99: {
            trace("RES 3, C");
            Cpu.C = setBitValue(Cpu.C, 3, 0);
            break;
        }
        case 0x9A: {
            trace("RES 3, D");
            Cpu.D = setBitValue(Cpu.D, 3, 0);
            break;
        }
        case 0x9B: {
            trace("RES 3, E");
            Cpu.E = setBitValue(Cpu.E, 3, 0);
            break;
        }
        case 0x9C: {
            trace("RES 3, H");
            Cpu.H = setBitValue(Cpu.H, 3, 0);
            break;
        }
        case 0x9D: {
            trace("RES 3, L");
            Cpu.L = setBitValue(Cpu.L, 3, 0);
            break;
        }
        case 0x9E: {
            trace("RES 3, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            writeByte(hl, setBitValue(value, 3, 0));
            break;
        }
        case 0x9F: {
            trace("RES 3, A");
            Cpu.A = setBitValue(Cpu.A, 3, 0);
            break;
        }
        case 0xA0: {
            trace("RES 4, B");
            Cpu.B = setBitValue(Cpu.B, 4, 0);
            break;
        }
        case 0xA1: {
            trace("RES 4, C");
            Cpu.C = setBitValue(Cpu.C, 4, 0);
            break;
        }
        case 0xA2: {
            trace("RES 4, D");
            Cpu.D = setBitValue(Cpu.D, 4, 0);
            break;
        }
        case 0xA3: {
            trace("RES 4, E");
            Cpu.E = setBitValue(Cpu.E, 4, 0);
            break;
        }
        case 0xA4: {
            trace("RES 4, H");
            Cpu.H = setBitValue(Cpu.H, 4, 0);
            break;
        }
        case 0xA5: {
            trace("RES 4, L");
            Cpu.L = setBitValue(Cpu.L, 4, 0);
            break;
        }
        case 0xA6: {
            trace("RES 4, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            writeByte(hl, setBitValue(value, 4, 0));
            break;
        }
        case 0xA7: {
            trace("RES 4, A");
            Cpu.A = setBitValue(Cpu.A, 4, 0);
            break;
        }
        case 0xA8: {
            trace("RES 5, B");
            Cpu.B = setBitValue(Cpu.B, 5, 0);
            break;
        }
        case 0xA9: {
            trace("RES 5, C");
            Cpu.C = setBitValue(Cpu.C, 5, 0);
            break;
        }
        case 0xAA: {
            trace("RES 5, D");
            Cpu.D = setBitValue(Cpu.D, 5, 0);
            break;
        }
        case 0xAB: {
            trace("RES 5, E");
            Cpu.E = setBitValue(Cpu.E, 5, 0);
            break;
        }
        case 0xAC: {
            trace("RES 5, H");
            Cpu.H = setBitValue(Cpu.H, 5, 0);
            break;
        }
        case 0xAD: {
            trace("RES 5, L");
            Cpu.L = setBitValue(Cpu.L, 5, 0);
            break;
        }
        case 0xAE: {
            trace("RES 5, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            writeByte(hl, setBitValue(value, 5, 0));
            break;
        }
        case 0xAF: {
            trace("RES 5, A");
            Cpu.A = setBitValue(Cpu.A, 5, 0);
            break;
        }
        case 0xB0: {
            trace("RES 6, B");
            Cpu.B = setBitValue(Cpu.B, 6, 0);
            break;
        }
        case 0xB1: {
            trace("RES 6, C");
            Cpu.C = setBitValue(Cpu.C, 6, 0);
            break;
        }
        case 0xB2: {
            trace("RES 6, D");
            Cpu.D = setBitValue(Cpu.D, 6, 0);
            break;
        }
        case 0xB3: {
            trace("RES 6, E");
            Cpu.E = setBitValue(Cpu.E, 6, 0);
            break;
        }
        case 0xB4: {
            trace("RES 6, H");
            Cpu.H = setBitValue(Cpu.H, 6, 0);
            break;
        }
        case 0xB5: {
            trace("RES 6, L");
            Cpu.L = setBitValue(Cpu.L, 6, 0);
            break;
        }
        case 0xB6: {
            trace("RES 6, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            writeByte(hl, setBitValue(value, 6, 0));
            break;
        }
        case 0xB7: {
            trace("RES 6, A");
            Cpu.A = setBitValue(Cpu.A, 6, 0);
            break;
        }
        case 0xB8: {
            trace("RES 7, B");
            Cpu.B = setBitValue(Cpu.B, 7, 0);
            break;
        }
        case 0xB9: {
            trace("RES 7, C");
            Cpu.C = setBitValue(Cpu.C, 7, 0);
            break;
        }
        case 0xBA: {
            trace("RES 7, D");
            Cpu.D = setBitValue(Cpu.D, 7, 0);
            break;
        }
        case 0xBB: {
            trace("RES 7, E");
            Cpu.E = setBitValue(Cpu.E, 7, 0);
            break;
        }
        case 0xBC: {
            trace("RES 7, H");
            Cpu.H = setBitValue(Cpu.H, 7, 0);
            break;
        }
        case 0xBD: {
            trace("RES 7, L");
            Cpu.L = setBitValue(Cpu.L, 7, 0);
            break;
        }
        case 0xBE: {
            trace("RES 7, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            writeByte(hl, setBitValue(value, 7, 0));
            break;
        }
        case 0xBF: {
            trace("RES 7, A");
            Cpu.A = setBitValue(Cpu.A, 7, 0);
            break;
        }
        case 0xC0: {
            trace("SET 0, B");
            Cpu.B = setBitValue(Cpu.B, 0, 1);
            break;
        }
        case 0xC1: {
            trace("SET 0, C");
            Cpu.C = setBitValue(Cpu.C, 0, 1);
            break;
        }
        case 0xC2: {
            trace("SET 0, D");
            Cpu.D = setBitValue(Cpu.D, 0, 1);
            break;
        }
        case 0xC3: {
            trace("SET 0, E");
            Cpu.E = setBitValue(Cpu.E, 0, 1);
            break;
        }
        case 0xC4: {
            trace("SET 0, H");
            Cpu.H = setBitValue(Cpu.H, 0, 1);
            break;
        }
        case 0xC5: {
            trace("SET 0, L");
            Cpu.L = setBitValue(Cpu.L, 0, 1);
            break;
        }
        case 0xC6: {
            trace("SET 0, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            writeByte(hl, setBitValue(value, 0, 1));
            break;
        }
        case 0xC7: {
            trace("SET 0, A");
            Cpu.A = setBitValue(Cpu.A, 0, 1);
            break;
        }
        case 0xC8: {
            trace("SET 1, B");
            Cpu.B = setBitValue(Cpu.B, 1, 1);
            break;
        }
        case 0xC9: {
            trace("SET 1, C");
            Cpu.C = setBitValue(Cpu.C, 1, 1);
            break;
        }
        case 0xCA: {
            trace("SET 1, D");
            Cpu.D = setBitValue(Cpu.D, 1, 1);
            break;
        }
        case 0xCB: {
            trace("SET 1, E");
            Cpu.E = setBitValue(Cpu.E, 1, 1);
            break;
        }
        case 0xCC: {
            trace("SET 1, H");
            Cpu.H = setBitValue(Cpu.H, 1, 1);
            break;
        }
        case 0xCD: {
            trace("SET 1, L");
            Cpu.L = setBitValue(Cpu.L, 1, 1);
            break;
        }
        case 0xCE: {
            trace("SET 1, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            writeByte(hl, setBitValue(value, 1, 1));
            break;
        }
        case 0xCF: {
            trace("SET 1, A");
            Cpu.A = setBitValue(Cpu.A, 1, 1);
            break;
        }
        case 0xD0: {
            trace("SET 2, B");
            Cpu.B = setBitValue(Cpu.B, 2, 1);
            break;
        }
        case 0xD1: {
            trace("SET 2, C");
            Cpu.C = setBitValue(Cpu.C, 2, 1);
            break;
        }
        case 0xD2: {
            trace("SET 2, D");
            Cpu.D = setBitValue(Cpu.D, 2, 1);
            break;
        }
        case 0xD3: {
            trace("SET 2, E");
            Cpu.E = setBitValue(Cpu.E, 2, 1);
            break;
        }
        case 0xD4: {
            trace("SET 2, H");
            Cpu.H = setBitValue(Cpu.H, 2, 1);
            break;
        }
        case 0xD5: {
            trace("SET 2, L");
            Cpu.L = setBitValue(Cpu.L, 2, 1);
            break;
        }
        case 0xD6: {
            trace("SET 2, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            writeByte(hl, setBitValue(value, 2, 1));
            break;
        }
        case 0xD7: {
            trace("SET 2, A");
            Cpu.A = setBitValue(Cpu.A, 2, 1);
            break;
        }
        case 0xD8: {
            trace("SET 3, B");
            Cpu.B = setBitValue(Cpu.B, 3, 1);
            break;
        }
        case 0xD9: {
            trace("SET 3, C");
            Cpu.C = setBitValue(Cpu.C, 3, 1);
            break;
        }
        case 0xDA: {
            trace("SET 3, D");
            Cpu.D = setBitValue(Cpu.D, 3, 1);
            break;
        }
        case 0xDB: {
            trace("SET 3, E");
            Cpu.E = setBitValue(Cpu.E, 3, 1);
            break;
        }
        case 0xDC: {
            trace("SET 3, H");
            Cpu.H = setBitValue(Cpu.H, 3, 1);
            break;
        }
        case 0xDD: {
            trace("SET 3, L");
            Cpu.L = setBitValue(Cpu.L, 3, 1);
            break;
        }
        case 0xDE: {
            trace("SET 3, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            writeByte(hl, setBitValue(value, 3, 1));
            break;
        }
        case 0xDF: {
            trace("SET 3, A");
            Cpu.A = setBitValue(Cpu.A, 3, 1);
            break;
        }
        case 0xE0: {
            trace("SET 4, B");
            Cpu.B = setBitValue(Cpu.B, 4, 1);
            break;
        }
        case 0xE1: {
            trace("SET 4, C");
            Cpu.C = setBitValue(Cpu.C, 4, 1);
            break;
        }
        case 0xE2: {
            trace("SET 4, D");
            Cpu.D = setBitValue(Cpu.D, 4, 1);
            break;
        }
        case 0xE3: {
            trace("SET 4, E");
            Cpu.E = setBitValue(Cpu.E, 4, 1);
            break;
        }
        case 0xE4: {
            trace("SET 4, H");
            Cpu.H = setBitValue(Cpu.H, 4, 1);
            break;
        }
        case 0xE5: {
            trace("SET 4, L");
            Cpu.L = setBitValue(Cpu.L, 4, 1);
            break;
        }
        case 0xE6: {
            trace("SET 4, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            writeByte(hl, setBitValue(value, 4, 1));
            break;
        }
        case 0xE7: {
            trace("SET 4, A");
            Cpu.A = setBitValue(Cpu.A, 4, 1);
            break;
        }
        case 0xE8: {
            trace("SET 5, B");
            Cpu.B = setBitValue(Cpu.B, 5, 1);
            break;
        }
        case 0xE9: {
            trace("SET 5, C");
            Cpu.C = setBitValue(Cpu.C, 5, 1);
            break;
        }
        case 0xEA: {
            trace("SET 5, D");
            Cpu.D = setBitValue(Cpu.D, 5, 1);
            break;
        }
        case 0xEB: {
            trace("SET 5, E");
            Cpu.E = setBitValue(Cpu.E, 5, 1);
            break;
        }
        case 0xEC: {
            trace("SET 5, H");
            Cpu.H = setBitValue(Cpu.H, 5, 1);
            break;
        }
        case 0xED: {
            trace("SET 5, L");
            Cpu.L = setBitValue(Cpu.L, 5, 1);
            break;
        }
        case 0xEE: {
            trace("SET 5, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            writeByte(hl, setBitValue(value, 5, 1));
            break;
        }
        case 0xEF: {
            trace("SET 5, A");
            Cpu.A = setBitValue(Cpu.A, 5, 1);
            break;
        }
        case 0xF0: {
            trace("SET 6, B");
            Cpu.B = setBitValue(Cpu.B, 6, 1);
            break;
        }
        case 0xF1: {
            trace("SET 6, C");
            Cpu.C = setBitValue(Cpu.C, 6, 1);
            break;
        }
        case 0xF2: {
            trace("SET 6, D");
            Cpu.D = setBitValue(Cpu.D, 6, 1);
            break;
        }
        case 0xF3: {
            trace("SET 6, E");
            Cpu.E = setBitValue(Cpu.E, 6, 1);
            break;
        }
        case 0xF4: {
            trace("SET 6, H");
            Cpu.H = setBitValue(Cpu.H, 6, 1);
            break;
        }
        case 0xF5: {
            trace("SET 6, L");
            Cpu.L = setBitValue(Cpu.L, 6, 1);
            break;
        }
        case 0xF6: {
            trace("SET 6, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            writeByte(hl, setBitValue(value, 6, 1));
            break;
        }
        case 0xF7: {
            trace("SET 6, A");
            Cpu.A = setBitValue(Cpu.A, 6, 1);
            break;
        }
        case 0xF8: {
            trace("SET 7, B");
            Cpu.B = setBitValue(Cpu.B, 7, 1);
            break;
        }
        case 0xF9: {
            trace("SET 7, C");
            Cpu.C = setBitValue(Cpu.C, 7, 1);
            break;
        }
        case 0xFA: {
            trace("SET 7, D");
            Cpu.D = setBitValue(Cpu.D, 7, 1);
            break;
        }
        case 0xFB: {
            trace("SET 7, E");
            Cpu.E = setBitValue(Cpu.E, 7, 1);
            break;
        }
        case 0xFC: {
            trace("SET 7, H");
            Cpu.H = setBitValue(Cpu.H, 7, 1);
            break;
        }
        case 0xFD: {
            trace("SET 7, L");
            Cpu.L = setBitValue(Cpu.L, 7, 1);
            break;
        }
        case 0xFE: {
            trace("SET 7, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            writeByte(hl, setBitValue(value, 7, 1));
            break;
        }
        case 0xFF: {
            trace("SET 7, A");
            Cpu.A = setBitValue(Cpu.A, 7, 1);
            break;
        }
        default: {
            new Error("Unreachable code");
            break;
        }
    }
}

function handle0xOpcode(opcode: u8): void {
    switch (opcode) {
        case 0x0: {
            trace("NOP");
            break;
        }
        case 0x1: {
            trace("LD BC, nn");
            Cpu.C = readByteAtPc();
            Cpu.B = readByteAtPc();
            break;
        }
        case 0x2: {
            trace("LD (BC), A");
            const bcAddress = getBC();
            writeByte(bcAddress, Cpu.A);
        }
        case 0x3: {
            trace("INC BC");
            const value = ((getBC() + 1) & 0xFFFF); 
            setBC(value);
            // syncCycle(4)
        }
        case 0x4: {
            trace("INC B");
            const value = ((Cpu.B + 1) & 0xFF); 
            const halfCarry: bool = ((getLowNibble(Cpu.B) + 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(0);
            Cpu.B = value;
        }
        case 0x5: {
            trace("DEC B");
            const value = ((Cpu.B - 1) & 0xFF);
            const halfCarry: bool = ((getLowNibble(Cpu.B) - 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(1);
            Cpu.B = value;
        }
        case 0x6: {
            trace("LD B, n");
            Cpu.B = readByteAtPc();
        }
        case 0x8: {
            trace("RLCA");
            const leftMostBit = Cpu.A & 0x80;
            Cpu.A = (Cpu.A << 1) & 0xFE;
            setCarryFlag(leftMostBit > 0 ? 1 : 0);
            setZeroFlag(0);
            setHalfCarryFlag(0);
            setNegativeFlag(0);
        }
        case 0x8: {
            trace("LD (nn), SP");
            const lowN = readByteAtPc();
            writeByte(lowN, getLowByte(Cpu.sp));
            const highN = readByteAtPc();
            writeByte(highN, getHighByte(Cpu.sp));
        }
        case 0x9: {
            trace("ADD HL, BC");
            const hl = getHL();
            const bc = getBC();
            const result = hl + bc;
            const halfCarry: bool = ((getLowNibble(Cpu.L) + getLowByte(Cpu.C)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag(result > 0xFFFF ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setHL(result & 0xFFFF);
            // syncCycle(4)
        }
        case 0xA: {
            trace("LD A, (BC)");
            const bcAddress = getBC();
            Cpu.A = readByte(bcAddress);
        }
        case 0xB: {
            trace("DEC BC");
            const bc = getBC();
            const bcDec = ((bc - 1) & 0xFFFF);
            setBC(bcDec);
            // syncCycle(4)
        }
        case 0xC: {
            trace("INC C");
            const value = ((Cpu.C + 1) & 0xFF); 
            const halfCarry: bool = ((getLowNibble(Cpu.C) + 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(0);
            Cpu.C = value;
        }
        case 0xD: {
            trace("DEC C");
            const value = ((Cpu.C - 1) & 0xFF);
            const halfCarry: bool = ((getLowNibble(Cpu.C) - 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(1);
            Cpu.C = value;
        }
        case 0xE: {
            trace("LD C, n");
            Cpu.C = readByteAtPc();
        }
        case 0xF: {
            trace("RRCA");
            const rightMostBit = Cpu.A & 1;
            let value = Cpu.A >> 1;
            if (rightMostBit == 1) {
                value = value & 0x80;
                setCarryFlag(1);
                
            } else {
                value = value | 0x80;
                setCarryFlag(0);
            }
            setZeroFlag(0);
            setHalfCarryFlag(0);
            setNegativeFlag(0);
        }
        default: {
            new Error("Unreachable code");
            break;
        }
    }
}

function handle1xOpcode(opcode: u8): void {
    switch (opcode) {
        case 0x0: {
            trace("STOP");
            // WEIRD_INSTRUCTION ONLY USE IN GBC
            Cpu.pc += 1;
            break;
        }
        case 0x1: {
            trace("LD DE, nn");
            Cpu.E = readByteAtPc();
            Cpu.D = readByteAtPc();
            break;
        }
        case 0x2: {
            trace("LD (DE), A");
            const deAddress = getDE();
            writeByte(deAddress, Cpu.A);
        }
        case 0x3: {
            trace("INC DE");
            const value = ((getDE() + 1) & 0xFFFF); 
            setDE(value);
            // syncCycle(4)
        }
        case 0x4: {
            trace("INC D");
            const value = ((Cpu.D + 1) & 0xFF); 
            const halfCarry: bool = ((getLowNibble(Cpu.D) + 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(0);
            Cpu.D = value;
        }
        case 0x5: {
            trace("DEC D");
            const value = ((Cpu.D - 1) & 0xFF);
            const halfCarry: bool = ((getLowNibble(Cpu.D) - 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(1);
            Cpu.D = value;
        }
        case 0x6: {
            trace("LD D, n");
            Cpu.D = readByteAtPc();
        }
        case 0x7: {
            trace("RLA");
            // OPCODE_TBD
        }
        case 0x8: {
            trace("JR e");
            const relativeOffset: i8 = <i8>readByteAtPc();
            // syncCycle(4)
            Cpu.pc += relativeOffset;
        }
        case 0x9: {
            trace("ADD HL, DE");
            const hl = getHL();
            const de = getDE();
            const result = hl + de;
            const halfCarry: bool = ((getLowNibble(Cpu.L) + getLowByte(Cpu.E)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag(result > 0xFFFF ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setHL(result & 0xFFFF);
            // syncCycle(4)
        }
        case 0xA: {
            trace("LD A, (DE)");
            const deAddress = getDE();
            Cpu.A = readByte(deAddress);
        }
        case 0xB: {
            trace("DEC DE");
            const value = ((getDE() - 1) & 0xFFFF); 
            setDE(value);
            // syncCycle(4)
        }
        case 0xC: {
            trace("INC E");
            const value = ((Cpu.E + 1) & 0xFF); 
            const halfCarry: bool = ((getLowNibble(Cpu.E) + 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(0);
            Cpu.E = value;
        }
        case 0xD: {
            trace("DEC E");
            const value = ((Cpu.E - 1) & 0xFF);
            const halfCarry: bool = ((getLowNibble(Cpu.E) - 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(1);
            Cpu.E = value;
        }
        case 0xE: {
            trace("LD E, n");
            Cpu.E = readByteAtPc();
        }
        case 0xF: {
            trace("RRA");
            // OPCODE_TBD
        }
        default: {
            new Error("Unreachable code");
            break;
        }
    }
}

function handle2xOpcode(opcode: u8): void {
    switch (opcode) {
        case 0x0: {
            trace("JR NZ, e");
            const relativeOffset: i8 = <i8>readByteAtPc();
            const zeroFlag = getZeroFlag();
            if (zeroFlag == 0) {
                Cpu.pc += relativeOffset;
                // syncCycle(4)
            }
            break;
        }
        case 0x1: {
            trace("LD HL, nn");
            Cpu.L = readByteAtPc();
            Cpu.H = readByteAtPc();
            break;
        }
        case 0x2: {
            trace("LD (HL+), A");
            const hl = getHL();
            writeByte(hl, Cpu.A);
            const hlInc = ((hl + 1) & 0xFFFF);
            setBC(hlInc);
        }
        case 0x3: {
            trace("INC HL");
            const value = ((getHL() + 1) & 0xFFFF); 
            setHL(value);
            // syncCycle(4)
        }
        case 0x4: {
            trace("INC H");
            const value = ((Cpu.H + 1) & 0xFF); 
            const halfCarry: bool = ((getLowNibble(Cpu.H) + 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(0);
            Cpu.H = value;
        }
        case 0x5: {
            trace("DEC H");
            const value = ((Cpu.H - 1) & 0xFF);
            const halfCarry: bool = ((getLowNibble(Cpu.H) - 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(1);
            Cpu.H = value;
        }
        case 0x6: {
            trace("LD H, n");
            Cpu.H = readByteAtPc();
        }
        case 0x7: {
            trace("DAA");
            // OPCODE_TBD
        }
        case 0x8: {
            trace("JR Z, e");
            const relativeOffset: i8 = <i8>readByteAtPc();
            const zeroFlag = getZeroFlag();
            if (zeroFlag == 1) {
                Cpu.pc += relativeOffset;
                // syncCycle(4)
            }
        }
        case 0x9: {
            trace("ADD HL, HL");
            const hl = getHL();
            const result = hl + hl;
            const halfCarry: bool = ((getLowNibble(Cpu.L) + getLowByte(Cpu.L)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag(result > 0xFFFF ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setHL(result & 0xFFFF);
            // syncCycle(4)
        }
        case 0xA: {
            trace("LD A, (HL+)");
            const hl = getHL();
            Cpu.A = readByte(hl);
            const hlInc = ((hl + 1) & 0xFFFF);
            setHL(hlInc);
        }
        case 0xB: {
            trace("DEC HL");
            const value = ((getHL() - 1) & 0xFFFF); 
            setHL(value);
            // syncCycle(4)
        }
        case 0xC: {
            trace("INC L");
            const value = ((Cpu.L + 1) & 0xFF); 
            const halfCarry: bool = ((getLowNibble(Cpu.L) + 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(0);
            Cpu.L = value;
        }
        case 0xD: {
            trace("DEC L");
            const value = ((Cpu.L - 1) & 0xFF);
            const halfCarry: bool = ((getLowNibble(Cpu.L) - 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(1);
            Cpu.L = value;
        }
        case 0xE: {
            trace("LD L, n");
            Cpu.L = readByteAtPc();
        }
        case 0xF: {
            trace("CPL");
            Cpu.A = Cpu.A ^ 0xFF;
            setHalfCarryFlag(1);
            setNegativeFlag(1);
        }
        default: {
            new Error("Unreachable code");
            break;
        }
    }    
}

function handle3xOpcode(opcode: u8): void {
    switch (opcode) {
        case 0x0: {
            trace("JR NC, e");
            const relativeOffset: i8 = <i8>readByteAtPc();
            const carryFlag = getCarryFlag();
            if (carryFlag == 0) {
                Cpu.pc += relativeOffset;
                // syncCycle(4)
            }
            break;
        }
        case 0x1: {
            trace("LD SP, nn");
            Cpu.sp = readWordAtPc();
            break;
        }
        case 0x2: {
            trace("LD (HL-), A");
            const hl = getHL();
            writeByte(hl, Cpu.A);
            const hlDec = ((hl - 1) & 0xFFFF);
            setHL(hlDec);
        }
        case 0x3: {
            trace("INC SP");
            const spInc = ((Cpu.sp + 1) & 0xFFFF);
            Cpu.sp = spInc;
            // syncCycle(4)
        }
        case 0x4: {
            trace("INC (HL)");
            const hl = getHL();
            const value = readByte(hl);
            const valueInc = ((value + 1) & 0xFF);
            const halfCarry: bool = ((getLowNibble(value) + 1) & 0x10) > 0 ? 1 : 0;
            setNegativeFlag(0);
            setZeroFlag(valueInc > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            writeByte(hl, valueInc);
        }
        case 0x5: {
            trace("DEC (HL)");
            const hl = getHL();
            const value = readByte(hl);
            const valueDec = ((value - 1) & 0xFF);
            const halfCarry: bool = ((getLowNibble(value) - 1) & 0x10) > 0 ? 1 : 0;
            setNegativeFlag(1);
            setZeroFlag(valueDec > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            writeByte(hl, valueDec);
        }
        case 0x6: {
            trace("LD (HL), n");
            const n = readByteAtPc();
            const hlAddress = getHL();
            writeByte(hlAddress, n);
        }
        case 0x7: {
            trace("SCF");
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setCarryFlag(1);
        }
        case 0x8: {
            trace("JR C, e");
            const relativeOffset: i8 = <i8>readByteAtPc();
            const carryFlag = getCarryFlag();
            if (carryFlag) {
                Cpu.pc += relativeOffset;
                // syncCycle(4)
            }
        }
        case 0x9: {
            trace("ADD HL, SP");
            const hl = getHL();
            const result = hl + Cpu.sp;
            const halfCarry: bool = ((getLowNibble(Cpu.L) + getLowByte(Cpu.sp)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag(result > 0xFFFF ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setHL(result & 0xFFFF);
            // syncCycle(4)
        }
        case 0xA: {
            trace("LD A, (HL-)");
            const hl = getHL();
            Cpu.A = readByte(hl);
            const hlDec = ((hl - 1) & 0xFFFF);
            setHL(hlDec);
        }
        case 0xB: {
            trace("DEC SP");
            const spDec = ((Cpu.sp - 1) & 0xFFFF);
            Cpu.sp = spDec;
            // syncCycle(4)
        }
        case 0xC: {
            trace("INC A");
            const value = ((Cpu.A + 1) & 0xFF);
            const halfCarry: bool = ((getLowNibble(Cpu.A) + 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(0);
            Cpu.A = value;
        }
        case 0xD: {
            trace("DEC A");
            const value = ((Cpu.A - 1) & 0xFF);
            const halfCarry: bool = ((getLowNibble(Cpu.A) - 1) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(value > 0 ? 0 : 1);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(1);
            Cpu.A = value;
        }
        case 0xE: {
            trace("LD A, n");
            Cpu.A = readByteAtPc();
        }
        case 0xF: {
            trace("CCF");
            // OPCODE_TBD
        }
        default: {
            new Error("Unreachable code");
            break;
        }
    }    
}

function handle4xOpcode(opcode: u8): void {
    switch (opcode) {
        case 0x0: {
            trace("LD B, B");
            Cpu.B = Cpu.B;
            break;
        }
        case 0x1: {
            trace("LD B, C");
            Cpu.B = Cpu.C;
            break;
        }
        case 0x2: {
            trace("LD B, D");
            Cpu.B = Cpu.D;
            break;
        }
        case 0x3: {
            trace("LD B, E");
            Cpu.B = Cpu.E;
            break;
        }
        case 0x4: {
            trace("LD B, H");
            Cpu.B = Cpu.H;
            break;
        }
        case 0x5: {
            trace("LD B, L");
            Cpu.B = Cpu.L;
            break;
        }
        case 0x6: {
            trace("LD B, (HL)");
            const hl = getHL();
            Cpu.B = readByte(hl);
            break;
        }
        case 0x7: {
            trace("LD B, A");
            Cpu.B = Cpu.A;
            break;
        }
        case 0x8: {
            trace("LD C, B");
            Cpu.C = Cpu.B;
            break;
        }
        case 0x9: {
            trace("LD C, C");
            Cpu.C = Cpu.C;
            break;
        }
        case 0xA: {
            trace("LD C, D");
            Cpu.C = Cpu.D;
            break;
        }
        case 0xB: {
            trace("LD C, E");
            Cpu.C = Cpu.E;
            break;
        }
        case 0xC: {
            trace("LD C, H");
            Cpu.C = Cpu.H;
            break;
        }
        case 0xD: {
            trace("LD C, L");
            Cpu.C = Cpu.L;
            break;
        }
        case 0xE: {
            trace("LD C, (HL)");
            const hl = getHL();
            Cpu.C = readByte(hl);
            break;
        }
        case 0xF: {
            trace("LD C, A");
            Cpu.C = Cpu.A;
            break;
        }
        default: {
            new Error("Unreachable code");
            break;
        }
    }
}

function handle5xOpcode(opcode: u8): void {
    switch (opcode) {
        case 0x0: {
            trace("LD D, B");
            Cpu.D = Cpu.B;
            break;
        }
        case 0x1: {
            trace("LD D, C");
            Cpu.D = Cpu.C;
            break;
        }
        case 0x2: {
            trace("LD D, D");
            Cpu.D = Cpu.D;
            break;
        }
        case 0x3: {
            trace("LD D, E");
            Cpu.D = Cpu.E;
            break;
        }
        case 0x4: {
            trace("LD D, H");
            Cpu.D = Cpu.H;
            break;
        }
        case 0x5: {
            trace("LD D, L");
            Cpu.D = Cpu.L;
            break;
        }
        case 0x6: {
            trace("LD D, (HL)");
            const hl = getHL();
            Cpu.D = readByte(hl);
            break;
        }
        case 0x7: {
            trace("LD D, A");
            Cpu.D = Cpu.A;
            break;
        }
        case 0x8: {
            trace("LD E, B");
            Cpu.E = Cpu.B;
            break;
        }
        case 0x9: {
            trace("LD E, C");
            Cpu.E = Cpu.C;
            break;
        }
        case 0xA: {
            trace("LD E, D");
            Cpu.E = Cpu.D;
            break;
        }
        case 0xB: {
            trace("LD E, E");
            Cpu.E = Cpu.E;
            break;
        }
        case 0xC: {
            trace("LD E, H");
            Cpu.E = Cpu.H;
            break;
        }
        case 0xD: {
            trace("LD E, L");
            Cpu.E = Cpu.L;
            break;
        }
        case 0xE: {
            trace("LD E, (HL)");
            const hl = getHL();
            Cpu.E = readByte(hl);
            break;
        }
        case 0xF: {
            trace("LD E, A");
            Cpu.E = Cpu.A;
            break;
        }
        default: {
            new Error("Unreachable code");
            break;
        }
    }
}

function handle6xOpcode(opcode: u8): void {
    switch (opcode) {
        case 0x0: {
            trace("LD H, B");
            Cpu.H = Cpu.B;
            break;
        }
        case 0x1: {
            trace("LD H, C");
            Cpu.H = Cpu.C;
            break;
        }
        case 0x2: {
            trace("LD H, D");
            Cpu.H = Cpu.D;
            break;
        }
        case 0x3: {
            trace("LD H, E");
            Cpu.H = Cpu.E;
            break;
        }
        case 0x4: {
            trace("LD H, H");
            Cpu.H = Cpu.H;
            break;
        }
        case 0x5: {
            trace("LD H, L");
            Cpu.H = Cpu.L;
            break;
        }
        case 0x6: {
            trace("LD H, (HL)");
            const hl = getHL();
            Cpu.H = readByte(hl);
            break;
        }
        case 0x7: {
            trace("LD H, A");
            Cpu.H = Cpu.A;
            break;
        }
        case 0x8: {
            trace("LD L, B");
            Cpu.L = Cpu.B;
            break;
        }
        case 0x9: {
            trace("LD L, C");
            Cpu.L = Cpu.C;
            break;
        }
        case 0xA: {
            trace("LD L, D");
            Cpu.L = Cpu.D;
            break;
        }
        case 0xB: {
            trace("LD L, E");
            Cpu.L = Cpu.E;
            break;
        }
        case 0xC: {
            trace("LD L, H");
            Cpu.L = Cpu.H;
            break;
        }
        case 0xD: {
            trace("LD L, L");
            Cpu.L = Cpu.L;
            break;
        }
        case 0xE: {
            trace("LD L, (HL)");
            const hl = getHL();
            Cpu.L = readByte(hl);
            break;
        }
        case 0xF: {
            trace("LD L, A");
            Cpu.L = Cpu.A;
            break;
        }
        default: {
            new Error("Unreachable code");
            break;
        }
    }
}

function handle7xOpcode(opcode: u8): void {
    switch (opcode) {
        case 0x0: {
            trace("LD (HL), B");
            const hl = getHL();
            writeByte(hl, Cpu.B);
            break;
        }
        case 0x1: {
            trace("LD (HL), C");
            const hl = getHL();
            writeByte(hl, Cpu.C);
            break;
        }
        case 0x2: {
            trace("LD (HL), D");
            const hl = getHL();
            writeByte(hl, Cpu.D);
            break;
        }
        case 0x3: {
            trace("LD (HL), E");
            const hl = getHL();
            writeByte(hl, Cpu.E);
            break;
        }
        case 0x4: {
            trace("LD (HL), H");
            const hl = getHL();
            writeByte(hl, Cpu.H);
            break;
        }
        case 0x5: {
            trace("LD (HL), L");
            const hl = getHL();
            writeByte(hl, Cpu.L);
            break;
        }
        case 0x6: {

            // TBD
            trace("HALT");
            // TBD

            break;
        }
        case 0x7: {
            trace("LD (HL), A");
            const hl = getHL();
            writeByte(hl, Cpu.A);
            break;
        }
        case 0x8: {
            trace("LD A, B");
            Cpu.A = Cpu.B;
            break;
        }
        case 0x9: {
            trace("LD A, C");
            Cpu.A = Cpu.C;
            break;
        }
        case 0xA: {
            trace("LD A, D");
            Cpu.A = Cpu.D;
            break;
        }
        case 0xB: {
            trace("LD A, E");
            Cpu.A = Cpu.E;
            break;
        }
        case 0xC: {
            trace("LD A, H");
            Cpu.A = Cpu.H;
            break;
        }
        case 0xD: {
            trace("LD A, L");
            Cpu.A = Cpu.L;
            break;
        }
        case 0xE: {
            trace("LD A, (HL)");
            const hl = getHL();
            Cpu.A = readByte(hl);
            break;
        }
        case 0xF: {
            trace("LD A, A");
            Cpu.A = Cpu.A;
            break;
        }
        default: {
            new Error("Unreachable code");
            break;
        }
    }
}

function handle8xOpcode(opcode: u8): void {
    switch (opcode) {
        case 0x0: {
            trace("ADD A, B");
            const result = Cpu.A + Cpu.B;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.B)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0x1: {
            trace("ADD A, C");
            const result = Cpu.A + Cpu.C;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.C)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0x2: {
            trace("ADD A, D");
            const result = Cpu.A + Cpu.D;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.D)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0x3: {
            trace("ADD A, E");
            const result = Cpu.A + Cpu.E;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.E)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0x4: {
            trace("ADD A, H");
            const result = Cpu.A + Cpu.H;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.H)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0x5: {
            trace("ADD A, L");
            const result = Cpu.A + Cpu.L;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.L)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0x6: {
            trace("ADD A, (HL)");
            const hl = getHL();
            const hlValue = readByte(hl);
            const result = Cpu.A + hlValue;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(hlValue)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0x7: {
            trace("ADD A, A");
            const result = Cpu.A + Cpu.A;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.A)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0x8: {
            trace("ADC A, B");
            const carry = <u8>getCarryFlag();
            const result = Cpu.A + Cpu.B + carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.B) + carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0x9: {
            trace("ADC A, C");
            const carry = <u8>getCarryFlag();
            const result = Cpu.A + Cpu.C + carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.C) + carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0xA: {
            trace("ADC A, D");
            const carry = <u8>getCarryFlag();
            const result = Cpu.A + Cpu.D + carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.D) + carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0xB: {
            trace("ADC A, E");
            const carry = <u8>getCarryFlag();
            const result = Cpu.A + Cpu.E + carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.E) + carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0xC: {
            trace("ADC A, H");
            const carry = <u8>getCarryFlag();
            const result = Cpu.A + Cpu.H + carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.H) + carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0xD: {
            trace("ADC A, L");
            const carry = <u8>getCarryFlag();
            const result = Cpu.A + Cpu.L + carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.L) + carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0xE: {
            trace("ADC A, (HL)");
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
            break;
        }
        case 0xF: {
            trace("ADC A, A");
            const carry = <u8>getCarryFlag();
            const result = Cpu.A + Cpu.A + carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(Cpu.A) + carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        default: {
            new Error("Unreachable code");
            break;
        }
    }
}

function handle9xOpcode(opcode: u8): void {
    switch (opcode) {
        case 0x0: {
            trace("SUB A, B");
            const result = Cpu.A - Cpu.B;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.B)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0x1: {
            trace("SUB A, C");
            const result = Cpu.A - Cpu.C;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.C)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0x2: {
            trace("SUB A, D");
            const result = Cpu.A - Cpu.D;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.D)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0x3: {
            trace("SUB A, E");
            const result = Cpu.A - Cpu.E;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.E)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0x4: {
            trace("SUB A, H");
            const result = Cpu.A - Cpu.H;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.H)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0x5: {
            trace("SUB A, L");
            const result = Cpu.A - Cpu.L;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.L)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0x6: {
            trace("SUB A, (HL)");
            const hl = getHL();
            const hlValue = readByte(hl);
            const result = Cpu.A - hlValue;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(hlValue)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0x7: {
            trace("SUB A, A");
            const result = Cpu.A - Cpu.A;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.A)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0x8: {
            trace("SBC A, B");
            const carry = <u8>getCarryFlag();
            const result = Cpu.A - Cpu.B - carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.B) - carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0x9: {
            trace("SBC A, C");
            const carry = <u8>getCarryFlag();
            const result = Cpu.A - Cpu.C - carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.C) - carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0xA: {
            trace("SBC A, D");
            const carry = <u8>getCarryFlag();
            const result = Cpu.A - Cpu.D - carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.D) - carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0xB: {
            trace("SBC A, E");
            const carry = <u8>getCarryFlag();
            const result = Cpu.A - Cpu.E - carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.E) - carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0xC: {
            trace("SBC A, H");
            const carry = <u8>getCarryFlag();
            const result = Cpu.A - Cpu.H - carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.H) - carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0xD: {
            trace("SBC A, L");
            const carry = <u8>getCarryFlag();
            const result = Cpu.A - Cpu.L - carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.L) - carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0xE: {
            trace("SBC A, (HL)");
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
            break;
        }
        case 0xF: {
            trace("SBC A, A");
            const carry = <u8>getCarryFlag();
            const result = Cpu.A - Cpu.A - carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.A) - carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        default: {
            new Error("Unreachable code");
            break;
        }
    }
}

function handleAxOpcode(opcode: u8): void {
    switch (opcode) {
        case 0x0: {
            trace("AND A, B");
            const result = Cpu.A & Cpu.B;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(1);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0x1: {
            trace("AND A, C");
            const result = Cpu.A & Cpu.C;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(1);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0x2: {
            trace("AND A, D");
            const result = Cpu.A & Cpu.D;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(1);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0x3: {
            trace("AND A, E");
            const result = Cpu.A & Cpu.E;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(1);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0x4: {
            trace("AND A, H");
            const result = Cpu.A & Cpu.H;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(1);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0x5: {
            trace("AND A, L");
            const result = Cpu.A & Cpu.L;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(1);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0x6: {
            trace("AND A, (HL)");
            const hl = getHL();
            const hlValue = readByte(hl);
            const result = Cpu.A & hlValue;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(1);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0x7: {
            trace("AND A, A");
            const result = Cpu.A & Cpu.A;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(1);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0x8: {
            trace("XOR A, B");
            const result = Cpu.A ^ Cpu.B;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0x9: {
            trace("XOR A, C");
            const result = Cpu.A ^ Cpu.C;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0xA: {
            trace("XOR A, D");
            const result = Cpu.A ^ Cpu.D;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0xB: {
            trace("XOR A, E");
            const result = Cpu.A ^ Cpu.E;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0xC: {
            trace("XOR A, H");
            const result = Cpu.A ^ Cpu.H;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0xD: {
            trace("XOR A, L");
            const result = Cpu.A ^ Cpu.L;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0xE: {
            trace("XOR A, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            const result = Cpu.A ^ value;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0xF: {
            trace("XOR A, A");
            const result = Cpu.A ^ Cpu.A;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        default: {
            new Error("Unreachable code");
            break;
        }
    }
}

function handleBxOpcode(opcode: u8): void {
    switch (opcode) {
        case 0x0: {
            trace("OR A, B");
            const result = Cpu.A | Cpu.B;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0x1: {
            trace("OR A, C");
            const result = Cpu.A | Cpu.C;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0x2: {
            trace("OR A, D");
            const result = Cpu.A | Cpu.D;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0x3: {
            trace("OR A, E");
            const result = Cpu.A | Cpu.E;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0x4: {
            trace("OR A, H");
            const result = Cpu.A | Cpu.H;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0x5: {
            trace("OR A, L");
            const result = Cpu.A | Cpu.L;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0x6: {
            trace("OR A, (HL)");
            const hl = getHL();
            const hlValue = readByte(hl);
            const result = Cpu.A | hlValue;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0x7: {
            trace("OR A, A");
            const result = Cpu.A | Cpu.A;
            setCarryFlag(0);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result;
            break;
        }
        case 0x8: {
            trace("CP A, B");
            const result = Cpu.A - Cpu.B;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.B)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            break;
        }
        case 0x9: {
            trace("CP A, C");
            const result = Cpu.A - Cpu.C;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.C)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            break;
        }
        case 0xA: {
            trace("CP A, D");
            const result = Cpu.A - Cpu.D;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.D)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            break;
        }
        case 0xB: {
            trace("CP A, E");
            const result = Cpu.A - Cpu.E;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.E)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            break;
        }
        case 0xC: {
            trace("CP A, H");
            const result = Cpu.A - Cpu.H;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.H)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            break;
        }
        case 0xD: {
            trace("CP A, L");
            const result = Cpu.A - Cpu.L;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.L)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            break;
        }
        case 0xE: {
            trace("CP A, (HL)");
            const hl = getHL();
            const value = readByte(hl);
            const result = Cpu.A - value;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(value)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            break;
        }
        case 0xF: {
            trace("CP A, A");
            const result = Cpu.A - Cpu.A;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(Cpu.A)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            break;
        }
        default: {
            new Error("Unreachable code");
            break;
        }
    }
}

function handleCxOpcode(opcode: u8): void {
    switch (opcode) {
        case 0x0: {
            trace("RET NZ");
            const zeroFlag = getZeroFlag();
            // syncCycle(4)
            if (zeroFlag == 0) {
                const lowByte = readByte(Cpu.sp);
                const highByte = readByte(Cpu.sp + 1);
                Cpu.sp += 2;
                // syncCycle(4)
                Cpu.pc = combineBytes(highByte, lowByte);
            }
            break;
        }
        case 0x1: {
            trace("POP BC");
            const lowByte = readByte(Cpu.sp);
            const highByte = readByte(Cpu.sp + 1);
            Cpu.sp += 2;
            setBC(combineBytes(highByte, lowByte));
            break;
        }
        case 0x2: {
            trace("JP NZ, nn");
            const zeroFlag = getZeroFlag();
            const nn = readWordAtPc();
            if (zeroFlag == 0) {
                // syncCycle(4)
                Cpu.pc = nn;
            }
            break;
        }
        case 0x3: {
            trace("JP nn");
            const nn = readWordAtPc();
            // syncCycle(4)
            Cpu.pc = nn;
            break;
        }
        case 0x4: {
            trace("CALL NZ, nn");
            const zeroFlag = getZeroFlag();
            const nn = readWordAtPc();
            if (zeroFlag == 0) {
                // syncCycle(4)
                writeByte(Cpu.sp - 1, getHighByte(Cpu.pc));
                writeByte(Cpu.sp - 2, getLowByte(Cpu.pc));
                Cpu.sp -= 2;
                Cpu.pc = nn;
            }
            break;
        }
        case 0x5: {
            trace("PUSH BC");
            // syncCycle(4)
            writeByte(Cpu.sp - 1, Cpu.B);
            writeByte(Cpu.sp - 2, Cpu.C);
            Cpu.sp -= 2;
            break;
        }
        case 0x6: {
            trace("ADD A, n");
            const n = readByteAtPc();
            const result = Cpu.A + n;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(n)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0x7: {
            trace("RST 00h");
            // OPCODE_TDB
            break;
        }
        case 0x8: {
            trace("RET Z");
            const zeroFlag = getZeroFlag();
            // syncCycle(4)
            if (zeroFlag == 1) {
                const lowByte = readByte(Cpu.sp);
                const highByte = readByte(Cpu.sp + 1);
                Cpu.sp += 2;
                // syncCycle(4)
                Cpu.pc = combineBytes(highByte, lowByte);
            }
            break;
        }
        case 0x9: {
            trace("RET");
            const lowByte = readByte(Cpu.sp);
            const highByte = readByte(Cpu.sp + 1);
            Cpu.sp += 2;
            // syncCycle(4)
            Cpu.pc = combineBytes(highByte, lowByte);
            break;
        }
        case 0xA: {
            trace("JP Z");
            const zeroFlag = getZeroFlag();
            const nn = readWordAtPc();
            if (zeroFlag == 1) {
                // syncCycle(4);
                Cpu.pc = nn;
            }
            break;
        }
        case 0xB: {
            trace("PREFIX CB");
            const cbOpcode = readByteAtPc();
            handleCBOpcode(cbOpcode);
            break;
        }
        case 0xC: {
            trace("CALL Z, nn");
            const zeroFlag = getZeroFlag();
            const nn = readWordAtPc();
            if (zeroFlag == 1) {
                // syncCycle(4)
                writeByte(Cpu.sp - 1, getHighByte(Cpu.pc));
                writeByte(Cpu.sp - 2, getLowByte(Cpu.pc));
                Cpu.sp -= 2;
                Cpu.pc = nn;
            }
            break;
        }
        case 0xD: {
            trace("CALL nn");
            const nn = readWordAtPc();
            // syncCycle(4)
            writeByte(Cpu.sp - 1, getHighByte(Cpu.pc));
            writeByte(Cpu.sp - 2, getLowByte(Cpu.pc));
            Cpu.sp -= 2;
            Cpu.pc = nn;
            break;
        }
        case 0xE: {
            trace("ADC A, n");
            const carry = <u8>getCarryFlag();
            const n = readByteAtPc();
            const result = Cpu.A + n + carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) + getLowNibble(n) + carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(0);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0xF: {
            trace("RST 08h");
            // OPCODE_TDB
            break;

        }
        default: {
            new Error("Unreachable code");
            break;
        }
    }
}

function handleDxOpcode(opcode: u8): void {
    switch (opcode) {
        case 0x0: {
            trace("RET NC");
            const carryFlag = getCarryFlag();
            // syncCycle(4)
            if (carryFlag == 0) {
                const lowByte = readByte(Cpu.sp);
                const highByte = readByte(Cpu.sp + 1);
                Cpu.sp += 2;
                // syncCycle(4)
                Cpu.pc = combineBytes(highByte, lowByte);
            }
            break;
        }
        case 0x1: {
            trace("POP DE");
            const lowByte = readByte(Cpu.sp);
            const highByte = readByte(Cpu.sp + 1);
            Cpu.sp += 2;
            setDE(combineBytes(highByte, lowByte));
            break;
        }
        case 0x2: {
            trace("JP NC, nn");
            const carryFlag = getCarryFlag();
            const nn = readWordAtPc();
            if (carryFlag == 0) {
                // syncCycle(4)
                Cpu.pc = nn;
            }
            break;
        }
        case 0x4: {
            trace("CALL NC, nn");
            const carryFlag = getCarryFlag();
            const nn = readWordAtPc();
            if (carryFlag == 0) {
                // syncCycle(4)
                writeByte(Cpu.sp - 1, getHighByte(Cpu.pc));
                writeByte(Cpu.sp - 2, getLowByte(Cpu.pc));
                Cpu.sp -= 2;
                Cpu.pc = nn;
            }
            break;
        }
        case 0x5: {
            trace("PUSH DE");
            // syncCycle(4)
            writeByte(Cpu.sp - 1, Cpu.D);
            writeByte(Cpu.sp - 2, Cpu.E);
            Cpu.sp -= 2;
            break;
        }
        case 0x6: {
            trace("SUB A, n");
            const n = readByteAtPc();
            const result = Cpu.A - n;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(n)) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0x7: {
            trace("RST 10h");
            // OPCODE_TDB
            break;
        }
        case 0x8: {
            trace("RET C");
            const carryFlag = getCarryFlag();
            // syncCycle(4)
            if (carryFlag == 1) {
                const lowByte = readByte(Cpu.sp);
                const highByte = readByte(Cpu.sp + 1);
                Cpu.sp += 2;
                // syncCycle(4)
                Cpu.pc = combineBytes(highByte, lowByte);
            }
            break;
        }
        case 0x9: {
            trace("RETI");
            const lowByte = readByte(Cpu.sp);
            const highByte = readByte(Cpu.sp + 1);
            Cpu.sp += 2;
            // syncCycle(4)
            Cpu.pc = combineBytes(highByte, lowByte);
            // NEED TO SET IME HERE
            // NEED TO SET IME HERE
            // NEED TO SET IME HERE
            // NEED TO SET IME HERE
            break;
        }
        case 0xA: {
            trace("JP C");
            const carryFlag = getCarryFlag();
            const nn = readWordAtPc();
            if (carryFlag == 1) {
                // syncCycle(4);
                Cpu.pc = nn;
            }
            break;
        }
        case 0xC: {
            trace("CALL C, nn");
            const carryFlag = getCarryFlag();
            const nn = readWordAtPc();
            if (carryFlag == 1) {
                // syncCycle(4)
                writeByte(Cpu.sp - 1, getHighByte(Cpu.pc));
                writeByte(Cpu.sp - 2, getLowByte(Cpu.pc));
                Cpu.sp -= 2;
                Cpu.pc = nn;
            }
            break;
        }
        case 0xE: {
            trace("SBC A, n");
            const carry = <u8>getCarryFlag();
            const n = readByteAtPc();
            const result = Cpu.A - n - carry;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(n) - carry) & 0x10) > 0 ? 1 : 0;
            setCarryFlag((result > 0xFF) ? 1 : 0);
            setNegativeFlag(1);
            setHalfCarryFlag(halfCarry);
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            Cpu.A = result & 0xFF;
            break;
        }
        case 0xF: {
            trace("RST 18h");
            // OPCODE_TDB
            break;

        }
        default: {
            new Error("Unreachable code");
            break;
        }
    }
}

function handleExOpcode(opcode: u8): void {
    switch (opcode) {
        case 0x0: {
            trace("LD (FF00 + n), A");
            const n = readByteAtPc();
            const address = combineBytes(0xFF, n);
            writeByte(address, Cpu.A);
            break;
        }
        case 0x1: {
            trace("POP HL");
            const lowByte = readByte(Cpu.sp);
            const highByte = readByte(Cpu.sp + 1);
            Cpu.sp += 2;
            setHL(combineBytes(highByte, lowByte));
            break;
        }
        case 0x2: {
            trace("LD (FF00 + C), A");
            const address = combineBytes(0xFF, Cpu.C);
            writeByte(address, Cpu.A);
            break;
        }
        case 0x5: {
            trace("PUSH HL");
            // syncCycle(4)
            writeByte(Cpu.sp - 1, Cpu.H);
            writeByte(Cpu.sp - 2, Cpu.L);
            Cpu.sp -= 2;
            break;
        }
        case 0x6: {
            trace("AND A, n");
            const n = readByteAtPc();
            const result = Cpu.A & n;
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            setNegativeFlag(0);
            setCarryFlag(0);
            setHalfCarryFlag(1);
            Cpu.A = result;
            break;
        }
        case 0x7: {
            trace("RST 20h");
            // OPCODE_TDB
            break;
        }
        case 0x8: {
            trace("ADD SP, n");
            const n = <i8>readByteAtPc();
            const result = Cpu.sp + n;
            const lowSp = getLowByte(Cpu.sp);
            const halfCarry: bool = ((getLowNibble(lowSp) - getLowNibble(n)) & 0x10) > 0 ? 1 : 0;
            setHalfCarryFlag(halfCarry);
            setCarryFlag(result > 0xFFFF ? 1 : 0);
            setZeroFlag(0);
            setNegativeFlag(0);
            Cpu.sp = result & 0xFFFF;
            break;
        }
        case 0x9: {
            trace("JP HL");
            Cpu.pc = getHL();
            break;
        }
        case 0xA: {
            trace("LD (nn), A");
            const nn = readWordAtPc();
            writeByte(nn, Cpu.A);
            break;
        }
        case 0xE: {
            trace("XOR A, n");
            const n = readByteAtPc();
            const result = Cpu.A ^ n;
            setZeroFlag(result > 0 ? 0 : 1);
            setCarryFlag(0);
            setHalfCarryFlag(0);
            setNegativeFlag(0);
            Cpu.A = result;
            break;
        }
        case 0xF: {
            trace("RST 28h");
            // OPCODE_TDB
            break;
        }
        default: {
            new Error("Unreachable code");
            break;
        }
    }
}

function handleFxOpcode(opcode: u8): void {
    switch (opcode) {
        case 0x0: {
            trace("LD A, (FF00 + n)");
            const n = readByteAtPc();
            const address = combineBytes(0xFF, n);
            Cpu.A = readByte(address);
            break;
        }
        case 0x1: {
            trace("POP AF");
            const lowByte = readByte(Cpu.sp);
            const highByte = readByte(Cpu.sp + 1);
            Cpu.sp += 2;
            setAF(combineBytes(highByte, lowByte));
            break;
        }
        case 0x2: {
            trace("LD A, (FF00 + C)");
            const address = combineBytes(0xFF, Cpu.C);
            Cpu.A = readByte(address);
            break;
        }
        case 0x3: {
            trace("DI");
            // OPCODE_TBD
        }
        case 0x5: {
            trace("PUSH AF");
            // syncCycle(4)
            writeByte(Cpu.sp - 1, Cpu.A);
            writeByte(Cpu.sp - 2, Cpu.F);
            Cpu.sp -= 2;
            break;
        }
        case 0x6: {
            trace("OR A, n");
            const n = readByteAtPc();
            const result = Cpu.A | n;
            setZeroFlag((result & 0xFF) > 0 ? 0 : 1);
            setNegativeFlag(0);
            setHalfCarryFlag(0);
            setCarryFlag(0);
            Cpu.A = result;
            break;
        }
        case 0x7: {
            trace("RST 30h");
            // OPCODE_TDB
            break;
        }
        case 0x8: {
            trace("LD HL, SP + n");
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
            break;
        }
        case 0x9: {
            trace("LD SP, HL");
            // syncCycle(4)
            Cpu.sp = getHL();
            break;
        }
        case 0xA: {
            trace("LD A, (nn)");
            const nn = readWordAtPc();
            Cpu.A = readByte(nn);
            break;
        }
        case 0xB: {
            trace("EI");
            // OPCODE_TBD
        }
        case 0xE: {
            trace("CP A, n");
            const n = readByteAtPc();
            const result = Cpu.A - n;
            const halfCarry: bool = ((getLowNibble(Cpu.A) - getLowNibble(n)) & 0x10) > 0 ? 1 : 0;
            setZeroFlag(result > 0 ? 0 : 1);
            setCarryFlag(result > 0xFF ? 1 : 0);
            setHalfCarryFlag(halfCarry);
            setNegativeFlag(1);
            break;
        }
        case 0xF: {
            trace("RST 38h");
            // OPCODE_TDB
            break;
        }
        default: {
            new Error("Unreachable code");
            break;
        }
    }
}

// Example: if opcode = 0x15
// firstNibble = 0x1
// secondNibble = 0x5
function executeOpcode(opcode: u8): void {
    const firstNibble: u8 = opcode >> 4;
    const secondNibble: u8 = opcode & 0xF;

    switch (firstNibble) {
        case 0x0: {
            handle0xOpcode(secondNibble);
            break;
        }
        case 0x1: {
            handle1xOpcode(secondNibble);
            break;
        }
        case 0x2: {
            handle2xOpcode(secondNibble);
            break;
        }
        case 0x3: {
            handle3xOpcode(secondNibble);
            break;
        }
        case 0x4: {
            handle4xOpcode(secondNibble);
            break;
        }
        case 0x5: {
            handle5xOpcode(secondNibble);
            break;
        }
        case 0x6: {
            handle6xOpcode(secondNibble);
            break;
        }
        case 0x7: {
            handle7xOpcode(secondNibble);
            break;
        }
        case 0x8: {
            handle8xOpcode(secondNibble);
            break;
        }
        case 0x9: {
            handle9xOpcode(secondNibble);
            break;
        }
        case 0xA: {
            handleAxOpcode(secondNibble);
            break;
        }
        case 0xB: {
            handleBxOpcode(secondNibble);
            break;
        }
        case 0xC: {
            handleCxOpcode(secondNibble);
            break;
        }
        case 0xD: {
            handleDxOpcode(secondNibble);
            break;
        }
        case 0xE: {
            handleExOpcode(secondNibble);
            break;
        }
        case 0xF: {
            handleFxOpcode(secondNibble);
            break;
        }
        default: {
            trace("This opcode isnt implemented yet");
            break;
        }
    }
}

export { executeOpcode };