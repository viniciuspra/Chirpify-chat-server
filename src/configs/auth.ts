export default {
  jwt: {
    secret: process.env.JWT_SECRET_KEY || "default",
    expiresIn: "1d",
  },
} as {
  jwt: {
    secret: string;
    expiresIn: string;
  };
};
