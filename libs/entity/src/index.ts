import { EventInfo, EventInfoSchema } from './event_info.entity';
import { EventGroup, EventGroupSchema } from './event_group.entity';
import { Condition, ConditionSchema } from './event_condition.entity';
import { EventReward, EventRewardSchema } from './event_reward.entity';
import {
  EventRewardRequest,
  EventRewardRequestSchema,
} from './event_reward_requests.entity';
import { Item, ItemSchema } from './item.entity';
import { Attendance, AttendanceSchema } from './attendance_log.entity';
import { Inventory, InventorySchema } from './inventory.entity';
import { User, UserSchema } from './user.entity';

export * from './auth.entity';
export * from './user.entity';

export const EventMongooseSchemas = [
  { name: EventInfo.name, schema: EventInfoSchema },
  { name: EventGroup.name, schema: EventGroupSchema },
  { name: Condition.name, schema: ConditionSchema },
  { name: EventRewardRequest.name, schema: EventRewardRequestSchema },
  { name: EventReward.name, schema: EventRewardSchema },
  { name: Item.name, schema: ItemSchema },
  { name: Attendance.name, schema: AttendanceSchema },
  { name: Inventory.name, schema: InventorySchema },
  { name: User.name, schema: UserSchema },
];
