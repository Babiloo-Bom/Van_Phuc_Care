import { Readable } from 'stream';

class BufferStream extends Readable {
  public buffer: Buffer;
  constructor (opts: any) {
    super(opts);
    this.buffer = opts.buffer;
  }

  _read (size: any) {
    this.push(this.buffer);
    this.push(null);
  }
}

export default BufferStream;
