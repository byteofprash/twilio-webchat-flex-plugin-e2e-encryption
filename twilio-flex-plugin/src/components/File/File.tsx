import React from 'react';
import { extension as mimeToExtension } from 'mime-types';
import { Actions, ActionStateListener, styled } from '@twilio/flex-ui';
import { CircularProgress } from '@twilio/flex-ui-core';
import { FilePreview } from '../FilePreview/FilePreview';

interface FileProps {
  message?: any;
  conversationSid?: string;
}

export class File extends React.Component<FileProps, any> {
  private downloadMedia = (disabled: boolean) => () => {
    const { message, conversationSid } = this.props;
    Actions.invokeAction('DownloadMedia', { media: message.source.media, conversationSid, channelSid: conversationSid });
  };

  render() {
    const { message } = this.props;
    const {
      message: {
        source: { media },
      },
    } = this.props;

    if (!media) {
      return null;
    }

    const file = {
      name: media.filename,
      size: media.size,
      type: media.contentType,
    };

    return (
      <ActionStateListener action="DownloadMedia">
        {(actionState) => (
          <MediaMessageContainer className="Twilio-Media-MessageBubble" onClick={this.downloadMedia(actionState.disabled)} role="link">
            <FilePreview
              file={file}
              iconOverride={
                message.isSending && <CircularProgress size={26} animating override={{ animatingBackgroundBorderColor: 'transparent' }} />
              }
            />
          </MediaMessageContainer>
        )}
      </ActionStateListener>
    );
  }
}

const MediaMessageContainer = styled('button')<any>`
  display: flex;
  align-items: center;
  border: none;
  outline: none;
  text-align: left;
  justify-content: space-between;
  cursor: pointer;
  max-width: 100%;
  padding: 0;
  margin-top: 10px;
  border-width: ${(props) => props.theme.tokens.borderWidths.borderWidth10};
  border-radius: ${(props) => props.theme.tokens.radii.borderRadius20};
  border-color: ${(props) => props.theme.tokens.borderColors.colorBorder};
  border-style: solid;
  &[aria-disabled='true'] {
    cursor: ${(props) => (props.message?.isSending ? 'default' : 'not-allowed')};
  }
  ${(props) =>
    props.message?.isFromMe ? props.theme.Chat.MessageListItem.FromMe.Media.Container : props.theme.Chat.MessageListItem.FromOthers.Media.Container};

  ${(props) => props.message?.error && props.theme.Chat.MessageListItem.FromMe.Media.Container?.disabled};
`;
