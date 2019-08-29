import uuid from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context) {
    const data = JSON.parse(event.body);

    // Status: 0 is active, change to status: 1 when complete
    const params = {
        TableName: "todo",
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            noteId: uuid.v1(),
            content: data.content,
            createdAt: Date.now(),
            status: 0
        }
    };

    try {
        await dynamoDbLib.call("put", params);
        return success(params.Item);
    }
    catch (e) {
        console.log(e);
        return failure({ status: false });
    }
}