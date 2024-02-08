export const MONGO_WRITE_QUERY_TIMEOUT = 15000;
export const MONGO_READ_QUERY_TIMEOUT = 10000;

export const AUTH_TOKEN: string = "auth-token";
export const JWT_MAX_AGE = "24h";
export const COOKIES_TTL = 60 * 60 * 24;

export const ACTION = Object.freeze({ EMAIL: "email", RESET: "reset" });

export const RESET_LINK_EXP_TIME = "48h";

// TODO : add more exams

export const EXAM_TYPES = {
  INSTITUTIONAL: {
    MIDSEM: "Midsem",
    ENDSEM: "Endsem",
    "QUIZ-I": "Quiz I",
    "QUIZ-2": "Quiz II",
    "PRACTICAL-I": "Practical I",
    "PRACTICAL-II": "Practical II",
  },
} as const;

export const RATING_TYPE = Object.freeze({
  HELPFUL: "helpful",
  STANDARD: "standard",
  RELEVANCE: "relevance",
});

export const SEMESTER = Object.freeze({
  I: "Semester I",
  II: "Semester II",
  III: "Semester III",
  IV: "Semester IV",
  V: "Semester V",
  VI: "Semester VI",
  VII: "Semester VII",
  VIII: "Semester VIII",
});

// TODO : add more branches

export const BRANCH: Array<{ label: string }> = [
  { label: "Computer Science and Engineering" },
];

export const INSTITUTIONS: Array<{ label: string }> = [
  {
    label: "National Institute of Technology, Karnataka (NITK)",
  },
];

export const SUBJECT: Array<{ label: string }> = [
  { label: "Operating Systems" },
  { label: "Data Structure and Algorithms" },
];

export const REDIS_COLLECTION_NAME = Object.freeze({
  INSTITUTIONS: "INSTITUTIONS",
  BRANCH: "BRANCH",
  "SUBJECT NAME": "SUBJECT_NAME",
});

export const ALLOWED_FILE_FORMATS = ["pdf"] as const;
export const TRANSFORMED_FORMAT = "pdf";
export const MAX_FILE_SIZE = 2 * 1024 * 1024;

export const MAX_COMMENT_LENGTH = 2000;

export const MAX_COMMENT_FETCH_LIMIT = 10;

export const MAX_PAPERS_FETCH_LIMIT = 20;
