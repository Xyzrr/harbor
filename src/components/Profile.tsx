import * as S from './Profile.styles';
import React from 'react';

export interface ProfileProps {
  className?: string;
}

const Profile: React.FC<ProfileProps> = ({ className }) => {
  return <S.Wrapper className={className} />;
};

export default Profile;
