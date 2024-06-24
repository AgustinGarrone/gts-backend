import { Inject, Injectable } from "@nestjs/common";
import { Notification } from "src/models/notification.model";

@Injectable()
export class NotificationService {
  constructor(
    @Inject("NOTIFICATION_REPOSITORY")
    private readonly notificationRepository: typeof Notification,
  ) {}

  async createNotification(userId: number, message: string) {
    try {
      await this.notificationRepository.create({
        userId,
        message,
      });
    } catch (error) {
      throw new Error("Failed to create notification");
    }
  }

  async getUserNotifications(userId: number) {
    try {
      return await this.notificationRepository.findAll({
        where: {
          userId,
        },
        order: [["createdAt", "DESC"]],
      });
    } catch (error) {
      throw new Error("Failed to get notifications");
    }
  }
}
