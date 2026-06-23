import { findRoleByName } from "../repository/role.repo";
import { RestaurantRole } from "../enums";
import { MemberNotFound, RoleNotFound, CanNotAssignBranchesToOwnerError } from "../errors";
import { findBranchesByMemberId, findRestaurantMemberById, setMemberBranches } from "../repository/member.branch.repo";
import { MemberBranch } from "../entity/member.branch.entity";

export class MemberBranchService {
  
updateMemberBranches = async (
  restaurantId: number,
  memberId: number,
  branchIds: number[]
): Promise<number[]> => {
  // 1- find member
  const member = await findRestaurantMemberById(memberId);

  // 2- validate member belongs to restaurant
  if (!member || Number(member.restaurantId) !== Number(restaurantId)) {
    throw MemberNotFound;
  }

  // 3- get owner role id
  const ownerRoleId = await findRoleByName(RestaurantRole.OWNER);

  if (!ownerRoleId) {
    throw RoleNotFound;
  }

  // 4- owner has access to all branches by default
  // so we do not allow assigning branches to owner
  if (Number(member.roleId) === Number(ownerRoleId)) {
    throw CanNotAssignBranchesToOwnerError;
  }

  // 5- build new selected branches rows
  const now = new Date();

  const rows = branchIds.map(
    (branchId) =>
      new MemberBranch({
        memberId,
        branchId,
        createdAt: now,
      })
  );

  // 6- replace old branch assignments with new selected branches
  await setMemberBranches(restaurantId,memberId, rows);

  return branchIds;
};

}

export const memberBranchService = new MemberBranchService();