import frequencyTable from "./frequencyTable";

const Notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const NotesLength = Notes.length;

export default class Note {
  name: string;
  octave: number;

  constructor(eventOrString: MIDIMessageEvent | string) {
    if (typeof eventOrString === "string") {
      this.fromString(eventOrString);
    } else {
      this.fromEvent(eventOrString);
    }
  }

  get isSemi() {
    return this.name.slice(-1) === "#";
  }

  frequency(range: number = 0, coarse: number = 0) {
    let newOctave = this.octave + range;
    let coarseIndex = Notes.indexOf(this.name) + coarse;
    let nameIndex = coarseIndex;

    if (coarseIndex >= NotesLength) {
      newOctave++;
      nameIndex = coarseIndex % NotesLength;
    } else if (coarseIndex < 0) {
      newOctave--;
      nameIndex = NotesLength + nameIndex;
    }

    const newName = Notes[nameIndex];

    return frequencyTable[`${newName}${newOctave}`];
  }

  private fromString(string: string) {
    const matches = string.match(/(\w#?)(\d)?/) || [];

    this.name = matches[1];
    this.octave = matches[2] ? parseInt(matches[2]) : 1;
  }

  private fromEvent(event: MIDIMessageEvent) {
    this.name = Notes[event.data[1] % 12];
    this.octave = Math.floor(event.data[1] / 12);
  }
}
