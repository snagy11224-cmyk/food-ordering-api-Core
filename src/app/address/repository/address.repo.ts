import { CustomerAddress } from "../entity/address.entity";
import {db} from "../../../common/knex/knex";
import {addressAlreadyExistsError} from '../errors';

const CUSTOMER_ADDRESS_COLUMNS=[
    "id",
    "user_id",
    "address_line1",
    "label",
    "country",
    "city",
    "street",
    "building" , 
    "apartment_number",
    "type",
    "lat",
    "lng",
    "is_default",
    "created_at",
    "updated_at"
]



function toEntity(row: any): CustomerAddress {
    return new CustomerAddress({
        id: row.id,
        userId: row.user_id,
        addressLine1: row.address_line1,
        label: row.label,
        country: row.country,     
        city: row.city,
        street: row.street,
        building: row.building,
        apartmentNumber:row.apartment_number,
        type:row.type ,
        lat:row.lat,
        lng:row.lng, 
        isDefault:row.is_default,
        createdAt:row.created_at,
        updatedAt:row.updated_at
    })
}


//get customer addresses
export async function findAddressesByUserId(userId: number) {
  const rows= await db("customer_addresses")
    .where("user_id", userId)
    .select(CUSTOMER_ADDRESS_COLUMNS);

    return rows.map(toEntity);
}



//post customer address with transaction to prevent race conditions
export async function insertCustomerAddressTransaction(
  userId: number,
  customerAddress: Partial<CustomerAddress>
): Promise<CustomerAddress> {

  return db.transaction(async (trx) => {

    //lock user row so concurrent requests for the same user wait for each other
    await trx.raw(
      `SELECT id FROM users WHERE id = ? FOR UPDATE`,
      [userId]
    );

    //check if this address is already there
    const duplicateRow = await trx("customer_addresses")
      .where({
        user_id: userId,
        country: customerAddress.country,
        city: customerAddress.city,
        street: customerAddress.street,
        building: customerAddress.building ?? null,
        apartment_number: customerAddress.apartmentNumber ?? null,
      })
      .first(CUSTOMER_ADDRESS_COLUMNS);

    if (duplicateRow) {
      throw addressAlreadyExistsError;
    }

    //check if this is the first address for this user
    const countRow = await trx("customer_addresses")
      .where("user_id", userId)
      .count<{ count: string }>("id as count")
      .first();

    const isFirstAddress =
      Number(countRow?.count ?? 0) === 0;

    //first address must always be default
    const shouldBeDefault =
      isFirstAddress ||
      customerAddress.isDefault === true;

    //remove existing default address before creating a new default one
    if (shouldBeDefault && !isFirstAddress) {
      await trx("customer_addresses")
        .where("user_id", userId)
        .update({
          is_default: false,
          updated_at: new Date(),
        });
    }

    //create customer address
    const [row] = await trx("customer_addresses")
      .insert({
        user_id: userId,
        address_line1: customerAddress.addressLine1,
        label: customerAddress.label,
        country: customerAddress.country,
        city: customerAddress.city,
        street: customerAddress.street,
        building: customerAddress.building,
        apartment_number: customerAddress.apartmentNumber,
        type: customerAddress.type,
        lat: customerAddress.lat,
        lng: customerAddress.lng,
        is_default: shouldBeDefault,
      })
      .returning(CUSTOMER_ADDRESS_COLUMNS);

    //map database row to entity
    return toEntity(row);
  });
}

//patch/update customer address
export async function updateCustomerAddresses(userId: number, addressId: number, data: Partial<CustomerAddress>): Promise<CustomerAddress|null> {
 const [row] = await db("customer_addresses").where({id:addressId , user_id: userId}).update(
    {
      label: data.label,
      country: data.country,
      city: data.city,
      street: data.street,
      building: data.building,
      apartment_number: data.apartmentNumber,
      type: data.type,
      lat: data.lat,
      lng: data.lng,
      updated_at: new Date(),
    }
 )
    .returning(CUSTOMER_ADDRESS_COLUMNS);

  return row ? toEntity(row) : null;
}