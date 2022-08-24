import { Box } from "@twilio-paste/core/box";
import { Text } from "@twilio-paste/core/text";
import { Button } from "@twilio-paste/core/button";
import { useDispatch } from "react-redux";

import { sessionDataHandler } from "../sessionDataHandler";
import { changeEngagementPhase } from "../store/actions/genericActions";
import { EngagementPhase } from "../store/definitions";
import { textStyles, titleStyles } from "./styles/ConversationEnded.styles";
import { containerStyles } from "./styles/WaitForAgentEncryption.styles";

export const WaitForAgentEncryption = () => {
    return (
        <Box {...containerStyles}>
            <Text as="h3" {...titleStyles}>
                Waiting for an available Agent...
            </Text>
            <Text as="p" {...textStyles}>
                You will soon be talking into a secure end-to-end encryption communication channel.
            </Text>
            <Text as="p" {...textStyles}>
                Only the Agent will be able to read your messages.
            </Text>
        </Box>
    );
};
