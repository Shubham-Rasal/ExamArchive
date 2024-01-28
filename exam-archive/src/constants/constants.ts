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
};

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

export const BRANCH = Object.freeze({
  CSE: "Computer Science and Engineering",
});

export const ALLOWED_FILE_FORMATS = ["jpg", "png", "pdf"] as const;
export const TRANSFORMED_FORMAT = "pdf";
export const MAX_FILE_SIZE = 200000;

export const MAX_COMMENT_LENGTH = 2000;

export const MAX_COMMENT_FETCH_LIMIT = 1;
