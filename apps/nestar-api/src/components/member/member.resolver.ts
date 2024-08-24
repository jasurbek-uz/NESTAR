import { Args, Mutation,Query, Resolver } from '@nestjs/graphql';
import { MemberService } from "./member.service";
import { InternalServerErrorException, UsePipes, ValidationPipe } from "@nestjs/common";
import { LoginInput, MemberInput } from "../../libs/dto/member/member.input";
import { Member } from "../../libs/dto/member/member";

@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) {}

  @Mutation(() => Member)
	public async signup(@Args('input') input: MemberInput): Promise<Member> {
			console.log('Mutation: signup');
			console.log('input: input');
			return this.memberService.signup(input);
	}

  @Mutation(() => Member)
	public async login(@Args('input') input: LoginInput): Promise<Member> {
			console.log('Mutation: input');
			return this.memberService.login(input);
	}

  // Authenticated users, agents, admins// 
	@Mutation(() => String)
	public async updateMember(): Promise<string> {
		console.log('Mutation: updateMember');
		return this.memberService.updateMember();
	}

  @Query(() => String)
  public async getMember(): Promise<string> {
    console.log('Query: getMember');
    return this.memberService.getMember();
  }


    // ADMIN MANAGEMENT// 
    
  @Mutation(() => String)
  public async getAllMembersByAdmin(): Promise<string> {

    return this.memberService.getAllMembersByAdmin();
  }

	@Query(() => String)
	public async updateMemberByAdmin(): Promise<string> {
		
		return this.memberService.updateMemberByAdmin() ;
	}
}
