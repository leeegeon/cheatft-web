import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordCode, resetPassword, verifyPasswordCode } from '../../services/cheatftApi.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

function getReadablePasswordError(error) {
  if (error.code === 'API_NOT_CONFIGURED') return '서비스 연결 설정을 확인해주세요.';
  if (error.status === 404) return '가입되지 않은 이메일 주소입니다.';
  if (error.status === 429) return '인증번호를 이미 발송했습니다. 잠시 후 다시 시도해주세요.';
  if (error.status === 400) return error.message || '입력값을 다시 확인해주세요.';
  if (error.status === 401) return '재설정 토큰이 만료되었습니다. 인증번호 확인부터 다시 진행해주세요.';
  return error.message || '비밀번호 재설정 요청에 실패했습니다.';
}

export default function PasswordResetView() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100%', backgroundColor: '#f8f9fa', padding: '40px' },
    card: { backgroundColor: '#ffffff', padding: '48px 40px', borderRadius: '16px', border: '1px solid #e0e0e0', width: '100%', maxWidth: '460px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
    title: { fontSize: '24px', fontWeight: 'bold', color: '#202124', marginBottom: '8px', textAlign: 'center' },
    subtitle: { fontSize: '14px', color: '#5f6368', marginBottom: '28px', textAlign: 'center', lineHeight: '1.5' },
    stepRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '28px' },
    stepPill: (isActive) => ({ padding: '8px', borderRadius: '8px', backgroundColor: isActive ? '#e8f0fe' : '#f8f9fa', color: isActive ? '#174ea6' : '#5f6368', border: isActive ? '1px solid #d2e3fc' : '1px solid #e0e0e0', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }),
    formGroup: { marginBottom: '18px' },
    label: { display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#3c4043', marginBottom: '8px' },
    input: { width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '15px', outline: 'none', boxSizing: 'border-box' },
    button: { width: '100%', padding: '14px', backgroundColor: '#0056d2', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', marginTop: '10px' },
    secondaryButton: { width: '100%', padding: '12px', backgroundColor: '#ffffff', color: '#3c4043', border: '1px solid #dadce0', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginTop: '12px' },
  };

  const clearStatus = () => {
    setMessage('');
    setErrorMessage('');
  };

  const sendCode = async (event) => {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setErrorMessage('올바른 이메일 형식으로 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    clearStatus();

    try {
      await requestPasswordCode(trimmedEmail);
      setEmail(trimmedEmail);
      setStep('code');
      setMessage('인증번호를 발송했습니다. 이메일을 확인해주세요.');
    } catch (error) {
      setErrorMessage(getReadablePasswordError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyCode = async (event) => {
    event.preventDefault();

    if (!code.trim()) {
      setErrorMessage('인증번호를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    clearStatus();

    try {
      const result = await verifyPasswordCode({ email, code: code.trim() });
      setResetToken(result?.resetToken || '');
      setStep('reset');
      setMessage('이메일 인증이 완료되었습니다. 새 비밀번호를 입력해주세요.');
    } catch (error) {
      setErrorMessage(getReadablePasswordError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitPassword = async (event) => {
    event.preventDefault();

    if (newPassword.length < PASSWORD_MIN_LENGTH) {
      setErrorMessage(`비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`);
      return;
    }

    if (newPassword !== passwordConfirm) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsSubmitting(true);
    clearStatus();

    try {
      await resetPassword({ resetToken, newPassword });
      navigate('/login', {
        replace: true,
        state: { noticeMessage: '비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.' },
      });
    } catch (error) {
      setErrorMessage(getReadablePasswordError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page" style={styles.container}>
      <div className="auth-card" style={styles.card}>
        <div style={styles.title}>비밀번호 찾기</div>
        <div style={styles.subtitle}>가입한 이메일로 인증번호를 받은 뒤 새 비밀번호를 설정합니다.</div>

        <div style={styles.stepRow} aria-label="비밀번호 재설정 단계">
          <div style={styles.stepPill(step === 'email')}>이메일</div>
          <div style={styles.stepPill(step === 'code')}>인증번호</div>
          <div style={styles.stepPill(step === 'reset')}>새 비밀번호</div>
        </div>

        {message && <div className="integration-notice" role="status">{message}</div>}
        {errorMessage && <div className="form-error" role="alert">{errorMessage}</div>}

        {step === 'email' && (
          <form onSubmit={sendCode}>
            <div style={styles.formGroup}>
              <label htmlFor="reset-email" style={styles.label}>이메일 주소</label>
              <input
                id="reset-email"
                type="email"
                style={styles.input}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  clearStatus();
                }}
                placeholder="example@domain.com"
                autoComplete="email"
                disabled={isSubmitting}
                required
              />
            </div>
            <button type="submit" style={styles.button} disabled={isSubmitting}>{isSubmitting ? '발송 중...' : '인증번호 발송'}</button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={verifyCode}>
            <div style={styles.formGroup}>
              <label htmlFor="reset-code" style={styles.label}>인증번호</label>
              <input
                id="reset-code"
                style={styles.input}
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  clearStatus();
                }}
                placeholder="6자리 인증번호"
                inputMode="numeric"
                maxLength={6}
                disabled={isSubmitting}
                required
              />
            </div>
            <button type="submit" style={styles.button} disabled={isSubmitting}>{isSubmitting ? '확인 중...' : '인증번호 확인'}</button>
            <button type="button" style={styles.secondaryButton} onClick={() => setStep('email')} disabled={isSubmitting}>이메일 다시 입력</button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={submitPassword}>
            <div style={styles.formGroup}>
              <label htmlFor="new-password" style={styles.label}>새 비밀번호</label>
              <input
                id="new-password"
                type="password"
                style={styles.input}
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  clearStatus();
                }}
                placeholder="8자 이상"
                autoComplete="new-password"
                disabled={isSubmitting}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="new-password-confirm" style={styles.label}>새 비밀번호 확인</label>
              <input
                id="new-password-confirm"
                type="password"
                style={styles.input}
                value={passwordConfirm}
                onChange={(event) => {
                  setPasswordConfirm(event.target.value);
                  clearStatus();
                }}
                autoComplete="new-password"
                disabled={isSubmitting}
                required
              />
            </div>
            <button type="submit" style={styles.button} disabled={isSubmitting}>{isSubmitting ? '변경 중...' : '비밀번호 변경'}</button>
          </form>
        )}

        <button type="button" style={styles.secondaryButton} onClick={() => navigate('/login')}>로그인으로 돌아가기</button>
      </div>
    </div>
  );
}
