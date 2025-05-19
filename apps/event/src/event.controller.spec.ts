import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './controllers/event.controller';
import { EventService } from './services/event.service';

describe('EventController', () => {
  let eventController: EventController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [EventService],
    }).compile();

    eventController = app.get<EventController>(EventController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(eventController.getHello()).toBe('Hello World!');
    });
  });
});
