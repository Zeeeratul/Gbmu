import { IO_REGISTERS_START } from "../constants";
import { getBitValue, getHighByte, getLowByte, setBitValue } from "../helpers/bitOperations";
import { Interrupt, InterruptType, setInterrupt } from "../interrupts";
import { Memory, readByte, writeByte } from "../memory";

export class Timer {
    static internalDiv: u16 = 0;
    static lastAnd: bool = false;
    static timaHasOverflowed: bool = false;

    static reset(): void {
        Timer.internalDiv = 0;
        Timer.lastAnd = false;
        Timer.timaHasOverflowed = false;
    }
}

function getDivBit(): bool {
    const tac = readByte(0xFF07) & 0b11;
    const lowByte = getLowByte(Timer.internalDiv);
    const highByte = getHighByte(Timer.internalDiv);

    if (tac == 0b00)
        return getBitValue(highByte, 1);
    else if (tac == 0b01)
        return getBitValue(lowByte, 3);
    else if (tac == 0b10)
        return getBitValue(lowByte, 5);
    return getBitValue(lowByte, 7);
}

function timerCounterEnable(): bool {
    return getBitValue(readByte(0xFF07), 2);
}

// TIMA
function incrementTima(): void {
    const tima: u8 = readByte(0xFF05) + 1;
    if (tima == 0)
        Timer.timaHasOverflowed = true;
    writeByte(0xFF05, tima);
}

export function setTima(value: u8): void {
    writeByte(0xFF05, value);
}

export function resetDiv(): void {
    Timer.internalDiv = 0;
    Memory.ioRegisters[0xFF04 - IO_REGISTERS_START] = 0;
}

function setDiv(value: u8): void {
    Memory.ioRegisters[0xFF04 - IO_REGISTERS_START] = value;
}

export function syncTimers(cycle: u8): void {
    // DIV
    Timer.internalDiv += cycle;
    setDiv(getHighByte(Timer.internalDiv));

    // TIMA
    if (Timer.timaHasOverflowed) {
        setInterrupt(InterruptType.Timer);
        const tma = readByte(0xFF06);
        setTima(tma);
        Timer.timaHasOverflowed = false;
        // return;
    }

    const currentAnd = <u8>timerCounterEnable() & <u8>getDivBit();
    if (Timer.lastAnd && currentAnd == 0) {
        incrementTima()
    }
    Timer.lastAnd = <bool>currentAnd;
}

export { getTimersRegisters } from './debug';