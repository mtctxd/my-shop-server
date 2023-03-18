import dotenv from 'dotenv';
import { Product } from '@declarations/Product';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { ENV } from '@declarations/ENV';

dotenv.config();

export class CreatedProductsNotificationSender {
  snsClient = new SNSClient({});
  topicArn: string;

  constructor(arn: string) {
    this.topicArn = arn;
  }

  formatProductCreationMessage(createdProducts: Product[]) {
    const message = [
      `PRODUCTS WAS CREATED - ${createdProducts.length}`,
      createdProducts.map(
        ({ title, price, count }) =>
          `name: ${title}\nprice: ${price}\nin stock: ${count}\n`
      ),
    ];

    return message.join('\n');
  }

  async send(createdProducts: Product[]): Promise<void> {
    const publishCommand = new PublishCommand({
      Subject: `${createdProducts.length} products was just created!`,
      Message: this.formatProductCreationMessage(createdProducts),
      TopicArn: this.topicArn,
    });

    try {
      await this.snsClient.send(publishCommand);
    } catch (e) {
      console.log(`Could not send email: ${e}`);
      throw new Error(`Could not send email: ${e}`);
    }
  }
}
