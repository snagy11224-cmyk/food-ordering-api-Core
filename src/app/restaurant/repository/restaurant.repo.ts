import { Restaurant } from "../entity/restaurant.entity";
import { db } from "../../../common/knex/knex";
import { Knex } from "knex";

const RESTAURANT_COLUMNS = [
  "id",
  "owner_id",
  "name",
  "logo_url",
  "status",
  "primary_country",
  "created_at",
  "updated_at",
  "status_updated_at",
];

function toEntity(row: any): Restaurant {
  return new Restaurant({
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    logoURL: row.logo_url,
    status: row.status,
    primaryCountry: row.primary_country,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    statusUpdatedAt: row.status_updated_at,
  });
}

export async function findAllRestaurants(): Promise<Restaurant[]> {
  const rows = await db("restaurants")
    .select(RESTAURANT_COLUMNS);

  return rows.map(toEntity);
}

//find restaurant by restaurant_id ORR owner_id
export async function findRestaurant(
  restaurantId: number,
  ownerId: number
): Promise<Restaurant | null> {
  const row = await db("restaurants")
    .select(RESTAURANT_COLUMNS)
    .where("id", restaurantId)
    .orWhere("owner_id", ownerId)
    .first();

  if (!row) {
    return null;
  }

  return toEntity(row);
}




export async function createRestaurant(data:Partial<Restaurant>, conn:Knex=db): Promise<Restaurant>{

    const [row]=await conn("restaurants").insert(
        {
            owner_id:data.ownerId,
            name: data.name,
            logo_url: data.logoURL,
            status: data.status,
            primary_country: data.primaryCountry,
            created_at: data.createdAt,
            updated_at: data.updatedAt,
            status_updated_at: data.statusUpdatedAt,
        }
    ).returning(RESTAURANT_COLUMNS);

    return toEntity(row);
}