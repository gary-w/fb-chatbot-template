const sendAPI = require( "../requests/sendAPI" );

const callSendAPI = sendAPI.callSendAPI;

const sendTextMessage = ( recipientId, messageText ) => {
    const messageData = {
        recipient: {
            id: recipientId,
        },
        message: {
            text: messageText,
            metadata: "DEVELOPER_DEFINED_METADATA",
        },
    };

    callSendAPI( messageData );
};

module.exports = {
    sendTextMessage,
};
