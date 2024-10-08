class NotificationService {
  async registerNotification(number, message) {
    try {
      await prisma.notificafications.create({
        data: { phone_client: number, message },
      });
    } catch (error) {
      console.log(error);
      throw new Error("Error in prisma.notifications.create");
    } finally {
      await prisma.$disconnect();
    }
  }

  // todo validacion de autenticacion
  async sendNotification(country_code, number, message, client) {
    try {
      const numberCode = country_code.split("+")[1];
      const chatId = `${numberCode}${number}@c.us`;
      await client.sendMessage(chatId, message);
      // await this.registerNotification(number, message);
    } catch (error) {
      console.log(error);
      throw new Error("Error in send notification");
    }
  }

  async checkingDaysOfAccounts() {
    try {
      const result = await prisma.account.updateMany({
        where: {
          is_active: true,
        },
        data: {
          numb_days_duration: {
            decrement: 1,
          },
        },
      });
      console.log(`Actualizados ${result.count} cuentas.`);
    } catch (e) {
      throw new Error("Error to update days duration of accounts");
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const notificationService = new NotificationService();
