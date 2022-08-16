import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Verify {
  @Prop({ type: String })
  code: string;

  @Prop({ type: Number })
  expires: number;
}
