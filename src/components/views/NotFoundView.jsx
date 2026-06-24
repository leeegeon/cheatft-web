import { Link } from 'react-router-dom'

export default function NotFoundView() {
  return (
    <section className="status-page" aria-labelledby="not-found-title">
      <div className="status-code">404</div>
      <h1 id="not-found-title">페이지를 찾을 수 없습니다.</h1>
      <p>주소가 변경되었거나 존재하지 않는 페이지입니다.</p>
      <Link className="primary-link" to="/">홈으로 돌아가기</Link>
    </section>
  )
}
