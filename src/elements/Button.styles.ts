import styled, { css } from 'styled-components';
import Color from 'color';
import { DANGER } from '../constants';

export const Wrapper = styled.a<{
  variant?: string;
  color?: string;
  disabled?: boolean;
  size?: string;
}>`
  display: block;
  text-align: center;
  outline: none;
  border: none;
  border-radius: 4px;
  background: none;
  color: white;
  padding: 6px 12px;
  font-size: 16px;
  -webkit-app-region: no-drag;
  text-decoration: none;
  cursor: default;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(128, 128, 128, 0.1);
  }

  ${(props) => {
    let color =
      props.color === 'primary'
        ? new Color('#000')
        : props.color === 'danger'
        ? DANGER
        : new Color('#ddd');

    if (props.variant === 'contained') {
      let bgColor = color;
      if (props.color === 'primary') {
        bgColor = new Color('#fff');
      }

      if (props.color === 'secondary') {
        bgColor = new Color('#444').alpha(0.3);
      }

      if (props.color === 'danger') {
        color = new Color('#fff');
        bgColor = DANGER;
      }

      return css`
        color: ${color.string()};
        background: ${bgColor.string()};
        ${props.color === 'secondary' &&
        css`
          box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.15),
            inset 1px 0 0 0 rgba(255, 255, 255, 0.04),
            inset -1px 0 0 0 rgba(255, 255, 255, 0.04);
        `}
        &:hover {
          background: ${props.color === 'primary'
            ? bgColor.darken(0.1).string()
            : props.color === 'secondary'
            ? bgColor.lighten(0.1).alpha(0.5).string()
            : bgColor.lighten(0.1).string()};
        }
        &:active {
          background: ${props.color === 'primary'
            ? bgColor.darken(0.2).string()
            : props.color === 'secondary'
            ? bgColor.lighten(0.2).alpha(0.5).string()
            : bgColor.lighten(0.2).string()};
        }
      `;
    }
    if (props.variant === 'outlined') {
      return css`
        outline: 1px solid ${color.string()};
      `;
    }
    return css`
      color: ${color.string()};
    `;
  }}

  ${(props) =>
    props.disabled &&
    css`
      pointer-events: none;
      background: #777;
      opacity: 0.6;
    `}

  ${(props) => {
    if (props.size === 'small') {
      return css`
        font-size: 14px;
        padding: 4px 8px;
      `;
    }

    if (props.size === 'large') {
      return css`
        font-size: 18px;
        padding: 8px 16px;
      `;
    }
  }}
`;
