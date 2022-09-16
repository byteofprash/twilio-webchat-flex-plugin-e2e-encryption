import { useDispatch, useSelector } from "react-redux";
import { CustomizationProvider, CustomizationProviderProps } from "@twilio-paste/core/customization";
import { CSSProperties, FC, useEffect } from "react";

import { RootContainer } from "./RootContainer";
import { AppState, EngagementPhase } from "../store/definitions";
import { sessionDataHandler } from "../sessionDataHandler";
import { initSession } from "../store/actions/initActions";
import { changeEngagementPhase } from "../store/actions/genericActions";
import { encrypt } from "../helpers/naclForWebsite";
import { ACTION_ADD_AGENT_PUBLIC_KEY } from "../store/actions/actionTypes";

const AnyCustomizationProvider: FC<CustomizationProviderProps & { style: CSSProperties }> = CustomizationProvider;

export function WebchatWidget() {
    const theme = useSelector((state: AppState) => state.config.theme);
    const dispatch = useDispatch();

    const startEncryptionFromLocalStorage = () => {
        const agentPublicKey = encrypt.initFromLocalStorage();
        dispatch({
            type: ACTION_ADD_AGENT_PUBLIC_KEY,
            payload: agentPublicKey
        });
    };
    useEffect(() => {
        const data = sessionDataHandler.tryResumeExistingSession();
        if (data) {
            try {
                startEncryptionFromLocalStorage();
                dispatch(initSession({ token: data.token, conversationSid: data.conversationSid }));
            } catch (e) {
                // if initSession fails, go to changeEngagement phase - most likely there's something wrong with the store token or conversation sis
                dispatch(changeEngagementPhase({ phase: EngagementPhase.PreEngagementForm }));
            }
        } else {
            encrypt.save();
            // if no token is stored, got engagement form
            dispatch(changeEngagementPhase({ phase: EngagementPhase.PreEngagementForm }));
        }
    }, [dispatch]);

    return (
        <AnyCustomizationProvider
            baseTheme={theme?.isLight ? "default" : "dark"}
            theme={theme?.overrides}
            elements={{
                MESSAGE_INPUT: {
                    boxShadow: "none!important" as "none"
                },
                MESSAGE_INPUT_BOX: {
                    display: "inline-block",
                    boxShadow: "none"
                },
                ALERT: {
                    paddingTop: "space30",
                    paddingBottom: "space30"
                },
                BUTTON: {
                    "&[aria-disabled='true'][color='colorTextLink']": {
                        color: "colorTextLinkWeak"
                    }
                }
            }}
            style={{ minHeight: "100%", minWidth: "100%" }}
        >
            <RootContainer />
        </AnyCustomizationProvider>
    );
}
