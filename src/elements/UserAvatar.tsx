import * as S from './UserAvatar.styles';
import React from 'react';
import { initials } from '../util/text';

export interface UserAvatarProps {
  className?: string;
  photoUrl?: string;
  userName?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  className,
  photoUrl,
  userName,
}) => {
  return (
    <S.Wrapper className={className}>
      {photoUrl ? (
        <S.AvatarImage src={photoUrl} />
      ) : (
        userName && initials(userName)
      )}
    </S.Wrapper>
  );
};

export default UserAvatar;
