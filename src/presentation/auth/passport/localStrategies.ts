import { loginService, oAuthService, registerService } from "@/dependencyInjection/container";
import { User } from "@/domain/users/entities/User";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserRegisterRequest } from "../requests/UserRegisterRequest";
import RegisterMapper from "../mappers/RegisterMapper";

export function configureLocalStrategy() {
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        
      },
      async (email: string, password: string, done) => {
        try {
          const user = await loginService.login({ email, password });
          return done(null, user);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          return done(null, false, { message: err.message });
        }
      }
    )
  );

    passport.use(
    "local-google",
    new LocalStrategy(
      {
        usernameField: "token",
        passwordField: "token",
        
      },
      async (token: string, _: string, done) => {
        try {
          if (!token) {
            return done(null, false, { message: "No token provided" });
          }
          const user = await oAuthService.google(token);
          return done(null, user);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          return done(null, false, { message: err.message });
        }
      }
    )
  );

  passport.use(
    "local-register",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      async (req, email: string, password: string, done) => {
        try {
           const registerRequest: UserRegisterRequest = {
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                surnames: req.body.surnames,
                birthdate: req.body.birthdate,
                gender: req.body.gender,
              }
              const registerCommand = RegisterMapper.toEntity(registerRequest);
              const result = await registerService.registerUser(registerCommand);
          return done(null, result);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          return done(null, false, { message: err.message });
        }
      }
    )
  );

      

}
