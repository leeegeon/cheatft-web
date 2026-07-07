import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/cheatftApi.js';

export default function SignupView() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordConfirm: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100%', backgroundColor: '#f8f9fa', padding: '40px' },
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.nickname || !formData.password || !formData.passwordConfirm) {
      setErrorMessage('모든 항목을 입력해주세요.');
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (formData.password.length < 8) {
      setErrorMessage('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const account = await signup({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
      });
      navigate('/login', {
        state: {
          signupMessage: `${account?.nickname || formData.nickname}님, 회원가입이 완료되었습니다. 로그인해주세요.`,
        },
      });
    } catch (error) {
      if (error.code === 'API_NOT_CONFIGURED') {
        setErrorMessage('API 기본 URL이 설정되지 않았습니다. VITE_API_BASE_URL을 확인해주세요.');
        return;
      }

      setErrorMessage(error.message || '회원가입에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.title}>Cheat F/T 회원가입</div>
        <div style={styles.subtitle}>검증된 정보를 찾기 위한 첫 걸음입니다.</div>
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="signup-email" style={styles.label}>이메일 주소</label>
            <input 
              id="signup-email"
              type="email" 
              name="email"
              style={styles.input} 
              placeholder="example@domain.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="signup-nickname" style={styles.label}>닉네임</label>
            <input 
              id="signup-nickname"
              type="text" 
              name="nickname"
              style={styles.input} 
              placeholder="사용하실 닉네임을 입력하세요"
              value={formData.nickname}
              onChange={handleChange}
              autoComplete="nickname"
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="signup-password" style={styles.label}>비밀번호</label>
            <input 
              id="signup-password"
              type="password" 
              name="password"
              style={styles.input} 
              placeholder="비밀번호 (8자 이상)"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="signup-password-confirm" style={styles.label}>비밀번호 확인</label>
            <input 
              id="signup-password-confirm"
              type="password" 
              name="passwordConfirm"
              style={styles.input} 
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.passwordConfirm}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
          
          {errorMessage && <div className="form-error" role="alert">{errorMessage}</div>}
          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? '가입 중...' : '회원가입'}
          </button>
        </form>
        
        <div style={styles.linkText}>
          이미 계정이 있으신가요? <span style={styles.link} onClick={() => navigate('/login')}>로그인하기</span>
        </div>
      </div>
    </div>
  );
}
