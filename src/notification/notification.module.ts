import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { notificationProvider } from "src/models/notification.model";

@Module({
  exports: [NotificationService],
  providers: [NotificationService, ...notificationProvider],
})
export class NotificationModule {}
