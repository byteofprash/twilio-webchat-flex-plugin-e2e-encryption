import { FlexBox, styled } from '@twilio/flex-ui';

export const UserNameContainer = styled('div')<any>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 0 1 auto;
  margin-right: ${(props) => props.theme.tokens.spacings.space30};
  font-size: ${(props) => props.theme.tokens.fontSizes.fontSize20};
  font-weight: ${(props) => props.theme.tokens.fontWeights.fontWeightBold};
  line-height: ${(props) => props.theme.tokens.lineHeights.lineHeight10};
`;

export const TimeContainer = styled('div')<any>`
  font-size: ${(props) => props.theme.tokens.fontSizes.fontSize20};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  flex: 0 0 auto;
`;

export const HeaderContainer = styled(FlexBox)<any>`
  justify-content: space-between;
  align-items: center;
`;

export const BodyContainer = styled('div')<any>`
  margin-top: ${(props) => props.theme.tokens.spacings.space20};
  margin-bottom: ${(props) => props.theme.tokens.spacings.space0};
  overflow-wrap: break-word;
  word-wrap: break-word;
  font-size: ${(props) => props.theme.tokens.fontSizes.fontSize30};
  line-height: ${(props) => props.theme.tokens.lineHeights.lineHeight20};
`;

export const EncryptedDisclaimer = styled('div')<any>`
  text-align: center;
  margin-top: 5px;
  font-size: x-small;
  color: ${({ isFromMe }) => (isFromMe ? 'yellow' : 'blue')};
`;
