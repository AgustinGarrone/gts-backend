import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { notificationProvider } from "src/models/notification.model";
import { NotificationController } from "./notification.controller";

@Module({
  exports: [NotificationService],
  controllers: [NotificationController],
  providers: [NotificationService, ...notificationProvider],
})
export class NotificationModule {}
