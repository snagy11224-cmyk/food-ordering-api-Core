import { CustomerAddress } from "../entity/address.entity"
import {db} from "../../../common/knex/knex"

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
//post customer address
export async function insertCustomerAddress(userId: number, customerAddress:Partial<CustomerAddress>): Promise<CustomerAddress> {
  const [row]= await db("customer_addresses")
    .insert(
        {
        user_id: userId,  
        address_line1:customerAddress.addressLine1,
        label:customerAddress.label,
        country:customerAddress.country ,
        city: customerAddress.city,
        street:customerAddress.street,
        building:customerAddress.building , 
        apartment_number:customerAddress.apartmentNumber,
        type:customerAddress.type,
        lat: customerAddress.lat,
        lng: customerAddress.lng,
        is_default: customerAddress.isDefault,
        }
    ).returning(CUSTOMER_ADDRESS_COLUMNS);

  return toEntity(row);
}


//patch/update customer address
