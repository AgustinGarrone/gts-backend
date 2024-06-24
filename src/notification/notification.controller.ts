import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { ApiResponse } from "src/constants/types";
import { Notification } from "src/models/notification.model";
import { NotificationService } from "./notification.service";
import { GetUserFromJwt } from "src/helpers/getUser.helper";

@ApiTags("Notification")
@ApiBearerAuth()
@Controller("notification")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserNotifications(
    @GetUserFromJwt() user,
  ): Promise<ApiResponse<Notification[]>> {
    try {
      const userId = user.userId;
      const userNotifications =
        await this.notificationService.getUserNotifications(userId);
      return {
        statusCode: HttpStatus.OK,
        message: "Notificaciones obtenidas con éxito",
        data: userNotifications,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
