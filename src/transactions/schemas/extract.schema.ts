import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ParsedOfxHeader, ParsedOfxTransaction } from '../utils/ofx-parser.util';

export type ExtractDocument = HydratedDocument<Extract>;

@Schema({ timestamps: true, collection: 'extract' })
export class Extract {
  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: Object, required: true })
  header: ParsedOfxHeader;

  @Prop({ type: Array, required: true })
  transactions: ParsedOfxTransaction[];

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const ExtractSchema = SchemaFactory.createForClass(Extract);
