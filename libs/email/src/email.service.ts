import { Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  transpoter: Transporter;

  constructor() {
    this.transpoter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: '88261196@qq.com',
        pass: 'qjthhwalgequbjei',
      },
    });
  }

  async sendMail({ to, subject, html }) {
    await this.transpoter.sendMail({
      from: {
        name: '考试系统',
        address: '88261196@qq.com',
      },
      to,
      subject,
      html,
    });
  }
}
