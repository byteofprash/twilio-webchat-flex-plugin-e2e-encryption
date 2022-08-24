import { Icon } from '@twilio/flex-ui';
import React from 'react';
import { encrypt } from '../../helpers/naclForFlexPlugins';
import { File } from '../File/File';
import { BodyContainer, HeaderContainer, EncryptedDisclaimer, TimeContainer, UserNameContainer } from './DecryptMessageBubble.Components';

interface Props {
  message?: any;
  conversationSid?: string;
}

interface State {
  encryptedMsg?: string;
  decryptedMsg?: string;
  customFontColor?: string;
}

export default class DecryptMessageBubble extends React.Component<Props, State> {
  constructor(props: any) {
    // console.log('@@@ constructor', props);
    super(props);
    const { message } = this.props;
    const { conversationSid } = this.props;
  }

  render() {
    const {
      message,
      conversationSid,
      message: {
        isFromMe,
        authorName,
        source: { dateCreated, author },
      },
    } = this.props;

    const messageTimestamp = dateCreated?.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const { body, wasEncrypted } = encrypt.decrypt(conversationSid!, message.source.state.body);
    const fromName = authorName || author;
    // console.log('@@@ message', fromName, body, message);
    return (
      <React.Fragment>
        <HeaderContainer className="MessageBubbleHeader" key="header" message={message}>
          <UserNameContainer>{fromName}</UserNameContainer>
          <TimeContainer>{messageTimestamp}</TimeContainer>
        </HeaderContainer>
        <BodyContainer>{body}</BodyContainer>
        <File message={message} conversationSid={conversationSid} />
        {wasEncrypted ? <EncryptedDisclaimer isFromMe={isFromMe}>End-to-end encrypted 🔒​​ </EncryptedDisclaimer> : null}
      </React.Fragment>
    );
  }
}
