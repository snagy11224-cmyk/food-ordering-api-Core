import knex, { Knex } from "knex";
import { db } from "../../../common/knex/knex";
import { RestaurantMember } from "../entity/restaurant.member.entity";
import { MemberStatus } from "../enums";

const RESTAURANT_MEMBER_COLUMNS = [
  "id",
  "restaurant_id",
  "user_id",
  "role_id",
  "status",
  "created_at",
  "updated_at",
];

function toEntity(row: any): RestaurantMember {
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

export async function createRestaurantMember(
  data: Partial<RestaurantMember>,
  conn: Knex = db
): Promise<RestaurantMember> {
  const  query= conn||db;
  const [row] = await query("restaurant_members")
    .insert({
      restaurant_id: data.restaurantId,
      user_id: data.userId,
      role_id: data.roleId,
      status: data.status,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
    })
    .returning(RESTAURANT_MEMBER_COLUMNS);

  return toEntity(row);
}



export async function updateRestaurantMemberStatusByUserId(
  userId:number , conn: Knex = db
): Promise<RestaurantMember | null> {
  const  query= conn||db;
 const row= await query("restaurant_members") 
    .where("user_id",userId)
    .update({
      status:MemberStatus.ACTIVE,
      updated_at: new Date(),
    });

  return toEntity(row);
}



export async function findRestaurantMemberByUserAndRestaurant(
  restaurantId: number,
  userId: number
): Promise<RestaurantMember | null> {
  const row = await db("restaurant_members")
    .select(RESTAURANT_MEMBER_COLUMNS)
    .where("restaurant_id", restaurantId)
    .andWhere("user_id", userId)
    .first();

  return row ? toEntity(row) : null;
}