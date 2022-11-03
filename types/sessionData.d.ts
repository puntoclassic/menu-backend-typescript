import session from "express-session";

declare module "express-session" {
  interface SessionData {
    cart: {
      items: any[];
      subtotal: 0;
    };
    token: string;
    user: any;
  }
}
