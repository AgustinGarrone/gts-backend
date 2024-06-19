import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        "92956bb3127d2490a9843c8db7d6e2337ab50f80bb81e7ea123a3472839dc0a3",
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.id,
      username: payload.email,
    };
  }
}
