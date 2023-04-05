export class GrpcTimestamp {
  nanos!: number;

  seconds!: {
    low: number;
    height: number;
    unsigned: boolean;
  };
}
