import jwt from "jsonwebtoken";

const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRE || "7d";

  if (!secret) {
    throw new Error("Missing JWT_SECRET in environment variables");
  }

  return jwt.sign({ id }, secret, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
};

export default generateToken;
