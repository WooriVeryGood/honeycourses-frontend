export type CategoryKey = "All" | "공지" | "자유" | "질문" | "중고거래" | "구인";

export const CategoryMap: { [key in CategoryKey]: string } = {
  All: "",
  공지: "notice",
  자유: "free",
  질문: "question",
  중고거래: "trade",
  구인: "offer",
};