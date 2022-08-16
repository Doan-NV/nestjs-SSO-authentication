import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
class Business {
  @Prop({ type: String })
  business_id: string;

  @Prop({ type: String })
  long_name: string;

  @Prop({ type: String })
  sort_name: string;

  @Prop(
    raw({
      jp: { type: Object },
      en: { type: Object },
    }),
  )
  description: { jp: any; en: any };
}

const BusinessSchema = SchemaFactory.createForClass(Business);
export { BusinessSchema, Business };
