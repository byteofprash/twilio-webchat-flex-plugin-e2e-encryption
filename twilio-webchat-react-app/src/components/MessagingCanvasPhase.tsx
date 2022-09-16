import React, { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Header } from "./Header";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { AppState } from "../store/definitions";
import { ConversationEnded } from "./ConversationEnded";
import { NotificationBar } from "./NotificationBar";
import { removeNotification, updatePreEngagementData } from "../store/actions/genericActions";
import { notifications } from "../notifications";
import { AttachFileDropArea } from "./AttachFileDropArea";
import { WaitForAgentEncryption } from "./WaitForAgentEncryption";

export const MessagingCanvasPhase = () => {
    const dispatch = useDispatch();
    const { conversationState, encryptionHandshakeDone } = useSelector((state: AppState) => ({
        conversationState: state.chat.conversationState,
        encryptionHandshakeDone: Boolean(state.e2eEncryption.agentPublicKey)
    }));

    useEffect(() => {
        dispatch(updatePreEngagementData({ email: "", name: "", query: "" }));
        dispatch(removeNotification(notifications.failedToInitSessionNotification("ds").id));
    }, [dispatch]);

    const Wrapper = conversationState === "active" ? AttachFileDropArea : Fragment;

    const loadBottom = () => {
        if (!encryptionHandshakeDone && conversationState === "active") {
            return <WaitForAgentEncryption />;
        }

        if (conversationState === "active") {
            return (
                <React.Fragment>
                    <MessageList />
                    <MessageInput />
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <MessageList />
                <ConversationEnded />
            </React.Fragment>
        );
    };

    return (
        <Wrapper>
            <Header />
            <NotificationBar />
            {loadBottom()}
        </Wrapper>
    );
};
