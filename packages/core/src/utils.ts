import { Metadata, type MetadataValue } from '@grpc/grpc-js';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';

import { GrpcTimestamp } from './dataType';

function isDate(data: Date | string | number): data is Date {
  return data instanceof Date;
}

export function createMetadata(
  params: Record<string, MetadataValue>,
): Metadata {
  const metadata = new Metadata();

  Object.entries(params).forEach(([key, value]) => {
    metadata.add(key, value);
  });

  return metadata;
}

export function dateToGrpcTimestamp(
  data: Date | string | number,
): GrpcTimestamp {
  if (!isDate(data)) {
    data = new Date(data);
  }

  const { nanos, seconds } = Timestamp.fromDate(data).toObject();
  const timestamp = new GrpcTimestamp();
  timestamp.nanos = nanos;
  timestamp.seconds = seconds;

  return timestamp;
}

export function grpcTimestampToDate(data: GrpcTimestamp): Date {
  let low: number;
  const { nanos, seconds } = data;

  if (typeof seconds === 'string') {
    low = parseInt(seconds, 10);
  } else {
    low = seconds;
  }

  const timestamp = new Timestamp();

  timestamp.setNanos(nanos);
  timestamp.setSeconds(low);

  return timestamp.toDate();
}
