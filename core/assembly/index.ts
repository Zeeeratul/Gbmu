import { Cpu } from './cpuState';

export function loadRom(buffer: Uint8Array): void {
  for (let index = 0; index < buffer.length; index++) {
    if (index >= 0x8000) {
      trace("Rom array has a limit of 0x8000 byte");
      break;
    }
    Cpu.rom[index] = buffer[index];
  }
  trace("Rom loaded")
}

export { getRegisters, getDisassembler, getMemory } from './debug/index';