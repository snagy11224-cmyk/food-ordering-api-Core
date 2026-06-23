import { Knex } from "knex";
import { db } from "../../../common/knex/knex";
import { User } from "../entity/user.entity";

const USER_COLUMNS = [
    "id",
    "email",    
    "phone",
    "name",
    "password_hash as passwordHash",
    "system_role as systemRole",
    "deleted_at as deletedAt",
    "created_at as createdAt",
    "updated_at as updatedAt"
]

type UpdatedUser = {
  id: number;
  email: string;
  phone: string;
  name: string;
  systemRole: string;
};

function toEntity(row: any): User {
    return new User({
        id: row.id,
        email: row.email,
        phone: row.phone,
        name: row.name,
        passwordHash: row.passwordHash,     
        systemRole: row.systemRole,
        deletedAt: row.deletedAt,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    })
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
    const row = await db("users").select(USER_COLUMNS).where({ "email": email }).whereNull("deleted_at").first();
    if (!row) {
        return undefined;
    }
    console.log("row", row);
    return row ? toEntity(row) : undefined;
}


export async function findUserById(id: number): Promise<User | undefined> {
    const row = await db("users").select(USER_COLUMNS).where({ "id": id }).whereNull("deleted_at").first();
    if (!row) {
        return undefined;
    }
    console.log("row", row);
    return row ? toEntity(row) : undefined;
}

export async function findUserExistsByEmailOrPhone(email: string, phone: string): Promise<boolean> {
const result = await db.raw(`SELECT EXISTS(select 1 from users where email=? or phone=?) AS "exists"`, [email, phone]);
return result.rows[0].exists;
}

export async function findUserExistsByEmail(email: string): Promise<boolean> {
const result = await db.raw(`SELECT EXISTS(select 1 from users where email=?) AS "exists"`, [email]);
return result.rows[0].exists;
}

export async function createUser(user: Partial<User>, conn: Knex=db): Promise<User> {
    const [row] = await conn("users").insert({
        email: user.email,
        phone: user.phone,
        name: user.name,
        password_hash: user.passwordHash,
        system_role: user.systemRole,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        deleted_at: user.deletedAt
    }).returning(USER_COLUMNS);
    return toEntity(row);
}


export async function updateUserPassword(id:number,password:string): Promise<void> {
    await db("users").where("id",id).update({password_hash:password});
}

export async function updateUserData(id:number, data:{name?:string,phone?:string}): Promise<UpdatedUser> {
    const [user] = await db("users").where("id",id).update({...data, updated_at: new Date() })
    .returning([
      "id",
      "email",
      "phone",
      "name",
      "system_role",
    ]);

    return user;
}

export async function findUserByPhone(phone: string) {
  return db("users")
    .where("phone", phone)
    .first();
}
