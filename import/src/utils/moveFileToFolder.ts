import { S3EventRecord } from 'aws-lambda';
import AWS from 'aws-sdk';

const s3 = new AWS.S3();

export const moveFileToFolder = async ({
  record,
  destinationFolder,
}: {
  record: S3EventRecord;
  destinationFolder: string;
}): Promise<void> => {
  try {
    const sourceBucket = record.s3.bucket.name;
    const sourceKey = record.s3.object.key;

    await s3
      .copyObject({
        Bucket: sourceBucket,
        CopySource: `${sourceBucket}/${sourceKey}`,
        Key: record.s3.object.key.replace("uploaded", destinationFolder),
      })
      .promise();

    await s3
      .deleteObject({
        Bucket: sourceBucket,
        Key: sourceKey,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new Error(`Could not move file to ${destinationFolder}`);
  }
};
