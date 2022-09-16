import { Conversation, Message } from "@twilio/conversations";
import { Dispatch } from "redux";
import { encrypt } from "../../../helpers/naclForWebsite";

import { ACTION_ADD_MESSAGE, ACTION_REMOVE_MESSAGE, ACTION_UPDATE_MESSAGE } from "../actionTypes";

export interface MessageDecrypted extends Message {
    bodyDecrypted?: string;
}

export const initMessagesListener = (conversation: Conversation, dispatch: Dispatch) => {
    conversation.addListener("messageAdded", (message: MessageDecrypted) => {
        const { body } = encrypt.decrypt(message.body);
        message.bodyDecrypted = body;

        dispatch({
            type: ACTION_ADD_MESSAGE,
            payload: { message }
        });
    });
    conversation.addListener("messageRemoved", (message: Message) => {
        dispatch({
            type: ACTION_REMOVE_MESSAGE,
            payload: { message }
        });
    });
    conversation.addListener("messageUpdated", ({ message }) => {
        dispatch({
            type: ACTION_UPDATE_MESSAGE,
            payload: { message }
        });
    });
};
