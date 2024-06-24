import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { userProvider } from "src/models/user.model";
import { NotificationModule } from "src/notification/notification.module";

@Module({
  imports: [
    JwtModule.register({
      secret:
        "92956bb3127d2490a9843c8db7d6e2337ab50f80bb81e7ea123a3472839dc0a3",
      signOptions: { expiresIn: "24h" },
    }),
    NotificationModule,
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ...userProvider],
})
export class AuthModule {}
