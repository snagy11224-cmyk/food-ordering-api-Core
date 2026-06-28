import { Knex } from "knex";
import { db } from "../../../common/knex/knex";
import { Branch } from "../entity/branch.entity";

const BRANCH_COLUMNS = [
  "id",
  "restaurant_id",
  "country_code",
  "address_text",
  "label",
  "lat",
  "lng",
  "is_active",
  "opens_at",
  "closes_at",
  "accept_orders",
  "created_at",
  "updated_at",
  "delivery_radius",
  "currency",
  "commission",
];

function toEntity(row: any): Branch {
  return new Branch({
    id: row.id,
    restaurantId: row.restaurant_id,
    countryCode: row.country_code,
    addressText: row.address_text,
    label: row.label,
    lat: Number(row.lat),
    lng: Number(row.lng),
    isActive: row.is_active,
    opensAt: row.opens_at,
    closesAt: row.closes_at,
    acceptOrders: row.accept_orders,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deliveryRadius: row.delivery_radius,
    currency: row.currency,
    commission: row.commission,
  });
}


export async function createBranch(
  data: Partial<Branch>,
  conn: Knex = db
): Promise<Branch> {
  const [row] = await conn("restaurant_branches")
    .insert({
      restaurant_id: data.restaurantId,
      country_code: data.countryCode,
      address_text: data.addressText,
      label: data.label,
      lat: data.lat,
      lng: data.lng,
      is_active: data.isActive,
      opens_at: data.opensAt,
      closes_at: data.closesAt,
      accept_orders: data.acceptOrders,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
      delivery_radius: data.deliveryRadius,
      currency: data.currency,
      commission: data.commission,
    })
    .returning(BRANCH_COLUMNS);

  return toEntity(row);
};


export async function findNearbyBranches(
  lat: number,
  lng: number
): Promise<any[]> {
  const { rows } = await db.raw(
    `
    SELECT
      b.id,
      b.restaurant_id,
      b.country_code,
      b.address_text,
      b.label,
      b.lat,
      b.lng,
      b.is_active,
      b.accept_orders,
      b.delivery_radius,
      b.currency,
      b.commission,

      r.name,
      r.logo_url,

      ST_Distance(
        b.location,
        ST_SetSRID(
          ST_MakePoint(?, ?),
          4326
        )::geography
      ) AS distance_meters

    FROM restaurant_branches b

    INNER JOIN restaurants r
      ON r.id = b.restaurant_id

    WHERE b.is_active = TRUE
      AND b.accept_orders = TRUE
      AND r.status = 'active'

      AND ST_DWithin(
        b.location,
        ST_SetSRID(
          ST_MakePoint(?, ?),
          4326
        )::geography,
        b.delivery_radius * 1000
      )

    ORDER BY distance_meters ASC
    `,
    [
      lng,
      lat,

      lng,
      lat,
    ]
  );

  return rows;
};


export async function findBranchesByRestaurant(
  restaurantId: number
): Promise<Branch[]> {
  const rows = await db("restaurant_branches")
    .select(BRANCH_COLUMNS)
    .where("restaurant_id", restaurantId)
    .orderBy("id", "asc");

  return rows.map(toEntity);
};


export async function findBranchById(branchId: number): Promise<Branch | null> {
  const row = await db("restaurant_branches")
    .select(BRANCH_COLUMNS)
    .where("id", branchId)
    .first();

  return row ? toEntity(row) : null;
}

export async function updateBranch(
  branchId: number,
  data: Partial<Branch>
): Promise<Branch> {
  const updateData: any = {
    updated_at: new Date(),
  };

  if (data.label !== undefined) updateData.label = data.label;
  if (data.addressText !== undefined) updateData.address_text = data.addressText;
  if (data.lat !== undefined) updateData.lat = data.lat;
  if (data.lng !== undefined) updateData.lng = data.lng;
  if (data.opensAt !== undefined) updateData.opens_at = data.opensAt;
  if (data.closesAt !== undefined) updateData.closes_at = data.closesAt;
  if (data.deliveryRadius !== undefined) updateData.delivery_radius = data.deliveryRadius;
  if (data.currency !== undefined) updateData.currency = data.currency;
  if (data.acceptOrders !== undefined) updateData.accept_orders = data.acceptOrders;

  const [row] = await db("restaurant_branches")
    .where("id", branchId)
    .update(updateData)
    .returning(BRANCH_COLUMNS);

  return toEntity(row);
}


export async function updateBranchStatus(
  branchId: number,
  data: Partial<Branch>
): Promise<Branch> {
  const updateData: any = {
    updated_at: new Date(),
  };

  if (data.isActive !== undefined) {
    updateData.is_active = data.isActive;

    if (data.isActive === false) {
      updateData.accept_orders = false;
    }
  }

  if (data.commission !== undefined) {
    updateData.commission = data.commission;
  }

  const [row] = await db("restaurant_branches")
    .where("id", branchId)
    .update(updateData)
    .returning(BRANCH_COLUMNS);

  return toEntity(row);
}