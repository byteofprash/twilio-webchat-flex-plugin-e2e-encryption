import { AnyAction, Reducer } from "redux";

import { E2eEncryptionState } from "./definitions";
import { ACTION_ADD_AGENT_PUBLIC_KEY } from "./actions/actionTypes";

const initialState: E2eEncryptionState = {};

export const e2eEncryptionReducer: Reducer = (
    state: E2eEncryptionState = initialState,
    action: AnyAction
): E2eEncryptionState => {
    switch (action.type) {
        case ACTION_ADD_AGENT_PUBLIC_KEY: {
            return {
                ...state,
                agentPublicKey: action.payload
            };
        }

        default:
            return state;
    }
};
