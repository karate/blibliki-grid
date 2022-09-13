import { v4 as uuidv4 } from "uuid";

export enum ModuleType {
  Oscillator = "oscillator",
  Envelope = "envelope",
  AmpEnvelope = "ampEnvelope",
  FreqEnvelope = "freqEnvelope",
  Filter = "filter",
}

export interface Connectable {
  connect: Function;
  chain: Function;
  toDestination: Function;
  dispose: Function;
}

export interface Triggerable {
  triggerAttack: Function;
  triggerRelease: Function;
}

export interface ModuleInterface {
  name: string;
  code: string;
  type: ModuleType;
  voice: number;
  voicable: boolean;
  props?: any;
}

class Module<InternalModule extends Connectable, PropsInterface>
  implements ModuleInterface
{
  protected internalModule: InternalModule;

  id: string;
  name: string;
  code: string;
  readonly voice: number;
  readonly voicable: boolean;
  type: ModuleType;
  _props: PropsInterface;

  constructor(internalModule: InternalModule, props: Partial<ModuleInterface>) {
    this.internalModule = internalModule;
    this.id = uuidv4();

    Object.assign(this, props);
  }

  set props(value: PropsInterface) {
    if (!value) return;
    if (!this._props) this._props = value;

    Object.assign(this, value);
  }

  get props() {
    return this._props;
  }

  connect(module: Module<InternalModule, PropsInterface>) {
    this.internalModule.connect(module.internalModule);
  }

  chain(...modules: Module<InternalModule, PropsInterface>[]) {
    this.internalModule.chain(
      ...modules.map(
        (m: Module<InternalModule, PropsInterface>) => m.internalModule
      )
    );
  }

  toDestination() {
    this.internalModule.toDestination();
  }

  dispose() {
    this.internalModule.dispose();
  }

  isTriggerable() {
    return !!(this as unknown as Triggerable).triggerAttack;
  }

  serialize() {
    return {
      name: this.name,
      code: this.code,
      type: this.type,
      voice: this.voice,
      voicable: this.voicable,
      props: this.props,
    };
  }
}

export default Module;
