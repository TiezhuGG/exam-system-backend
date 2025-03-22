import { PrismaService } from '@app/prisma';
import { Inject, Injectable } from '@nestjs/common';
import { AnswerAddDto } from './dto/answer-add.dto';

@Injectable()
export class AnswerService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async add(answerAddDto: AnswerAddDto, userId: number) {
    const exam = await this.prismaService.exam.findUnique({
      where: {
        id: answerAddDto.examId,
      },
    });

    console.log('=====', exam);

    let questions = [];
    try {
      questions = JSON.parse(exam?.content);
    } catch (e) {}

    let answers = [];
    try {
      answers = JSON.parse(answerAddDto.content);
    } catch (error) {}

    console.log('------', questions, answers);

    let totalScore = 0;

    answers.forEach((answer) => {
      const question = questions.find((item) => item.id === answer.id);

      if (
        JSON.stringify(answer.answer) === JSON.stringify(question.userAnswer)
      ) {
        totalScore += question.score;
      }
    });

    return this.prismaService.answer.create({
      data: {
        content: answerAddDto.content,
        score: totalScore,
        answerer: {
          connect: {
            id: userId,
          },
        },
        exam: {
          connect: {
            id: answerAddDto.examId,
          },
        },
      },
    });
  }

  async list(examId: number) {
    return this.prismaService.answer.findMany({
      where: {
        examId,
      },
      include: {
        exam: true,
        answerer: true,
      },
    });
  }

  async find(id: number) {
    return this.prismaService.answer.findUnique({
      where: {
        id,
      },
      include: {
        exam: true,
        answerer: true,
      },
    });
  }
}
