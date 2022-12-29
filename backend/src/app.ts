import express, { Router } from "express";
import passport from "passport";
import productsRouter from "./routers/productsRouter";
import { COOKIE_SECRET } from "./config";
import authRouter from "./routers/authRouter";
import session from "express-session";

// Setup passport
import "./passport";
import userRouter from "./routers/userRouter";
import ingredientsRouter from "./routers/ingredientsRouter";
import manageRouter from "./routers/manageRouter";
import skinSolverRouter from "./routers/skinSolverRouter";
import parsePagination from "./middleware/parsePagination";
import { requireAuthLevel } from "./middleware/requireAuth";

const app = express();
const router = Router();

app.use(
  session({
    secret: COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.authenticate("session"));

router.use((req, res, next) => {
  console.log("Is authenticated?:", req.isAuthenticated());
  next();
});

router.use(parsePagination);

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/manage", /*requireAuthLevel(1),*/ manageRouter);
router.use("/products", productsRouter);
router.use("/ingredients", ingredientsRouter);
router.use("/solver", skinSolverRouter);

app.use("/api", router);

app.use((req, res) => res.status(404).send("Not Found"));

export default app;
