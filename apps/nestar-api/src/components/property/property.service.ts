import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { Property } from "../../libs/dto/property/property";
import { Message } from "../../libs/enums/common.enum";
import { PropertyInput } from "../../libs/dto/property/property.input";
import { MemberService } from "../member/member.service";
import { PropertyStatus } from "../../libs/enums/property.enum";
import { ViewGroup } from "../../libs/enums/view.enum";
import { StatisticModifier, T } from "../../libs/types/common";
import { ViewService } from "../view/view.service";
import { PropertyUpdate } from "../../libs/dto/property/property.update";
import moment from "moment";

@Injectable()
export class PropertyService {
	constructor(
		@InjectModel('Property') private readonly propertyModel: Model<Property>,
		private memberService: MemberService,
		private viewService: ViewService,
	) {}

	public async createProperty(input: PropertyInput): Promise<Property> {
		try {
			const result = await this.propertyModel.create(input);
			// increase memberProperties
			await this.memberService.memberStatsEditor({ _id: result.memberId, targetKey: 'memberProperties', modifier: 1 });
			return result;
		} catch (err) {
			console.log('Error, createProperty:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getProperty(memberId: ObjectId, propertyId: ObjectId): Promise<Property> {
		const search: T = {
			_id: propertyId,
			PropertyStatus: PropertyStatus.ACTIVE,
		};

		const tartgetProperty: Property = await this.propertyModel.findOne(search).lean().exec();
		if (!tartgetProperty) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput = { memberId: memberId, viewRefId: propertyId, viewGroup: ViewGroup.PROPERTY };
			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.propertyStatsEditor({ _id: propertyId, targetKey: 'propertyViews', modifier: 1 });
				tartgetProperty.propertyViews++;
			}

			//meliked
		}

		tartgetProperty.memberData = await this.memberService.getMember(null, tartgetProperty.memberId);
		return tartgetProperty;
	}

	public async propertyStatsEditor(input: StatisticModifier): Promise<Property> {
		const { _id, targetKey, modifier } = input;
    return await this.propertyModel.findByIdAndUpdate(_id, { $inc: { [targetKey]: modifier } }, { new: true })
      .exec();
  }
  
  public async updateProperty(memberId: ObjectId, input: PropertyUpdate): Promise<Property>{
    let { propertyStatus, soldAt, deletedAt } = input;
    const search: T = {
      memberId: memberId,
      propertyStatus: PropertyStatus.ACTIVE,
    };

    if (propertyStatus === PropertyStatus.SOLD) soldAt = moment().toDate();
    else if (propertyStatus === PropertyStatus.DELETE) deletedAt = moment().toDate();

    const result = await this.propertyModel
      .findOneAndUpdate(search, input, { new: true, })
      .exec();
    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
    
    if (soldAt || deletedAt) {
      await this.memberService.memberStatsEditor({
        _id: memberId,
        targetKey: 'memberProperties',
        modifier: -1,
      });
    }

    return result;
  }
}
