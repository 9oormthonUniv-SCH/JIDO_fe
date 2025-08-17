// src/api/utils/params.js

// 쿼리스트링을 예쁘게 직렬화해주는 함수
export function serializeParams(params = {}) {
  const usp = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value == null) return; // null/undefined 건너뛰기

    if (Array.isArray(value)) {
      // 배열이면 같은 key로 여러 개 추가 (ex: ?category=a&category=b)
      value.forEach((v) => usp.append(key, String(v)));
    } else if (value instanceof Date) {
      usp.append(key, value.toISOString());
    } else if (typeof value === "object") {
      usp.append(key, JSON.stringify(value)); // 객체는 JSON 문자열로
    } else {
      usp.append(key, String(value));
    }
  });

  return usp.toString();
}
