import { CategoryKey } from "../types/post";

export const POST_CATEGORY_LABELS: { [key in CategoryKey]: string } = {
  All: "",
  공지: "notice",
  자유: "free",
  질문: "question",
  중고거래: "trade",
  구인: "offer",
};