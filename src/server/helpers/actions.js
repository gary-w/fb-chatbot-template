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

const setGreetingText = () => {
    const messageData = {
        greeting: [
            {
                locale: "default",
                text: "Hey {{user_first_name}}, ask me anything!",
            },
        ],
    };

    callSendAPI( messageData );
};

module.exports = {
    sendTextMessage,
    createGetStartedButton,
    setGreetingText,
};
