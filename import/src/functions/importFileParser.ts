import { StatusCode } from '@declarations/StatusCode';
import { formatJSONResponse } from '@libs/api-gateway';
import { midifyEvent } from '@libs/lambda';
import { moveFileToFolder } from '@utils/moveFileToFolder';
import { parseCSVs3Stream } from '@utils/parseCSVs3Stream';
import { S3Event } from 'aws-lambda';

import dotenv from 'dotenv';

dotenv.config();

export const importFileParser: any = async (event: S3Event) => {
  const records = [];

  try {
    for (const record of event.Records) {
      const parsedRecords = await parseCSVs3Stream(record);

      records.push(...parsedRecords);

      await moveFileToFolder({ record, destinationFolder: 'parsed' });
    }

    return formatJSONResponse({
      statusCode: StatusCode.CREATED,
      response: records,
    });
  } catch (error) {
    return formatJSONResponse({
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      response: error,
    });
  }
};

export const importFileParserHandler = midifyEvent(importFileParser);
