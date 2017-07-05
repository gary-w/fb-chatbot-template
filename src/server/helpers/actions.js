const sendAPI = require( "../requests/sendAPI" );

const callSendAPI = sendAPI.callSendAPI;

const sendTextMessage = ( recipientId, messageText ) => {
    const messageData = {
        recipient: {
            id: recipientId,
        },
        message: {
            text: messageText,
        },
    };

    callSendAPI( messageData );
};

const createGetStartedButton = () => {
    const messageData = {
        get_started: { payload: "GET_STARTED_PAYLOAD" },
    };

    callSendAPI( messageData );
};

module.exports = {
    sendTextMessage,
    createGetStartedButton,
};
