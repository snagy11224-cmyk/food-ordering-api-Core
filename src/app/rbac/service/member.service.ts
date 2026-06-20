import { MemberBranch } from './../entity/member.branch.entity';
import { db } from "../../../common/knex/knex";
import { userAlreadyExistsError } from "../../auth/errors";
import { SystemRole } from "../../user/enums";
import { createUser, findUserByEmail } from "../../user/repository/users.repo";
import { CreateRestaurantMemberDTO } from "../dto/restaurant.member.dto";
import { MemberStatus } from "../enums";
import {CanNotCreateOwnerUserError, RoleNotFound} from '../errors'
import { setMemberBranches } from "../repository/member.branch.repo";
import { createRestaurantMember } from "../repository/restaurant.member.repository";
import { findRoleByName } from "../repository/role.repo";
import { generateOTP, hashOTP } from '../../auth/utils';
import { createPasswordReset } from '../../auth/repository/repo.pasword.reset';

export class MemberService {


  async createMember(restaurantId:number,data: CreateRestaurantMemberDTO): Promise<void>
{
//dont accept owner role creation 
if(data.role=='owner')
throw CanNotCreateOwnerUserError;
//check if user already exists
const existingUser=await findUserByEmail(data.email);
if(existingUser){
    throw userAlreadyExistsError;
}

//find roleId by roleName
const roleId= await findRoleByName(data.role);
if(!roleId){
    throw RoleNotFound;
}
//craete user, member , assign branches 
//all in single transaction
const trx=await db.transaction();

try{
const now=new Date();
const user= await createUser({
    email:data.email,
    name:data.name,
    phone:data.phone,
    passwordHash:'',
    systemRole:SystemRole.RESTAURANT_USER,
    createdAt:now,
    updatedAt:now
},trx)

const member=await createRestaurantMember({
restaurantId,
userId:user.id!,
roleId,
createdAt:now,
updatedAt:now,
status:MemberStatus.INACTIVE
},trx)


const rows=data.branchIds.map(branchId => new MemberBranch({
branchId:branchId,
memberId:member.id!,
createdAt:now

}))

 await setMemberBranches(member.id!,rows,trx);

//generate OTP and create password reset record && send email 
//generate an otp
const otp= generateOTP();
//hash the otp 
const hashedOtp= hashOTP(otp)
//insert the otp
await createPasswordReset({
    userId:user.id!,
    otpHash:hashedOtp,
    expiresAt:new Date(Date.now()+ 10*60*1000),
    createdAt:new Date()
}, trx)
//send email 
console.log(`mocked emaiil sent ${otp}`);

await trx.commit();
}catch(error){
    await trx.rollback();
    throw error
}

}


}





export const memberService = new MemberService();