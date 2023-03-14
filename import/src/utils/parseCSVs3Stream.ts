import AWS from 'aws-sdk';

import { S3EventRecord } from 'aws-lambda';
import csv from 'csv-parser';

const s3 = new AWS.S3();

export const parseCSVs3Stream = async (
  record: S3EventRecord
): Promise<any[]> => {
  try {
    const records = [];

    const s3Stream = s3
      .getObject({
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key,
      })
      .createReadStream()
      .pipe(csv());

    for await (const chunk of s3Stream) {
      records.push(chunk);
    }

    console.log(`importFileParser: Parsed CSV for ${record.s3.object.key}:
    ${records}
  `);

    return records;
  } catch {
    throw new Error('could not parse file')
  }
};
