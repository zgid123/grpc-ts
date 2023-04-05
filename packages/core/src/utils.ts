import { Metadata, type MetadataValue } from '@grpc/grpc-js';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';

import type { GrpcTimestamp } from './dataType';

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
): Timestamp.AsObject {
  if (!isDate(data)) {
    data = new Date(data);
  }

  return Timestamp.fromDate(data).toObject();
}

export function grpcTimestampToDate(data: GrpcTimestamp): Date {
  const { nanos, seconds } = data;
  const { low } = seconds || {};
  const timestamp = new Timestamp();

  timestamp.setNanos(nanos);
  timestamp.setSeconds(low);

  return timestamp.toDate();
}
