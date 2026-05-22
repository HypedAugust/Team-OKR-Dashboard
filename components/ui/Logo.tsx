export function Logo({ height = 36 }: { height?: number }) {
  // SVG로 재현해 외부 파일 의존성 없이 어느 환경에서나 동일 렌더링
  const w = height * 2.6;
  return (
    <svg
      viewBox="0 0 260 100"
      width={w}
      height={height}
      role="img"
      aria-label="10kM.ai"
      style={{ display: 'block' }}
    >
      {/* 검은 상단 박스 */}
      <rect x="0" y="0" width="260" height="76" rx="14" fill="#0A0A0B" />
      {/* 텍스트 10kM.ai */}
      <text
        x="130"
        y="55"
        textAnchor="middle"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Pretendard', system-ui, sans-serif"
        fontWeight="900"
        fontSize="58"
        fill="#FFFFFF"
        letterSpacing="-2"
      >
        10kM.ai
      </text>
      {/* 오렌지 하단 띠 */}
      <rect x="0" y="64" width="260" height="36" rx="14" fill="#FF6E48" />
      <rect x="0" y="64" width="260" height="14" fill="#FF6E48" />
      {/* 띠 안의 이진 코드 */}
      <text
        x="130"
        y="91"
        textAnchor="middle"
        fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
        fontWeight="700"
        fontSize="12"
        fill="#FFFFFF"
        letterSpacing="0.5"
      >
        1000 0100 0000 1000 0100 0000 1000 0100 0000
      </text>
    </svg>
  );
}
