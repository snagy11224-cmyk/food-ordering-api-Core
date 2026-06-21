import { Knex } from "knex";
import { db } from "../../../common/knex/knex";
import { MemberBranch } from "../entity/member.branch.entity";
import { RestaurantMember } from "../entity/restaurant.member.entity";

const MEMBER_BRANCH_COLUMNS = [
  "member_id",
  "branch_id",
  "created_at",
];

const RESTAURANT_MEMBER_COLUMNS = [
  "id",
  "restaurant_id",
  "user_id",
  "role_id",
  "status",
  "created_at",
  "updated_at",
]; 

function toEntity_res_mem(row: any): RestaurantMember {
  return new RestaurantMember({
    id: row.id,
    restaurantId: row.restaurant_id,
    userId: row.user_id,
    roleId: row.role_id,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
} 
function toEntity(row: any): MemberBranch {
  return new MemberBranch({
    memberId: row.member_id,
    branchId: row.branch_id,
    createdAt: row.created_at,
  });
}


export async function setMemberBranches(
  memberId: number,
  rows: MemberBranch[],
  trx?: Knex.Transaction
): Promise<void> {
  const query = trx || db;

  await query("member_branches")
    .where("member_id", memberId)
    .delete();

  if (rows.length > 0) {
    await query("member_branches").insert(
      rows.map((row) => ({
        member_id: row.memberId,
        branch_id: row.branchId,
        created_at: row.createdAt,
      }))
    );
  }
}

export async function createMemberBranch(
  data: Partial<MemberBranch>,
  trx?: Knex.Transaction
): Promise<MemberBranch> {
  const query = trx || db;

  const [row] = await query("member_branches")
    .insert({
      member_id: data.memberId,
      branch_id: data.branchId,
      created_at: data.createdAt,
    })
    .returning(MEMBER_BRANCH_COLUMNS);

  return toEntity(row);
}

export async function findBranchesByMemberId(
  memberId: number
): Promise<MemberBranch[]> {
  const rows = await db("member_branches")
    .select(MEMBER_BRANCH_COLUMNS)
    .where("member_id", memberId);

  return rows.map(toEntity);
}

export async function findRestaurantMemberById(
  memberId: number
): Promise<RestaurantMember | null> {
  const row = await db("restaurant_members")
    .select(RESTAURANT_MEMBER_COLUMNS)
    .where("id", memberId)
    .first();

  return row ? toEntity_res_mem(row) : null;
}

export async function deleteMemberBranch(
  memberId: number,
  branchId: number
): Promise<void> {
  await db("member_branches")
    .where({
      member_id: memberId,
      branch_id: branchId,
    })
    .delete();
}


export async function findBranchIdsByMemberId(
  memberId: number
): Promise<number[]> {
  const rows: any[] = await db("member_branches")
    .select("branch_id")
    .where("member_id", memberId);

  return rows.map((row: any) => row.branch_id); // [{branch_id:2}, {branch_id:3}] => [2,3]
}