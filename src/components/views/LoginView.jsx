import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../../services/cheatftApi.js';

export default function LoginView({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', backgroundColor: '#f8f9fa', padding: '40px' },
    card: { backgroundColor: '#ffffff', padding: '48px 40px', borderRadius: '16px', border: '1px solid #e0e0e0', width: '100%', maxWidth: '420px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
    title: { fontSize: '24px', fontWeight: 'bold', color: '#202124', marginBottom: '8px', textAlign: 'center' },
    subtitle: { fontSize: '14px', color: '#5f6368', marginBottom: '32px', textAlign: 'center', lineHeight: '1.5' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#3c4043', marginBottom: '8px' },
    input: { width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '15px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' },
    button: { width: '100%', padding: '14px', backgroundColor: '#0056d2', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', marginTop: '12px', transition: 'background-color 0.2s' },
    linkText: { textAlign: 'center', fontSize: '14px', color: '#5f6368', marginTop: '24px' },
    link: { color: '#0056d2', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none' }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const session = await login({ email, password });
      if (!session?.accessToken) {
        setErrorMessage('로그인 응답에 accessToken이 없습니다. 백엔드 응답 형식을 확인해주세요.');
        return;
      }

      if (onLogin) onLogin(session);
      navigate('/');
    } catch (error) {
      if (error.code === 'API_NOT_CONFIGURED') {
        setErrorMessage('API 기본 URL이 설정되지 않았습니다. VITE_API_BASE_URL을 확인해주세요.');
        return;
      }

      setErrorMessage(error.message || '로그인에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.title}>Cheat F/T 로그인</div>
        <div style={styles.subtitle}>편향 없는 진실의 시작, 환영합니다.</div>
        
        {location.state?.signupMessage && <div className="integration-notice" role="status">{location.state.signupMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="login-email" style={styles.label}>이메일 주소</label>
            <input 
              id="login-email"
              type="email" 
              style={styles.input} 
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="login-password" style={{...styles.label, display: 'flex', justifyContent: 'space-between'}}>
              비밀번호
              <span style={{color: '#0056d2', cursor: 'pointer', fontWeight: 'normal'}}>비밀번호 찾기</span>
            </label>
            <input 
              id="login-password"
              type="password" 
              style={styles.input} 
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          
          {errorMessage && <div className="form-error" role="alert">{errorMessage}</div>}
          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
        </form>
        
        <div style={styles.linkText}>
          계정이 없으신가요? <span style={styles.link} onClick={() => navigate('/signup')}>회원가입하기</span>
        </div>
      </div>
    </div>
  );
}
