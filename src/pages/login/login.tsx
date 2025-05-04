import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { fetchLogin } from '../../slices/userSlice';
import { useDispatch } from '../../services/store';
import { Navigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // поменять на нормальную проверку
  const [isRegistered, setIsRegistered] = useState(false);

  const dispatch = useDispatch();
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    setIsRegistered(true);
    dispatch(fetchLogin({ email, password }));
  };

  if (isRegistered) {
    return <Navigate to='/profile' />;
  }

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
